package com.tutorlink.booking.client;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.*;
import org.springframework.stereotype.Component;
import org.springframework.util.LinkedMultiValueMap;
import org.springframework.util.MultiValueMap;
import org.springframework.web.client.RestTemplate;

import java.util.Base64;
import java.util.HashMap;
import java.util.Map;

@Component
public class OrangeMomoClient {

    @Value("${orange.momo.client-id}")
    private String clientId;

    @Value("${orange.momo.client-secret}")
    private String clientSecret;

    @Value("${orange.momo.merchant-key}")
    private String merchantKey;

    @Value("${orange.momo.auth-url}")
    private String authUrl;

    @Value("${orange.momo.base-url}")
    private String baseUrl;

    @Value("${orange.momo.return-url}")
    private String returnUrl;

    @Value("${orange.momo.cancel-url}")
    private String cancelUrl;

    @Value("${orange.momo.notif-url}")
    private String notifUrl;

    private final RestTemplate restTemplate = new RestTemplate();

    private String getAccessToken() {
        String auth = clientId + ":" + clientSecret;
        String encodedAuth = Base64.getEncoder().encodeToString(auth.getBytes());

        HttpHeaders headers = new HttpHeaders();
        headers.set("Authorization", "Basic " + encodedAuth);
        headers.setContentType(MediaType.APPLICATION_FORM_URLENCODED);

        MultiValueMap<String, String> form = new LinkedMultiValueMap<>();
        form.add("grant_type", "client_credentials");

        HttpEntity<MultiValueMap<String, String>> entity = new HttpEntity<>(form, headers);

        ResponseEntity<Map> response = restTemplate.exchange(
                authUrl,
                HttpMethod.POST,
                entity,
                Map.class
        );

        if (response.getBody() == null || !response.getBody().containsKey("access_token")) {
            throw new RuntimeException("Impossible d'obtenir le token Orange Money");
        }
        return (String) response.getBody().get("access_token");
    }

    public Map<String, String> initPayment(Integer amount, String orderId, String reference) {
        String token = getAccessToken();

        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.APPLICATION_JSON);
        headers.set("Authorization", "Bearer " + token);

        Map<String, Object> body = new HashMap<>();
        body.put("merchant_key", merchantKey);
        body.put("currency", "XAF");
        body.put("order_id", orderId);
        body.put("amount", amount);
        body.put("return_url", returnUrl);
        body.put("cancel_url", cancelUrl);
        body.put("notif_url", notifUrl);
        body.put("lang", "fr");
        body.put("reference", reference);

        HttpEntity<Map<String, Object>> entity = new HttpEntity<>(body, headers);

        ResponseEntity<Map> response = restTemplate.exchange(
                baseUrl,
                HttpMethod.POST,
                entity,
                Map.class
        );

        if (response.getBody() == null || !response.getBody().containsKey("payment_url")) {
            throw new RuntimeException("Échec de l'initialisation du paiement Orange Money");
        }

        Map<String, String> result = new HashMap<>();
        result.put("paymentUrl", (String) response.getBody().get("payment_url"));
        result.put("payToken", (String) response.getBody().get("pay_token"));
        return result;
    }

    public String checkPaymentStatus(String orderId, Integer amount, String payToken) {
        String token = getAccessToken();

        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.APPLICATION_JSON);
        headers.set("Authorization", "Bearer " + token);

        Map<String, Object> body = new HashMap<>();
        body.put("order_id", orderId);
        body.put("amount", amount);
        body.put("pay_token", payToken);

        HttpEntity<Map<String, Object>> entity = new HttpEntity<>(body, headers);

        ResponseEntity<Map> response = restTemplate.exchange(
                baseUrl + "/transactionstatus",
                HttpMethod.POST,
                entity,
                Map.class
        );

        if (response.getBody() == null) {
            return "FAILED";
        }
        return (String) response.getBody().get("status");
    }
}