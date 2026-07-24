// ============================================================
// FICHIER 5 : ForgotPasswordRequest.java
// Données envoyées quand l'utilisateur a oublié son mot de passe
// Via POST /api/auth/forgot-password
// Le serveur va envoyer un nouvel OTP à cet email
// ============================================================
package com.tutorlink.auth.dto;

// Exemple de JSON reçu :
// {
//   "email": "jean@gmail.com"
// }
// C'est le DTO le plus simple — juste un email !
public class ForgotPasswordRequest {

    private String email;

    // Getter et Setter
    public String getEmail() { return email; }
    public void setEmail(String email) { this.email = email; }
}