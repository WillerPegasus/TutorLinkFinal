package com.tutorlink.booking.dto;

import com.tutorlink.booking.enums.BookingStatus;
import jakarta.validation.constraints.NotNull;
import lombok.Data;

@Data
public class BookingStatusRequest {

    @NotNull
    private BookingStatus status;

    private String tutorNote; // optionnel, pour motif de refus
}