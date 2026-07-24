package com.tutorlink.notification.dto;

import jakarta.validation.constraints.*;
import lombok.Data;
import java.util.List;

@Data
public class SystemNotificationRequest {
    @NotEmpty(message = "Au moins un userId requis")
    private List<Long> userIds;
    @NotBlank private String title;
    @NotBlank private String content;
}