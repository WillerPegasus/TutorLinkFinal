package com.tutorlink.auth.dto;

// ✎ AJOUT — réponse enrichie de l'inscription, incluant l'id du compte créé
// (nécessaire côté frontend pour créer le profil tuteur et uploader les documents)
public class RegisterResponse {
    private String message;
    private Long userId;

    public RegisterResponse() {}

    public RegisterResponse(String message, Long userId) {
        this.message = message;
        this.userId = userId;
    }

    public String getMessage() { return message; }
    public void setMessage(String message) { this.message = message; }

    public Long getUserId() { return userId; }
    public void setUserId(Long userId) { this.userId = userId; }
}
