package com.tutorlink.auth.exception;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;

import java.time.LocalDateTime;
import java.util.HashMap;
import java.util.Map;

// @RestControllerAdvice : cette classe surveille TOUS les controllers
// Quand une exception est lancée n'importe où dans l'application,
// Spring cherche ici la méthode qui sait la gérer
// C'est comme un filet de sécurité global
@RestControllerAdvice
public class GlobalExceptionHandler {

    // ============================================================
    // MÉTHODE UTILITAIRE : buildErrorResponse()
    // Construit un objet JSON d'erreur standardisé
    // Toutes les erreurs auront le même format :
    // {
    //   "timestamp": "2024-01-15T14:30:00",
    //   "status": 409,
    //   "error": "CONFLICT",
    //   "message": "Un compte existe déjà avec cet email"
    // }
    // ============================================================
    private ResponseEntity<Map<String, Object>> buildErrorResponse(
            HttpStatus status, String message) {

        Map<String, Object> body = new HashMap<>();
        body.put("timestamp", LocalDateTime.now().toString());
        body.put("status", status.value());        // Le code HTTP (409, 401, 400...)
        body.put("error", status.getReasonPhrase()); // Le texte du code ("Conflict"...)
        body.put("message", message);              // Notre message personnalisé

        return ResponseEntity.status(status).body(body);
    }

    // ============================================================
    // HANDLER 1 : UserAlreadyExistsException
    // Déclenchée dans AuthService.register() quand l'email existe déjà
    // Code HTTP 409 CONFLICT : "il y a un conflit avec une ressource existante"
    //
    // @ExceptionHandler : Spring appelle cette méthode automatiquement
    // quand une UserAlreadyExistsException est lancée n'importe où
    // ============================================================
    @ExceptionHandler(UserAlreadyExistsException.class)
    public ResponseEntity<Map<String, Object>> handleUserAlreadyExists(
            UserAlreadyExistsException ex) {
        return buildErrorResponse(HttpStatus.CONFLICT, ex.getMessage());
    }

    // ============================================================
    // HANDLER 2 : InvalidCredentialsException
    // Déclenchée dans AuthService.login() quand email/mdp est incorrect
    // Code HTTP 401 UNAUTHORIZED : "non autorisé, identifiants invalides"
    // ============================================================
    @ExceptionHandler(InvalidCredentialsException.class)
    public ResponseEntity<Map<String, Object>> handleInvalidCredentials(
            InvalidCredentialsException ex) {
        return buildErrorResponse(HttpStatus.UNAUTHORIZED, ex.getMessage());
    }

    // ============================================================
    // HANDLER 3 : OtpExpiredException
    // Déclenchée quand le code OTP a dépassé 10 minutes
    // Code HTTP 400 BAD REQUEST : "la requête est invalide"
    // ============================================================
    @ExceptionHandler(OtpExpiredException.class)
    public ResponseEntity<Map<String, Object>> handleOtpExpired(
            OtpExpiredException ex) {
        return buildErrorResponse(HttpStatus.BAD_REQUEST, ex.getMessage());
    }

    // ============================================================
    // HANDLER 4 : OtpInvalidException
    // Déclenchée quand le code OTP entré ne correspond pas
    // Code HTTP 400 BAD REQUEST
    // ============================================================
    @ExceptionHandler(OtpInvalidException.class)
    public ResponseEntity<Map<String, Object>> handleOtpInvalid(
            OtpInvalidException ex) {
        return buildErrorResponse(HttpStatus.BAD_REQUEST, ex.getMessage());
    }

    // ============================================================
    // HANDLER 5 : Exception générale (filet de sécurité)
    // Intercepte TOUTE exception non gérée par les handlers ci-dessus
    // Code HTTP 500 INTERNAL SERVER ERROR : "erreur interne du serveur"
    // Utile pour ne jamais exposer une erreur Java brute au frontend
    // ============================================================
    @ExceptionHandler(Exception.class)
    public ResponseEntity<Map<String, Object>> handleGenericException(
            Exception ex) {
        return buildErrorResponse(
            HttpStatus.INTERNAL_SERVER_ERROR,
            "Une erreur interne est survenue. Veuillez réessayer."
        );
    }
}