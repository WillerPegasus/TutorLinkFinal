package com.tutorlink.tutorservice.controller;

import com.tutorlink.tutorservice.dto.*;
import com.tutorlink.tutorservice.service.TutorService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/api/tutors")
@RequiredArgsConstructor
public class TutorProfileController {

    private final TutorService tutorService;

    @PostMapping
    public ResponseEntity<TutorProfileResponse> createProfile(
            @Valid @RequestBody TutorProfileRequest request) {
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(tutorService.createTutorProfile(request));
    }
    // ✎ AJOUT — GET /api/tutors (sans /search) — alias attendu par le frontend,
    // réutilise exactement la même logique de recherche/filtrage
    @GetMapping
    public ResponseEntity<List<TutorProfileResponse>> getAllOrSearchTutors(
            @RequestParam(required = false) String subject,
            @RequestParam(required = false) String level,
            @RequestParam(required = false) String city,
            @RequestParam(required = false) String district,
            @RequestParam(required = false) Integer minPrice,
            @RequestParam(required = false) Integer maxPrice,
            @RequestParam(required = false) Double minRating) {
        return searchTutors(subject, level, city, district, minPrice, maxPrice, minRating);
    }

    @GetMapping("/{id}")
    public ResponseEntity<TutorProfileResponse> getTutorById(@PathVariable Long id) {
        return ResponseEntity.ok(tutorService.getTutorById(id));
    }

    @GetMapping("/user/{userId}")
    public ResponseEntity<TutorProfileResponse> getTutorByUserId(@PathVariable Long userId) {
        return ResponseEntity.ok(tutorService.getTutorByUserId(userId));
    }

    @PutMapping("/{id}")
    public ResponseEntity<TutorProfileResponse> updateProfile(
            @PathVariable Long id,
            @Valid @RequestBody TutorProfileRequest request) {
        return ResponseEntity.ok(tutorService.updateProfile(id, request));
    }

    @GetMapping("/search")
    public ResponseEntity<List<TutorProfileResponse>> searchTutors(
            @RequestParam(required = false) String subject,
            @RequestParam(required = false) String level,
            @RequestParam(required = false) String city,
            @RequestParam(required = false) String district,
            @RequestParam(required = false) Integer minPrice,
            @RequestParam(required = false) Integer maxPrice,
            @RequestParam(required = false) Double minRating) {
        TutorSearchRequest searchRequest = TutorSearchRequest.builder()
                .subject(subject).level(level).city(city).district(district)
                .minPrice(minPrice).maxPrice(maxPrice).minRating(minRating)
                .build();
        return ResponseEntity.ok(tutorService.searchTutors(searchRequest));
    }

    @GetMapping("/verified")
    public ResponseEntity<List<TutorProfileResponse>> getVerifiedTutors() {
        return ResponseEntity.ok(tutorService.getAllVerifiedTutors());
    }
    // ✎ AJOUT — GET /api/tutors/subjects — toutes les matières distinctes
    // proposées par les tuteurs vérifiés (pour peupler un filtre)
    @GetMapping("/subjects")
    public ResponseEntity<List<String>> getAllAvailableSubjects() {
        return ResponseEntity.ok(tutorService.getAllAvailableSubjects());
    }

    // ✎ AJOUT — GET /api/tutors/quartiers — tous les quartiers distincts
    @GetMapping("/quartiers")
    public ResponseEntity<List<String>> getAllAvailableDistricts() {
        return ResponseEntity.ok(tutorService.getAllAvailableDistricts());
    }
    // ✎ AJOUT — liste des tuteurs en attente (admin)
    @GetMapping("/pending")
    public ResponseEntity<List<TutorProfileResponse>> getPendingTutors() {
        return ResponseEntity.ok(tutorService.getPendingTutors());
    }

    // ✎ AJOUT — alias de verifyTutor, nom aligné avec le frontend
    @PatchMapping("/{id}/approve")
    public ResponseEntity<Void> approveTutor(@PathVariable Long id) {
        tutorService.verifyTutor(id);
        return ResponseEntity.noContent().build();
    }
    
    // ✎ AJOUT — rejette un tuteur, avec motif optionnel en paramètre
    @PatchMapping("/{id}/reject")
    public ResponseEntity<Void> rejectTutor(
            @PathVariable Long id,
            @RequestParam(required = false) String reason) {
        tutorService.rejectTutor(id, reason);
        return ResponseEntity.noContent().build();
    }

    @PatchMapping("/{id}/verify")
    public ResponseEntity<Void> verifyTutor(@PathVariable Long id) {
        tutorService.verifyTutor(id);
        return ResponseEntity.noContent().build();
    }
    // ✎ AJOUT — DELETE /api/tutors/user/{userId} — suppression admin en cascade
    @DeleteMapping("/user/{userId}")
    public ResponseEntity<Void> deleteByUserId(@PathVariable Long userId) {
        tutorService.deleteTutorProfileByUserId(userId);
        return ResponseEntity.noContent().build();
    }

}