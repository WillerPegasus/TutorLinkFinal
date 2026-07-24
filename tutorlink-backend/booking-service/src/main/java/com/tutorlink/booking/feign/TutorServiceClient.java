package com.tutorlink.booking.feign;

import org.springframework.cloud.openfeign.FeignClient;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;

import java.util.Map;

@FeignClient(name = "tutor-service")
public interface TutorServiceClient {

    @GetMapping("/api/tutors/{tutorId}/availability")
    Object getTutorAvailability(@PathVariable("tutorId") Long tutorId);

    // ✎ AJOUT V4 : récupère le profil du répétiteur (dont hourlyRate)
    // pour calculer le montant d'une réservation. On utilise Map plutôt
    // qu'un DTO dédié pour ne pas dupliquer TutorProfileResponse ici.
    @GetMapping("/api/tutors/{tutorId}")
    Map<String, Object> getTutorById(@PathVariable("tutorId") Long tutorId);
}