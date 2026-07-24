package com.tutorlink.tutorservice.exception;

public class BookingNotCompletedException extends RuntimeException {
    public BookingNotCompletedException(Long bookingId) {
        super("La réservation " + bookingId + " n'est pas encore complétée.");
    }
}