package com.tutorlink.tutorservice.entity;

import jakarta.persistence.*;
import lombok.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "reviews")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Review {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private Long tutorId;

    @Column(nullable = false)
    private Long studentId;

    @Column(nullable = false)
    private Long bookingId;

    @Column(nullable = false)
    private Integer rating;

    @Column(length = 1000)
    private String comment;
    @Column(length = 1000)
    private String tutorReply;

    private java.time.LocalDateTime repliedAt;

    @Column(updatable = false)
    private LocalDateTime createdAt;

    @PrePersist
    protected void onCreate() {
        this.createdAt = LocalDateTime.now();
    }
}