package com.tutorlink.booking.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class BookingStatsResponse {
    private long totalBookings;
    private long upcomingCount;
    private long completedCount;
    private long cancelledCount;
    private long tutorsContactedCount;
}