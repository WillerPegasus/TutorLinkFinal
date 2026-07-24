package com.tutorlink.booking.exception;

public class BookingNotFoundException extends RuntimeException {
    public BookingNotFoundException(Long id) {
        super("Réservation introuvable avec l'id : " + id);
    }
}