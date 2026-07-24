package com.tutorlink.tutorservice.controller;

import com.tutorlink.tutorservice.entity.SubscriptionPayment;
import com.tutorlink.tutorservice.entity.TutorSubscription;
import com.tutorlink.tutorservice.service.SubscriptionService;
import com.tutorlink.tutorservice.service.TutorService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

// Monté sous /api/tutors/me/subscription — cohérent avec
// MyTutorAvailabilityController (résolution via X-User-Id)
@RestController
@RequestMapping("/api/tutors/me/subscription")
@RequiredArgsConstructor
public class SubscriptionController {

    private final SubscriptionService subscriptionService;
    private final TutorService tutorService;

    private Long resolveTutorId(String requesterId) {
        return tutorService.getTutorByUserId(Long.parseLong(requesterId)).getId();
    }

    @GetMapping
    public ResponseEntity<TutorSubscription> getSubscription(
            @RequestHeader(value = "X-User-Id", required = false) String requesterId) {
        if (requesterId == null) return ResponseEntity.status(401).build();
        return ResponseEntity.ok(subscriptionService.getSubscription(resolveTutorId(requesterId)));
    }

    @GetMapping("/payments")
    public ResponseEntity<List<SubscriptionPayment>> getPayments(
            @RequestHeader(value = "X-User-Id", required = false) String requesterId) {
        if (requesterId == null) return ResponseEntity.status(401).build();
        return ResponseEntity.ok(subscriptionService.getPaymentHistory(resolveTutorId(requesterId)));
    }

    // Body attendu : { "operator": "MTN", "phoneNumber": "6XXXXXXXX" }
    @PostMapping("/pay/mtn")
    public ResponseEntity<TutorSubscription> payMtn(
            @RequestHeader(value = "X-User-Id", required = false) String requesterId,
            @RequestBody Map<String, String> body) {
        if (requesterId == null) return ResponseEntity.status(401).build();
        return ResponseEntity.ok(
                subscriptionService.payMtn(resolveTutorId(requesterId), body.get("phoneNumber")));
    }

    @PostMapping("/pay/orange/init")
    public ResponseEntity<Map<String, String>> initOrange(
            @RequestHeader(value = "X-User-Id", required = false) String requesterId) {
        if (requesterId == null) return ResponseEntity.status(401).build();
        return ResponseEntity.ok(subscriptionService.initOrangePayment(resolveTutorId(requesterId)));
    }

    @PostMapping("/pay/orange/confirm")
    public ResponseEntity<TutorSubscription> confirmOrange(
            @RequestHeader(value = "X-User-Id", required = false) String requesterId,
            @RequestParam String orderId,
            @RequestParam String payToken) {
        if (requesterId == null) return ResponseEntity.status(401).build();
        return ResponseEntity.ok(
                subscriptionService.confirmOrangePayment(resolveTutorId(requesterId), orderId, payToken));
    }

    @PutMapping("/auto-renew")
    public ResponseEntity<TutorSubscription> toggleAutoRenew(
            @RequestHeader(value = "X-User-Id", required = false) String requesterId,
            @RequestBody Map<String, Boolean> body) {
        if (requesterId == null) return ResponseEntity.status(401).build();
        return ResponseEntity.ok(
                subscriptionService.toggleAutoRenew(resolveTutorId(requesterId), body.get("enabled")));
    }

    @GetMapping("/notifications")
    public ResponseEntity<Map<String, Object>> getNotifications(
            @RequestHeader(value = "X-User-Id", required = false) String requesterId) {
        if (requesterId == null) return ResponseEntity.status(401).build();
        return ResponseEntity.ok(subscriptionService.getNotifications(resolveTutorId(requesterId)));
    }
}