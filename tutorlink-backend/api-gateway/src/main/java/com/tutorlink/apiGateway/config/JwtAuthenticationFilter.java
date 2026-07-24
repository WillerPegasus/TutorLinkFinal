package com.tutorlink.apiGateway.config;

import io.jsonwebtoken.Claims;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.security.Keys;
import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletRequestWrapper;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;

import javax.crypto.SecretKey;
import java.io.IOException;
import java.nio.charset.StandardCharsets;
import java.util.List;
import java.util.regex.Pattern;

@Component
public class JwtAuthenticationFilter extends OncePerRequestFilter {

    @Value("${app.jwt.secret}")
    private String jwtSecret;

 private static final List<String> PUBLIC_PATHS = List.of(
        "/api/auth/",
        "/eureka/",
        "/actuator",
        "/favicon.ico",
        "/error",
        "/api/tutors/search",
        "/api/tutors/verified",
        "/api/home/",
        "/api/admin/auth/login",      // ✎ FIX
        "/api/admin/auth/verify-otp"  // ✎ FIX
);
    // ✎ AJOUT V4 : /api/auth/admin/** exige un vrai token ADMIN valide —
    // ce n'est PAS public malgré le préfixe /api/auth/
    private static final List<String> AUTH_EXCEPTIONS = List.of(
            "/api/auth/admin/"
    );

    // ✎ AJOUT — Point 3 : callbacks de paiement Orange Money.
    // Ces routes sont appelées directement par le serveur d'Orange (notif_url),
    // qui n'envoie jamais de header Authorization. Elles doivent donc être
    // publiques, mais UNIQUEMENT sur ce chemin précis (pas tout /api/bookings/**
    // ni tout /api/groups/**), d'où l'usage de regex plutôt que startsWith.
    private static final Pattern ORANGE_CALLBACK_BOOKING =
            Pattern.compile("^/api/bookings/\\d+/pay/orange/confirm$");
    private static final Pattern ORANGE_CALLBACK_GROUP =
            Pattern.compile("^/api/groups/memberships/\\d+/pay/orange/confirm$");
            // ✎ AJOUT — profil public d'un utilisateur (nom, photo, ville, bio),
    // utilisé notamment par l'affichage public des résultats de recherche
    // de tuteurs. Ne doit PAS nécessiter d'authentification.
    private static final Pattern PUBLIC_USER_PROFILE =
            Pattern.compile("^/api/users/\\d+/public$");

    private boolean isPublicPaymentCallback(String path) {
        return ORANGE_CALLBACK_BOOKING.matcher(path).matches()
                || ORANGE_CALLBACK_GROUP.matcher(path).matches();
    }

