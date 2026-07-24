package com.tutorlink.apiGateway.controller;

import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.client.HttpClientErrorException;
import org.springframework.web.client.RestTemplate;

import java.util.Map;

// ✎ FIX — alias /api/admin/auth/** attendus par adminAuthService.ts,
// qui relaient vers /api/auth/login et /api/auth/verify-2fa d'auth-service
// (la 2FA ADMIN y est déjà entièrement gérée, seuls les noms de champs diffèrent)
@RestController
@RequestMapping("/api/admin/auth")
@RequiredArgsConstructor
public class AdminAuthProxyController {

    private final RestTemplate restTemplate;

    @Value("${services.auth-service.url}")
    private String authServiceUrl;

    // Frontend envoie { email, password } → backend attend { identifier, password }
    @PostMapping("/login")
    public ResponseEntity<Object> login(@RequestBody Map<String, String> body) {
        Map<String, String> mapped = Map.of(
                "identifier", body.get("email"),
                "password", body.get("password")
        );
        try {
            return ResponseEntity.ok(
                    restTemplate.postForObject(authServiceUrl + "/api/auth/login", mapped, Object.class));
        } catch (HttpClientErrorException e) {
            return ResponseEntity.status(e.getStatusCode()).body(e.getResponseBodyAsString());
        }
    }

    // Frontend envoie { email, otp } → backend attend { identifier, code }
    @PostMapping("/verify-otp")
    public ResponseEntity<Object> verifyOtp(@RequestBody Map<String, String> body) {
        Map<String, String> mapped = Map.of(
                "identifier", body.get("email"),
                "code", body.get("otp")
        );
        try {
            return ResponseEntity.ok(
                    restTemplate.postForObject(authServiceUrl + "/api/auth/verify-2fa", mapped, Object.class));
        } catch (HttpClientErrorException e) {
            return ResponseEntity.status(e.getStatusCode()).body(e.getResponseBodyAsString());
        }
    }
}