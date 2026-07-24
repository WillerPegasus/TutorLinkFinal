package com.tutorlink.tutorservice.controller;

import com.tutorlink.tutorservice.dto.AvailabilityRequest;
import com.tutorlink.tutorservice.service.TutorService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/api/tutors/{tutorId}/availability")
@RequiredArgsConstructor
public class AvailabilityController {

    private final TutorService tutorService;

    // Récupérer les disponibilités (TutorAvailability.tsx)
    @GetMapping
    public ResponseEntity<List<AvailabilityRequest>> getAvailability(
            @PathVariable Long tutorId) {
        return ResponseEntity.ok(tutorService.getAvailability(tutorId));
    }

    // Définir / mettre à jour les disponibilités
    @PutMapping
    public ResponseEntity<Void> setAvailability(
            @PathVariable Long tutorId,
            @Valid @RequestBody List<AvailabilityRequest> availabilities) {
        tutorService.setAvailability(tutorId, availabilities);
        return ResponseEntity.noContent().build();
    }
}