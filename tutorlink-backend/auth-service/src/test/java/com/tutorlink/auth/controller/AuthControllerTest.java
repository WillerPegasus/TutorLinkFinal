package com.tutorlink.auth.controller;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.tutorlink.auth.dto.*;
import com.tutorlink.auth.entity.User;
import com.tutorlink.auth.repository.UserRepository;
import org.junit.jupiter.api.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.http.MediaType;
import org.springframework.test.context.ActiveProfiles;
import org.springframework.test.web.servlet.MockMvc;
import org.mockito.Mockito;
import org.springframework.boot.test.mock.mockito.MockBean;
import com.tutorlink.auth.service.EmailService;
import com.tutorlink.auth.client.UserServiceClient;
import com.tutorlink.auth.client.NotificationServiceClient;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

// @SpringBootTest : démarre le contexte Spring complet pour les tests
// C'est un vrai test d'intégration — Spring, Security, Base de données...
@SpringBootTest
// @AutoConfigureMockMvc : configure MockMvc automatiquement
// MockMvc simule des requêtes HTTP sans avoir besoin d'un vrai navigateur
@AutoConfigureMockMvc
// @ActiveProfiles("test") : utilise application-test.properties si il existe
@ActiveProfiles("test")
// @TestMethodOrder : définit l'ordre d'exécution des tests
// On veut que register() soit testé avant login()
@TestMethodOrder(MethodOrderer.OrderAnnotation.class)
class AuthControllerTest {

    // MockMvc simule les requêtes HTTP vers notre controller
    // Sans lancer un vrai serveur Tomcat
    @Autowired
    private MockMvc mockMvc;

    // ObjectMapper convertit nos objets Java en JSON et vice versa
    @Autowired
    private ObjectMapper objectMapper;

    // On injecte le repository pour nettoyer la base entre les tests
    @Autowired
    private UserRepository userRepository;

    // Email de test utilisé dans tous les tests
    private static final String TEST_EMAIL = "test.integration@gmail.com";
    private static final String TEST_PASSWORD = "motdepasse123";

    // @BeforeEach : exécuté avant CHAQUE test
    // On supprime l'utilisateur de test pour avoir une base propre
    @BeforeEach
void setUp() {
    // Nettoyer la base avant chaque test
    userRepository.findByEmail(TEST_EMAIL)
            .ifPresent(user -> userRepository.delete(user));

    // Dire à Mockito de ne rien faire quand on appelle sendOtpEmail
    // Sans ça, le test tente d'envoyer un vrai email Gmail et plante
    Mockito.doNothing().when(emailService)
           .sendOtpEmail(Mockito.anyString(), Mockito.anyString());
}
    // @MockBean remplace le vrai bean par un faux pendant les tests
// EmailService ne tentera pas d'envoyer un vrai email
@MockBean
private EmailService emailService;

// Idem pour les clients Feign — pas de vrais appels réseau
@MockBean
private UserServiceClient userServiceClient;

@MockBean
private NotificationServiceClient notificationServiceClient;

    // ============================================================
    // TEST 1 : GET /api/auth/health
    // Vérifie que le service répond correctement
    // @Order(1) : ce test s'exécute en premier
    // ============================================================
    @Test
    @Order(1)
    @DisplayName("T1 - Health check doit retourner 200")
    void healthCheck_shouldReturn200() throws Exception {
        mockMvc.perform(get("/api/auth/health"))
                // On vérifie que le code HTTP est 200 OK
                .andExpect(status().isOk())
                // On vérifie que la réponse contient ce texte
                .andExpect(content().string("Auth service is running !"));
    }

    // ============================================================
    // TEST 2 : POST /api/auth/register
    // Vérifie qu'un nouvel utilisateur peut s'inscrire
    // ============================================================
    @Test
    @Order(2)
    @DisplayName("T2 - Inscription réussie doit retourner 200")
    void register_withValidData_shouldReturn200() throws Exception {
        // Préparer les données d'inscription
        RegisterRequest request = new RegisterRequest();
        request.setFirstName("Jean");
        request.setLastName("Dupont");
        request.setEmail(TEST_EMAIL);
        request.setPassword(TEST_PASSWORD);
        request.setRole(User.Role.STUDENT);
        request.setPhone("+237691234567");

        // Envoyer la requête POST et vérifier la réponse
        mockMvc.perform(post("/api/auth/register")
                        .contentType(MediaType.APPLICATION_JSON)
                        // objectMapper.writeValueAsString() convertit l'objet en JSON
                        .content(objectMapper.writeValueAsString(request)))
                .andExpect(status().isOk())
                .andExpect(content().string(
                    org.hamcrest.Matchers.containsString("Inscription réussie")
                ));
    }

