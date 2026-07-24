package com.tutorlink.auth.entity;

import jakarta.persistence.*;
import java.time.LocalDateTime;

// @Entity dit à Spring Boot : "cette classe Java = une table en base de données"
@Entity

// @Table(name="users") : le nom exact de la table dans MySQL sera "users"
// Sans ça, Spring utiliserait "user" qui est un mot réservé MySQL (bug !)
@Table(name = "users")
public class User {

    // ============================================================
    // CHAMPS = COLONNES DE LA TABLE MySQL
    // Chaque champ Java devient automatiquement une colonne SQL
    // ============================================================

    // @Id : ce champ est la clé primaire (colonne ID, unique pour chaque ligne)
    // @GeneratedValue : MySQL génère l'ID automatiquement : 1, 2, 3, 4...
    // Tu n'as jamais besoin de définir l'ID toi-même
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    // nullable = false signifie que ce champ est OBLIGATOIRE en base
    // Si tu essaies de sauvegarder un User sans prénom → erreur SQL
    @Column(nullable = false)
    private String firstName;

    @Column(nullable = false)
    private String lastName;

    // unique = true : deux utilisateurs ne peuvent PAS avoir le même email
    // C'est la base de la sécurité : l'email identifie chaque personne
    @Column(nullable = false, unique = true)
    private String email;

   // ✎ V3 : numéro de téléphone obligatoire dès l'inscription
   // Exemple : "+237691234567"
   @Column(nullable = false)
   private String phone;

    // ATTENTION : on ne stocke JAMAIS un mot de passe en clair !
    // Ce champ contiendra le mot de passe HACHÉ par BCrypt
    // Exemple : "monMotDePasse" devient "$2a$10$xyz123abc..."
    @Column(nullable = false)
    private String password;

    // @Enumerated(EnumType.STRING) : stocke le texte "STUDENT", "TUTOR"...
    // Sans ça, JPA stockerait des chiffres (0, 1, 2...) illisibles en base
    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private Role role;

    // Par défaut false : tout nouveau compte est NON vérifié
    // Il devient true seulement après validation du code OTP par email
    @Column(nullable = false)
    private Boolean isVerified = false;

    // Le code OTP à 6 chiffres envoyé par email (ex: "847291")
    // Null quand aucun OTP n'est en cours
    private String otpCode;

    // La date et heure d'expiration du code OTP
    // Exemple : si envoyé à 14h00, expire à 14h10
    private LocalDateTime otpExpiry;

    // La date de création du compte
    // updatable = false : une fois créée, cette date ne change jamais
    @Column(nullable = false, updatable = false)
    private LocalDateTime createdAt;

    // ============================================================
    // @PrePersist : méthode appelée automatiquement par JPA
    // juste AVANT la première sauvegarde en base de données
    // Elle remplit createdAt avec la date/heure actuelle
    // Tu n'as jamais besoin d'appeler cette méthode toi-même !
    // ============================================================
    @PrePersist
    protected void onCreate() {
        this.createdAt = LocalDateTime.now();
    }

    // ============================================================
    // ENUM ROLE : les 4 rôles possibles dans TutorLink
    // Un enum c'est une liste de valeurs fixes et limitées
    // Un User.role ne peut être QUE l'une de ces 4 valeurs
    // ============================================================
    public enum Role {
        STUDENT,  // Élève cherchant un répétiteur
        PARENT,   // Parent gérant le compte d'un élève
        TUTOR,    // Répétiteur proposant ses services
        ADMIN     // Administrateur (ne peut PAS s'inscrire via l'API publique)
    }

    // ============================================================
    // GETTERS ET SETTERS
    // En Java, les champs sont "private" (personne ne peut y accéder
    // directement depuis l'extérieur). Les getters/setters sont les
    // portes d'entrée et de sortie pour lire et modifier ces champs.
    // Spring Boot en a besoin pour fonctionner correctement.
    // Exemple : user.getEmail() retourne l'email, user.setEmail("x") le modifie
    // ============================================================

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public String getFirstName() { return firstName; }
    public void setFirstName(String firstName) { this.firstName = firstName; }

    public String getLastName() { return lastName; }
    public void setLastName(String lastName) { this.lastName = lastName; }

    public String getEmail() { return email; }
    public void setEmail(String email) { this.email = email; }

    public String getPhone() { return phone; }
    public void setPhone(String phone) { this.phone = phone; }

    public String getPassword() { return password; }
    public void setPassword(String password) { this.password = password; }

    public Role getRole() { return role; }
    public void setRole(Role role) { this.role = role; }

    public Boolean getIsVerified() { return isVerified; }
    public void setIsVerified(Boolean isVerified) { this.isVerified = isVerified; }

    public String getOtpCode() { return otpCode; }
    public void setOtpCode(String otpCode) { this.otpCode = otpCode; }

    public LocalDateTime getOtpExpiry() { return otpExpiry; }
    public void setOtpExpiry(LocalDateTime otpExpiry) { this.otpExpiry = otpExpiry; }

    public LocalDateTime getCreatedAt() { return createdAt; }
    public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }
}