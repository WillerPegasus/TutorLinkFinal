package com.tutorlink.booking.exception;

public class TutorNotAvailableException extends RuntimeException {
    public TutorNotAvailableException() {
        super("Le répétiteur n'est pas disponible pour ce créneau.");
    }
}