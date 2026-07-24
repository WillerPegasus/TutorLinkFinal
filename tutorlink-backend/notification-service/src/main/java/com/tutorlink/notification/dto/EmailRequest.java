package com.tutorlink.notification.dto;

import jakarta.validation.constraints.*;
import lombok.*;

@Data @Builder @NoArgsConstructor @AllArgsConstructor
public class EmailRequest {
    @NotBlank @Email
    private String to;
    @NotBlank
    private String subject;
    @NotBlank
    private String body;
}