package com.tutorlink.apiGateway.controller;

import com.tutorlink.apiGateway.service.ReportPdfService;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.client.RestTemplate;

import java.io.IOException;
import java.time.LocalDateTime;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/admin")
@RequiredArgsConstructor
public class AdminStatsController {

    private final RestTemplate restTemplate;
    private final ReportPdfService reportPdfService; // ✎ AJOUT V4

    @Value("${services.user-service.url}")
    private String userServiceUrl;

    @Value("${services.tutor-service.url}")
    private String tutorServiceUrl;

    @Value("${services.booking-service.url}")
    private String bookingServiceUrl;

    @Value("${services.notification-service.url}")
    private String notificationServiceUrl;

    @GetMapping("/stats")
    public ResponseEntity<Map<String, Object>> getAdminStats() {
        Map<String, Object> stats = new HashMap<>();

        stats.put("totalUsers",        fetchCount(userServiceUrl         + "/api/admin/stats/users"));
        stats.put("activeTutors",      fetchCount(tutorServiceUrl        + "/api/admin/stats/tutors/active"));
        stats.put("pendingDocuments",  fetchCount(tutorServiceUrl        + "/api/admin/stats/documents/pending"));
        stats.put("activeGroups",      fetchCount(tutorServiceUrl        + "/api/admin/stats/groups/active"));
        stats.put("totalBookings",     fetchCount(bookingServiceUrl      + "/api/admin/stats/bookings"));
        stats.put("unresolvedReports", fetchCount(notificationServiceUrl + "/api/admin/stats/reports"));

        return ResponseEntity.ok(stats);
    }

    // ✎ AJOUT — alias attendu par le frontend dashboard admin
    @GetMapping("/dashboard/stats")
    public ResponseEntity<Map<String, Object>> getDashboardStats() {
        return getAdminStats();
    }

    // ✎ AJOUT — alerte simple basée sur les documents en attente
    // (à enrichir plus tard avec de vraies règles métier)
    @GetMapping("/dashboard/alerts")
    public ResponseEntity<Map<String, Object>> getDashboardAlerts() {
        Map<String, Object> stats = getAdminStats().getBody();
        Map<String, Object> alerts = new HashMap<>();
        alerts.put("pendingDocuments", stats.get("pendingDocuments"));
        alerts.put("hasAlerts", ((Long) stats.getOrDefault("pendingDocuments", 0L)) > 0);
        return ResponseEntity.ok(alerts);
    }

    // ✎ AJOUT — inscriptions récentes (proxy vers user-service)
    @GetMapping("/dashboard/registrations/recent")
    public ResponseEntity<List> getRecentRegistrations() {
        List recent = restTemplate.getForObject(
                userServiceUrl + "/api/admin/stats/users/recent", List.class);
        return ResponseEntity.ok(recent);
    }

    // ✎ AJOUT — inscriptions mensuelles (proxy vers user-service)
    @GetMapping("/dashboard/monthly")
    public ResponseEntity<Map> getMonthlyStats() {
        Map monthly = restTemplate.getForObject(
                userServiceUrl + "/api/admin/stats/users/monthly", Map.class);
        return ResponseEntity.ok(monthly);
    }
    // ✎ AJOUT — réutilise l'agrégation mensuelle des inscriptions comme
    // données de graphique par défaut (à enrichir plus tard avec les
    // réservations mensuelles si besoin d'un graphique plus complet)
    @GetMapping("/reports/chart")
    public ResponseEntity<Map> getReportsChart() {
        return getMonthlyStats();
    }

    // ✎ AJOUT — répartition par matière (proxy vers tutor-service)
    @GetMapping("/reports/subjects")
    public ResponseEntity<Map> getSubjectsReport() {
        Map result = restTemplate.getForObject(
                tutorServiceUrl + "/api/admin/stats/subjects/distribution", Map.class);
        return ResponseEntity.ok(result);
    }

    // ✎ AJOUT — répartition par ville (proxy vers tutor-service)
    @GetMapping("/reports/quartiers")
    public ResponseEntity<Map> getQuartiersReport() {
        Map result = restTemplate.getForObject(
                tutorServiceUrl + "/api/admin/stats/quartiers/distribution", Map.class);
        return ResponseEntity.ok(result);
    }
    // ✎ FIX — alias attendu par adminReportsService.ts (getStats)
    @GetMapping("/reports/stats")
    public ResponseEntity<Map<String, Object>> getReportsStats() {
        return getAdminStats();
    }

    // ✎ FIX — alias attendu par adminReportsService.ts (exportReport)
    @GetMapping("/reports/export")
    public ResponseEntity<byte[]> exportReport() throws IOException {
        return downloadReportPdf();
    }

    // ============================================================
    // ✎ AJOUT V4 — GET /api/admin/reports/generate
    // Réutilise l'agrégation existante + horodatage ("📊 Générer rapport")
    // ============================================================
    @GetMapping("/reports/generate")
    public ResponseEntity<Map<String, Object>> generateReport() {
        Map<String, Object> stats = getAdminStats().getBody();
        Map<String, Object> report = new HashMap<>(stats);
        report.put("generatedAt", LocalDateTime.now().toString());
        return ResponseEntity.ok(report);
    }

    // ============================================================
    // ✎ AJOUT V4 — GET /api/admin/reports/download
    // Renvoie un PDF téléchargeable ("⬇ Télécharger PDF")
    // ============================================================
    @GetMapping("/reports/download")
    public ResponseEntity<byte[]> downloadReportPdf() throws IOException {
        Map<String, Object> stats = getAdminStats().getBody();
        byte[] pdf = reportPdfService.buildReportPdf(stats);

        return ResponseEntity.ok()
                .header("Content-Type", "application/pdf")
                .header("Content-Disposition", "attachment; filename=\"rapport-tutorlink.pdf\"")
                .body(pdf);
    }

    @SuppressWarnings("unchecked")
    private Long fetchCount(String url) {
        try {
            Map<String, Object> response = restTemplate.getForObject(url, Map.class);
            if (response != null && response.containsKey("count")) {
                Object val = response.get("count");
                if (val instanceof Number n) return n.longValue();
            }
        } catch (Exception e) {
            System.err.println("[AdminStats] Service inaccessible : " + url + " — " + e.getMessage());
        }
        return 0L;
    }
}