package com.tutorlink.auth.dto;

// ✎ AJOUT V4 : requête envoyée par le frontend à l'étape 2 du login admin
// (après avoir reçu le code par SMS/email)
public class TwoFactorVerifyRequest {

    private String identifier; // email ou téléphone de l'admin
    private String code;       // code à 6 chiffres reçu

    public String getIdentifier() { return identifier; }
    public void setIdentifier(String identifier) { this.identifier = identifier; }

    public String getCode() { return code; }
    public void setCode(String code) { this.code = code; }
}