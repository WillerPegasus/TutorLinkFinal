package com.tutorlink.apiGateway.controller;

import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.client.RestTemplate;

import java.util.List;
import java.util.Map;

// ✎ AJOUT — agrégation pour la page d'accueil publique (sans authentification)
@RestController
@RequestMapping("/api/home")
@RequiredArgsConstructor
public class HomeController {

    private final RestTemplate restTemplate;

    @Value("${services.tutor-service.url}")
    private String tutorServiceUrl;

    @GetMapping("/tutors/featured")
    public ResponseEntity<List> getFeaturedTutors() {
        List tutors = restTemplate.getForObject(
                tutorServiceUrl + "/api/tutors/verified", List.class);
        return ResponseEntity.ok(tutors);
    }

    @GetMapping("/groups/featured")
    public ResponseEntity<List> getFeaturedGroups() {
        List groups = restTemplate.getForObject(
                tutorServiceUrl + "/api/groups", List.class);
        return ResponseEntity.ok(groups);
    }

    @GetMapping("/stats")
    public ResponseEntity<Map<String, Object>> getHomeStats() {
        List tutors = restTemplate.getForObject(
                tutorServiceUrl + "/api/tutors/verified", List.class);
        return ResponseEntity.ok(Map.of(
                "verifiedTutorsCount", tutors != null ? tutors.size() : 0
        ));
    }
}