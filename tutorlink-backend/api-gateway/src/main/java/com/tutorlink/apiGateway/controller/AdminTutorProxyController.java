package com.tutorlink.apiGateway.controller;

import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.client.RestTemplate;

import java.util.List;

// ✎ AJOUT — alias /api/admin/tutors/** attendus par le frontend
@RestController
@RequestMapping("/api/admin/tutors")
@RequiredArgsConstructor
public class AdminTutorProxyController {

    private final RestTemplate restTemplate;

    @Value("${services.tutor-service.url}")
    private String tutorServiceUrl;

    @GetMapping("/pending")
    public ResponseEntity<List> getPendingTutors() {
        List tutors = restTemplate.getForObject(tutorServiceUrl + "/api/tutors/pending", List.class);
        return ResponseEntity.ok(tutors);
    }

    @GetMapping("/top-rated")
    public ResponseEntity<List> getTopRatedTutors() {
        // Réutilise la liste des tuteurs vérifiés (pas de tri par note dédié pour l'instant)
        List tutors = restTemplate.getForObject(tutorServiceUrl + "/api/tutors/verified", List.class);
        return ResponseEntity.ok(tutors);
    }

    @PatchMapping("/{id}/approve")
    public ResponseEntity<Void> approveTutor(@PathVariable Long id) {
        restTemplate.patchForObject(tutorServiceUrl + "/api/tutors/" + id + "/approve", null, Void.class);
        return ResponseEntity.noContent().build();
    }

    @PatchMapping("/{id}/reject")
    public ResponseEntity<Void> rejectTutor(@PathVariable Long id) {
        restTemplate.patchForObject(tutorServiceUrl + "/api/tutors/" + id + "/reject", null, Void.class);
        return ResponseEntity.noContent().build();
    }
}