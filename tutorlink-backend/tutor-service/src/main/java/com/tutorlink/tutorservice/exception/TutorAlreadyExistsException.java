package com.tutorlink.tutorservice.exception;

public class TutorAlreadyExistsException extends RuntimeException {
    public TutorAlreadyExistsException(Long userId) {
        super("Un profil tuteur existe déjà pour l'userId : " + userId);
    }
}