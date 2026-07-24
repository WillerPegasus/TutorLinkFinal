package com.tutorlink.notification.dto;

import com.tutorlink.notification.entity.Notification;
import com.tutorlink.notification.entity.Notification.NotificationType;
import lombok.*;
import java.time.LocalDateTime;

@Data @Builder
public class NotificationResponse {
    private Long id;
    private Long userId;
    private NotificationType type;
    private String title;
    private String content;
    private Boolean isRead;
    private LocalDateTime createdAt;

    public static NotificationResponse from(Notification n) {
        return NotificationResponse.builder()
                .id(n.getId()).userId(n.getUserId()).type(n.getType())
                .title(n.getTitle()).content(n.getContent())
                .isRead(n.getIsRead()).createdAt(n.getCreatedAt()).build();
    }
}