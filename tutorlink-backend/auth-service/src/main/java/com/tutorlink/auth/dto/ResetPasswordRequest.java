// ============================================================
// FICHIER 6 : ResetPasswordRequest.java
// Données envoyées pour réinitialiser le mot de passe
// Via POST /api/auth/reset-password
// L'utilisateur fournit son email, le code OTP reçu,
// et son nouveau mot de passe
// ============================================================
package com.tutorlink.auth.dto;

// Exemple de JSON reçu :
// {
//   "email": "jean@gmail.com",
//   "otpCode": "847291",
//   "newPassword": "monNouveauMotDePasse456"
// }
public class ResetPasswordRequest {

    private String email;

    // Le code OTP reçu par email pour confirmer l'identité
    private String otpCode;

    // Le nouveau mot de passe EN CLAIR
    // Il sera haché par BCrypt avant d'être sauvegardé
    private String newPassword;

    // Getters et Setters
    public String getEmail() { return email; }
    public void setEmail(String email) { this.email = email; }

    public String getOtpCode() { return otpCode; }
    public void setOtpCode(String otpCode) { this.otpCode = otpCode; }

    public String getNewPassword() { return newPassword; }
    public void setNewPassword(String newPassword) { this.newPassword = newPassword; }
}