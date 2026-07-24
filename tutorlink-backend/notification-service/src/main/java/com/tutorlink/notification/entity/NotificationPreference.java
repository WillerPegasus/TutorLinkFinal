package com.tutorlink.notification.entity;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "notification_preferences")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class NotificationPreference {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, unique = true)
    private Long userId;

    // ── Champs répétiteur ──────────────────────────────────
    @Builder.Default private Boolean smsNewRequest = true;
    @Builder.Default private Boolean smsPaymentReceived = true;
    @Builder.Default private Boolean smsNewReview = false;
    @Builder.Default private Boolean emailWeeklySummary = true;
    @Builder.Default private Boolean emailNewRequest = false;

    // ── Champs élève ───────────────────────────────────────
    @Builder.Default private Boolean emailReservation = true;
    @Builder.Default private Boolean emailMessage = true;
    @Builder.Default private Boolean smsReminder = true;
    @Builder.Default private Boolean smsPayment = true;
    @Builder.Default private Boolean pushNotifications = true;
}