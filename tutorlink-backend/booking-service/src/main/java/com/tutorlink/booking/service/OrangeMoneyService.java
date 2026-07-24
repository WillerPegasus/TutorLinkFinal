package com.tutorlink.booking.service;

import com.tutorlink.booking.client.OrangeMomoClient;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import java.util.HashMap;
import java.util.Map;
import java.util.UUID;

@Slf4j
@Service
public class OrangeMoneyService {

    private final OrangeMomoClient orangeMomoClient;

    @Value("${orange.momo.client-id:}")
    private String clientId;

    public OrangeMoneyService(OrangeMomoClient orangeMomoClient) {
        this.orangeMomoClient = orangeMomoClient;
    }

    private boolean isMockMode() {
        return clientId == null || clientId.isBlank();
    }

    /**
     * Initie un paiement Orange Money pour une réservation.
     * Retourne l'URL de paiement à renvoyer au front, et le payToken à stocker
     * dans l'entité Booking pour vérifier le statut plus tard.
     */
    public Map<String, String> initierPaiement(Integer montant, String bookingId) {
        String reference = "TUTORLINK-" + bookingId;

        if (isMockMode()) {
            log.warn("OrangeMoneyService en mode MOCK (orange.momo.client-id vide) — aucun appel réel à Orange.");
            Map<String, String> mockResult = new HashMap<>();
            mockResult.put("paymentUrl", "https://mock.orange-money.local/pay/" + UUID.randomUUID());
            mockResult.put("payToken", "MOCK-" + UUID.randomUUID());
            return mockResult;
        }

        return orangeMomoClient.initPayment(montant, bookingId, reference);
    }

    /**
     * Vérifie le statut d'un paiement Orange Money déjà initié.
     * Valeurs possibles : SUCCESS, FAILED, EXPIRED, PENDING, INITIATED.
     */
    public String verifierStatutPaiement(String bookingId, Integer montant, String payToken) {
        if (isMockMode() || (payToken != null && payToken.startsWith("MOCK-"))) {
            log.warn("OrangeMoneyService en mode MOCK — statut simulé renvoyé : SUCCESS");
            return "SUCCESS";
        }

        return orangeMomoClient.checkPaymentStatus(bookingId, montant, payToken);
    }
}