    // ============================================================
    // TEST 3 : POST /api/auth/register avec email déjà existant
    // Vérifie qu'on reçoit une erreur 409 CONFLICT
    // ============================================================
    @Test
    @Order(3)
    @DisplayName("T3 - Inscription avec email existant doit retourner 409")
    void register_withExistingEmail_shouldReturn409() throws Exception {
        // D'abord on crée un utilisateur
        register_withValidData_shouldReturn200();

        // On essaie de s'inscrire avec le même email
        RegisterRequest request = new RegisterRequest();
        request.setFirstName("Marie");
        request.setLastName("Martin");
       request.setEmail(TEST_EMAIL);
        request.setPassword("autreMotDePasse");
        request.setRole(User.Role.STUDENT);
        request.setPhone("+237698765432");

        mockMvc.perform(post("/api/auth/register")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(request)))
                // On vérifie que le code HTTP est 409 CONFLICT
                .andExpect(status().isConflict())
                // On vérifie que le JSON retourné contient "status": 409
                .andExpect(jsonPath("$.status").value(409));
    }

    // ============================================================
    // TEST 4 : POST /api/auth/register avec role ADMIN
    // Vérifie que le rôle ADMIN est refusé (T13)
    // ============================================================
    @Test
    @Order(4)
    @DisplayName("T4 - Inscription avec role ADMIN doit forcer STUDENT")
    void register_withAdminRole_shouldForceStudent() throws Exception {
        RegisterRequest request = new RegisterRequest();
        request.setFirstName("Hacker");
        request.setLastName("Test");
        request.setEmail(TEST_EMAIL);
        request.setPassword(TEST_PASSWORD);
        request.setRole(User.Role.ADMIN); // On essaie de se créer un compte ADMIN
        request.setPhone("+237691234567");
        mockMvc.perform(post("/api/auth/register")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(request)))
                .andExpect(status().isOk());

        // Vérifier en base que le rôle a bien été forcé à STUDENT
        User savedUser = userRepository.findByEmail(TEST_EMAIL).orElseThrow();
        Assertions.assertEquals(User.Role.STUDENT, savedUser.getRole(),
            "Le rôle ADMIN doit être forcé à STUDENT !");
    }

    // ============================================================
    // TEST 5 : POST /api/auth/login avec mauvais mot de passe
    // Vérifie qu'on reçoit une erreur 401 UNAUTHORIZED
    // ============================================================
    @Test
    @Order(5)
    @DisplayName("T5 - Login avec mauvais mot de passe doit retourner 401")
    void login_withWrongPassword_shouldReturn401() throws Exception {
        LoginRequest request = new LoginRequest();
        request.setIdentifier(TEST_EMAIL);
        request.setPassword("mauvaisMotDePasse"); // Mauvais mot de passe

        mockMvc.perform(post("/api/auth/login")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(request)))
                .andExpect(status().isUnauthorized())
                .andExpect(jsonPath("$.status").value(401));
    }

    // ============================================================
    // TEST 6 : POST /api/auth/verify-otp avec mauvais code
    // Vérifie qu'on reçoit une erreur 400 BAD REQUEST
    // ============================================================
    @Test
    @Order(6)
    @DisplayName("T6 - Vérification OTP avec mauvais code doit retourner 400")
    void verifyOtp_withWrongCode_shouldReturn400() throws Exception {
        // D'abord créer un utilisateur
        register_withValidData_shouldReturn200();

        // Essayer de vérifier avec un mauvais OTP
        OtpVerifyRequest request = new OtpVerifyRequest();
        request.setEmail(TEST_EMAIL);
        request.setOtpCode("000000"); // Mauvais code

        mockMvc.perform(post("/api/auth/verify-otp")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(request)))
                .andExpect(status().isBadRequest())
                .andExpect(jsonPath("$.status").value(400));
    }

    // ============================================================
    // TEST 7 : POST /api/auth/forgot-password avec email inexistant
    // Vérifie qu'on reçoit une erreur 401
    // ============================================================
    @Test
    @Order(7)
    @DisplayName("T7 - Forgot password avec email inexistant doit retourner 401")
    void forgotPassword_withUnknownEmail_shouldReturn401() throws Exception {
        ForgotPasswordRequest request = new ForgotPasswordRequest();
        request.setEmail("email.inexistant@gmail.com");

        mockMvc.perform(post("/api/auth/forgot-password")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(request)))
                .andExpect(status().isUnauthorized());
    }
}