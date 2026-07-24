package com.tutorlink.auth.controller;

import com.tutorlink.auth.dto.*;
import com.tutorlink.auth.service.AuthService;
import com.tutorlink.auth.service.JwtService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.web.bind.annotation.*;
import com.tutorlink.auth.entity.User;
import java.util.Map;


// @RestController = @Controller + @ResponseBody
// Cela signifie : cette classe gère des requêtes HTTP ET
// retourne automatiquement du JSON (pas des pages HTML)
@RestController

// @RequestMapping : toutes les routes de ce controller
// commencent par /api/auth
// Exemple : /api/auth/register, /api/auth/login...
@RequestMapping("/api/auth")


public class AuthController {

    // Spring injecte automatiquement AuthService
    @Autowired
    private AuthService authService;

    // Nécessaires pour l'endpoint /validate ci-dessous
    @Autowired
    private JwtService jwtService;

    @Autowired
    private UserDetailsService userDetailsService;

    // ============================================================
    // ENDPOINT 1 : POST /api/auth/register
    // Inscription d'un nouvel utilisateur
    //
    // @PostMapping : cette méthode répond aux requêtes HTTP POST
    // @RequestBody : Spring lit le JSON de la requête et le convertit
    //               automatiquement en objet RegisterRequest Java
    // ResponseEntity : permet de contrôler le code HTTP de la réponse
    //   - 200 OK : tout s'est bien passé
    //   - 400 Bad Request : données invalides
    //   - 409 Conflict : email déjà utilisé (géré par GlobalExceptionHandler)
    // ============================================================
   // ✎ AJOUT — vérification de disponibilité d'un email avant inscription
    @GetMapping("/check-email")
    public ResponseEntity<Map<String, Boolean>> checkEmail(@RequestParam String email) {
        return ResponseEntity.ok(Map.of("available", authService.isEmailAvailable(email)));
    }

    // ✎ AJOUT — vérification de disponibilité d'un téléphone avant inscription
    @GetMapping("/check-phone")
    public ResponseEntity<Map<String, Boolean>> checkPhone(@RequestParam String phone) {
        return ResponseEntity.ok(Map.of("available", authService.isPhoneAvailable(phone)));
    }
@PostMapping("/register")
    public ResponseEntity<com.tutorlink.auth.dto.RegisterResponse> register(@RequestBody RegisterRequest request) {
        return ResponseEntity.ok(authService.register(request));
    }

    // ============================================================
    // ✎ FIX — POST /api/auth/register/student
    // Inscription élève/parent — force le rôle STUDENT
    // ============================================================
    @PostMapping("/register/student")
    public ResponseEntity<com.tutorlink.auth.dto.RegisterResponse> registerStudent(@RequestBody RegisterRequest request) {
        request.setRole(User.Role.STUDENT);
        return ResponseEntity.ok(authService.register(request));
    }

    // ============================================================
    // ✎ FIX — POST /api/auth/register/tutor
    // Inscription répétiteur — force le rôle TUTOR
    // ⚠️ NOTE : cet endpoint ne gère que les champs texte (JSON).
    // Les documents (CNI, diplôme, photo) doivent être envoyés séparément
    // vers tutor-service (POST /api/tutors/{tutorId}/documents/upload)
    // une fois le compte créé. Le frontend (registerService.ts) envoie
    // actuellement tout en FormData multipart en un seul appel :
    // on corrigera ça côté frontend plus tard, ou on ajoutera ici la
    // gestion multipart si tu préfères tout faire en un seul appel.
    // ============================================================
    @PostMapping("/register/tutor")
    public ResponseEntity<com.tutorlink.auth.dto.RegisterResponse> registerTutor(@RequestBody RegisterRequest request) {
        request.setRole(User.Role.TUTOR);
        return ResponseEntity.ok(authService.register(request));
    }

    // ============================================================
    // ENDPOINT 2 : POST /api/auth/verify-otp
    // Vérification du code OTP reçu par email
    // ============================================================
    @PostMapping("/verify-otp")
    public ResponseEntity<String> verifyOtp(@RequestBody OtpVerifyRequest request) {
        String message = authService.verifyOtp(request);
        return ResponseEntity.ok(message);
    }

