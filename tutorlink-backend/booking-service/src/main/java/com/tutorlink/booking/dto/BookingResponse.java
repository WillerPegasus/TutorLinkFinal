package com.tutorlink.booking.dto;

import com.tutorlink.booking.enums.BookingStatus;
import com.tutorlink.booking.enums.PaymentMethod;
import com.tutorlink.booking.enums.PaymentStatus;
import lombok.Data;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.LocalTime;

@Data
public class BookingResponse {

    private Long id;
    private Long studentId;
    private Long tutorId;
    private String subject;
    private String level;
    private LocalDate scheduledDate;
    private LocalTime startTime;
    private Integer duration;
    private String location;
    private BookingStatus status;
    private String studentNote;
    private String tutorNote;
    private Integer grade;
    private LocalDateTime createdAt;

    // ✎ V3
    private PaymentMethod paymentMethod;
    private PaymentStatus paymentStatus;
    private Integer amount; // ✎ AJOUT V4
}