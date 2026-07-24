package com.tutorlink.booking.client;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.*;
import org.springframework.stereotype.Component;
import org.springframework.web.client.RestTemplate;

import java.util.Base64;
import java.util.HashMap;
import java.util.Map;
import java.util.UUID;

@Component
public class MtnMomoClient {

    @Value("${mtn.momo.subscription-key}")
    private String subscriptionKey;

    @Value("${mtn.momo.api-user}")
    private String apiUser;

    @Value("${mtn.momo.api-key}")
    private String apiKey;

    @Value("${mtn.momo.base-url}")
    private String baseUrl;

    @Value("${mtn.momo.target-environment}")
    private String targetEnvironment;

    private final RestTemplate restTemplate = new RestTemplate();

    private String getAccessToken() {
        String auth = apiUser + ":" + apiKey;
        String encodedAuth = Base64.getEncoder().encodeToString(auth.getBytes());

        HttpHeaders headers = new HttpHeaders();
        headers.set("Authorization", "Basic " + encodedAuth);
        headers.set("Ocp-Apim-Subscription-Key", subscriptionKey);

        HttpEntity<Void> entity = new HttpEntity<>(headers);

        ResponseEntity<Map> response = restTemplate.exchange(
                baseUrl + "/collection/token/",
                HttpMethod.POST,
                entity,
                Map.class
        );

        if (response.getBody() == null || !response.getBody().containsKey("access_token")) {
            throw new RuntimeException("Impossible d'obtenir le token MTN MoMo");
        }
        return (String) response.getBody().get("access_token");
    }

    public String requestPayment(String phoneNumber, Integer amount, String reference) {
        String token = getAccessToken();
        String referenceId = UUID.randomUUID().toString();

        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.APPLICATION_JSON);
        headers.set("Authorization", "Bearer " + token);
        headers.set("X-Reference-Id", referenceId);
        headers.set("X-Target-Environment", targetEnvironment);
        headers.set("Ocp-Apim-Subscription-Key", subscriptionKey);

        Map<String, Object> body = new HashMap<>();
        body.put("amount", String.valueOf(amount));
        body.put("currency", "EUR");
        body.put("externalId", reference);

        Map<String, String> payer = new HashMap<>();
        payer.put("partyIdType", "MSISDN");
        payer.put("partyId", phoneNumber);
        body.put("payer", payer);

        body.put("payerMessage", "Paiement TutorLink");
        body.put("payeeNote", "Paiement séance de répétition");

        HttpEntity<Map<String, Object>> entity = new HttpEntity<>(body, headers);

        ResponseEntity<Void> response = restTemplate.exchange(
                baseUrl + "/collection/v1_0/requesttopay",
                HttpMethod.POST,
                entity,
                Void.class
        );

        if (response.getStatusCode() != HttpStatus.ACCEPTED) {
            throw new RuntimeException("Échec de la demande de paiement MTN MoMo");
        }

        return referenceId;
    }

    public String checkPaymentStatus(String referenceId) {
        String token = getAccessToken();

        HttpHeaders headers = new HttpHeaders();
        headers.set("Authorization", "Bearer " + token);
        headers.set("X-Target-Environment", targetEnvironment);
        headers.set("Ocp-Apim-Subscription-Key", subscriptionKey);

        HttpEntity<Void> entity = new HttpEntity<>(headers);

        ResponseEntity<Map> response = restTemplate.exchange(
                baseUrl + "/collection/v1_0/requesttopay/" + referenceId,
                HttpMethod.GET,
                entity,
                Map.class
        );

        if (response.getBody() == null) {
            return "FAILED";
        }
        return (String) response.getBody().get("status");
    }
}