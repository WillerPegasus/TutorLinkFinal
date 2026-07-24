// ============================================================
// FICHIER 4 : OtpInvalidException.java
// Lancée quand le code OTP entré par l'utilisateur
// ne correspond pas à celui stocké en base de données
// ============================================================
package com.tutorlink.auth.exception;

public class OtpInvalidException extends RuntimeException {
    public OtpInvalidException(String message) {
        super(message);
    }
}