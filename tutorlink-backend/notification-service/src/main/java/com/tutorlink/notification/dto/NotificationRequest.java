package com.tutorlink.notification.dto;

import com.tutorlink.notification.entity.Notification.NotificationType;
import jakarta.validation.constraints.*;
import lombok.Data;

@Data
public class NotificationRequest {
    @NotNull(message = "userId est obligatoire")
    public Long userId;
    @NotNull(message = "type est obligatoire")
    public NotificationType type;
    @NotBlank(message = "title est obligatoire")
    public String title;
    @NotBlank(message = "content est obligatoire")
    public String content;
    public String email; // optionnel
}