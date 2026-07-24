package com.tutorlink.auth.client;

import org.springframework.cloud.openfeign.FeignClient;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;

import java.util.Map;

// ============================================================
// T11 : Feign Client vers user-service
//
// @FeignClient : Spring génère automatiquement le code HTTP
// pour appeler ce service distant
//
// name = "user-service" : le nom du service dans Eureka
// Spring trouve automatiquement son adresse via l'annuaire Eureka
// Tu n'as pas besoin de connaître son port ou son IP !
// ============================================================
@FeignClient(name = "user-service")
public interface UserServiceClient {

    // Cette méthode appelle POST http://user-service/api/users
    // en envoyant un JSON avec les données du profil
    //
    // Spring Feign génère tout le code HTTP automatiquement :
    // - Crée la connexion HTTP
    // - Sérialise le Map en JSON
    // - Envoie la requête
    // - Désérialise la réponse
    // Tu appelles juste createUserProfile(...) comme une méthode normale !
    @PostMapping("/api/users")
    void createUserProfile(@RequestBody Map<String, Object> profileData);
}