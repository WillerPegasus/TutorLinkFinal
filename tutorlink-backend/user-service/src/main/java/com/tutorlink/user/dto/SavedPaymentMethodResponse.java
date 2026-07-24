package com.tutorlink.user.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class SavedPaymentMethodResponse {
    private Long id;
    private String operator;
    private String phoneNumberMasked;
    private Boolean isDefault;
}