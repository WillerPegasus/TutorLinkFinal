package com.tutorlink.tutorservice.dto;

import lombok.*;
import java.time.LocalDateTime;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ReviewResponse {
    private Long id;
    private Long tutorId;
    private Long studentId;
    private Integer rating;
    private String comment;
    private LocalDateTime createdAt;
    private Long bookingId;
}