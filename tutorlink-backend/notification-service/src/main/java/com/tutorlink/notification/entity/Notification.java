package com.tutorlink.notification.entity;

import jakarta.persistence.*;
import lombok.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "notifications")
@Data @Builder @NoArgsConstructor @AllArgsConstructor
public class Notification {

    @Id @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private Long userId;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private NotificationType type;

    @Column(nullable = false)
    private String title;

    @Column(columnDefinition = "TEXT", nullable = false)
    private String content;

    @Column(nullable = false)
    @Builder.Default
    private Boolean isRead = false;

    @Column(nullable = false, updatable = false)
    @Builder.Default
    private LocalDateTime createdAt = LocalDateTime.now();

    public enum NotificationType {
        BOOKING_RECEIVED,
        BOOKING_CONFIRMED,
        BOOKING_CANCELLED,
        OTP,
        MESSAGE,
        REMINDER,
        SYSTEM,
        GROUP_JOINED,      // ✦ NOUVEAU V3
        GROUP_FULL,        // ✦ NOUVEAU V3
        PAYMENT_RECEIVED   // ✦ NOUVEAU V3
    }
}