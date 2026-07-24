// ============================================================
// FICHIER 2 : InvalidCredentialsException.java
// Lancée quand l'email ou le mot de passe est incorrect
// à la connexion
// ============================================================
package com.tutorlink.auth.exception;

public class InvalidCredentialsException extends RuntimeException {
    public InvalidCredentialsException(String message) {
        super(message);
    }
}