package com.tutorlink.booking.controller;

import com.tutorlink.booking.repository.BookingRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.Map;

// FIX — GET /api/admin/stats/bookings, appelé directement par api-gateway (AdminStatsController.fetchCount)
@RestController
@RequestMapping("/api/admin/stats")
@RequiredArgsConstructor
public class AdminStatsController {

    private final BookingRepository bookingRepository;

    @GetMapping("/bookings")
    public ResponseEntity<Map<String, Long>> getTotalBookingsCount() {
        long count = bookingRepository.count();
        return ResponseEntity.ok(Map.of("count", count));
    }
}