package com.tutorlink.apiGateway.controller;

import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpMethod;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.client.RestTemplate;
import org.springframework.web.util.UriComponentsBuilder;
import java.util.List;
import org.springframework.core.io.ByteArrayResource;
import org.springframework.http.MediaType;
import org.springframework.util.LinkedMultiValueMap;
import org.springframework.web.multipart.MultipartFile;
import java.io.IOException;
import java.time.LocalDateTime;
import java.time.temporal.ChronoUnit;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.stream.Collectors;

import java.util.Map;
import java.util.Optional;

// ✎ AJOUT — pont /api/student/** vers user-service, booking-service,
// tutor-service, notification-service et auth-service.
@RestController
@RequestMapping("/api/student")
@RequiredArgsConstructor
public class StudentDashboardProxyController {

    private final RestTemplate restTemplate;

    @Value("${services.user-service.url}")
    private String userServiceUrl;

    @Value("${services.booking-service.url}")
    private String bookingServiceUrl;

    @Value("${services.tutor-service.url}")
    private String tutorServiceUrl;

    @Value("${services.notification-service.url}")
    private String notificationServiceUrl;

    @Value("${services.auth-service.url}")
    private String authServiceUrl;

    private HttpEntity<Void> withUserHeader(String userId) {
        HttpHeaders headers = new HttpHeaders();
        headers.set("X-User-Id", userId);
        return new HttpEntity<>(headers);
    }

    // ── Profil ───────────────────────────────────────────────────────────
    @GetMapping("/profile")
    public ResponseEntity<Object> getProfile(@RequestHeader("X-User-Id") String userId) {
        ResponseEntity<Object> resp = restTemplate.exchange(
                userServiceUrl + "/api/users/me", HttpMethod.GET, withUserHeader(userId), Object.class);
        return ResponseEntity.ok(resp.getBody());
    }

    @PutMapping("/profile")
    public ResponseEntity<Object> updateProfile(
            @RequestHeader("X-User-Id") String userId, @RequestBody Object body) {
        HttpHeaders headers = new HttpHeaders();
        headers.set("X-User-Id", userId);
        ResponseEntity<Object> resp = restTemplate.exchange(
                userServiceUrl + "/api/users/me", HttpMethod.PUT,
                new HttpEntity<>(body, headers), Object.class);
        return ResponseEntity.ok(resp.getBody());
    }
    // ✎ AJOUT — POST /profile/avatar — upload photo de profil (proxy multipart
    // vers user-service). Le frontend envoie le champ "avatar", le backend
    // attend "file" : on le renomme au passage.
    @PostMapping(value = "/profile/avatar", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ResponseEntity<Object> uploadAvatar(
            @RequestHeader("X-User-Id") String userId,
            @RequestParam("avatar") MultipartFile avatar) throws IOException {

        LinkedMultiValueMap<String, Object> body = new LinkedMultiValueMap<>();
        ByteArrayResource fileResource = new ByteArrayResource(avatar.getBytes()) {
            @Override
            public String getFilename() {
                return avatar.getOriginalFilename();
            }
        };
        body.add("file", fileResource);

        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.MULTIPART_FORM_DATA);
        HttpEntity<LinkedMultiValueMap<String, Object>> requestEntity = new HttpEntity<>(body, headers);

        ResponseEntity<Object> resp = restTemplate.postForEntity(
                userServiceUrl + "/api/users/" + userId + "/avatar", requestEntity, Object.class);
        return ResponseEntity.ok(resp.getBody());
    }

    // ── Mot de passe ─────────────────────────────────────────────────────
    // ⚠️ auth-service exige un "identifier" (email/tel), pas un userId.
    // On récupère d'abord l'email via user-service, puis on délègue.
    @PutMapping("/password")
    public ResponseEntity<Object> changePassword(
            @RequestHeader("X-User-Id") String userId,
            @RequestBody Map<String, String> body) {

        ResponseEntity<Map> profileResp = restTemplate.exchange(
                userServiceUrl + "/api/users/me", HttpMethod.GET, withUserHeader(userId), Map.class);
        String email = (String) profileResp.getBody().get("email");

        Map<String, String> authPayload = Map.of(
                "identifier", email,
                "oldPassword", body.get("oldPassword"),
                "newPassword", body.get("newPassword")
        );

        Object result = restTemplate.postForObject(
                authServiceUrl + "/api/auth/change-password", authPayload, Object.class);
        return ResponseEntity.ok(result);
    }

