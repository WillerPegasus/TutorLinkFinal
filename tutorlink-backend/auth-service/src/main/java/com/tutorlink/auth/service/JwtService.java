package com.tutorlink.auth.service;

import io.jsonwebtoken.Claims;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.SignatureAlgorithm;
import io.jsonwebtoken.security.Keys;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.stereotype.Service;

import java.security.Key;
import java.util.Date;
import java.util.HashMap;
import java.util.Map;
import java.util.function.Function;

// @Service dit à Spring : "cette classe contient de la logique métier"
// Spring va créer une seule instance de cette classe et la réutiliser partout
// C'est ce qu'on appelle un "Bean" Spring — un objet géré par Spring
@Service
public class JwtService {

    // @Value lit la valeur depuis application.properties
    // jwt.secret=tutorlink_super_secret_key_2024...
    // Spring injecte automatiquement cette valeur au démarrage
    @Value("${jwt.secret}")
    private String secretKey;

    // jwt.expiration=86400000 (24 heures en millisecondes)
    @Value("${jwt.expiration}")
    private long jwtExpiration;

    // ============================================================
    // MÉTHODE 1 : generateToken(user)
    // Fabrique un nouveau token JWT pour un utilisateur
    // Appelée dans AuthService.login() après vérification du mot de passe
    // ============================================================
    public String generateToken(UserDetails userDetails, Long userId) {
    Map<String, Object> extraClaims = new HashMap<>();

    // Récupère le rôle depuis les "authorities" Spring Security
    // (ex: "ROLE_STUDENT" -> "STUDENT") et le met dans le token
    // pour que l'api-gateway puisse vérifier les routes /api/admin/**
    String role = userDetails.getAuthorities().stream()
            .findFirst()
            .map(a -> a.getAuthority().replace("ROLE_", ""))
            .orElse(null);
    extraClaims.put("role", role);

    // ✎ FIX — le sub du JWT est l'email, pas l'id numérique.
    // On ajoute un claim "userId" dédié pour que l'api-gateway
    // puisse le propager tel quel dans X-User-Id (contrôle owner/self).
    extraClaims.put("userId", userId);

    return buildToken(extraClaims, userDetails);
}

    // Méthode privée qui construit réellement le token
    private String buildToken(Map<String, Object> extraClaims, UserDetails userDetails) {
        return Jwts.builder()
                // Les données qu'on met dans le token (payload)
                .setClaims(extraClaims)
                // Le "sujet" du token = l'email de l'utilisateur
                // C'est l'information principale stockée dans le JWT
                .setSubject(userDetails.getUsername())
                // La date de création du token
                .setIssuedAt(new Date(System.currentTimeMillis()))
                // La date d'expiration = maintenant + 24 heures
                .setExpiration(new Date(System.currentTimeMillis() + jwtExpiration))
                // On signe le token avec notre clé secrète
                // Sans cette signature, n'importe qui pourrait fabriquer un faux token
                .signWith(getSigningKey(), SignatureAlgorithm.HS256)
                .compact(); // Transforme tout en une chaîne de caractères
    }

    // ============================================================
    // MÉTHODE 2 : extractEmail(token)
    // Lit l'email contenu dans un token JWT
    // Appelée dans le filtre JWT pour identifier l'utilisateur
    // ============================================================
    public String extractEmail(String token) {
        // getSubject() retourne ce qu'on a mis dans setSubject() = l'email
        return extractClaim(token, Claims::getSubject);
    }

    // ============================================================
    // MÉTHODE 3 : isTokenValid(token, userDetails)
    // Vérifie qu'un token est authentique ET appartient au bon utilisateur
    // Retourne true si tout est bon, false sinon
    // ============================================================
    public boolean isTokenValid(String token, UserDetails userDetails) {
        final String email = extractEmail(token);
        // Double vérification :
        // 1. L'email dans le token correspond à l'utilisateur en base
        // 2. Le token n'est pas expiré
        return (email.equals(userDetails.getUsername())) && !isTokenExpired(token);
    }

    // ============================================================
    // MÉTHODE 4 : extractExpiration(token)
    // Lit la date d'expiration contenue dans le token
    // ============================================================
    public Date extractExpiration(String token) {
        return extractClaim(token, Claims::getExpiration);
    }

    // ============================================================
    // MÉTHODES PRIVÉES UTILITAIRES
    // Utilisées en interne par les méthodes publiques ci-dessus
    // ============================================================

    // Vérifie si le token est expiré
    // Compare la date d'expiration du token avec la date actuelle
    private boolean isTokenExpired(String token) {
        return extractExpiration(token).before(new Date());
    }

    // Méthode générique pour extraire n'importe quelle information du token
    // "Function<Claims, T>" signifie "une fonction qui prend Claims et retourne T"
    // Exemple : extractClaim(token, Claims::getSubject) retourne l'email
    //           extractClaim(token, Claims::getExpiration) retourne la date
    private <T> T extractClaim(String token, Function<Claims, T> claimsResolver) {
        final Claims claims = extractAllClaims(token);
        return claimsResolver.apply(claims);
    }

    // Décode et vérifie le token pour en extraire toutes les données
    // Si le token est falsifié ou expiré → une exception est levée automatiquement
    private Claims extractAllClaims(String token) {
        return Jwts.parserBuilder()
                .setSigningKey(getSigningKey()) // Utilise notre clé secrète pour vérifier
                .build()
                .parseClaimsJws(token)
                .getBody();
    }

    // Convertit la clé secrète (String) en objet Key utilisable par JJWT
    // HMAC-SHA256 est l'algorithme de signature utilisé
    private Key getSigningKey() {
        byte[] keyBytes = secretKey.getBytes();
        return Keys.hmacShaKeyFor(keyBytes);
    }
}