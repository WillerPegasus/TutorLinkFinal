package com.tutorlink.auth.dto;

import com.tutorlink.auth.entity.User;

public class AuthResponse {

    private String token;
    private Long userId;
    private String firstName;
    private String lastName;
    private User.Role role;
    private Boolean isVerified;

    // ✎ AJOUT V4 : indique au frontend qu'il doit afficher l'écran
    // "Code 2FA envoyé par SMS" avant de recevoir un vrai token
    private Boolean twoFactorRequired = false;
    private String message;

    // Constructeur existant (login normal STUDENT/PARENT/TUTOR, ou étape finale admin)
    public AuthResponse(String token, Long userId, String firstName,
                        String lastName, User.Role role, Boolean isVerified) {
        this.token = token;
        this.userId = userId;
        this.firstName = firstName;
        this.lastName = lastName;
        this.role = role;
        this.isVerified = isVerified;
    }

    // ✎ AJOUT V4 : constructeur utilisé quand la 2FA est requise (compte ADMIN)
    public AuthResponse(Boolean twoFactorRequired, String message) {
        this.twoFactorRequired = twoFactorRequired;
        this.message = message;
    }

    public String getToken() { return token; }
    public Long getUserId() { return userId; }
    public String getFirstName() { return firstName; }
    public String getLastName() { return lastName; }
    public User.Role getRole() { return role; }
    public Boolean getIsVerified() { return isVerified; }
    public Boolean getTwoFactorRequired() { return twoFactorRequired; }
    public String getMessage() { return message; }
}