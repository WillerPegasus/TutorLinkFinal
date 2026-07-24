package com.tutorlink.tutorservice.dto;

import com.tutorlink.tutorservice.enums.DayOfWeek;
import jakarta.validation.constraints.NotNull;
import lombok.*;
import java.time.LocalTime;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class AvailabilityRequest {

    @NotNull(message = "Le jour est obligatoire")
    private DayOfWeek dayOfWeek;

    @NotNull(message = "L'heure de début est obligatoire")
    private LocalTime startTime;

    @NotNull(message = "L'heure de fin est obligatoire")
    private LocalTime endTime;

    private Boolean isAvailable = true;
}