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
import java.time.LocalDateTime;
import java.time.temporal.ChronoUnit;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.stream.Collectors;
import java.util.Map;
import java.util.Optional;

// ✎ AJOUT — pont /api/tutor/** (singulier, dashboard du tuteur connecté)
// vers tutor-service (/api/tutors/**) et booking-service (/api/bookings/**).
// Le tuteur connecté n'a que son userId (X-User-Id) ; on résout son
// tutorId une fois via tutor-service, puis on route vers le bon service.
@RestController
@RequestMapping("/api/tutor")
@RequiredArgsConstructor
public class TutorDashboardProxyController {

    private final RestTemplate restTemplate;

    @Value("${services.tutor-service.url}")
    private String tutorServiceUrl;

    @Value("${services.booking-service.url}")
    private String bookingServiceUrl;

    // ── Résolution du tutorId à partir du userId connecté ──────────────
    private Long resolveTutorId(String userId) {
        Map<?, ?> profile = restTemplate.getForObject(
                tutorServiceUrl + "/api/tutors/user/" + userId, Map.class);
        if (profile == null || profile.get("id") == null) {
            throw new IllegalStateException("Profil tuteur introuvable pour userId=" + userId);
        }
        return Long.valueOf(profile.get("id").toString());
    }

    private HttpEntity<Void> withUserHeader(String userId) {
        HttpHeaders headers = new HttpHeaders();
        headers.set("X-User-Id", userId);
        return new HttpEntity<>(headers);
    }

    // ── Disponibilités : tutor-service gère déjà tout via X-User-Id ────
    @GetMapping("/availability")
    public ResponseEntity<Object> getAvailability(
            @RequestHeader("X-User-Id") String userId) {
        ResponseEntity<Object> resp = restTemplate.exchange(
                tutorServiceUrl + "/api/tutors/me/availability",
                HttpMethod.GET, withUserHeader(userId), Object.class);
        return ResponseEntity.ok(resp.getBody());
    }

    @PutMapping("/availability")
    public ResponseEntity<Void> setAvailability(
            @RequestHeader("X-User-Id") String userId,
            @RequestBody Object body) {
        HttpHeaders headers = new HttpHeaders();
        headers.set("X-User-Id", userId);
        restTemplate.exchange(
                tutorServiceUrl + "/api/tutors/me/availability",
                HttpMethod.PUT, new HttpEntity<>(body, headers), Void.class);
        return ResponseEntity.noContent().build();
    }

    // ── Demandes de cours (bookings en PENDING) ─────────────────────────
    @GetMapping("/requests")
    public ResponseEntity<Object> getRequests(@RequestHeader("X-User-Id") String userId) {
        Long tutorId = resolveTutorId(userId);
        Object result = restTemplate.getForObject(
                bookingServiceUrl + "/api/bookings/tutor/" + tutorId + "/requests", Object.class);
        return ResponseEntity.ok(result);
    }

    @PatchMapping("/requests/{id}/accept")
    public ResponseEntity<Object> acceptRequest(@PathVariable Long id) {
        return ResponseEntity.ok(
                restTemplate.patchForObject(bookingServiceUrl + "/api/bookings/" + id + "/accept", null, Object.class));
    }

    @PatchMapping("/requests/{id}/refuse")
    public ResponseEntity<Object> refuseRequest(@PathVariable Long id) {
        return ResponseEntity.ok(
                restTemplate.patchForObject(bookingServiceUrl + "/api/bookings/" + id + "/refuse", null, Object.class));
    }

    // ── Cours confirmés ──────────────────────────────────────────────────
    @GetMapping("/courses/confirmed")
    public ResponseEntity<Object> getConfirmedCourses(@RequestHeader("X-User-Id") String userId) {
        Long tutorId = resolveTutorId(userId);
        String url = tutorServiceUrl.replace(tutorServiceUrl, bookingServiceUrl) // no-op, clarté
                + "/api/bookings/tutor/" + tutorId + "?status=CONFIRMED";
        Object result = restTemplate.getForObject(url, Object.class);
        return ResponseEntity.ok(result);
    }

// ✎ AJOUT — PATCH /courses/{bookingId}/grade — noter une séance terminée
    @PatchMapping("/courses/{bookingId}/grade")
    public ResponseEntity<Object> gradeCourse(
            @PathVariable Long bookingId, @RequestBody Map<String, Integer> body) {
        ResponseEntity<Object> resp = restTemplate.exchange(
                bookingServiceUrl + "/api/bookings/" + bookingId + "/grade",
                HttpMethod.PATCH, new HttpEntity<>(body), Object.class);
        return ResponseEntity.ok(resp.getBody());
    }
    // ── Groupes du tuteur ─────────────────────────────────────────────────
    @GetMapping("/groups")
    public ResponseEntity<Object> getGroups(@RequestHeader("X-User-Id") String userId) {
        Long tutorId = resolveTutorId(userId);
        Object result = restTemplate.getForObject(
                tutorServiceUrl + "/api/groups/tutor/" + tutorId, Object.class);
        return ResponseEntity.ok(result);
    }

