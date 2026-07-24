package com.tutorlink.messageservice.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.*;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class SendMessageRequest {

    @NotNull(message = "senderId obligatoire")
    private Long senderId;

    @NotNull(message = "receiverId obligatoire")
    private Long receiverId;

    @NotBlank(message = "Le contenu ne peut pas être vide")
    private String content;
}