    // ── Notifications (préférences) ─────────────────────────────────────
    @GetMapping("/notifications")
    public ResponseEntity<Object> getNotificationPrefs(@RequestHeader("X-User-Id") String userId) {
        ResponseEntity<Object> resp = restTemplate.exchange(
                notificationServiceUrl + "/api/notifications/preferences",
                HttpMethod.GET, withUserHeader(userId), Object.class);
        return ResponseEntity.ok(resp.getBody());
    }

    @PutMapping("/notifications")
    public ResponseEntity<Object> updateNotificationPrefs(
            @RequestHeader("X-User-Id") String userId, @RequestBody Object body) {
        HttpHeaders headers = new HttpHeaders();
        headers.set("X-User-Id", userId);
        ResponseEntity<Object> resp = restTemplate.exchange(
                notificationServiceUrl + "/api/notifications/preferences",
                HttpMethod.PUT, new HttpEntity<>(body, headers), Object.class);
        return ResponseEntity.ok(resp.getBody());
    }

    // ── Confidentialité ──────────────────────────────────────────────────
    @GetMapping("/privacy")
    public ResponseEntity<Object> getPrivacy(@RequestHeader("X-User-Id") String userId) {
        ResponseEntity<Object> resp = restTemplate.exchange(
                userServiceUrl + "/api/users/me/privacy", HttpMethod.GET, withUserHeader(userId), Object.class);
        return ResponseEntity.ok(resp.getBody());
    }

    @PutMapping("/privacy")
    public ResponseEntity<Object> updatePrivacy(
            @RequestHeader("X-User-Id") String userId, @RequestBody Object body) {
        HttpHeaders headers = new HttpHeaders();
        headers.set("X-User-Id", userId);
        ResponseEntity<Object> resp = restTemplate.exchange(
                userServiceUrl + "/api/users/me/privacy", HttpMethod.PUT,
                new HttpEntity<>(body, headers), Object.class);
        return ResponseEntity.ok(resp.getBody());
    }

    // ── Suppression de compte ────────────────────────────────────────────
    @DeleteMapping("/account")
    public ResponseEntity<Void> deleteAccount(@RequestHeader("X-User-Id") String userId) {
        restTemplate.exchange(
                userServiceUrl + "/api/users/me/account", HttpMethod.DELETE, withUserHeader(userId), Void.class);
        return ResponseEntity.noContent().build();
    }

    // ── Dashboard : stats, cours à venir, groupes ────────────────────────
    @GetMapping("/stats")
    public ResponseEntity<Object> getStats(@RequestHeader("X-User-Id") String userId) {
        Object result = restTemplate.getForObject(
                bookingServiceUrl + "/api/bookings/student/" + userId + "/stats", Object.class);
        return ResponseEntity.ok(result);
    }

// ✎ AJOUT — GET /progress — moyenne des notes par matière (proxy booking-service)
    @GetMapping("/progress")
    public ResponseEntity<Object> getProgress(@RequestHeader("X-User-Id") String userId) {
        Object result = restTemplate.getForObject(
                bookingServiceUrl + "/api/bookings/student/" + userId + "/progress", Object.class);
        return ResponseEntity.ok(result);
    }
    @GetMapping("/courses/upcoming")
    public ResponseEntity<Object> getUpcomingCourses(@RequestHeader("X-User-Id") String userId) {
        Object result = restTemplate.getForObject(
                bookingServiceUrl + "/api/bookings/student/" + userId + "/upcoming", Object.class);
        return ResponseEntity.ok(result);
    }

    @GetMapping("/groups")
    public ResponseEntity<Object> getMyGroups(@RequestHeader("X-User-Id") String userId) {
        Object result = restTemplate.getForObject(
                tutorServiceUrl + "/api/groups/student/" + userId, Object.class);
        return ResponseEntity.ok(result);
    }

    // ── Réservations ──────────────────────────────────────────────────────
    @GetMapping("/reservations")
    public ResponseEntity<Object> getReservations(
            @RequestHeader("X-User-Id") String userId,
            @RequestParam(required = false) String status) {
        String url = UriComponentsBuilder
                .fromHttpUrl(bookingServiceUrl + "/api/bookings/student/" + userId)
                .queryParamIfPresent("status", Optional.ofNullable(status))
                .toUriString();
        Object result = restTemplate.getForObject(url, Object.class);
        return ResponseEntity.ok(result);
    }

    @PostMapping("/reservations/{id}/cancel")
    public ResponseEntity<Void> cancelReservation(@PathVariable Long id) {
        restTemplate.patchForObject(bookingServiceUrl + "/api/bookings/" + id + "/cancel", null, Void.class);
        return ResponseEntity.noContent().build();
    }

