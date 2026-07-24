package com.tutorlink.booking.dto;

import com.tutorlink.booking.enums.PaymentMethod;
import jakarta.validation.constraints.NotNull;
import lombok.Data;

import java.time.LocalDate;
import java.time.LocalTime;

@Data
public class BookingRequest {

    @NotNull
    private Long studentId;

    @NotNull
    private Long tutorId;

    @NotNull
    private String subject;

    @NotNull
    private String level;

    @NotNull
    private LocalDate scheduledDate;

    @NotNull
    private LocalTime startTime;

    @NotNull
    private Integer duration;

    @NotNull
    private String location;

    private String studentNote;

    // ✎ V3
    @NotNull(message = "Le moyen de paiement est obligatoire (MTN_MOMO ou ORANGE_MONEY)")
    private PaymentMethod paymentMethod;
}