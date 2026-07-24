// ============================================================
// FICHIER 1 : UserAlreadyExistsException.java
// Lancée quand quelqu'un essaie de s'inscrire avec un email
// qui existe déjà en base de données
// ============================================================
package com.tutorlink.auth.exception;

// RuntimeException = exception non vérifiée
// Tu n'as pas besoin de la déclarer dans chaque méthode avec "throws"
// Elle remonte automatiquement jusqu'au GlobalExceptionHandler
public class UserAlreadyExistsException extends RuntimeException {
    public UserAlreadyExistsException(String message) {
        super(message); // Passe le message à la classe parent RuntimeException
    }
}