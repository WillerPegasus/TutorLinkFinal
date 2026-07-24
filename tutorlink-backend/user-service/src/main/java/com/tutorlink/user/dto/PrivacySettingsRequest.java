package com.tutorlink.user.dto;

import lombok.Data;

@Data
public class PrivacySettingsRequest {
    private Boolean phoneVisible;
    private Boolean profilePublic;
}