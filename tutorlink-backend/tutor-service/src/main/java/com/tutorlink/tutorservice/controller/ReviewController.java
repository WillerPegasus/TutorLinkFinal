package com.tutorlink.tutorservice.controller;

import com.tutorlink.tutorservice.dto.ReviewRequest;
import com.tutorlink.tutorservice.dto.ReviewResponse;
import com.tutorlink.tutorservice.service.TutorService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.List;
import java.util.Map;

@RestController
@RequiredArgsConstructor
public class ReviewController {

    private final TutorService tutorService;

    // Ajouter un avis (après réservation COMPLETED)
    @PostMapping("/api/tutors/{tutorId}/reviews")
    public ResponseEntity<ReviewResponse> addReview(
            @PathVariable Long tutorId,
            @Valid @RequestBody ReviewRequest request) {
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(tutorService.addReview(tutorId, request));
    }

    // Récupérer les avis d'un tuteur (TutorProfilePage.tsx)
    @GetMapping("/api/tutors/{tutorId}/reviews")
    public ResponseEntity<List<ReviewResponse>> getReviewsByTutor(
            @PathVariable Long tutorId) {
        return ResponseEntity.ok(tutorService.getReviewsByTutor(tutorId));
    }

   // Récupérer les avis d'un étudiant (page "Mes avis")
    @GetMapping("/api/tutors/reviews/student/{studentId}")
    public ResponseEntity<List<ReviewResponse>> getReviewsByStudent(
            @PathVariable Long studentId) {
        return ResponseEntity.ok(tutorService.getReviewsByStudent(studentId));
    }
   // ✎ FIX — GET /api/tutors/{tutorId}/reviews/stats
    // Statistiques calculées à la volée à partir des avis existants
    @GetMapping("/api/tutors/{tutorId}/reviews/stats")
    public ResponseEntity<Map<String, Object>> getReviewStats(@PathVariable Long tutorId) {
        List<ReviewResponse> reviews = tutorService.getReviewsByTutor(tutorId);

        long total = reviews.size();
        double average = reviews.stream()
                .mapToInt(ReviewResponse::getRating)
                .average()
                .orElse(0.0);

        Map<Integer, Long> distribution = new java.util.HashMap<>();
        for (int star = 1; star <= 5; star++) {
            final int s = star;
            distribution.put(s, reviews.stream().filter(r -> r.getRating() == s).count());
        }

        return ResponseEntity.ok(Map.of(
                "total", total,
                "average", Math.round(average * 10.0) / 10.0,
                "distribution", distribution
        ));
    }

    // ✎ FIX — GET /api/tutors/me/reviews
    // Raccourci pour le tuteur connecté (dashboard) — résout le tutorId
    // à partir du X-User-Id injecté par la gateway.
    @GetMapping("/api/tutors/me/reviews")
    public ResponseEntity<List<ReviewResponse>> getMyReviews(
            @RequestHeader(value = "X-User-Id", required = false) String requesterId) {
        if (requesterId == null) return ResponseEntity.status(401).build();
        Long tutorId = tutorService.getTutorByUserId(Long.parseLong(requesterId)).getId();
        return ResponseEntity.ok(tutorService.getReviewsByTutor(tutorId));
    }

    // ✎ FIX — GET /api/tutors/me/reviews/stats
    @GetMapping("/api/tutors/me/reviews/stats")
    public ResponseEntity<Map<String, Object>> getMyReviewStats(
            @RequestHeader(value = "X-User-Id", required = false) String requesterId) {
        if (requesterId == null) return ResponseEntity.status(401).build();
        Long tutorId = tutorService.getTutorByUserId(Long.parseLong(requesterId)).getId();
        return getReviewStats(tutorId);
    } 
    // ✎ FIX — POST /api/tutors/me/reviews/{reviewId}/reply
    @PostMapping("/api/tutors/me/reviews/{reviewId}/reply")
    public ResponseEntity<ReviewResponse> replyToReview(
            @PathVariable Long reviewId,
            @RequestHeader(value = "X-User-Id", required = false) String requesterId,
            @RequestBody Map<String, String> body) {
        if (requesterId == null) return ResponseEntity.status(401).build();
        return ResponseEntity.ok(tutorService.replyToReview(reviewId, body.get("reply")));
    }
    @PutMapping("/api/tutors/reviews/{reviewId}")
    public ResponseEntity<ReviewResponse> updateReview(
            @PathVariable Long reviewId,
            @RequestHeader(value = "X-User-Id", required = false) String requesterId,
            @Valid @RequestBody ReviewRequest request) {
        if (requesterId == null) return ResponseEntity.status(401).build();
        return ResponseEntity.ok(tutorService.updateReview(reviewId, Long.parseLong(requesterId), request));
    }

    @DeleteMapping("/api/tutors/reviews/{reviewId}")
    public ResponseEntity<Void> deleteReview(
            @PathVariable Long reviewId,
            @RequestHeader(value = "X-User-Id", required = false) String requesterId) {
        if (requesterId == null) return ResponseEntity.status(401).build();
        tutorService.deleteReview(reviewId, Long.parseLong(requesterId));
        return ResponseEntity.noContent().build();
    }
}