    // ── Paiements ─────────────────────────────────────────────────────────
    @GetMapping("/payments/stats")
    public ResponseEntity<Object> getPaymentStats(@RequestHeader("X-User-Id") String userId) {
        return getStats(userId); // même donnée que /student/stats
    }

    @GetMapping("/payments")
    public ResponseEntity<Object> getPayments(@RequestHeader("X-User-Id") String userId) {
        Object result = restTemplate.getForObject(
                bookingServiceUrl + "/api/bookings/student/" + userId + "/payments", Object.class);
        return ResponseEntity.ok(result);
    }
    // ✎ AJOUT — GET /payments/{id}/receipt — reçu (proxy vers booking-service)
    @GetMapping("/payments/{id}/receipt")
    public ResponseEntity<byte[]> getPaymentReceipt(@PathVariable Long id) {
        byte[] receipt = restTemplate.getForObject(
                bookingServiceUrl + "/api/bookings/" + id + "/receipt", byte[].class);
        return ResponseEntity.ok()
                .header("Content-Type", "text/plain; charset=UTF-8")
                .header("Content-Disposition", "attachment; filename=\"recu-" + id + ".txt\"")
                .body(receipt);
    }

    @GetMapping("/payment-methods")
    public ResponseEntity<Object> getPaymentMethods(@RequestHeader("X-User-Id") String userId) {
        Object result = restTemplate.getForObject(
                userServiceUrl + "/api/users/" + userId + "/payment-methods", Object.class);
        return ResponseEntity.ok(result);
    }

    @PostMapping("/payment-methods")
    public ResponseEntity<Object> addPaymentMethod(
            @RequestHeader("X-User-Id") String userId, @RequestBody Object body) {
        Object result = restTemplate.postForObject(
                userServiceUrl + "/api/users/" + userId + "/payment-methods", body, Object.class);
        return ResponseEntity.ok(result);
    }

    @DeleteMapping("/payment-methods/{id}")
    public ResponseEntity<Void> removePaymentMethod(
            @RequestHeader("X-User-Id") String userId, @PathVariable Long id) {
        restTemplate.delete(userServiceUrl + "/api/users/" + userId + "/payment-methods/" + id);
        return ResponseEntity.noContent().build();
    }

    @PatchMapping("/payment-methods/{id}/default")
    public ResponseEntity<Object> setDefaultPaymentMethod(
            @RequestHeader("X-User-Id") String userId, @PathVariable Long id) {
        Object result = restTemplate.patchForObject(
                userServiceUrl + "/api/users/" + userId + "/payment-methods/" + id + "/default",
                null, Object.class);
        return ResponseEntity.ok(result);
    }
    // ✎ AJOUT — PUT /reviews/{id} — modifier un avis (proxy tutor-service)
    @PutMapping("/reviews/{id}")
    public ResponseEntity<Object> updateReview(
            @RequestHeader("X-User-Id") String userId,
            @PathVariable Long id,
            @RequestBody Object body) {
        HttpHeaders headers = new HttpHeaders();
        headers.set("X-User-Id", userId);
        ResponseEntity<Object> resp = restTemplate.exchange(
                tutorServiceUrl + "/api/tutors/reviews/" + id,
                HttpMethod.PUT, new HttpEntity<>(body, headers), Object.class);
        return ResponseEntity.ok(resp.getBody());
    }

    // ✎ AJOUT — DELETE /reviews/{id} — supprimer un avis (proxy tutor-service)
    @DeleteMapping("/reviews/{id}")
    public ResponseEntity<Void> deleteReview(
            @RequestHeader("X-User-Id") String userId, @PathVariable Long id) {
        restTemplate.exchange(
                tutorServiceUrl + "/api/tutors/reviews/" + id,
                HttpMethod.DELETE, withUserHeader(userId), Void.class);
        return ResponseEntity.noContent().build();
    }

