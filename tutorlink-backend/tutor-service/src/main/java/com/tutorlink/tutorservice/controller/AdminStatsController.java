package com.tutorlink.tutorservice.controller;

import com.tutorlink.tutorservice.entity.TutorProfile;
import com.tutorlink.tutorservice.enums.DocumentStatus;
import com.tutorlink.tutorservice.repository.TutorProfileRepository;
import com.tutorlink.tutorservice.repository.VerificationDocumentRepository;
import com.tutorlink.tutorservice.service.GroupService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.Arrays;
import java.util.Map;
import java.util.stream.Collectors;

// FIX — endpoints internes appelés directement par api-gateway (AdminStatsController.fetchCount)
// /api/admin/stats/tutors/active, /api/admin/stats/documents/pending, /api/admin/stats/groups/active
@RestController
@RequestMapping("/api/admin/stats")
@RequiredArgsConstructor
public class AdminStatsController {

    private final TutorProfileRepository tutorProfileRepository;
    private final VerificationDocumentRepository verificationDocumentRepository;
    private final GroupService groupService;

    @GetMapping("/tutors/active")
    public ResponseEntity<Map<String, Long>> getActiveTutorsCount() {
        long count = tutorProfileRepository.findByIsVerifiedTrue().size();
        return ResponseEntity.ok(Map.of("count", count));
    }

   @GetMapping("/documents/pending")
public ResponseEntity<Map<String, Long>> getPendingDocumentsCount() {
    // ✎ FIX — alignement avec /api/tutors/pending (getPendingTutors) : on
    // compte désormais les PROFILS tuteur non vérifiés (isVerified=false,
    // pas encore rejetés), et non les documents PENDING isolés — ce qui
    // créait un chiffre différent de celui affiché sur la page Répétiteurs.
    long count = tutorProfileRepository.findByIsVerifiedFalseAndRejectionReasonIsNull().size();
    return ResponseEntity.ok(Map.of("count", count));
}

    // Déplacé depuis GroupController — le chemin doit être /api/admin/stats/groups/active
    @GetMapping("/groups/active")
    public ResponseEntity<Map<String, Long>> getActiveGroupsCount() {
        return ResponseEntity.ok(Map.of("count", groupService.countActiveGroups()));
    }

    // ✎ AJOUT — répartition des tuteurs par matière (rapport admin)
    // Simplification : compte les tuteurs proposant chaque matière (champ
    // "subjects" séparé par virgules), pas le volume de réservations par matière.
    @GetMapping("/subjects/distribution")
    public ResponseEntity<Map<String, Long>> getSubjectDistribution() {
        Map<String, Long> distribution = tutorProfileRepository.findAll().stream()
                .map(TutorProfile::getSubjects)
                .filter(s -> s != null && !s.isBlank())
                .flatMap(s -> Arrays.stream(s.split(",")))
                .map(String::trim)
                .filter(s -> !s.isEmpty())
                .collect(Collectors.groupingBy(s -> s, Collectors.counting()));
        return ResponseEntity.ok(distribution);
    }

    // ✎ AJOUT — répartition des tuteurs par ville (rapport admin)
    // Simplification : par ville (champ "city"), pas par quartier précis
    // (le champ "districts" est une liste libre par tuteur, trop hétérogène
    // pour un groupement fiable).
    @GetMapping("/quartiers/distribution")
    public ResponseEntity<Map<String, Long>> getCityDistribution() {
        Map<String, Long> distribution = tutorProfileRepository.findAll().stream()
                .map(TutorProfile::getCity)
                .filter(c -> c != null && !c.isBlank())
                .collect(Collectors.groupingBy(c -> c, Collectors.counting()));
        return ResponseEntity.ok(distribution);
    }
}