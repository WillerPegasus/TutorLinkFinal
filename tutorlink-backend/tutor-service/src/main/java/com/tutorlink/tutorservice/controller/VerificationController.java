package com.tutorlink.tutorservice.controller;

import com.tutorlink.tutorservice.dto.VerificationDocumentRequest;
import com.tutorlink.tutorservice.entity.VerificationDocument;
import com.tutorlink.tutorservice.enums.DocumentStatus;
import com.tutorlink.tutorservice.service.TutorService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/tutors")
@RequiredArgsConstructor
public class VerificationController {

    private final TutorService tutorService;

    // Soumettre un document de vérification
    @PostMapping("/{tutorId}/documents")
    public ResponseEntity<VerificationDocument> submitDocument(
            @PathVariable Long tutorId,
            @Valid @RequestBody VerificationDocumentRequest request) {
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(tutorService.submitDocument(tutorId, request));
    }

    // Réviser un document (admin)
    @PatchMapping("/documents/{documentId}/review")
    public ResponseEntity<VerificationDocument> reviewDocument(
            @PathVariable Long documentId,
            @RequestParam DocumentStatus status,
            @RequestParam(required = false) String note) {
        return ResponseEntity.ok(tutorService.reviewDocument(documentId, status, note));
    }
}