    // ✎ AJOUT — GET /reviews/pending — cours COMPLETED sans avis encore laissé
    @GetMapping("/reviews/pending")
    public ResponseEntity<Object> getPendingReviews(@RequestHeader("X-User-Id") String userId) {
        Map[] completedBookings = restTemplate.getForObject(
                bookingServiceUrl + "/api/bookings/student/" + userId + "?status=COMPLETED", Map[].class);
        Map[] existingReviews = restTemplate.getForObject(
                tutorServiceUrl + "/api/tutors/reviews/student/" + userId, Map[].class);

        java.util.Set<Object> reviewedBookingIds = new java.util.HashSet<>();
        if (existingReviews != null) {
            for (Map review : existingReviews) {
                reviewedBookingIds.add(review.get("bookingId"));
            }
        }

        List<Map> pending = completedBookings == null ? List.of() :
                java.util.Arrays.stream(completedBookings)
                        .filter(b -> !reviewedBookingIds.contains(b.get("id")))
                        .collect(java.util.stream.Collectors.toList());

        return ResponseEntity.ok(pending);
    }

// ✎ AJOUT — GET /activity — historique reconstitué (réservations, avis, groupes)
    @GetMapping("/activity")
    public ResponseEntity<Object> getRecentActivity(@RequestHeader("X-User-Id") String userId) {
        List<Map<String, Object>> events = new ArrayList<>();

        Map[] bookings = restTemplate.getForObject(
                bookingServiceUrl + "/api/bookings/student/" + userId, Map[].class);
        if (bookings != null) {
            for (Map b : bookings) {
                String status = String.valueOf(b.get("status"));
                String subject = String.valueOf(b.get("subject"));
                String timestamp = "PENDING".equals(status)
                        ? String.valueOf(b.get("createdAt")) : String.valueOf(b.get("updatedAt"));
                String message = switch (status) {
                    case "COMPLETED" -> "Cours de " + subject + " terminé";
                    case "CONFIRMED" -> "Cours de " + subject + " confirmé";
                    case "CANCELLED" -> "Réservation de " + subject + " annulée";
                    default -> "Nouvelle demande de réservation en " + subject;
                };
                String icon = switch (status) {
                    case "COMPLETED" -> "✅";
                    case "CONFIRMED" -> "📅";
                    case "CANCELLED" -> "❌";
                    default -> "⏳";
                };
                events.add(buildActivityEvent(icon, message, timestamp));
            }
        }

        Map[] reviews = restTemplate.getForObject(
                tutorServiceUrl + "/api/tutors/reviews/student/" + userId, Map[].class);
        if (reviews != null) {
            for (Map r : reviews) {
                events.add(buildActivityEvent("⭐", "Avis publié", String.valueOf(r.get("createdAt"))));
            }
        }

        Map[] groups = restTemplate.getForObject(
                tutorServiceUrl + "/api/groups/student/" + userId, Map[].class);
        if (groups != null) {
            for (Map g : groups) {
                events.add(buildActivityEvent("👥", "Groupe rejoint", String.valueOf(g.get("joinedAt"))));
            }
        }

        events.sort((a, b) -> ((LocalDateTime) b.get("timestamp")).compareTo((LocalDateTime) a.get("timestamp")));
        List<Map<String, Object>> top = events.stream().limit(15).collect(Collectors.toList());
        for (int i = 0; i < top.size(); i++) {
            top.get(i).put("id", String.valueOf(i));
            top.get(i).remove("timestamp");
        }
        return ResponseEntity.ok(top);
    }

    private Map<String, Object> buildActivityEvent(String icon, String message, String rawTimestamp) {
        LocalDateTime ts;
        try {
            ts = LocalDateTime.parse(rawTimestamp);
        } catch (Exception e) {
            ts = LocalDateTime.now();
        }
        Map<String, Object> event = new HashMap<>();
        event.put("icon", icon);
        event.put("message", message);
        event.put("timestamp", ts);
        event.put("time", formatRelativeTime(ts));
        event.put("isNew", ts.isAfter(LocalDateTime.now().minusHours(24)));
        return event;
    }

    private String formatRelativeTime(LocalDateTime ts) {
        long minutes = ChronoUnit.MINUTES.between(ts, LocalDateTime.now());
        if (minutes < 1) return "à l'instant";
        if (minutes < 60) return "il y a " + minutes + " min";
        long hours = minutes / 60;
        if (hours < 24) return "il y a " + hours + "h";
        long days = hours / 24;
        if (days < 30) return "il y a " + days + " j";
        return ts.toLocalDate().toString();
    }
    // ── Avis ──────────────────────────────────────────────────────────────
    @GetMapping("/reviews")
    public ResponseEntity<Object> getMyReviews(@RequestHeader("X-User-Id") String userId) {
        Object result = restTemplate.getForObject(
                tutorServiceUrl + "/api/tutors/reviews/student/" + userId, Object.class);
        return ResponseEntity.ok(result);
    }

    @PostMapping("/reviews")
    public ResponseEntity<Object> addReview(@RequestBody Map<String, Object> body) {
        Object tutorId = body.get("tutorId");
        if (tutorId == null) {
            return ResponseEntity.badRequest().body(Map.of("error", "tutorId est requis"));
        }
        Object result = restTemplate.postForObject(
                tutorServiceUrl + "/api/tutors/" + tutorId + "/reviews", body, Object.class);
        return ResponseEntity.ok(result);
    }

   


}