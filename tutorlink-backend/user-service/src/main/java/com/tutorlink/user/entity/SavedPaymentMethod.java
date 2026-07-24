package com.tutorlink.user.entity;

import jakarta.persistence.*;
import lombok.*;
import java.time.LocalDateTime;

// ✎ AJOUT — moyens de paiement enregistrés par un étudiant (numéro masqué)
@Entity
@Table(name = "saved_payment_methods")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class SavedPaymentMethod {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private Long userId;

    @Column(nullable = false)
    private String operator; // "MTN" ou "ORANGE"

    @Column(nullable = false)
    private String phoneNumberMasked; // ex: "6XX XX 45 67"

    @Builder.Default
    private Boolean isDefault = false;

    @Column(updatable = false)
    private LocalDateTime createdAt;

    @PrePersist
    protected void onCreate() {
        this.createdAt = LocalDateTime.now();
    }
}