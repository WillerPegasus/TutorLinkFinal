package com.tutorlink.tutorservice.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;
import java.time.LocalDateTime;

// ✎ AJOUT — vue "groupe" côté élève, enrichie avec les infos du Group
// (nom, matière, prix...) en plus de son adhésion (GroupMembership).
// tutorName n'est PAS résolu ici (le tutor-service n'a pas accès aux
// noms d'utilisateur, gérés par user-service) — le frontend le résout
// lui-même via /tutors/{id} puis /users/{id}/public, comme pour les
// autres pages (admin groupes, réservations...).
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class StudentGroupResponse {
    private Long membershipId;
    private Long groupId;
    private String name;
    private String subject;
    private String level;
    private String city;
    private String district;
    private Long tutorId;
    private Integer monthlyPrice;
    private String schedules;
    private String status;        // Group.status (ACTIVE, FULL, SUSPENDED...)
    private String memberStatus;  // GroupMembership.status (ACTIVE, PENDING...)
    private LocalDateTime joinedAt;
    private LocalDate lastPaymentDate;
    private boolean upToDate;
}
