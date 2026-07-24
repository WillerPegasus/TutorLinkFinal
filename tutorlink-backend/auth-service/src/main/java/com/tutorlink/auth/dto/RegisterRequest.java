// ============================================================
// FICHIER 1 : RegisterRequest.java
// Données reçues quand un utilisateur s'inscrit
// Le frontend envoie ces champs en JSON via POST /api/auth/register
// ============================================================
package com.tutorlink.auth.dto;

import com.tutorlink.auth.entity.User;

// Ce DTO représente le formulaire d'inscription
// Exemple de JSON reçu :
// {
//   "firstName": "Jean",
//   "lastName": "Dupont",
//   "email": "jean@gmail.com",
//   "password": "monMotDePasse123",
//   "role": "STUDENT"
// }
public class RegisterRequest {

    private String firstName;
    private String lastName;
    private String email;
    private String password;

    // Le rôle choisi par l'utilisateur à l'inscription
    // On utilise l'enum Role défini dans User.java
    private User.Role role;

    // ✎ V3 : téléphone obligatoire à l'inscription
     private String phone;
    // Getters et Setters
    public String getFirstName() { return firstName; }
    public void setFirstName(String firstName) { this.firstName = firstName; }

    public String getLastName() { return lastName; }
    public void setLastName(String lastName) { this.lastName = lastName; }

    public String getEmail() { return email; }
    public void setEmail(String email) { this.email = email; }

    public String getPassword() { return password; }
    public void setPassword(String password) { this.password = password; }

    public User.Role getRole() { return role; }
    public void setRole(User.Role role) { this.role = role; }
    public String getPhone() { return phone; }
    public void setPhone(String phone) { this.phone = phone; }

    // ✎ AJOUT — champs pédagogiques, utilisés seulement si role == TUTOR
    private String subjects;
    private String levels;
    private Integer hourlyRate;
    private String bio;
    private String city;
    private String districts;

    public String getSubjects() { return subjects; }
    public void setSubjects(String subjects) { this.subjects = subjects; }

    public String getLevels() { return levels; }
    public void setLevels(String levels) { this.levels = levels; }

    public Integer getHourlyRate() { return hourlyRate; }
    public void setHourlyRate(Integer hourlyRate) { this.hourlyRate = hourlyRate; }

    public String getBio() { return bio; }
    public void setBio(String bio) { this.bio = bio; }

    public String getCity() { return city; }
    public void setCity(String city) { this.city = city; }

    public String getDistricts() { return districts; }
    public void setDistricts(String districts) { this.districts = districts; }
}