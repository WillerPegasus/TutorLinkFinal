package com.tutorlink.tutorservice.exception;

public class TutorNotFoundException extends RuntimeException {
    public TutorNotFoundException(Long id) {
        super("Tuteur introuvable avec l'id : " + id);
    }
    public TutorNotFoundException(String message) {
        super(message);
    }
}