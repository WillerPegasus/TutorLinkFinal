package com.tutorlink.auth.service;

import com.tutorlink.auth.dto.*;
import com.tutorlink.auth.entity.User;
import com.tutorlink.auth.exception.*;
import com.tutorlink.auth.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.Random;
import com.tutorlink.auth.client.NotificationServiceClient;
import com.tutorlink.auth.client.UserServiceClient;
import java.util.HashMap;
import java.util.Map;

// @Service : Spring gère cette classe et l'injecte partout où on en a besoin
@Service
public class AuthService {

    // Spring injecte automatiquement ces 4 dépendances
    // Tu n'as jamais besoin de les créer avec "new"

    @Autowired
    private UserRepository userRepository; // Pour accéder à la base de données

    @Autowired
    private PasswordEncoder passwordEncoder; // Pour hacher les mots de passe (BCrypt)

    @Autowired
    private JwtService jwtService; // Pour générer les tokens JWT

    @Autowired
    private EmailService emailService; // Pour envoyer les emails OTP

    @Autowired
    private UserServiceClient userServiceClient;
    @Autowired
    private com.tutorlink.auth.client.TutorServiceClient tutorServiceClient;

    @Autowired
    private NotificationServiceClient notificationServiceClient;

    // ============================================================
    // MÉTHODE 1 : register()
    // Inscription d'un nouvel utilisateur
    // Étapes : vérifier email unique → hacher mdp → générer OTP
    //          → envoyer email → sauvegarder en base
    // ============================================================
    public com.tutorlink.auth.dto.RegisterResponse register(RegisterRequest request) {

        // ÉTAPE 1 : Vérifier que l'email n'est pas déjà utilisé
        if (userRepository.existsByEmail(request.getEmail())) {
            throw new UserAlreadyExistsException(
                "Un compte existe déjà avec l'email : " + request.getEmail()
            );
        }
        

        // ÉTAPE 2 (T13) : Bloquer la création de comptes ADMIN
        User.Role role = request.getRole();
        if (role == null || role == User.Role.ADMIN) {
            role = User.Role.STUDENT;
        }

        // ÉTAPE 3 : Générer le code OTP
        String otpCode = generateOtp();

        // ÉTAPE 4 : Créer et sauvegarder l'utilisateur
        User user = new User();
        user.setFirstName(request.getFirstName());
        user.setLastName(request.getLastName());
        user.setEmail(request.getEmail());
        user.setPassword(passwordEncoder.encode(request.getPassword()));
        user.setRole(role);
        // ✎ V3 : enregistrer le numéro de téléphone
        user.setPhone(request.getPhone());
        user.setIsVerified(false);
        user.setOtpCode(otpCode);
        user.setOtpExpiry(LocalDateTime.now().plusMinutes(10));
        userRepository.save(user);

        // ÉTAPE 5 (T11) : Appeler user-service pour créer le profil
        // On construit un Map avec les données du profil
        // Si user-service est en panne, on logue l'erreur sans bloquer l'inscription
        try {
            Map<String, Object> profileData = new HashMap<>();
            profileData.put("userId", user.getId());
            profileData.put("firstName", user.getFirstName());
            profileData.put("lastName", user.getLastName());
            profileData.put("email", user.getEmail());
            // FIX : le téléphone était manquant ici — user-service l'exige
            // (obligatoire, NOT NULL) sinon la création du profil échouait
           profileData.put("phone", user.getPhone());
            profileData.put("role", user.getRole().name());
            profileData.put("city", request.getCity());
            profileData.put("districts", request.getDistricts());
            userServiceClient.createUserProfile(profileData);
        } catch (Exception e) {
            System.out.println(
                "[WARNING] Impossible de créer le profil dans user-service : "
                + e.getMessage()
            );
        }

        /// ✎ AJOUT — si TUTOR, créer aussi le profil pédagogique dans tutor-service
        if (role == User.Role.TUTOR) {
            try {
                Map<String, Object> tutorProfileData = new HashMap<>();
                tutorProfileData.put("userId", user.getId());
                tutorProfileData.put("subjects", request.getSubjects());
                tutorProfileData.put("levels", request.getLevels());
                tutorProfileData.put("hourlyRate", request.getHourlyRate());
                tutorProfileData.put("bio", request.getBio());
                tutorProfileData.put("city", request.getCity());
                tutorProfileData.put("districts", request.getDistricts());
                tutorServiceClient.createTutorProfile(tutorProfileData);
            } catch (Exception e) {
                System.out.println(
                    "[WARNING] Impossible de créer le profil dans tutor-service : "
                    + e.getMessage()
                );
            }
        }

        // ÉTAPE 6 (T12) : Envoyer l'OTP via notification-service
        // Si notification-service est en panne, le fallback utilise EmailService
        try {
            Map<String, Object> notifData = new HashMap<>();
            notifData.put("to", request.getEmail());
            notifData.put("otpCode", otpCode);
            // APRÈS
            notifData.put("type", "OTP");
            notificationServiceClient.sendNotification(notifData);
        } catch (Exception e) {
            // Si même le fallback échoue, on utilise EmailService directement
            emailService.sendOtpEmail(request.getEmail(), otpCode);
        }
        return new com.tutorlink.auth.dto.RegisterResponse(
            "Inscription réussie ! Vérifiez votre email pour le code OTP.",
            user.getId()
        );
    }
    // ✎ AJOUT — vérifications de disponibilité pour le frontend
    public boolean isEmailAvailable(String email) {
        return !userRepository.existsByEmail(email);
    }