    // ── Revenus ───────────────────────────────────────────────────────────
    @GetMapping("/revenue")
    public ResponseEntity<Object> getRevenue(@RequestHeader("X-User-Id") String userId) {
        Long tutorId = resolveTutorId(userId);
        Object result = restTemplate.getForObject(
                bookingServiceUrl + "/api/bookings/tutor/" + tutorId + "/revenue/stats", Object.class);
        return ResponseEntity.ok(result);
    }

    @GetMapping("/revenue/stats")
    public ResponseEntity<Object> getRevenueStats(
            @RequestHeader("X-User-Id") String userId,
            @RequestParam(required = false) String period) {
        Long tutorId = resolveTutorId(userId);
        // ⚠️ NOTE : booking-service ignore "period" pour l'instant (pas de
        // filtre par date implémenté côté getTutorRevenueStats). À corriger
        // dans booking-service si le filtre par période est indispensable.
        Object result = restTemplate.getForObject(
                bookingServiceUrl + "/api/bookings/tutor/" + tutorId + "/revenue/stats", Object.class);
        return ResponseEntity.ok(result);
    }

    @GetMapping("/revenue/chart")
    public ResponseEntity<Object> getRevenueChart(@RequestHeader("X-User-Id") String userId) {
        Long tutorId = resolveTutorId(userId);
        Object result = restTemplate.getForObject(
                bookingServiceUrl + "/api/bookings/tutor/" + tutorId + "/revenue/chart", Object.class);
        return ResponseEntity.ok(result);
    }

    @GetMapping("/revenue/transactions")
    public ResponseEntity<Object> getRevenueTransactions(@RequestHeader("X-User-Id") String userId) {
        Long tutorId = resolveTutorId(userId);
        Object result = restTemplate.getForObject(
                bookingServiceUrl + "/api/bookings/tutor/" + tutorId + "/revenue/transactions", Object.class);
        return ResponseEntity.ok(result);
    }

    @GetMapping("/revenue/export")
    public ResponseEntity<byte[]> exportRevenue(@RequestHeader("X-User-Id") String userId) {
        Long tutorId = resolveTutorId(userId);
        byte[] csv = restTemplate.getForObject(
                bookingServiceUrl + "/api/bookings/tutor/" + tutorId + "/revenue/export", byte[].class);
        return ResponseEntity.ok()
                .header("Content-Type", "text/csv; charset=UTF-8")
                .header("Content-Disposition", "attachment; filename=\"revenus.csv\"")
                .body(csv);
    }

    // ── Avis (reviews) : tutor-service gère déjà /me via X-User-Id ──────
    @GetMapping("/reviews")
    public ResponseEntity<Object> getReviews(@RequestHeader("X-User-Id") String userId) {
        ResponseEntity<Object> resp = restTemplate.exchange(
                tutorServiceUrl + "/api/tutors/me/reviews",
                HttpMethod.GET, withUserHeader(userId), Object.class);
        return ResponseEntity.ok(resp.getBody());
    }

    @GetMapping("/reviews/stats")
    public ResponseEntity<Object> getReviewsStats(@RequestHeader("X-User-Id") String userId) {
        ResponseEntity<Object> resp = restTemplate.exchange(
                tutorServiceUrl + "/api/tutors/me/reviews/stats",
                HttpMethod.GET, withUserHeader(userId), Object.class);
        return ResponseEntity.ok(resp.getBody());
    }
    // ✎ AJOUT — POST /reviews/{id}/reply — répondre à un avis (proxy tutor-service)
    @PostMapping("/reviews/{id}/reply")
    public ResponseEntity<Object> replyToReview(
            @RequestHeader("X-User-Id") String userId,
            @PathVariable Long id,
            @RequestBody Map<String, String> body) {
        HttpHeaders headers = new HttpHeaders();
        headers.set("X-User-Id", userId);
        ResponseEntity<Object> resp = restTemplate.exchange(
                tutorServiceUrl + "/api/tutors/me/reviews/" + id + "/reply",
                HttpMethod.POST, new HttpEntity<>(body, headers), Object.class);
        return ResponseEntity.ok(resp.getBody());
    }

    // ── Statistiques globales du dashboard tuteur ───────────────────────
    // Agrège 3 sources existantes : revenus, demandes en attente, groupes.
    @GetMapping("/stats")
    public ResponseEntity<Map<String, Object>> getDashboardStats(
            @RequestHeader("X-User-Id") String userId) {
        Long tutorId = resolveTutorId(userId);

        Object revenue = restTemplate.getForObject(
                bookingServiceUrl + "/api/bookings/tutor/" + tutorId + "/revenue/stats", Object.class);
        Object[] pendingRequests = restTemplate.getForObject(
                bookingServiceUrl + "/api/bookings/tutor/" + tutorId + "/requests", Object[].class);
        Object[] groups = restTemplate.getForObject(
                tutorServiceUrl + "/api/groups/tutor/" + tutorId, Object[].class);

        return ResponseEntity.ok(Map.of(
                "revenue", revenue,
                "pendingRequestsCount", pendingRequests == null ? 0 : pendingRequests.length,
                "groupsCount", groups == null ? 0 : groups.length
        ));
    }
    // ── Abonnement (nouveau) ─────────────────────────────────────────────
    @GetMapping("/subscription")
    public ResponseEntity<Object> getSubscription(@RequestHeader("X-User-Id") String userId) {
        ResponseEntity<Object> resp = restTemplate.exchange(
                tutorServiceUrl + "/api/tutors/me/subscription",
                HttpMethod.GET, withUserHeader(userId), Object.class);
        return ResponseEntity.ok(resp.getBody());
    }

