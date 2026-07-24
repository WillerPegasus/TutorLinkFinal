package com.tutorlink.auth.dto;

// ✎ V3 : le champ "email" est renommé en "identifier"
// "identifier" accepte soit un email soit un numéro de téléphone
// Exemple email : "jean@gmail.com"
// Exemple téléphone : "+237691234567"
public class LoginRequest {

    // ✎ V3 : était "email" avant, maintenant "identifier"
    // Le frontend envoie soit l'email soit le téléphone dans ce champ
    private String identifier;

    private String password;

    // Getters et Setters
    public String getIdentifier() { return identifier; }
    public void setIdentifier(String identifier) { this.identifier = identifier; }

    public String getPassword() { return password; }
    public void setPassword(String password) { this.password = password; }
}