package com.tutorlink.notification.controller;

import com.tutorlink.notification.dto.NotificationRequest;
import com.tutorlink.notification.dto.NotificationResponse;
import com.tutorlink.notification.dto.SystemNotificationRequest;
import com.tutorlink.notification.service.NotificationService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/notifications")
@RequiredArgsConstructor
public class NotificationController {

    private final NotificationService service;

    // POST /api/notifications/send
    // Appelé par les autres microservices (auth-service, booking-service...)
    @PostMapping("/send")
    public ResponseEntity<NotificationResponse> send(
            @Valid @RequestBody NotificationRequest request) {
        return ResponseEntity.status(HttpStatus.CREATED).body(service.sendNotification(request));
    }

    // GET /api/notifications/user/{userId}
    // Notifications d'un utilisateur triées par date DESC
    @GetMapping("/user/{userId}")
    public ResponseEntity<List<NotificationResponse>> getByUser(@PathVariable Long userId) {
        return ResponseEntity.ok(service.getNotificationsByUser(userId));
    }

    // PATCH /api/notifications/{id}/read
    @PatchMapping("/{id}/read")
    public ResponseEntity<NotificationResponse> markAsRead(@PathVariable Long id) {
        return ResponseEntity.ok(service.markAsRead(id));
    }

    // PATCH /api/notifications/user/{userId}/read-all
    @PatchMapping("/user/{userId}/read-all")
    public ResponseEntity<Void> markAllAsRead(@PathVariable Long userId) {
        service.markAllAsRead(userId);
        return ResponseEntity.noContent().build();
    }

    // GET /api/notifications/user/{userId}/unread-count
    @GetMapping("/user/{userId}/unread-count")
    public ResponseEntity<Map<String, Long>> getUnreadCount(@PathVariable Long userId) {
        return ResponseEntity.ok(Map.of("unreadCount", service.getUnreadCount(userId)));
    }

    // POST /api/notifications/system — admin uniquement
    // (le contrôle ADMIN est fait par l'api-gateway sur /api/admin/**)
    @PostMapping("/system")
    public ResponseEntity<Void> sendSystem(
            @Valid @RequestBody SystemNotificationRequest request) {
        service.sendSystemNotification(request);
        return ResponseEntity.status(HttpStatus.CREATED).build();
    }

   // GET /api/admin/stats/reports — appelé par api-gateway AdminStatsController
    // ✎ CORRECTIF V4 : renvoyait toujours 0 en dur, on renvoie maintenant
    // le vrai nombre total de notifications envoyées sur la plateforme
    @GetMapping("/admin/stats/reports")
    public ResponseEntity<Map<String, Long>> getReportsStats() {
        return ResponseEntity.ok(Map.of("count", service.getTotalNotificationsCount()));
    }
}