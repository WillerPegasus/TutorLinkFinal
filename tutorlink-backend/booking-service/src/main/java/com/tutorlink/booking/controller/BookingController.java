package com.tutorlink.booking.controller;

import com.tutorlink.booking.dto.*;
import com.tutorlink.booking.enums.BookingStatus;
import com.tutorlink.booking.service.BookingService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;
import org.springframework.data.domain.Page;

@RestController
@RequestMapping("/api/bookings")
@RequiredArgsConstructor
public class BookingController {

    private final BookingService bookingService;

    // POST /api/bookings — Créer une réservation
    @PostMapping
    public ResponseEntity<BookingResponse> createBooking(@Valid @RequestBody BookingRequest request) {
        return ResponseEntity.status(HttpStatus.CREATED).body(bookingService.createBooking(request));
    }
     // ✎ AJOUT — GET /api/bookings?status=&page=&size= — Liste admin (toutes réservations)
    @GetMapping
public ResponseEntity<Page<BookingResponse>> getAllBookingsAdmin(
        @RequestParam(required = false) BookingStatus status,
        @RequestParam(defaultValue = "0") int page,
        @RequestParam(defaultValue = "20") int size) {
    return ResponseEntity.ok(bookingService.getAllBookingsAdmin(status, page, size));
}


@GetMapping("/{bookingId}")
public ResponseEntity<BookingResponse> getBookingById(@PathVariable Long bookingId) {
    return ResponseEntity.ok(bookingService.getBookingById(bookingId));
}

    // GET /api/bookings/student/{userId}?status= — Réservations d'un élève
    @GetMapping("/student/{userId}")
    public ResponseEntity<List<BookingResponse>> getBookingsByStudent(
            @PathVariable Long userId,
            @RequestParam(required = false) BookingStatus status) {
        return ResponseEntity.ok(bookingService.getBookingsByStudent(userId, status));
    }

    // GET /api/bookings/student/{userId}/upcoming — Séances à venir
    @GetMapping("/student/{userId}/upcoming")
    public ResponseEntity<List<BookingResponse>> getUpcomingByStudent(@PathVariable Long userId) {
        return ResponseEntity.ok(bookingService.getUpcomingByStudent(userId));
    }

    // GET /api/bookings/student/{userId}/stats — Stats dashboard élève
    @GetMapping("/student/{userId}/stats")
    public ResponseEntity<BookingStatsResponse> getStudentStats(@PathVariable Long userId) {
        return ResponseEntity.ok(bookingService.getStudentStats(userId));
    }
    // ✎ AJOUT — historique des paiements d'un étudiant
    @GetMapping("/student/{userId}/payments")
    public ResponseEntity<List<BookingResponse>> getStudentPayments(@PathVariable Long userId) {
        return ResponseEntity.ok(bookingService.getStudentPayments(userId));
    }
    // ✎ FIX — GET /api/bookings/student/{userId}/payments/stats
    @GetMapping("/student/{userId}/payments/stats")
    public ResponseEntity<StudentPaymentStatsResponse> getStudentPaymentStats(@PathVariable Long userId) {
        return ResponseEntity.ok(bookingService.getStudentPaymentStats(userId));
    }
    // ✎ AJOUT — GET /api/bookings/{bookingId}/receipt — reçu de paiement
    @GetMapping("/{bookingId}/receipt")
    public ResponseEntity<byte[]> getReceipt(@PathVariable Long bookingId) {
        byte[] receipt = bookingService.generateReceipt(bookingId);
        return ResponseEntity.ok()
                .header("Content-Type", "text/plain; charset=UTF-8")
                .header("Content-Disposition", "attachment; filename=\"recu-" + bookingId + ".txt\"")
                .body(receipt);
    }
    // ✎ AJOUT — PATCH /api/bookings/{bookingId}/grade — le tuteur note la séance
    @PatchMapping("/{bookingId}/grade")
    public ResponseEntity<BookingResponse> gradeBooking(
            @PathVariable Long bookingId, @RequestBody Map<String, Integer> body) {
        return ResponseEntity.ok(bookingService.gradeBooking(bookingId, body.get("grade")));
    }

