package com.tutorlink.apiGateway.controller;

import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpMethod;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.client.RestTemplate;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpHeaders;
import java.util.List;
import java.util.Map;

// ✎ AJOUT — alias /api/admin/users/** attendus par le frontend, qui
// redirigent vers les vraies routes /api/users/** de user-service.
// Évite de dupliquer la logique métier : simple relais.
@RestController
@RequestMapping("/api/admin/users")
@RequiredArgsConstructor
public class AdminUserProxyController {

    private final RestTemplate restTemplate;

    @Value("${services.user-service.url}")
    private String userServiceUrl;
    @Value("${services.tutor-service.url}")
    private String tutorServiceUrl;

    @Value("${services.auth-service.url}")
    private String authServiceUrl;

    @GetMapping
    public ResponseEntity<List> getUsers() {
        List users = restTemplate.getForObject(userServiceUrl + "/api/users", List.class);
        return ResponseEntity.ok(users);
    }

    @PatchMapping("/{id}/suspend")
    public ResponseEntity<Void> suspendUser(@PathVariable Long id) {
        restTemplate.patchForObject(userServiceUrl + "/api/users/" + id + "/suspend", null, Void.class);
        return ResponseEntity.noContent().build();
    }

    // ✎ alias "validate" -> "reactivate" existant
    @PatchMapping("/{id}/validate")
    public ResponseEntity<Void> validateUser(@PathVariable Long id) {
        restTemplate.patchForObject(userServiceUrl + "/api/users/" + id + "/reactivate", null, Void.class);
        return ResponseEntity.noContent().build();
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteUser(
            @PathVariable Long id,
            @RequestHeader(value = "X-User-Id", required = false) String requesterId,
            @RequestHeader(value = "X-User-Role", required = false) String requesterRole) {

        restTemplate.delete(tutorServiceUrl + "/api/tutors/user/" + id);

        HttpHeaders headers = new HttpHeaders();
        if (requesterId != null) headers.set("X-User-Id", requesterId);
        if (requesterRole != null) headers.set("X-User-Role", requesterRole);
        restTemplate.exchange(
                userServiceUrl + "/api/users/" + id, HttpMethod.DELETE,
                new HttpEntity<>(headers), Void.class);

        restTemplate.delete(authServiceUrl + "/api/auth/user/" + id);

        return ResponseEntity.noContent().build();
    }
}