    @Override
    protected void doFilterInternal(HttpServletRequest request,
                                    HttpServletResponse response,
                                    FilterChain filterChain)
            throws ServletException, IOException {

        // FIX -- laisser passer les requetes preflight CORS (OPTIONS) sans
        // exiger de token : elles ne contiennent jamais d'en-tete Authorization.
        if ("OPTIONS".equalsIgnoreCase(request.getMethod())) {
            filterChain.doFilter(request, response);
            return;
        }

        String path = request.getRequestURI();

        boolean isPublic = (PUBLIC_PATHS.stream().anyMatch(path::startsWith)
                && AUTH_EXCEPTIONS.stream().noneMatch(path::startsWith))
                || isPublicPaymentCallback(path) // ✎ AJOUT — Point 3
                || PUBLIC_USER_PROFILE.matcher(path).matches(); // ✎ AJOUT — Point 4

        if (isPublic) {
            filterChain.doFilter(request, response);
            return;
        }

        String authHeader = request.getHeader("Authorization");

        if (authHeader == null || !authHeader.startsWith("Bearer ")) {
            response.setStatus(HttpServletResponse.SC_UNAUTHORIZED);
            response.setContentType("application/json");
            response.getWriter().write("{\"error\": \"Token manquant ou invalide\"}");
            return;
        }

        String token = authHeader.substring(7);

        try {
            SecretKey key = Keys.hmacShaKeyFor(jwtSecret.getBytes(StandardCharsets.UTF_8));
            Claims claims = Jwts.parser()
                    .verifyWith(key)
                    .build()
                    .parseSignedClaims(token)
                    .getPayload();

            String role = claims.get("role", String.class);

            // ✎ AJOUT V4 : liste élargie des routes réservées aux ADMIN
            // (avant, seul /api/admin/** était protégé — d'autres routes
            // sensibles ajoutées en V4 ne l'étaient pas encore)
            if (isAdminOnly(path) && !"ADMIN".equals(role)) {
                response.setStatus(HttpServletResponse.SC_FORBIDDEN);
                response.setContentType("application/json");
                response.getWriter().write("{\"error\": \"Accès réservé aux administrateurs\"}");
                return;
            }

          // ✎ FIX — claims.getSubject() renvoie l'email (sub), pas l'id numérique.
          // On lit désormais le claim "userId" (ajouté par auth-service) pour
          // que X-User-Id contienne le vrai id, sinon le contrôle owner/self
          // dans user-service (comparaison à l'id du path) échoue toujours.
          String userIdClaim = String.valueOf(claims.get("userId"));

         HttpServletRequest wrappedRequest = new HttpServletRequestWrapper(request) {
                @Override
                public String getHeader(String name) {
                    if ("X-User-Id".equals(name))    return userIdClaim;
                    if ("X-User-Role".equals(name))  return claims.get("role", String.class);
                    if ("X-User-Email".equals(name)) return claims.getSubject(); // ✎ FIX
                    return super.getHeader(name);
                }

                @Override
                public java.util.Enumeration<String> getHeaderNames() {
                    java.util.List<String> names = java.util.Collections.list(super.getHeaderNames());
                    if (!names.contains("X-User-Id")) names.add("X-User-Id");
                    if (!names.contains("X-User-Role")) names.add("X-User-Role");
                    if (!names.contains("X-User-Email")) names.add("X-User-Email"); // ✎ FIX
                    return java.util.Collections.enumeration(names);
                }

                @Override
                public java.util.Enumeration<String> getHeaders(String name) {
                    if ("X-User-Id".equals(name))    return java.util.Collections.enumeration(java.util.List.of(userIdClaim));
                    if ("X-User-Role".equals(name))  return java.util.Collections.enumeration(java.util.List.of(claims.get("role", String.class)));
                    if ("X-User-Email".equals(name)) return java.util.Collections.enumeration(java.util.List.of(claims.getSubject())); // ✎ FIX
                    return super.getHeaders(name);
                }
            };

            filterChain.doFilter(wrappedRequest, response);

        } catch (Exception e) {
            response.setStatus(HttpServletResponse.SC_UNAUTHORIZED);
            response.setContentType("application/json");
            response.getWriter().write("{\"error\": \"Token invalide ou expiré\"}");
        }
    }

    // ============================================================
    // ✎ AJOUT V4 : isAdminOnly()
    // Centralise toutes les routes réservées aux ADMIN, y compris
    // celles hors /api/admin/** (suspension de compte, exports CSV,
    // création de compte par un admin)
    // ============================================================
    private boolean isAdminOnly(String path) {
        if (path.startsWith("/api/admin/")) return true;
        if (path.startsWith("/api/auth/admin/")) return true;
        if (path.equals("/api/users")) return true;                         // ⬅️ AJOUT — Point 6
        if (path.equals("/api/users/export")) return true;
        if (path.startsWith("/api/users/") && (path.endsWith("/suspend") || path.endsWith("/reactivate"))) return true;
        if (path.equals("/api/bookings/export")) return true;
        if (path.endsWith("/verify")) return true;
        if (path.matches("/api/tutors/documents/\\d+/review")) return true;
        if (path.equals("/api/notifications/send")) return true;            // ⬅️ AJOUT — Point 6
        return false;
    }
}