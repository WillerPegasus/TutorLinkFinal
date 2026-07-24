// ============================================================
// FICHIER 3 : OtpExpiredException.java
// Lancée quand le code OTP a dépassé sa durée de validité
// (10 minutes après l'envoi)
// ============================================================
package com.tutorlink.auth.exception;

public class OtpExpiredException extends RuntimeException {
    public OtpExpiredException(String message) {
        super(message);
    }
}


// ============================================================
// FICHIER 4 : OtpInvalidException.java
// Lancée quand le code OTP entré par l'utilisateur
// ne correspond pas à celui stocké en base de données
// ============================================================
// Note : ce fichier ne peut contenir qu'une seule classe publique
// Crée un fichier séparé pour OtpInvalidException