    public boolean isPhoneAvailable(String phone) {
        return !userRepository.existsByPhone(phone);
    }

    // ============================================================
    // MÉTHODE 2 : verifyOtp()
    // Vérifie le code OTP entré par l'utilisateur
    // Étapes : trouver l'utilisateur → vérifier code → vérifier expiry
    //          → marquer comme vérifié → effacer OTP
    // ============================================================
    public String verifyOtp(OtpVerifyRequest request) {

        // Chercher l'utilisateur par son email
        // orElseThrow() : si Optional est vide (utilisateur non trouvé)
        // → lance automatiquement l'exception indiquée
        User user = userRepository.findByEmail(request.getEmail())
                .orElseThrow(() -> new InvalidCredentialsException(
                    "Aucun compte trouvé avec cet email"
                ));

        // Vérifier que le code OTP n'est pas expiré
        // LocalDateTime.now().isAfter(otpExpiry) = "maintenant est après l'expiration"
        if (LocalDateTime.now().isAfter(user.getOtpExpiry())) {
            throw new OtpExpiredException("Le code OTP a expiré. Demandez-en un nouveau.");
        }

        // Vérifier que le code entré correspond au code en base
        // equals() compare les deux chaînes de caractères
        if (!user.getOtpCode().equals(request.getOtpCode())) {
            throw new OtpInvalidException("Code OTP incorrect.");
        }

        // Tout est bon ! Marquer le compte comme vérifié
        user.setIsVerified(true);

        // Effacer le code OTP — il a été utilisé, on n'en a plus besoin
        user.setOtpCode(null);
        user.setOtpExpiry(null);

        // Sauvegarder les modifications (UPDATE SQL)
        userRepository.save(user);

        return "Compte vérifié avec succès ! Vous pouvez maintenant vous connecter.";
    }
    public void deleteUserById(Long userId) {
        userRepository.deleteById(userId);
    }

    
public AuthResponse login(LoginRequest request) {

    // ✎ V3 : chercher d'abord par email, puis par téléphone
    User user = userRepository.findByEmail(request.getIdentifier())
            .orElseGet(() -> userRepository.findByPhone(request.getIdentifier())
                    .orElseThrow(() -> new InvalidCredentialsException(
                        "Email ou téléphone ou mot de passe incorrect"
                    )));

    // Vérifier le mot de passe
    if (!passwordEncoder.matches(request.getPassword(), user.getPassword())) {
        throw new InvalidCredentialsException("Email ou téléphone ou mot de passe incorrect");
    }

    // Vérifier que le compte a été vérifié par OTP
    if (!user.getIsVerified()) {
        throw new InvalidCredentialsException(
            "Compte non vérifié. Vérifiez votre email."
        );
    }

    // ✎ AJOUT V4 : 2FA obligatoire pour les comptes ADMIN
    // On ne délivre pas de token tout de suite : on génère un code,
    // on l'envoie, et on demande une 2e étape via /api/auth/verify-2fa
    if (user.getRole() == User.Role.ADMIN) {
        String otpCode = generateOtp();
        user.setOtpCode(otpCode);
        user.setOtpExpiry(LocalDateTime.now().plusMinutes(5));
        userRepository.save(user);

        send2FaCode(user, otpCode);

        return new AuthResponse(true, "Code de vérification envoyé par SMS.");
    }

    // Créer UserDetails pour JwtService
    org.springframework.security.core.userdetails.UserDetails userDetails = buildUserDetails(user);

    // Générer le token JWT
String token = jwtService.generateToken(userDetails, user.getId());
    // Retourner la réponse complète
    return new AuthResponse(
        token,
        user.getId(),
        user.getFirstName(),
        user.getLastName(),
        user.getRole(),
        user.getIsVerified()
    );
}

// ============================================================
// ✎ AJOUT V4 : verify2Fa()
// Étape 2 du login admin — vérifie le code puis délivre le token JWT
// ============================================================
public AuthResponse verify2Fa(TwoFactorVerifyRequest request) {

    User user = userRepository.findByEmail(request.getIdentifier())
            .orElseGet(() -> userRepository.findByPhone(request.getIdentifier())
                    .orElseThrow(() -> new InvalidCredentialsException(
                        "Compte introuvable"
                    )));

    if (user.getOtpExpiry() == null || LocalDateTime.now().isAfter(user.getOtpExpiry())) {
        throw new OtpExpiredException("Le code a expiré. Reconnectez-vous.");
    }

    if (user.getOtpCode() == null || !user.getOtpCode().equals(request.getCode())) {
        throw new OtpInvalidException("Code de vérification incorrect.");
    }

    user.setOtpCode(null);
    user.setOtpExpiry(null);
    userRepository.save(user);

    org.springframework.security.core.userdetails.UserDetails userDetails = buildUserDetails(user);
    String token = jwtService.generateToken(userDetails, user.getId());

    return new AuthResponse(
        token,
        user.getId(),
        user.getFirstName(),
        user.getLastName(),
        user.getRole(),
        user.getIsVerified()
    );
}

// ============================================================
// ✎ AJOUT V4 : send2FaCode()
// Pas de passerelle SMS réelle configurée → mode mock (log console)
// + envoi par email en secours pour pouvoir tester réellement
// ============================================================
private void send2FaCode(User user, String otpCode) {
    System.out.println(
        "[SMS MOCK] Code 2FA envoyé au " + user.getPhone() + " : " + otpCode
    );
    try {
        emailService.sendOtpEmail(user.getEmail(), otpCode);
    } catch (Exception e) {
        System.out.println(
            "[WARNING] Échec de l'envoi du code 2FA par email : " + e.getMessage()
        );
    }
}

// ============================================================
// ✎ AJOUT V4 : buildUserDetails() — factorisation
// ============================================================
private org.springframework.security.core.userdetails.UserDetails buildUserDetails(User user) {
    return org.springframework.security.core.userdetails.User
            .withUsername(user.getEmail())
            .password(user.getPassword())
            .roles(user.getRole().name())
            .build();
}