    // ✎ AJOUT — GET /api/bookings/student/{userId}/progress
    @GetMapping("/student/{userId}/progress")
    public ResponseEntity<List<Map<String, Object>>> getStudentProgress(@PathVariable Long userId) {
        return ResponseEntity.ok(bookingService.getStudentProgress(userId));
    }

    // GET /api/bookings/tutor/{tutorId}?status= — Réservations d'un répétiteur
    @GetMapping("/tutor/{tutorId}")
    public ResponseEntity<List<BookingResponse>> getBookingsByTutor(
            @PathVariable Long tutorId,
            @RequestParam(required = false) BookingStatus status) {
        return ResponseEntity.ok(bookingService.getBookingsByTutor(tutorId, status));
    }

    // PATCH /api/bookings/{bookingId}/status — Changer le statut
    @PatchMapping("/{bookingId}/status")
    public ResponseEntity<BookingResponse> updateStatus(
            @PathVariable Long bookingId,
            @Valid @RequestBody BookingStatusRequest request) {
        return ResponseEntity.ok(bookingService.updateStatus(bookingId, request));
    }
    // ✎ FIX — PATCH /api/bookings/{bookingId}/accept
    // Alias explicite : le tuteur accepte une demande de cours (PENDING → CONFIRMED)
    @PatchMapping("/{bookingId}/accept")
    public ResponseEntity<BookingResponse> acceptBooking(@PathVariable Long bookingId) {
        BookingStatusRequest request = new BookingStatusRequest();
        request.setStatus(BookingStatus.CONFIRMED);
        return ResponseEntity.ok(bookingService.updateStatus(bookingId, request));
    }

    // ✎ FIX — PATCH /api/bookings/{bookingId}/refuse
    // Alias explicite : le tuteur refuse une demande de cours (PENDING → CANCELLED)
    @PatchMapping("/{bookingId}/refuse")
    public ResponseEntity<BookingResponse> refuseBooking(@PathVariable Long bookingId) {
        BookingStatusRequest request = new BookingStatusRequest();
        request.setStatus(BookingStatus.CANCELLED);
        return ResponseEntity.ok(bookingService.updateStatus(bookingId, request));
    }

    // ✎ FIX — GET /api/bookings/tutor/{tutorId}/requests
    // Alias explicite : liste des demandes en attente d'un tuteur
    // (équivalent à GET /tutor/{tutorId}?status=PENDING, mais nom clair
    // pour matcher courseRequestService.ts / tutorDashboardService.ts)
    @GetMapping("/tutor/{tutorId}/requests")
    public ResponseEntity<List<BookingResponse>> getPendingRequestsByTutor(@PathVariable Long tutorId) {
        return ResponseEntity.ok(bookingService.getBookingsByTutor(tutorId, BookingStatus.PENDING));
    }
    // ✎ AJOUT — alias admin, marque directement comme COMPLETED
    @PatchMapping("/{bookingId}/complete")
    public ResponseEntity<BookingResponse> completeBooking(@PathVariable Long bookingId) {
        BookingStatusRequest request = new BookingStatusRequest();
        request.setStatus(BookingStatus.COMPLETED);
        return ResponseEntity.ok(bookingService.updateStatus(bookingId, request));
    }

    // ✎ AJOUT — alias PATCH de la suppression, nom aligné avec le frontend admin
    @PatchMapping("/{bookingId}/cancel")
    public ResponseEntity<Void> cancelBookingPatch(@PathVariable Long bookingId) {
        bookingService.cancelBooking(bookingId);
        return ResponseEntity.noContent().build();
    }

