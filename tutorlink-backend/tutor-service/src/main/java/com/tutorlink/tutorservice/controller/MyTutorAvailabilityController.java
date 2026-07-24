package com.tutorlink.tutorservice.controller;

import com.tutorlink.tutorservice.dto.AvailabilityRequest;
import com.tutorlink.tutorservice.service.TutorService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.List;

// ✎ AJOUT — alias "moi-même" pour les disponibilités du tuteur connecté.
// Le frontend tuteur ne connaît que son userId (via le token), pas son
// tutorId. On résout le tutorId via TutorService.getTutorByUserId(),
// puis on réutilise getAvailability/setAvailability existants.
@RestController
@RequestMapping("/api/tutors/me/availability")
@RequiredArgsConstructor
public class MyTutorAvailabilityController {

    private final TutorService tutorService;

    @GetMapping
    public ResponseEntity<List<AvailabilityRequest>> getMyAvailability(
            @RequestHeader(value = "X-User-Id", required = false) String requesterId) {

        if (requesterId == null) {
            return ResponseEntity.status(401).build();
        }

        Long tutorId = tutorService.getTutorByUserId(Long.parseLong(requesterId)).getId();
        return ResponseEntity.ok(tutorService.getAvailability(tutorId));
    }

    @PutMapping
    public ResponseEntity<Void> setMyAvailability(
            @RequestHeader(value = "X-User-Id", required = false) String requesterId,
            @Valid @RequestBody List<AvailabilityRequest> availabilities) {

        if (requesterId == null) {
            return ResponseEntity.status(401).build();
        }

        Long tutorId = tutorService.getTutorByUserId(Long.parseLong(requesterId)).getId();
        tutorService.setAvailability(tutorId, availabilities);
        return ResponseEntity.noContent().build();
    }
}