package com.tutorlink.tutorservice.entity;
import jakarta.persistence.*;
import lombok.*;
import java.time.LocalDate;
@Entity
@Table(name = "tutor_subscriptions")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class TutorSubscription {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    @Column(nullable = false, unique = true)
    private Long tutorId;
    @Enumerated(EnumType.STRING)
    @Builder.Default
    private SubscriptionStatus status = SubscriptionStatus.EXPIRED;
    private LocalDate expiryDate;
    @Builder.Default
    private Boolean autoRenew = false;
    // ✎ AJOUT — période d'essai gratuite (2 mois à l'inscription)
    private LocalDate trialStartDate;
    private LocalDate trialEndDate;
    public enum SubscriptionStatus {
        TRIAL, ACTIVE, EXPIRED, SUSPENDED
    }
}