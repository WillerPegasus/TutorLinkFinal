package com.tutorlink.user.dto;

import com.tutorlink.user.entity.Role;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

// ✎ AJOUT — DTO public : PAS d'email, PAS de phone.
// Utilisé pour l'affichage public des profils (ex: recherche de tuteurs)
// sans exposer de données sensibles à des utilisateurs non authentifiés.
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class PublicUserProfileResponse {
    private Long id;
    private Long userId;
    private String firstName;
    private String lastName;
    private String profilePicture;
    private String city;
    private String districts;
    private Role role;
    private String bio;
}