package com.tutorlink.booking.entity;

import com.tutorlink.booking.enums.BookingStatus;
import com.tutorlink.booking.enums.PaymentMethod;
import com.tutorlink.booking.enums.PaymentStatus;
import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.LocalTime;

@Entity
@Table(name = "bookings")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Booking {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private Long studentId;

    @Column(nullable = false)
    private Long tutorId;

    @Column(nullable = false)
    private String subject;

    @Column(nullable = false)
    private String level;

    @Column(nullable = false)
    private LocalDate scheduledDate;

    @Column(nullable = false)
    private LocalTime startTime;

    @Column(nullable = false)
    private Integer duration; // en minutes

    @Column(nullable = false)
    private String location;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    @Builder.Default
    private BookingStatus status = BookingStatus.PENDING;

    private String studentNote;
    private String tutorNote;
// ✎ AJOUT — note du tuteur sur la séance (0-20), base de /student/progress
    private Integer grade;

    // ✎ V3 — Mobile Money
    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private PaymentMethod paymentMethod;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    @Builder.Default
    private PaymentStatus paymentStatus = PaymentStatus.PENDING;
    // ✎ AJOUT V4 : montant à payer en XAF, calculé automatiquement
    // depuis le tarif horaire du répétiteur (jamais fourni par le frontend)
    private Integer amount;

    // ✎ AJOUT V4 : traçabilité du paiement Orange Money (init → confirm)
    private String orangeOrderId;
    private String orangePayToken;
    // ✎ FIX — traçabilité du paiement MTN (symétrique à orangeOrderId)
    private String mtnReferenceId;

    @CreationTimestamp
    private LocalDateTime createdAt;

    @UpdateTimestamp
    private LocalDateTime updatedAt;
}