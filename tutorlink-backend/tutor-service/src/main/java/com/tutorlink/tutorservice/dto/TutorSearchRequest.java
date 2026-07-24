package com.tutorlink.tutorservice.dto;

import lombok.*;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class TutorSearchRequest {
    private String subject;
    private String level;
    private String city;
    private String district;
    private Integer minPrice;
    private Integer maxPrice;
    private Double minRating;
}