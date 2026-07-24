package com.tutorlink.tutorservice.entity;

import jakarta.persistence.*;
import lombok.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "tutor_groups")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Group {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private Long tutorId;

    @Column(nullable = false)
    private String name;

    @Column(nullable = false)
    private String subject;

    @Column(nullable = false)
    private String level;

    private String city;
    private String district;

    @Column(nullable = false)
    private Integer maxCapacity;

    @Column(nullable = false)
    private Integer monthlyPrice;

    @Column(columnDefinition = "TEXT")
    private String description;

    private String schedules;

    @Enumerated(EnumType.STRING)
    @Builder.Default
    private GroupStatus status = GroupStatus.ACTIVE;

    @Column(updatable = false)
    private LocalDateTime createdAt;

    @PrePersist
    protected void onCreate() {
        this.createdAt = LocalDateTime.now();
    }
public enum GroupStatus {
        ACTIVE, FULL, CLOSED, SUSPENDED
    }
}