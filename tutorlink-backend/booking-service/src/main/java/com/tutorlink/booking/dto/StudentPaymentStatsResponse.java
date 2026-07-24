package com.tutorlink.booking.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class StudentPaymentStatsResponse {
    private long totalSpent;
    private long totalTransactions;
    private long pendingAmount;
    private long averagePerCourse;
}