    // ============================================================
    // ENDPOINT 3 : POST /api/auth/login
    // Connexion — retourne un token JWT si les credentials sont bons
    // ============================================================
    @PostMapping("/login")
    public ResponseEntity<AuthResponse> login(@RequestBody LoginRequest request) {
        AuthResponse response = authService.login(request);
        return ResponseEntity.ok(response);
    }
    // ============================================================
    // ✎ AJOUT V4 — ENDPOINT : POST /api/auth/verify-2fa
    // Étape 2 du login admin — vérifie le code SMS/email
    // ============================================================
    @PostMapping("/verify-2fa")
    public ResponseEntity<AuthResponse> verify2Fa(@RequestBody TwoFactorVerifyRequest request) {
        AuthResponse response = authService.verify2Fa(request);
        return ResponseEntity.ok(response);
    }

    // ============================================================
    // ENDPOINT 4 : POST /api/auth/forgot-password
    // Demande de réinitialisation — envoie un nouvel OTP par email
    // ============================================================
    @PostMapping("/forgot-password")
    public ResponseEntity<String> forgotPassword(
            @RequestBody ForgotPasswordRequest request) {
        String message = authService.forgotPassword(request);
        return ResponseEntity.ok(message);
    }

    // ============================================================
    // ENDPOINT 5 : POST /api/auth/reset-password
    // Réinitialisation du mot de passe avec le code OTP
    // ============================================================
    @PostMapping("/reset-password")
    public ResponseEntity<String> resetPassword(
            @RequestBody ResetPasswordRequest request) {
        String message = authService.resetPassword(request);
        return ResponseEntity.ok(message);
    }

    // ============================================================
    // ENDPOINT 6 : GET /api/auth/validate
    // Valide un JWT — appelé par api-gateway (ou tout autre service)
    // pour vérifier qu'un token est authentique et non expiré.
    // Attend le header : Authorization: Bearer <token>
    // Retourne simplement true/false (jamais d'erreur 500 ici,
    // un token invalide doit juste donner false, pas planter l'appelant)
    // ============================================================
    @GetMapping("/validate")
    public ResponseEntity<Boolean> validate(@RequestHeader("Authorization") String authHeader) {
        try {
            if (authHeader == null || !authHeader.startsWith("Bearer ")) {
                return ResponseEntity.ok(false);
            }
            String token = authHeader.substring(7);
            String email = jwtService.extractEmail(token);
            UserDetails userDetails = userDetailsService.loadUserByUsername(email);
            boolean valid = jwtService.isTokenValid(token, userDetails);
            return ResponseEntity.ok(valid);
        } catch (Exception e) {
            return ResponseEntity.ok(false);
        }
    }
    // ============================================================
    // ✎ AJOUT : POST /api/auth/refresh
    // Régénère un nouveau token JWT à partir d'un token encore valide
    // ============================================================
    @PostMapping("/refresh")
    public ResponseEntity<AuthResponse> refresh(@RequestHeader("Authorization") String authHeader) {
        AuthResponse response = authService.refreshToken(authHeader);
        return ResponseEntity.ok(response);
    }

    // ============================================================
    // ✎ AJOUT : POST /api/auth/change-password
    // Changement de mot de passe pour un utilisateur déjà connecté
    // ============================================================
    @PostMapping("/change-password")
    public ResponseEntity<String> changePassword(@RequestBody ChangePasswordRequest request) {
        String message = authService.changePassword(request);
        return ResponseEntity.ok(message);
    }
// ============================================================
    // ✎ AJOUT V4 : POST /api/auth/admin/create-account
    // Réservé aux admins (à protéger par rôle au niveau api-gateway,
    // qu'on configurera à l'étape api-gateway)
    // ============================================================
    @PostMapping("/admin/create-account")
    public ResponseEntity<String> adminCreateAccount(@RequestBody AdminCreateAccountRequest request) {
        String message = authService.adminCreateAccount(request);
        return ResponseEntity.ok(message);
    }
    // ============================================================
    // ENDPOINT BONUS : GET /api/auth/health
    // Simple endpoint pour vérifier que le service tourne
    // Utile pour les tests et le monitoring
    // ============================================================
    @GetMapping("/health")
    public ResponseEntity<String> health() {
        return ResponseEntity.ok("Auth service is running !");
    }
    // ✎ AJOUT — DELETE /api/auth/user/{userId} — suppression admin du compte
    @DeleteMapping("/user/{userId}")
    public ResponseEntity<Void> deleteUser(@PathVariable Long userId) {
        authService.deleteUserById(userId);
        return ResponseEntity.noContent().build();
    }
}