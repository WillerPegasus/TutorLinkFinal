package com.tutorlink.tutorservice.dto;

import lombok.*;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class TutorProfileResponse {
    private Long id;
    private Long userId;
    private String subjects;
    private String levels;
    private Integer hourlyRate;
    private String bio;
    private String city;
    private String districts;
    private Boolean isVerified;
    private Double rating;
    private Integer totalReviews;
}