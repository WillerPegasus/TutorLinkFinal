package com.tutorlink.tutorservice.dto;

import jakarta.validation.constraints.*;
import lombok.*;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class TutorProfileRequest {

    @NotNull(message = "userId obligatoire")
    private Long userId;

    @NotBlank(message = "Les matières sont obligatoires")
    private String subjects;

    @NotBlank(message = "Les niveaux sont obligatoires")
    private String levels;

    @NotNull(message = "Le tarif horaire est obligatoire")
    @Min(value = 0, message = "Le tarif doit être positif")
    private Integer hourlyRate;

    private String bio;

    @NotBlank(message = "La ville est obligatoire")
    private String city;

    private String districts;
}