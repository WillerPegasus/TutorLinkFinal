package com.tutorlink.tutorservice.controller;

import com.tutorlink.tutorservice.entity.TutorSubscription;
import com.tutorlink.tutorservice.service.GroupService;
import com.tutorlink.tutorservice.service.SubscriptionService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/admin/subscriptions")
@RequiredArgsConstructor
public class AdminSubscriptionController {

    private final SubscriptionService subscriptionService;
    private final GroupService groupService;

    @GetMapping("/tutors")
    public ResponseEntity<List<TutorSubscription>> getAllTutorSubscriptions() {
        return ResponseEntity.ok(subscriptionService.getAllSubscriptions());
    }

    @GetMapping("/stats")
    public ResponseEntity<Map<String, Object>> getStats() {
        List<TutorSubscription> all = subscriptionService.getAllSubscriptions();
        long active = all.stream().filter(s -> s.getStatus() == TutorSubscription.SubscriptionStatus.ACTIVE).count();
        long expired = all.stream().filter(s -> s.getStatus() == TutorSubscription.SubscriptionStatus.EXPIRED).count();
        long suspended = all.stream().filter(s -> s.getStatus() == TutorSubscription.SubscriptionStatus.SUSPENDED).count();
        return ResponseEntity.ok(Map.of(
                "total", all.size(), "active", active, "expired", expired, "suspended", suspended));
    }

    @PostMapping("/tutors/{tutorId}/activate")
    public ResponseEntity<TutorSubscription> activate(@PathVariable Long tutorId) {
        return ResponseEntity.ok(
                subscriptionService.adminSetStatus(tutorId, TutorSubscription.SubscriptionStatus.ACTIVE));
    }

    @PostMapping("/tutors/{tutorId}/suspend")
    public ResponseEntity<TutorSubscription> suspend(@PathVariable Long tutorId) {
        return ResponseEntity.ok(
                subscriptionService.adminSetStatus(tutorId, TutorSubscription.SubscriptionStatus.SUSPENDED));
    }
    // ✎ AJOUT — GET /api/admin/subscriptions/groups
    @GetMapping("/groups")
    public ResponseEntity<Object> getAllGroupSubscriptions() {
        return ResponseEntity.ok(groupService.getGroupSubscriptionsOverview());
    }

    // ✎ AJOUT — GET /api/admin/subscriptions/export — CSV combiné tuteurs + groupes
    @GetMapping("/export")
    public ResponseEntity<byte[]> exportSubscriptionsCsv() {
        StringBuilder csv = new StringBuilder("type,id,statut,expiration,montant_mensuel,membres_actifs\n");

        for (TutorSubscription s : subscriptionService.getAllSubscriptions()) {
            csv.append("tutor,")
               .append(s.getTutorId()).append(",")
               .append(s.getStatus()).append(",")
               .append(s.getExpiryDate() != null ? s.getExpiryDate() : "").append(",,")
               .append("\n");
        }

        for (Map<String, Object> g : groupService.getGroupSubscriptionsOverview()) {
            csv.append("group,")
               .append(g.get("groupId")).append(",")
               .append(g.get("status")).append(",,")
               .append(g.get("monthlyPrice")).append(",")
               .append(g.get("activeMembers"))
               .append("\n");
        }

        byte[] bytes = csv.toString().getBytes(java.nio.charset.StandardCharsets.UTF_8);
        return ResponseEntity.ok()
                .header("Content-Type", "text/csv; charset=UTF-8")
                .header("Content-Disposition", "attachment; filename=\"abonnements.csv\"")
                .body(bytes);
    }
}