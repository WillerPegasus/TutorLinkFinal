package com.tutorlink.tutorservice.feign;

import org.springframework.cloud.openfeign.FeignClient;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;

@FeignClient(name = "booking-service", url = "${booking.service.url:http://localhost:8084}")
public interface BookingServiceClient {

    @GetMapping("/api/bookings/{bookingId}/status")
    String getBookingStatus(@PathVariable("bookingId") Long bookingId);
}