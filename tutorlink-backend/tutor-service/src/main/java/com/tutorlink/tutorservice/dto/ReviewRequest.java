package com.tutorlink.tutorservice.dto;

import jakarta.validation.constraints.*;
import lombok.*;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ReviewRequest {

    @NotNull(message = "studentId obligatoire")
    private Long studentId;

    @NotNull(message = "bookingId obligatoire")
    private Long bookingId;

    @NotNull
    @Min(value = 1, message = "La note minimale est 1")
    @Max(value = 5, message = "La note maximale est 5")
    private Integer rating;

    @Size(max = 1000, message = "Commentaire trop long")
    private String comment;
}