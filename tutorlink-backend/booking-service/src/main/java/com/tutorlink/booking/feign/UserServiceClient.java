package com.tutorlink.booking.feign;

import org.springframework.cloud.openfeign.FeignClient;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import java.util.Map;

@FeignClient(name = "user-service")
public interface UserServiceClient {

    // Réutilise l'endpoint public existant (firstName/lastName seulement)
    @GetMapping("/api/users/{userId}/public")
    Map<String, Object> getPublicProfile(@PathVariable("userId") Long userId);
}