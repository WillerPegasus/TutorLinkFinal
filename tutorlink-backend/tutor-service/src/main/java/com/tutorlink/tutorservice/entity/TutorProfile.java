package com.tutorlink.tutorservice.entity;

import jakarta.persistence.*;
import lombok.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "tutor_profiles")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class TutorProfile {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, unique = true)
    private Long userId;

    @Column(length = 500)
    private String subjects;

    @Column(length = 500)
    private String levels;

    private Integer hourlyRate;

    @Column(columnDefinition = "TEXT")
    private String bio;

    private String city;

    @Column(length = 500)
    private String districts;

    @Builder.Default
    private Boolean isVerified = false;
    
// ✎ AJOUT — distingue "rejeté explicitement" de "pas encore examiné"
    @Builder.Default
    private Boolean isRejected = false;

    @Column(columnDefinition = "TEXT")
    private String rejectionReason;
    @Builder.Default
    private Double rating = 0.0;

    @Builder.Default
    private Integer totalReviews = 0;

    @Column(updatable = false)
    private LocalDateTime createdAt;

    @PrePersist
    protected void onCreate() {
        this.createdAt = LocalDateTime.now();
    }
}