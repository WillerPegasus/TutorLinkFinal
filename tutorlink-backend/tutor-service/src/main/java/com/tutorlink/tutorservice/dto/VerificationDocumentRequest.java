package com.tutorlink.tutorservice.dto;

import com.tutorlink.tutorservice.enums.DocumentType;
import jakarta.validation.constraints.NotNull;
import lombok.*;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class VerificationDocumentRequest {

    @NotNull(message = "Le type de document est obligatoire")
    private DocumentType documentType;

    @NotNull(message = "L'URL du fichier est obligatoire")
    private String fileUrl;
}