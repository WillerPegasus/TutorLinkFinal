package com.tutorlink.auth.dto;

import com.tutorlink.auth.entity.User;

// ✎ AJOUT V4 : requête utilisée par l'admin pour créer un compte
// directement (rôle imposé, pas de passage par l'inscription publique)
public class AdminCreateAccountRequest {

    private String firstName;
    private String lastName;
    private String email;
    private String phone;
    private User.Role role; // l'admin peut choisir n'importe quel rôle, y compris ADMIN

    public String getFirstName() { return firstName; }
    public void setFirstName(String firstName) { this.firstName = firstName; }

    public String getLastName() { return lastName; }
    public void setLastName(String lastName) { this.lastName = lastName; }

    public String getEmail() { return email; }
    public void setEmail(String email) { this.email = email; }

    public String getPhone() { return phone; }
    public void setPhone(String phone) { this.phone = phone; }

    public User.Role getRole() { return role; }
    public void setRole(User.Role role) { this.role = role; }
}