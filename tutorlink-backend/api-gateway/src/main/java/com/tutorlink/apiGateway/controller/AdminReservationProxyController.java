package com.tutorlink.apiGateway.controller;

import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.client.RestTemplate;
import org.springframework.web.util.UriComponentsBuilder;

// ✎ AJOUT — alias /api/admin/reservations/** attendus par adminReservationService.ts
@RestController
@RequestMapping("/api/admin/reservations")
@RequiredArgsConstructor
public class AdminReservationProxyController {

    private final RestTemplate restTemplate;

    @Value("${services.booking-service.url}")
    private String bookingServiceUrl;

    @GetMapping
    public ResponseEntity<Object> getAllReservations(
            @RequestParam(required = false) String status,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "20") int size) {

        String url = UriComponentsBuilder.fromHttpUrl(bookingServiceUrl + "/api/bookings")
                .queryParamIfPresent("status", java.util.Optional.ofNullable(status))
                .queryParam("page", page)
                .queryParam("size", size)
                .toUriString();

        Object result = restTemplate.getForObject(url, Object.class);
        return ResponseEntity.ok(result);
    }

    @PatchMapping("/{id}/cancel")
    public ResponseEntity<Void> cancelReservation(@PathVariable Long id) {
        restTemplate.patchForObject(bookingServiceUrl + "/api/bookings/" + id + "/cancel", null, Void.class);
        return ResponseEntity.noContent().build();
    }
}