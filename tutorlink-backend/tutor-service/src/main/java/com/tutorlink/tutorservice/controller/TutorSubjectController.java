package com.tutorlink.tutorservice.controller;

import com.tutorlink.tutorservice.service.TutorService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/tutors/{tutorId}/subjects")
@RequiredArgsConstructor
public class TutorSubjectController {

    private final TutorService tutorService;

    @GetMapping
    public ResponseEntity<List<String>> getSubjects(@PathVariable Long tutorId) {
        return ResponseEntity.ok(tutorService.getSubjects(tutorId));
    }

    @PostMapping
    public ResponseEntity<List<String>> addSubject(
            @PathVariable Long tutorId,
            @RequestBody Map<String, String> body) {
        return ResponseEntity.ok(tutorService.addSubject(tutorId, body.get("subject")));
    }

    @DeleteMapping("/{subject}")
    public ResponseEntity<List<String>> removeSubject(
            @PathVariable Long tutorId,
            @PathVariable String subject) {
        return ResponseEntity.ok(tutorService.removeSubject(tutorId, subject));
    }
}