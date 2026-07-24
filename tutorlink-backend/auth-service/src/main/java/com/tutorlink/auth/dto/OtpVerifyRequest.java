// ============================================================
// FICHIER 4 : OtpVerifyRequest.java
// Données envoyées pour vérifier le code OTP reçu par email
// Via POST /api/auth/verify-otp
// ============================================================
package com.tutorlink.auth.dto;

// Exemple de JSON reçu :
// {
//   "email": "jean@gmail.com",
//   "otpCode": "847291"
// }
public class OtpVerifyRequest {

    private String email;

    // Le code à 6 chiffres que l'utilisateur a reçu par email
    // et qu'il tape dans l'interface
    private String otpCode;

    // Getters et Setters
    public String getEmail() { return email; }
    public void setEmail(String email) { this.email = email; }

    public String getOtpCode() { return otpCode; }
    public void setOtpCode(String otpCode) { this.otpCode = otpCode; }
}