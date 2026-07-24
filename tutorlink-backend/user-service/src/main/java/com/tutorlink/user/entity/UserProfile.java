package com.tutorlink.user.entity;

import jakarta.persistence.*;
import lombok.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "user_profiles")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class UserProfile {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, unique = true)
    private Long userId;

    private String firstName;
    private String lastName;

    @Column(nullable = false, unique = true)
    private String email;

   
@Column(nullable = false)
private String phone;
    private String profilePicture;
    private String city;
    private String districts;

    @Enumerated(EnumType.STRING)
    private Role role;

    @Lob
    @Column(columnDefinition = "TEXT")
    private String bio;
    // ✎ AJOUT V4 : statut du compte (actif / suspendu / à valider)
    @Enumerated(EnumType.STRING)
    @Builder.Default
    private AccountStatus status = AccountStatus.ACTIVE;
    // ✎ AJOUT — préférences de confidentialité
    @Builder.Default
    private Boolean phoneVisible = true;

    @Builder.Default
    private Boolean profilePublic = true;

    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;

    @PrePersist
    protected void onCreate() {
        createdAt = LocalDateTime.now();
        updatedAt = LocalDateTime.now();
    }

    @PreUpdate
    protected void onUpdate() {
        updatedAt = LocalDateTime.now();
    }
}