    @GetMapping("/subscription/payments")
    public ResponseEntity<Object> getSubscriptionPayments(@RequestHeader("X-User-Id") String userId) {
        ResponseEntity<Object> resp = restTemplate.exchange(
                tutorServiceUrl + "/api/tutors/me/subscription/payments",
                HttpMethod.GET, withUserHeader(userId), Object.class);
        return ResponseEntity.ok(resp.getBody());
    }

    @PostMapping("/subscription/pay")
    public ResponseEntity<Object> paySubscription(
            @RequestHeader("X-User-Id") String userId, @RequestBody Map<String, String> body) {
        HttpHeaders headers = new HttpHeaders();
        headers.set("X-User-Id", userId);
        String path = "MTN".equalsIgnoreCase(body.get("operator"))
                ? "/api/tutors/me/subscription/pay/mtn"
                : "/api/tutors/me/subscription/pay/orange/init";
        ResponseEntity<Object> resp = restTemplate.exchange(
                tutorServiceUrl + path, HttpMethod.POST, new HttpEntity<>(body, headers), Object.class);
        return ResponseEntity.ok(resp.getBody());
    }

    @PutMapping("/subscription/auto-renew")
    public ResponseEntity<Object> toggleAutoRenew(
            @RequestHeader("X-User-Id") String userId, @RequestBody Object body) {
        HttpHeaders headers = new HttpHeaders();
        headers.set("X-User-Id", userId);
        ResponseEntity<Object> resp = restTemplate.exchange(
                tutorServiceUrl + "/api/tutors/me/subscription/auto-renew",
                HttpMethod.PUT, new HttpEntity<>(body, headers), Object.class);
        return ResponseEntity.ok(resp.getBody());
    }

    @GetMapping("/subscription/notifications")
    public ResponseEntity<Object> getSubscriptionNotifications(@RequestHeader("X-User-Id") String userId) {
        ResponseEntity<Object> resp = restTemplate.exchange(
                tutorServiceUrl + "/api/tutors/me/subscription/notifications",
                HttpMethod.GET, withUserHeader(userId), Object.class);
        return ResponseEntity.ok(resp.getBody());
    }
   // ✎ AJOUT — GET /activity — historique reconstitué du tuteur
    @GetMapping("/activity")
    public ResponseEntity<Object> getRecentActivity(@RequestHeader("X-User-Id") String userId) {
        Long tutorId = resolveTutorId(userId);
        List<Map<String, Object>> events = new ArrayList<>();

        Map[] bookings = restTemplate.getForObject(
                bookingServiceUrl + "/api/bookings/tutor/" + tutorId, Map[].class);
        if (bookings != null) {
            for (Map b : bookings) {
                String status = String.valueOf(b.get("status"));
                String subject = String.valueOf(b.get("subject"));
                String timestamp = "PENDING".equals(status)
                        ? String.valueOf(b.get("createdAt")) : String.valueOf(b.get("updatedAt"));
                String message = switch (status) {
                    case "COMPLETED" -> "Cours de " + subject + " terminé";
                    case "CONFIRMED" -> "Vous avez confirmé un cours de " + subject;
                    case "CANCELLED" -> "Cours de " + subject + " annulé";
                    default -> "Nouvelle demande de cours en " + subject;
                };
                String icon = switch (status) {
                    case "COMPLETED" -> "✅";
                    case "CONFIRMED" -> "📅";
                    case "CANCELLED" -> "❌";
                    default -> "🔔";
                };
                events.add(buildActivityEvent(icon, message, timestamp));
            }
        }

        Map[] reviews = restTemplate.getForObject(
                tutorServiceUrl + "/api/tutors/" + tutorId + "/reviews", Map[].class);
        if (reviews != null) {
            for (Map r : reviews) {
                events.add(buildActivityEvent("⭐", "Nouvel avis reçu", String.valueOf(r.get("createdAt"))));
            }
        }

        Map[] groups = restTemplate.getForObject(
                tutorServiceUrl + "/api/groups/tutor/" + tutorId, Map[].class);
        if (groups != null) {
            for (Map g : groups) {
                Object groupId = g.get("id");
                Map[] members = restTemplate.getForObject(
                        tutorServiceUrl + "/api/groups/" + groupId + "/members", Map[].class);
                if (members != null) {
                    for (Map m : members) {
                        events.add(buildActivityEvent("👥",
                                "Nouveau membre dans \"" + g.get("name") + "\"",
                                String.valueOf(m.get("joinedAt"))));
                    }
                }
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


}