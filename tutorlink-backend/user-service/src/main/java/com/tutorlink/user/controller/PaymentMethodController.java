package com.tutorlink.user.controller;

import com.tutorlink.user.dto.SavedPaymentMethodRequest;
import com.tutorlink.user.dto.SavedPaymentMethodResponse;
import com.tutorlink.user.entity.SavedPaymentMethod;
import com.tutorlink.user.repository.SavedPaymentMethodRepository;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/users/{userId}/payment-methods")
@RequiredArgsConstructor
public class PaymentMethodController {

    private final SavedPaymentMethodRepository repository;

    @GetMapping
    public ResponseEntity<List<SavedPaymentMethodResponse>> list(@PathVariable Long userId) {
        List<SavedPaymentMethodResponse> result = repository.findByUserId(userId)
                .stream().map(this::toResponse).toList();
        return ResponseEntity.ok(result);
    }

    @PostMapping
    public ResponseEntity<SavedPaymentMethodResponse> add(
            @PathVariable Long userId,
            @Valid @RequestBody SavedPaymentMethodRequest request) {

        String raw = request.getPhoneNumber();
        String masked = raw.length() >= 4
                ? "XX XX " + raw.substring(raw.length() - 4)
                : raw;

        SavedPaymentMethod method = SavedPaymentMethod.builder()
                .userId(userId)
                .operator(request.getOperator())
                .phoneNumberMasked(masked)
                .isDefault(repository.findByUserId(userId).isEmpty())
                .build();

        SavedPaymentMethod saved = repository.save(method);
        return ResponseEntity.status(HttpStatus.CREATED).body(toResponse(saved));
    }

    @DeleteMapping("/{methodId}")
    public ResponseEntity<Void> delete(@PathVariable Long userId, @PathVariable Long methodId) {
        repository.deleteById(methodId);
        return ResponseEntity.noContent().build();
    }
    // ✎ FIX — PATCH /api/users/{userId}/payment-methods/{methodId}/default
    // Définit un moyen de paiement comme méthode par défaut,
    // et retire le statut "défaut" des autres moyens de l'utilisateur.
    @PatchMapping("/{methodId}/default")
    public ResponseEntity<SavedPaymentMethodResponse> setDefault(
            @PathVariable Long userId,
            @PathVariable Long methodId) {

        List<SavedPaymentMethod> methods = repository.findByUserId(userId);

        SavedPaymentMethod target = methods.stream()
                .filter(m -> m.getId().equals(methodId))
                .findFirst()
                .orElseThrow(() -> new IllegalArgumentException("Moyen de paiement introuvable"));

       for (SavedPaymentMethod m : methods) {
            boolean shouldBeDefault = m.getId().equals(methodId);
            boolean currentlyDefault = Boolean.TRUE.equals(m.getIsDefault());
            if (currentlyDefault != shouldBeDefault) {
                m.setIsDefault(shouldBeDefault);
                repository.save(m);
            }
        }

        return ResponseEntity.ok(toResponse(target));
    }

    private SavedPaymentMethodResponse toResponse(SavedPaymentMethod m) {
        return SavedPaymentMethodResponse.builder()
                .id(m.getId())
                .operator(m.getOperator())
                .phoneNumberMasked(m.getPhoneNumberMasked())
                .isDefault(m.getIsDefault())
                .build();
    }
}