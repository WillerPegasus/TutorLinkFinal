package com.tutorlink.auth.service;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.springframework.security.core.userdetails.User;
import org.springframework.security.core.userdetails.UserDetails;

import java.util.Collections;

import static org.junit.jupiter.api.Assertions.*;

// Pas de @SpringBootTest ici !
// Les tests unitaires testent une seule classe isolément
// Sans démarrer Spring ni se connecter à la base de données
// C'est beaucoup plus rapide !
class JwtServiceTest {

    private JwtService jwtService;
    private UserDetails userDetails;

    // @BeforeEach : exécuté avant chaque test
    // On initialise JwtService manuellement (sans Spring)
    @BeforeEach
    void setUp() throws Exception {
        jwtService = new JwtService();

        // Injecter manuellement les valeurs de application.properties
        // car Spring n'est pas démarré dans les tests unitaires
        var secretField = JwtService.class.getDeclaredField("secretKey");
        secretField.setAccessible(true);
        secretField.set(jwtService,
            "tutorlink_super_secret_key_2024_dschang_university_very_long_key");

        var expirationField = JwtService.class.getDeclaredField("jwtExpiration");
        expirationField.setAccessible(true);
        expirationField.set(jwtService, 86400000L);

        // Créer un UserDetails de test
        userDetails = User.withUsername("test@gmail.com")
                .password("motdepasse")
                .roles("STUDENT")
                .build();
    }

    // ============================================================
    // TEST 1 : generateToken() doit retourner un token non null
    // ============================================================
    @Test
    @DisplayName("generateToken doit retourner un token non vide")
    void generateToken_shouldReturnNonNullToken() {
       String token = jwtService.generateToken(userDetails, 1L);

        // assertNotNull vérifie que le token n'est pas null
        assertNotNull(token, "Le token ne doit pas être null");

        // Un token JWT a toujours 3 parties séparées par des points
        assertEquals(3, token.split("\\.").length,
            "Le token JWT doit avoir 3 parties séparées par des points");
    }

    // ============================================================
    // TEST 2 : extractEmail() doit retourner le bon email
    // ============================================================
    @Test
    @DisplayName("extractEmail doit retourner l'email contenu dans le token")
    void extractEmail_shouldReturnCorrectEmail() {
        String token = jwtService.generateToken(userDetails, 1L);
        String extractedEmail = jwtService.extractEmail(token);

        assertEquals("test@gmail.com", extractedEmail,
            "L'email extrait doit correspondre à celui du UserDetails");
    }

    // ============================================================
    // TEST 3 : isTokenValid() doit retourner true pour un token valide
    // ============================================================
    @Test
    @DisplayName("isTokenValid doit retourner true pour un token valide")
    void isTokenValid_withValidToken_shouldReturnTrue() {
        String token = jwtService.generateToken(userDetails, 1L);

        assertTrue(jwtService.isTokenValid(token, userDetails),
            "Le token généré doit être valide");
    }

    // ============================================================
    // TEST 4 : isTokenValid() doit retourner false pour un mauvais user
    // ============================================================
    @Test
    @DisplayName("isTokenValid doit retourner false si le token ne correspond pas à l'utilisateur")
    void isTokenValid_withWrongUser_shouldReturnFalse() {
        String token = jwtService.generateToken(userDetails, 1L);

        // Créer un autre UserDetails avec un email différent
        UserDetails autreUser = User.withUsername("autre@gmail.com")
                .password("motdepasse")
                .roles("STUDENT")
                .build();

        assertFalse(jwtService.isTokenValid(token, autreUser),
            "Le token ne doit pas être valide pour un autre utilisateur");
    }

    // ============================================================
    // TEST 5 : extractExpiration() doit retourner une date future
    // ============================================================
    @Test
    @DisplayName("extractExpiration doit retourner une date dans le futur")
    void extractExpiration_shouldReturnFutureDate() {
        String token = jwtService.generateToken(userDetails, 1L);
        java.util.Date expiration = jwtService.extractExpiration(token);

        // La date d'expiration doit être après maintenant
        assertTrue(expiration.after(new java.util.Date()),
            "La date d'expiration doit être dans le futur");
    }
}