    // ✎ AJOUT — remboursement sans annulation de la réservation
    @PostMapping("/{bookingId}/refund")
    public ResponseEntity<Void> refundBooking(@PathVariable Long bookingId) {
        bookingService.refundBooking(bookingId);
        return ResponseEntity.noContent().build();
    }
  @GetMapping("/tutor/{tutorId}/revenue/stats")
    public ResponseEntity<RevenueStatsResponse> getTutorRevenueStats(
            @PathVariable Long tutorId, @RequestParam(required = false) String period) {
        return ResponseEntity.ok(bookingService.getTutorRevenueStats(tutorId, period));
    }

    @GetMapping("/tutor/{tutorId}/revenue/transactions")
    public ResponseEntity<List<RevenueTransactionResponse>> getTutorTransactions(
            @PathVariable Long tutorId, @RequestParam(required = false) String period) {
        return ResponseEntity.ok(bookingService.getTutorTransactions(tutorId, period));
    }

    @GetMapping("/tutor/{tutorId}/revenue/chart")
    public ResponseEntity<List<MonthlyRevenuePoint>> getTutorRevenueChart(
            @PathVariable Long tutorId, @RequestParam(required = false) String period) {
        return ResponseEntity.ok(bookingService.getTutorRevenueChart(tutorId, period));
    }

    // ✎ AJOUT — export CSV des transactions d'un tuteur
    @GetMapping("/tutor/{tutorId}/revenue/export")
    public ResponseEntity<byte[]> exportTutorRevenue(@PathVariable Long tutorId, @RequestParam(required = false) String period) {
        String csv = bookingService.exportTutorRevenueCsv(tutorId, period);
        byte[] bytes = csv.getBytes(java.nio.charset.StandardCharsets.UTF_8);
        return ResponseEntity.ok()
                .header("Content-Type", "text/csv; charset=UTF-8")
                .header("Content-Disposition", "attachment; filename=\"revenus-tuteur.csv\"")
                .body(bytes);
    }
// ✎ AJOUT V4 — POST /api/bookings/{bookingId}/pay/mtn
    @PostMapping("/{bookingId}/pay/mtn")
    public ResponseEntity<BookingResponse> payMtn(
            @PathVariable Long bookingId,
            @RequestParam String phoneNumber) {
        return ResponseEntity.ok(bookingService.payBookingMtn(bookingId, phoneNumber));
    }

    // ✎ AJOUT V4 — POST /api/bookings/{bookingId}/pay/orange/init
    @PostMapping("/{bookingId}/pay/orange/init")
    public ResponseEntity<Map<String, String>> initOrangePayment(@PathVariable Long bookingId) {
        return ResponseEntity.ok(bookingService.initOrangeBookingPayment(bookingId));
    }

    // ✎ AJOUT V4 — POST /api/bookings/{bookingId}/pay/orange/confirm
    @PostMapping("/{bookingId}/pay/orange/confirm")
    public ResponseEntity<BookingResponse> confirmOrangePayment(
            @PathVariable Long bookingId,
            @RequestParam String orderId,
            @RequestParam String payToken) {
        return ResponseEntity.ok(bookingService.confirmOrangeBookingPayment(bookingId, orderId, payToken));
    }
    // ✎ AJOUT V4 — GET /api/bookings/export
    @GetMapping("/export")
    public ResponseEntity<byte[]> exportBookingsCsv() {
        String csv = bookingService.exportBookingsToCsv();
        byte[] bytes = csv.getBytes(java.nio.charset.StandardCharsets.UTF_8);
        return ResponseEntity.ok()
                .header("Content-Type", "text/csv; charset=UTF-8")
                .header("Content-Disposition", "attachment; filename=\"reservations.csv\"")
                .body(bytes);
    }
    // DELETE /api/bookings/{bookingId} — Annuler
    @DeleteMapping("/{bookingId}")
    public ResponseEntity<Void> cancelBooking(@PathVariable Long bookingId) {
        bookingService.cancelBooking(bookingId);
        return ResponseEntity.noContent().build();
    }
}