    // ============================================================
    // MÉTHODE 4 : forgotPassword()
    // L'utilisateur a oublié son mot de passe
    // Étapes : trouver utilisateur → générer nouvel OTP
    //          → sauvegarder → envoyer email
    // ============================================================
    public String forgotPassword(ForgotPasswordRequest request) {

        // Trouver l'utilisateur
        User user = userRepository.findByEmail(request.getEmail())
                .orElseThrow(() -> new InvalidCredentialsException(
                    "Aucun compte trouvé avec cet email"
                ));

        // Générer un nouveau code OTP
        String otpCode = generateOtp();
        user.setOtpCode(otpCode);
        user.setOtpExpiry(LocalDateTime.now().plusMinutes(10));

        // Sauvegarder le nouvel OTP en base
        userRepository.save(user);

        // Envoyer l'email avec le nouveau code
        emailService.sendOtpEmail(request.getEmail(), otpCode);

        return "Un nouveau code OTP a été envoyé à votre email.";
    }

    // ============================================================
    // MÉTHODE 5 : resetPassword()
    // Réinitialisation du mot de passe avec le code OTP
    // Étapes : trouver utilisateur → vérifier OTP → hacher nouveau mdp
    //          → sauvegarder → effacer OTP
    // ============================================================
    public String resetPassword(ResetPasswordRequest request) {

        // Trouver l'utilisateur
        User user = userRepository.findByEmail(request.getEmail())
                .orElseThrow(() -> new InvalidCredentialsException(
                    "Aucun compte trouvé avec cet email"
                ));

        // Vérifier l'expiration de l'OTP
        if (LocalDateTime.now().isAfter(user.getOtpExpiry())) {
            throw new OtpExpiredException("Le code OTP a expiré. Demandez-en un nouveau.");
        }

        // Vérifier le code OTP
        if (!user.getOtpCode().equals(request.getOtpCode())) {
            throw new OtpInvalidException("Code OTP incorrect.");
        }

        // Hacher et sauvegarder le nouveau mot de passe
        user.setPassword(passwordEncoder.encode(request.getNewPassword()));

        // Effacer l'OTP utilisé
        user.setOtpCode(null);
        user.setOtpExpiry(null);

        // Sauvegarder en base
        userRepository.save(user);

        return "Mot de passe réinitialisé avec succès !";
    }
    public String changePassword(ChangePasswordRequest request) {
        User user = userRepository.findByEmail(request.getIdentifier())
                .orElseThrow(() -> new InvalidCredentialsException(
                    "Aucun compte trouvé avec cet identifiant"
                ));
        if (!passwordEncoder.matches(request.getOldPassword(), user.getPassword())) {
            throw new InvalidCredentialsException("Ancien mot de passe incorrect.");
        }
        user.setPassword(passwordEncoder.encode(request.getNewPassword()));
        userRepository.save(user);
        return "Mot de passe modifié avec succès !";
    }
    // ============================================================
    // ✎ AJOUT : refreshToken()
    // Vérifie le token actuel puis en génère un nouveau
    // ============================================================
    public AuthResponse refreshToken(String authHeader) {
        if (authHeader == null || !authHeader.startsWith("Bearer ")) {
            throw new InvalidCredentialsException("Token manquant ou invalide");
        }
        String oldToken = authHeader.substring(7);
        String email = jwtService.extractEmail(oldToken);

        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new InvalidCredentialsException("Utilisateur introuvable"));

