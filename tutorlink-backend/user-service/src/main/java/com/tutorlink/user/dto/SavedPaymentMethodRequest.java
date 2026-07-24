package com.tutorlink.user.dto;

import jakarta.validation.constraints.NotBlank;
import lombok.Data;

@Data
public class SavedPaymentMethodRequest {
    @NotBlank
    private String operator;

    @NotBlank
    private String phoneNumber; // reçu en clair, masqué avant stockage
}