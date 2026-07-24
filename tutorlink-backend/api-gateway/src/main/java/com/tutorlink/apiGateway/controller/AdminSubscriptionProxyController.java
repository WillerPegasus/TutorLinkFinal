package com.tutorlink.apiGateway.controller;

import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.client.RestTemplate;

import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/api/admin/subscriptions")
@RequiredArgsConstructor
public class AdminSubscriptionProxyController {

    private final RestTemplate restTemplate;

    @Value("${services.tutor-service.url}")
    private String tutorServiceUrl;

    // ✎ AJOUT
    @Value("${services.notification-service.url}")
    private String notificationServiceUrl;

    @GetMapping("/stats")
    public ResponseEntity<Object> getStats() {
        return ResponseEntity.ok(restTemplate.getForObject(
                tutorServiceUrl + "/api/admin/subscriptions/stats", Object.class));
    }

    @GetMapping("/tutors")
    public ResponseEntity<Object> getTutorSubscriptions() {
        return ResponseEntity.ok(restTemplate.getForObject(
                tutorServiceUrl + "/api/admin/subscriptions/tutors", Object.class));
    }

    @PostMapping("/tutors/{id}/activate")
    public ResponseEntity<Object> activate(@PathVariable Long id) {
        return ResponseEntity.ok(restTemplate.postForObject(
                tutorServiceUrl + "/api/admin/subscriptions/tutors/" + id + "/activate", null, Object.class));
    }

    @PostMapping("/tutors/{id}/suspend")
    public ResponseEntity<Object> suspend(@PathVariable Long id) {
        return ResponseEntity.ok(restTemplate.postForObject(
                tutorServiceUrl + "/api/admin/subscriptions/tutors/" + id + "/suspend", null, Object.class));
    }

    // ✎ AJOUT — GET /api/admin/subscriptions/groups
    @GetMapping("/groups")
    public ResponseEntity<Object> getGroupSubscriptions() {
        return ResponseEntity.ok(restTemplate.getForObject(
                tutorServiceUrl + "/api/admin/subscriptions/groups", Object.class));
    }

    // ✎ AJOUT — POST /api/admin/subscriptions/groups/{id}/activate
    // Réutilise l'endpoint existant PATCH /api/groups/{id}/verify (réactivation admin)
    @PostMapping("/groups/{id}/activate")
    public ResponseEntity<Void> activateGroup(@PathVariable Long id) {
        restTemplate.patchForObject(tutorServiceUrl + "/api/groups/" + id + "/verify", null, Void.class);
        return ResponseEntity.noContent().build();
    }

    // ✎ AJOUT — POST /api/admin/subscriptions/groups/{id}/suspend
    // Réutilise l'endpoint existant PATCH /api/groups/{id}/suspend
    @PostMapping("/groups/{id}/suspend")
    public ResponseEntity<Void> suspendGroup(@PathVariable Long id) {
        restTemplate.patchForObject(tutorServiceUrl + "/api/groups/" + id + "/suspend", null, Void.class);
        return ResponseEntity.noContent().build();
    }

    // ✎ AJOUT — POST /api/admin/subscriptions/notify — rappel manuel
    // Body attendu : { "id": "...", "type": "tutor"|"group" }
    @PostMapping("/notify")
    public ResponseEntity<Void> sendReminder(@RequestBody Map<String, String> body) {
        Long id = Long.valueOf(body.get("id"));
        String type = body.get("type");

        Long targetUserId;
        String context;

        if ("tutor".equalsIgnoreCase(type)) {
            Map tutor = restTemplate.getForObject(tutorServiceUrl + "/api/tutors/" + id, Map.class);
            targetUserId = Long.valueOf(tutor.get("userId").toString());
            context = "Merci de régulariser votre abonnement TutorLink.";
        } else {
            Map group = restTemplate.getForObject(tutorServiceUrl + "/api/groups/" + id, Map.class);
            Long tutorId = Long.valueOf(group.get("tutorId").toString());
            Map tutor = restTemplate.getForObject(tutorServiceUrl + "/api/tutors/" + tutorId, Map.class);
            targetUserId = Long.valueOf(tutor.get("userId").toString());
            context = "Merci de régulariser l'abonnement du groupe \"" + group.get("name") + "\".";
        }

        Map<String, Object> notif = new HashMap<>();
        notif.put("userId", targetUserId);
        notif.put("type", "REMINDER");
        notif.put("title", "Rappel d'abonnement");
        notif.put("content", context);

        restTemplate.postForObject(notificationServiceUrl + "/api/notifications/send", notif, Object.class);
        return ResponseEntity.noContent().build();
    }

    // ✎ AJOUT — GET /api/admin/subscriptions/export — CSV combiné
    @GetMapping("/export")
    public ResponseEntity<byte[]> exportCsv() {
        byte[] csv = restTemplate.getForObject(
                tutorServiceUrl + "/api/admin/subscriptions/export", byte[].class);
        return ResponseEntity.ok()
                .header("Content-Type", "text/csv; charset=UTF-8")
                .header("Content-Disposition", "attachment; filename=\"abonnements.csv\"")
                .body(csv);
    }
}