        org.springframework.security.core.userdetails.UserDetails userDetails =
                org.springframework.security.core.userdetails.User
                    .withUsername(user.getEmail())
                    .password(user.getPassword())
                    .authorities("ROLE_" + user.getRole().name())
                    .build();

        if (!jwtService.isTokenValid(oldToken, userDetails)) {
            throw new InvalidCredentialsException("Token expiré ou invalide, reconnexion nécessaire");
        }

      String newToken = jwtService.generateToken(userDetails, user.getId());

        return new AuthResponse(
                newToken,
                user.getId(),
                user.getFirstName(),
                user.getLastName(),
                user.getRole(),
                user.getIsVerified()
        );
    }

    // ============================================================
    // MÉTHODE PRIVÉE UTILITAIRE : generateOtp()
    // Génère un code OTP aléatoire à 6 chiffres
    // Exemple : "847291", "003821", "999001"
    // ============================================================
    // ============================================================
    // ✎ AJOUT V4 : adminCreateAccount()
    // Création directe d'un compte par un admin — pas d'OTP,
    // rôle imposé, mot de passe temporaire généré et envoyé par email
    // ============================================================
    public String adminCreateAccount(AdminCreateAccountRequest request) {

        if (userRepository.existsByEmail(request.getEmail())) {
            throw new UserAlreadyExistsException(
                "Un compte existe déjà avec l'email : " + request.getEmail()
            );
        }

        String tempPassword = generateTempPassword();

        User user = new User();
        user.setFirstName(request.getFirstName());
        user.setLastName(request.getLastName());
        user.setEmail(request.getEmail());
        user.setPhone(request.getPhone());
        user.setPassword(passwordEncoder.encode(tempPassword));
        user.setRole(request.getRole() != null ? request.getRole() : User.Role.STUDENT);
        // Créé directement par un admin : compte considéré vérifié d'office
        user.setIsVerified(true);
        userRepository.save(user);

        try {
            Map<String, Object> profileData = new HashMap<>();
            profileData.put("userId", user.getId());
            profileData.put("firstName", user.getFirstName());
            profileData.put("lastName", user.getLastName());
            profileData.put("email", user.getEmail());
            profileData.put("phone", user.getPhone());
            profileData.put("role", user.getRole().name());
            userServiceClient.createUserProfile(profileData);
        } catch (Exception e) {
            System.out.println("[WARNING] Impossible de créer le profil dans user-service : " + e.getMessage());
        }

        try {
            emailService.sendTempPasswordEmail(request.getEmail(), tempPassword);
        } catch (Exception e) {
            System.out.println("[WARNING] Échec de l'envoi de l'email de bienvenue : " + e.getMessage());
        }

        return "Compte créé avec succès. Mot de passe temporaire envoyé à " + request.getEmail();
    }

    private String generateTempPassword() {
        String chars = "ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnopqrstuvwxyz23456789";
        Random random = new Random();
        StringBuilder sb = new StringBuilder();
        for (int i = 0; i < 10; i++) {
            sb.append(chars.charAt(random.nextInt(chars.length())));
        }
        return sb.toString();
    }
    private String generateOtp() {
        // Random génère un nombre entre 0 et 999999
        // String.format("%06d", ...) formate sur 6 chiffres avec des zéros devant
        // Exemple : 3821 devient "003821"
        Random random = new Random();
        int otp = random.nextInt(999999);
        return String.format("%06d", otp);
    }
}