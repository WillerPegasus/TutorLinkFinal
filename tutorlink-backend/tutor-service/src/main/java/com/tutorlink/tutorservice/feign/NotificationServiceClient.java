package com.tutorlink.tutorservice.feign;

import org.springframework.cloud.openfeign.FeignClient;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;

import java.util.Map;

// T19 — Feign client vers notification-service
// Utilisé par GroupService pour notifier GROUP_JOINED et GROUP_FULL
@FeignClient(name = "notification-service", url = "${notification.service.url:http://localhost:8085}")
public interface NotificationServiceClient {

    @PostMapping("/api/notifications/send")
    void sendNotification(@RequestBody Map<String, Object> notificationData);
}