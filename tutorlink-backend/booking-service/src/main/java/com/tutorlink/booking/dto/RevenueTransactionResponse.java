package com.tutorlink.booking.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.time.LocalDate;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class RevenueTransactionResponse {
    private Long id;
    private String reference;
    private String studentName;
    private String type;          // toujours "individuel" ici
    private String subject;
    private LocalDate date;
    private long amount;
    private long commission;
    private long netAmount;
    private String operator;      // "MTN" ou "Orange"
    private String transactionId;
    private String status;        // "recu" | "en_attente" | "rembourse"
}