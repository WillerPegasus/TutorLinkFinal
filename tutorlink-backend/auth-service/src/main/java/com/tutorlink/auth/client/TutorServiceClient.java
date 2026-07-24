package com.tutorlink.auth.client;

import org.springframework.cloud.openfeign.FeignClient;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import java.util.Map;

// ✎ AJOUT — Feign Client vers tutor-service, même pattern que UserServiceClient.
// Permet à auth-service de créer automatiquement le profil pédagogique
// (TutorProfile) au moment de l'inscription d'un répétiteur.
@FeignClient(name = "tutor-service")
public interface TutorServiceClient {

    // Appelle POST http://tutor-service/api/tutors
    @PostMapping("/api/tutors")
    void createTutorProfile(@RequestBody Map<String, Object> profileData);
}
