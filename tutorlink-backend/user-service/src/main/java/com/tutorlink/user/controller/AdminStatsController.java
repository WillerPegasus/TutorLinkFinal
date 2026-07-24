package com.tutorlink.user.controller;

import com.tutorlink.user.service.UserService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import java.util.List;
import java.util.Map;

// FIX — GET /api/admin/stats/users, appelé directement par api-gateway (AdminStatsController.fetchCount)
// Doit renvoyer {"count": <nombre total d'utilisateurs>}
@RestController
@RequestMapping("/api/admin/stats")
@RequiredArgsConstructor
public class AdminStatsController {

    private final UserService userService;

    @GetMapping("/users")
    public ResponseEntity<Map<String, Long>> getTotalUsersCount() {
        long count = userService.getAllUsers().size();
        return ResponseEntity.ok(Map.of("count", count));
    }

    // ✎ AJOUT — inscriptions récentes (dashboard admin)
    @GetMapping("/users/recent")
    public ResponseEntity<List<com.tutorlink.user.dto.UserProfileResponse>> getRecentRegistrations() {
        List<com.tutorlink.user.dto.UserProfileResponse> recent = userService.getAllUsers()
                .stream()
                .sorted((a, b) -> b.getCreatedAt().compareTo(a.getCreatedAt()))
                .limit(10)
                .toList();
        return ResponseEntity.ok(recent);
    }

    // ✎ AJOUT — inscriptions groupées par mois (graphique dashboard admin)
    @GetMapping("/users/monthly")
    public ResponseEntity<Map<String, Long>> getMonthlyRegistrations() {
        Map<String, Long> byMonth = userService.getAllUsers().stream()
                .filter(u -> u.getCreatedAt() != null)
                .collect(java.util.stream.Collectors.groupingBy(
                        u -> u.getCreatedAt().getYear() + "-" + String.format("%02d", u.getCreatedAt().getMonthValue()),
                        java.util.stream.Collectors.counting()
                ));
        return ResponseEntity.ok(byMonth);
    }
}