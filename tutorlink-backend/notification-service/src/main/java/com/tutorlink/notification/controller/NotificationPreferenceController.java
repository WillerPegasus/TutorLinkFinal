package com.tutorlink.notification.controller;

import com.tutorlink.notification.dto.StudentNotificationPreferenceDTO;
import com.tutorlink.notification.dto.TutorNotificationPreferenceDTO;
import com.tutorlink.notification.entity.NotificationPreference;
import com.tutorlink.notification.repository.NotificationPreferenceRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/notifications/preferences")
@RequiredArgsConstructor
public class NotificationPreferenceController {

    private final NotificationPreferenceRepository repository;

    private NotificationPreference getOrCreate(String requesterId) {
        Long userId = Long.parseLong(requesterId);
        return repository.findByUserId(userId)
                .orElseGet(() -> NotificationPreference.builder().userId(userId).build());
    }

    // ── Répétiteur ───────────────────────────────────────────
    @GetMapping("/tutor")
    public ResponseEntity<TutorNotificationPreferenceDTO> getTutorPrefs(
            @RequestHeader(value = "X-User-Id", required = false) String requesterId) {
        if (requesterId == null) return ResponseEntity.status(401).build();
        NotificationPreference p = getOrCreate(requesterId);
        return ResponseEntity.ok(TutorNotificationPreferenceDTO.builder()
                .smsNewRequest(p.getSmsNewRequest())
                .smsPaymentReceived(p.getSmsPaymentReceived())
                .smsNewReview(p.getSmsNewReview())
                .emailWeeklySummary(p.getEmailWeeklySummary())
                .emailNewRequest(p.getEmailNewRequest())
                .build());
    }

    @PutMapping("/tutor")
    public ResponseEntity<TutorNotificationPreferenceDTO> updateTutorPrefs(
            @RequestHeader(value = "X-User-Id", required = false) String requesterId,
            @RequestBody TutorNotificationPreferenceDTO body) {
        if (requesterId == null) return ResponseEntity.status(401).build();
        NotificationPreference p = getOrCreate(requesterId);
        if (body.getSmsNewRequest() != null) p.setSmsNewRequest(body.getSmsNewRequest());
        if (body.getSmsPaymentReceived() != null) p.setSmsPaymentReceived(body.getSmsPaymentReceived());
        if (body.getSmsNewReview() != null) p.setSmsNewReview(body.getSmsNewReview());
        if (body.getEmailWeeklySummary() != null) p.setEmailWeeklySummary(body.getEmailWeeklySummary());
        if (body.getEmailNewRequest() != null) p.setEmailNewRequest(body.getEmailNewRequest());
        repository.save(p);
        return getTutorPrefs(requesterId);
    }

    // ── Élève ────────────────────────────────────────────────
    @GetMapping("/student")
    public ResponseEntity<StudentNotificationPreferenceDTO> getStudentPrefs(
            @RequestHeader(value = "X-User-Id", required = false) String requesterId) {
        if (requesterId == null) return ResponseEntity.status(401).build();
        NotificationPreference p = getOrCreate(requesterId);
        return ResponseEntity.ok(StudentNotificationPreferenceDTO.builder()
                .emailReservation(p.getEmailReservation())
                .emailMessage(p.getEmailMessage())
                .smsReminder(p.getSmsReminder())
                .smsPayment(p.getSmsPayment())
                .pushNotifications(p.getPushNotifications())
                .build());
    }

    @PutMapping("/student")
    public ResponseEntity<StudentNotificationPreferenceDTO> updateStudentPrefs(
            @RequestHeader(value = "X-User-Id", required = false) String requesterId,
            @RequestBody StudentNotificationPreferenceDTO body) {
        if (requesterId == null) return ResponseEntity.status(401).build();
        NotificationPreference p = getOrCreate(requesterId);
        if (body.getEmailReservation() != null) p.setEmailReservation(body.getEmailReservation());
        if (body.getEmailMessage() != null) p.setEmailMessage(body.getEmailMessage());
        if (body.getSmsReminder() != null) p.setSmsReminder(body.getSmsReminder());
        if (body.getSmsPayment() != null) p.setSmsPayment(body.getSmsPayment());
        if (body.getPushNotifications() != null) p.setPushNotifications(body.getPushNotifications());
        repository.save(p);
        return getStudentPrefs(requesterId);
    }
}