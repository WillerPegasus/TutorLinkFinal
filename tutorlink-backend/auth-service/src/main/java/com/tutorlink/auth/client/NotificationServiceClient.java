package com.tutorlink.auth.client;

import com.tutorlink.auth.service.EmailService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.cloud.openfeign.FeignClient;
import org.springframework.stereotype.Component;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;

import java.util.Map;

// ============================================================
// T12 : Feign Client vers notification-service
//
// fallback = NotificationFallback.class : si le notification-service
// est en panne ou ne répond pas, Spring appelle automatiquement
// la classe NotificationFallback au lieu de planter
// C'est le "plan B" — le disjoncteur électrique de ton code
// ============================================================
@FeignClient(
    name = "notification-service",
    fallback = NotificationServiceClient.NotificationFallback.class
)
public interface NotificationServiceClient {

    // Appelle POST http://notification-service/api/notifications/send
    // avec un objet JSON contenant l'email et le code OTP
    //
    // Exemple de JSON envoyé :
    // {
    //   "to": "jean@gmail.com",
    //   "otpCode": "847291",
    //   "type": "OTP_VERIFICATION"
    // }
    @PostMapping("/api/notifications/send")
    void sendNotification(@RequestBody Map<String, Object> notificationData);

    // ============================================================
    // CLASSE FALLBACK : NotificationFallback
    // Cette classe est le "plan B" utilisé quand notification-service
    // est indisponible
    //
    // @Component : Spring gère cette classe comme un Bean
    // Elle implémente NotificationServiceClient pour pouvoir
    // remplacer les appels Feign en cas de panne
    // ============================================================
    @Component
    class NotificationFallback implements NotificationServiceClient {

        // On injecte EmailService pour envoyer l'email directement
        // si notification-service est en panne
        @Autowired
        private EmailService emailService;

        @Override
        public void sendNotification(Map<String, Object> notificationData) {
            // Plan B : envoyer l'email directement via EmailService
            // sans passer par notification-service
            //
            // On récupère les données depuis la Map
            String to = (String) notificationData.get("to");
            String otpCode = (String) notificationData.get("otpCode");

            // Log pour savoir qu'on utilise le fallback
            System.out.println(
                "[FALLBACK] notification-service indisponible. " +
                "Envoi direct de l'email OTP à : " + to
            );

            // Envoi direct via EmailService
            emailService.sendOtpEmail(to, otpCode);
        }
    }
}