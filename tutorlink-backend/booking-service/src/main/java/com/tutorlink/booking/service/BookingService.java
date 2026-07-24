package com.tutorlink.booking.service;

import com.tutorlink.booking.dto.*;
import com.tutorlink.booking.entity.Booking;
import com.tutorlink.booking.enums.BookingStatus;
import com.tutorlink.booking.enums.PaymentStatus;
import com.tutorlink.booking.exception.BookingNotFoundException;
import com.tutorlink.booking.feign.NotificationServiceClient;
import com.tutorlink.booking.repository.BookingRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;
import com.tutorlink.booking.client.MtnMomoClient;
import com.tutorlink.booking.feign.TutorServiceClient;
import com.tutorlink.booking.feign.UserServiceClient;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;

@Service
@RequiredArgsConstructor
public class BookingService {

    private final BookingRepository bookingRepository;
    private final NotificationServiceClient notificationServiceClient;
    private final TutorServiceClient tutorServiceClient;
    private final MtnMomoClient mtnMomoClient;
    private final OrangeMoneyService orangeMoneyService;
    private final UserServiceClient userServiceClient;

    // ✎ AJOUT — Liste admin paginée/filtrée de toutes les réservations
    public Page<BookingResponse> getAllBookingsAdmin(BookingStatus status, int page, int size) {
        Pageable pageable = PageRequest.of(page, size);
        Page<Booking> bookings = (status != null)
                ? bookingRepository.findByStatus(status, pageable)
                : bookingRepository.findAll(pageable);
        return bookings.map(this::toResponse);
    }

    // ── Créer une réservation ──────────────────────────────────────────────
    // ── Créer une réservation ──────────────────────────────────────────────
    public BookingResponse createBooking(BookingRequest request) {
        Integer amount = computeAmount(request.getTutorId(), request.getDuration()); // ✎ AJOUT V4

        Booking booking = Booking.builder()
                .studentId(request.getStudentId())
                .tutorId(request.getTutorId())
                .subject(request.getSubject())
                .level(request.getLevel())
                .scheduledDate(request.getScheduledDate())
                .startTime(request.getStartTime())
                .duration(request.getDuration())
                .location(request.getLocation())
                .studentNote(request.getStudentNote())
                .paymentMethod(request.getPaymentMethod())
                .amount(amount) // ✎ AJOUT V4
                .build();

        Booking saved = bookingRepository.save(booking);

        // Notifier le répétiteur
        try {
            Map<String, Object> notif = new HashMap<>();
            notif.put("userId", request.getTutorId());
            notif.put("type", "BOOKING_RECEIVED");
            notif.put("title", "Nouvelle demande de réservation");
            notif.put("content", "Un élève a demandé une séance en " + request.getSubject());
            notificationServiceClient.sendNotification(notif);
        } catch (Exception ignored) {}

        return toResponse(saved);
    }

    // ============================================================
    // ✎ AJOUT V4 : computeAmount()
    // Calcule le montant en interrogeant tutor-service (jamais confié
    // au frontend, pour éviter qu'un élève modifie le prix)
    // ============================================================
    private Integer computeAmount(Long tutorId, Integer durationMinutes) {
        try {
            Map<String, Object> tutor = tutorServiceClient.getTutorById(tutorId);
            Object rateObj = tutor.get("hourlyRate");
            int hourlyRate = rateObj != null ? ((Number) rateObj).intValue() : 0;
            return Math.round(hourlyRate * (durationMinutes / 60f));
        } catch (Exception e) {
            System.out.println("[WARNING] Impossible de récupérer le tarif du répétiteur : " + e.getMessage());
            return null;
        }
    }

    // ── Récupérer une réservation par ID ──────────────────────────────────
    public BookingResponse getBookingById(Long bookingId) {
        Booking booking = bookingRepository.findById(bookingId)
                .orElseThrow(() -> new BookingNotFoundException(bookingId));
        return toResponse(booking);
    }

    // ── Réservations d'un élève ────────────────────────────────────────────
    public List<BookingResponse> getBookingsByStudent(Long studentId, BookingStatus status) {
        List<Booking> bookings = (status != null)
                ? bookingRepository.findByStudentIdAndStatus(studentId, status)
                : bookingRepository.findByStudentId(studentId);
        return bookings.stream().map(this::toResponse).collect(Collectors.toList());
    }

    // ── Séances à venir d'un élève ────────────────────────────────────────
    public List<BookingResponse> getUpcomingByStudent(Long studentId) {
        return bookingRepository
                .findByStudentIdAndScheduledDateAfter(studentId, LocalDate.now())
                .stream()
                .filter(b -> b.getStatus() == BookingStatus.CONFIRMED)
                .map(this::toResponse)
                .collect(Collectors.toList());
    }

    // ── Stats dashboard élève ─────────────────────────────────────────────
    public BookingStatsResponse getStudentStats(Long studentId) {
        long total = bookingRepository.findByStudentId(studentId).size();
        long upcoming = bookingRepository
                .findByStudentIdAndScheduledDateAfter(studentId, LocalDate.now())
                .stream().filter(b -> b.getStatus() == BookingStatus.CONFIRMED).count();
        long completed = bookingRepository.countByStudentIdAndStatus(studentId, BookingStatus.COMPLETED);
        long cancelled = bookingRepository.countByStudentIdAndStatus(studentId, BookingStatus.CANCELLED);
        long tutorsContacted = bookingRepository.countDistinctTutorIdByStudentId(studentId);

        return new BookingStatsResponse(total, upcoming, completed, cancelled, tutorsContacted);
    }
    // ✎ AJOUT — historique des paiements d'un étudiant
    public List<BookingResponse> getStudentPayments(Long studentId) {
        return bookingRepository.findByStudentIdAndPaymentStatus(studentId, PaymentStatus.PAID)
                .stream().map(this::toResponse).collect(Collectors.toList());
    }
    // ✎ FIX — GET /api/bookings/student/{userId}/payments/stats
    public StudentPaymentStatsResponse getStudentPaymentStats(Long studentId) {
        List<Booking> paid = bookingRepository.findByStudentIdAndPaymentStatus(studentId, PaymentStatus.PAID);
        long totalSpent = paid.stream().mapToLong(b -> b.getAmount() != null ? b.getAmount() : 0).sum();
        long pendingAmount = bookingRepository.findByStudentIdAndPaymentStatus(studentId, PaymentStatus.PENDING)
                .stream().mapToLong(b -> b.getAmount() != null ? b.getAmount() : 0).sum();
        long avg = paid.isEmpty() ? 0 : totalSpent / paid.size();
        return new StudentPaymentStatsResponse(totalSpent, paid.size(), pendingAmount, avg);
    }
    // ✎ AJOUT — GET /api/bookings/{bookingId}/receipt — génère un reçu texte
    // pour un paiement. (Note : reçu texte simple pour l'instant ; pour un
    // vrai PDF il faudra ajouter une lib type Apache PDFBox au pom.xml.)
    public byte[] generateReceipt(Long bookingId) {
        Booking booking = bookingRepository.findById(bookingId)
                .orElseThrow(() -> new BookingNotFoundException(bookingId));

        String receipt = """
                ===============================
                REÇU DE PAIEMENT — TutorLink
                ===============================
                Réservation n°: %d
                Matière: %s (%s)
                Date de la séance: %s à %s
                Durée: %d min
                Montant: %s FCFA
                Méthode de paiement: %s
                Statut du paiement: %s
                Émis le: %s
                ===============================
                """.formatted(
                        booking.getId(),
                        booking.getSubject(),
                        booking.getLevel(),
                        booking.getScheduledDate(),
                        booking.getStartTime(),
                        booking.getDuration(),
                        booking.getAmount() != null ? booking.getAmount().toString() : "N/A",
                        booking.getPaymentMethod(),
                        booking.getPaymentStatus(),
                        java.time.LocalDateTime.now()
                );

        return receipt.getBytes(java.nio.charset.StandardCharsets.UTF_8);
    }
    // ✎ AJOUT — le tuteur note une séance terminée (0 à 20)
    public BookingResponse gradeBooking(Long bookingId, Integer grade) {
        if (grade == null || grade < 0 || grade > 20) {
            throw new IllegalArgumentException("La note doit être comprise entre 0 et 20");
        }
        Booking booking = bookingRepository.findById(bookingId)
                .orElseThrow(() -> new BookingNotFoundException(bookingId));
        if (booking.getStatus() != BookingStatus.COMPLETED) {
            throw new IllegalStateException("Seule une séance terminée peut être notée");
        }
        booking.setGrade(grade);
        return toResponse(bookingRepository.save(booking));
    }

    // ✎ AJOUT — GET /api/bookings/student/{userId}/progress — moyenne par matière
    public List<Map<String, Object>> getStudentProgress(Long studentId) {
        List<Booking> graded = bookingRepository.findByStudentId(studentId).stream()
                .filter(b -> b.getStatus() == BookingStatus.COMPLETED && b.getGrade() != null)
                .collect(Collectors.toList());

        Map<String, List<Integer>> gradesBySubject = new HashMap<>();
        for (Booking b : graded) {
            gradesBySubject.computeIfAbsent(b.getSubject(), k -> new java.util.ArrayList<>())
                    .add(b.getGrade());
        }

        return gradesBySubject.entrySet().stream().map(entry -> {
            double avg = entry.getValue().stream().mapToInt(Integer::intValue).average().orElse(0.0);
            Map<String, Object> row = new HashMap<>();
            row.put("subject", entry.getKey());
            row.put("score", Math.round(avg * 10.0) / 10.0);
            return row;
        }).collect(Collectors.toList());
    }

    // ── Réservations d'un répétiteur ──────────────────────────────────────
    public List<BookingResponse> getBookingsByTutor(Long tutorId, BookingStatus status) {
        List<Booking> bookings = (status != null)
                ? bookingRepository.findByTutorIdAndStatus(tutorId, status)
                : bookingRepository.findByTutorId(tutorId);
        return bookings.stream().map(this::toResponse).collect(Collectors.toList());
    }
    // ✎ FIX — convertit le code période frontend en date de début
    private LocalDate resolvePeriodStart(String period) {
        if (period == null) return LocalDate.MIN;
        return switch (period) {
            case "7j"  -> LocalDate.now().minusDays(7);
            case "30j" -> LocalDate.now().minusDays(30);
            case "3m"  -> LocalDate.now().minusMonths(3);
            case "6m"  -> LocalDate.now().minusMonths(6);
            case "1an" -> LocalDate.now().minusYears(1);
            default    -> LocalDate.MIN;
        };
    }
    private static final double COMMISSION_RATE = 0.10;

    public RevenueStatsResponse getTutorRevenueStats(Long tutorId, String period) {
        LocalDate start = resolvePeriodStart(period);

        List<Booking> completed = bookingRepository.findByTutorIdAndStatus(tutorId, BookingStatus.COMPLETED)
                .stream().filter(b -> b.getScheduledDate() != null && !b.getScheduledDate().isBefore(start))
                .collect(Collectors.toList());

        long totalBrut = completed.stream().mapToLong(b -> b.getAmount() != null ? b.getAmount() : 0).sum();
        long totalCommission = Math.round(totalBrut * COMMISSION_RATE);
        long totalNet = totalBrut - totalCommission;

        List<Booking> pending = bookingRepository.findByTutorIdAndPaymentStatus(tutorId, PaymentStatus.PENDING)
                .stream().filter(b -> b.getScheduledDate() != null && !b.getScheduledDate().isBefore(start))
                .collect(Collectors.toList());
        long pendingRevenue = pending.stream().mapToLong(b -> b.getAmount() != null ? b.getAmount() : 0).sum();

        // Période précédente de même longueur, pour l'évolution
        long lengthDays = java.time.temporal.ChronoUnit.DAYS.between(start, LocalDate.now());
        LocalDate prevStart = start.equals(LocalDate.MIN) ? LocalDate.MIN : start.minusDays(lengthDays);
        LocalDate prevEnd = start;
        long prevBrut = bookingRepository.findByTutorIdAndStatus(tutorId, BookingStatus.COMPLETED).stream()
                .filter(b -> b.getScheduledDate() != null
                        && !b.getScheduledDate().isBefore(prevStart)
                        && b.getScheduledDate().isBefore(prevEnd))
                .mapToLong(b -> b.getAmount() != null ? b.getAmount() : 0).sum();
        double evolution = prevBrut == 0 ? (totalBrut > 0 ? 100.0 : 0.0)
                : Math.round(((totalBrut - prevBrut) * 1000.0 / prevBrut)) / 10.0;

        return new RevenueStatsResponse(totalBrut, totalCommission, totalNet, totalBrut, 0,
                completed.size(), pendingRevenue, evolution);
    }

    // ✎ AJOUT — liste des transactions (réservations payées) d'un tuteur
   public List<RevenueTransactionResponse> getTutorTransactions(Long tutorId, String period) {
        LocalDate start = resolvePeriodStart(period);
        return bookingRepository.findByTutorIdAndPaymentStatus(tutorId, PaymentStatus.PAID).stream()
                .filter(b -> b.getScheduledDate() != null && !b.getScheduledDate().isBefore(start))
                .map(this::toRevenueTransaction)
                .collect(Collectors.toList());
    }

    private RevenueTransactionResponse toRevenueTransaction(Booking b) {
        String studentName = "Élève";
        try {
            Map<String, Object> profile = userServiceClient.getPublicProfile(b.getStudentId());
            studentName = profile.get("firstName") + " " + profile.get("lastName");
        } catch (Exception ignored) {}

        long amount = b.getAmount() != null ? b.getAmount() : 0;
        long commission = Math.round(amount * COMMISSION_RATE);

        return RevenueTransactionResponse.builder()
                .id(b.getId())
                .reference("VRS-" + b.getScheduledDate().getYear() + "-" + String.format("%03d", b.getId()))
                .studentName(studentName)
                .type("individuel")
                .subject(b.getSubject())
                .date(b.getScheduledDate())
                .amount(amount)
                .commission(commission)
                .netAmount(amount - commission)
                .operator(b.getPaymentMethod() == com.tutorlink.booking.enums.PaymentMethod.MTN_MOMO ? "MTN" : "Orange")
                .transactionId(b.getMtnReferenceId() != null ? b.getMtnReferenceId() : b.getOrangeOrderId())
                .status(b.getPaymentStatus() == PaymentStatus.REFUNDED ? "rembourse" : "recu")
                .build();
    }
    // ✎ AJOUT — revenus groupés par mois, pour le graphique dashboard tuteur
   public List<MonthlyRevenuePoint> getTutorRevenueChart(Long tutorId, String period) {
    LocalDate start = resolvePeriodStart(period);   // ✎ FIX — filtre période ajouté

    List<Booking> completed = bookingRepository.findByTutorIdAndStatus(tutorId, BookingStatus.COMPLETED)
            .stream()
            .filter(b -> b.getScheduledDate() != null && !b.getScheduledDate().isBefore(start))
            .collect(Collectors.toList());

    Map<String, Long> byMonth = completed.stream()
            .collect(Collectors.groupingBy(
                    b -> b.getScheduledDate().getYear() + "-" + String.format("%02d", b.getScheduledDate().getMonthValue()),
                    Collectors.summingLong(b -> b.getAmount() != null ? b.getAmount() : 0)
            ));

    return byMonth.entrySet().stream()
            .sorted(Map.Entry.comparingByKey())
            .map(e -> new MonthlyRevenuePoint(e.getKey(), e.getValue()))
            .collect(Collectors.toList());
}

    // ✎ AJOUT — export CSV des transactions d'un tuteur (même style que exportBookingsToCsv)
   public String exportTutorRevenueCsv(Long tutorId, String period) {
        LocalDate start = resolvePeriodStart(period);
        List<Booking> bookings = bookingRepository.findByTutorId(tutorId).stream()
                .filter(b -> b.getScheduledDate() != null && !b.getScheduledDate().isBefore(start))
                .collect(Collectors.toList());
        StringBuilder csv = new StringBuilder();
        csv.append("ID,Eleve,Matiere,Date,Statut,StatutPaiement,Montant\n");

        for (Booking b : bookings) {
            csv.append(b.getId()).append(",")
               .append(b.getStudentId()).append(",")
               .append(escapeCsv(b.getSubject())).append(",")
               .append(b.getScheduledDate()).append(",")
               .append(b.getStatus()).append(",")
               .append(b.getPaymentStatus()).append(",")
               .append(b.getAmount() != null ? b.getAmount() : "").append("\n");
        }

        return csv.toString();
    }

    // ── Changer le statut d'une réservation ───────────────────────────────
    public BookingResponse updateStatus(Long bookingId, BookingStatusRequest request) {
        Booking booking = bookingRepository.findById(bookingId)
                .orElseThrow(() -> new BookingNotFoundException(bookingId));

        booking.setStatus(request.getStatus());
        if (request.getTutorNote() != null) {
            booking.setTutorNote(request.getTutorNote());
        }

        // ✎ V4 : le paiement n'est plus simulé ici — il passe désormais par
        // /pay/mtn ou /pay/orange/*. On garde uniquement le remboursement
        // automatique en cas d'annulation d'une séance déjà payée.
        if (request.getStatus() == BookingStatus.CANCELLED
                && booking.getPaymentStatus() == PaymentStatus.PAID) {
            booking.setPaymentStatus(PaymentStatus.REFUNDED);
        }

        Booking updated = bookingRepository.save(booking);

        // Notifier l'élève
        try {
            String type = request.getStatus() == BookingStatus.CONFIRMED
                    ? "BOOKING_CONFIRMED" : "BOOKING_CANCELLED";
            Map<String, Object> notif = new HashMap<>();
            notif.put("userId", booking.getStudentId());
            notif.put("type", type);
            notif.put("title", "Mise à jour de votre réservation");
            notif.put("content", "Votre réservation est maintenant : " + request.getStatus());
            notificationServiceClient.sendNotification(notif);
        } catch (Exception ignored) {}

        return toResponse(updated);
    }

    // ── Annuler une réservation ───────────────────────────────────────────
    public void cancelBooking(Long bookingId) {
        Booking booking = bookingRepository.findById(bookingId)
                .orElseThrow(() -> new BookingNotFoundException(bookingId));
        booking.setStatus(BookingStatus.CANCELLED);
        booking.setPaymentStatus(PaymentStatus.REFUNDED);
        bookingRepository.save(booking);
    }
    // ✎ AJOUT — marque le paiement comme remboursé sans changer le statut
    // de la réservation (contrairement à cancelBooking qui fait les deux).
    public void refundBooking(Long bookingId) {
        Booking booking = bookingRepository.findById(bookingId)
                .orElseThrow(() -> new BookingNotFoundException(bookingId));
        booking.setPaymentStatus(PaymentStatus.REFUNDED);
        bookingRepository.save(booking);
    }
    // ── Paiement réservation — MTN MoMo (synchrone) ─────────────────────────
    public BookingResponse payBookingMtn(Long bookingId, String phoneNumber) {
    Booking booking = bookingRepository.findById(bookingId)
            .orElseThrow(() -> new BookingNotFoundException(bookingId));

    validatePayable(booking);

    String referenceId = mtnMomoClient.requestPayment(
            phoneNumber,
            booking.getAmount(),
            "BOOKING-" + bookingId
    );

    String status = mtnMomoClient.checkPaymentStatus(referenceId);

    if (!"SUCCESSFUL".equals(status)) {
        throw new IllegalStateException("Paiement MTN non confirmé, statut : " + status);
    }

    booking.setMtnReferenceId(referenceId);   // ✎ FIX — manquait, nécessaire pour transactionId
    booking.setPaymentStatus(PaymentStatus.PAID);
    Booking updated = bookingRepository.save(booking);
    notifyPaymentReceived(booking, "MTN Mobile Money");
    return toResponse(updated);
}

    // ── Paiement réservation — Orange Money : étape 1 (init) ────────────────
    public Map<String, String> initOrangeBookingPayment(Long bookingId) {
        Booking booking = bookingRepository.findById(bookingId)
                .orElseThrow(() -> new BookingNotFoundException(bookingId));

        validatePayable(booking);

        String orderId = "BOOKING-" + bookingId + "-" + System.currentTimeMillis();
        Map<String, String> result = orangeMoneyService.initierPaiement(booking.getAmount(), orderId);

        booking.setOrangeOrderId(orderId);
        booking.setOrangePayToken(result.get("payToken"));
        bookingRepository.save(booking);

        result.put("orderId", orderId);
        result.put("bookingId", String.valueOf(bookingId));
        return result;
    }

    // ── Paiement réservation — Orange Money : étape 2 (confirm) ─────────────
    public BookingResponse confirmOrangeBookingPayment(Long bookingId, String orderId, String payToken) {
        Booking booking = bookingRepository.findById(bookingId)
                .orElseThrow(() -> new BookingNotFoundException(bookingId));

        String status = orangeMoneyService.verifierStatutPaiement(orderId, booking.getAmount(), payToken);

        if (!"SUCCESS".equals(status)) {
            throw new IllegalStateException("Paiement Orange non confirmé, statut : " + status);
        }

        booking.setPaymentStatus(PaymentStatus.PAID);
        Booking updated = bookingRepository.save(booking);
        notifyPaymentReceived(booking, "Orange Money");
        return toResponse(updated);
    }

    // ── Vérifications communes avant tout paiement ───────────────────────────
    private void validatePayable(Booking booking) {
        if (booking.getStatus() != BookingStatus.CONFIRMED) {
            throw new IllegalStateException(
                "Le paiement n'est possible qu'après confirmation du répétiteur."
            );
        }
        if (booking.getPaymentStatus() == PaymentStatus.PAID) {
            throw new IllegalStateException("Cette réservation est déjà payée.");
        }
        if (booking.getAmount() == null) {
            throw new IllegalStateException("Montant introuvable pour cette réservation.");
        }
    }

    private void notifyPaymentReceived(Booking booking, String moyenPaiement) {
        try {
            Map<String, Object> notif = new HashMap<>();
            notif.put("userId", booking.getTutorId());
            notif.put("type", "PAYMENT_RECEIVED");
            notif.put("title", "Paiement reçu");
            notif.put("content", "L'élève a payé sa séance via " + moyenPaiement + ".");
            notificationServiceClient.sendNotification(notif);
        } catch (Exception ignored) {}
    }
    // ============================================================
    // ✎ AJOUT V4 : exportBookingsToCsv()
    // Utilisée par admin-reservations ("⬇ Exporter")
    // ============================================================
    public String exportBookingsToCsv() {
        List<Booking> bookings = bookingRepository.findAll();

        StringBuilder csv = new StringBuilder();
        csv.append("ID,Eleve,Repetiteur,Matiere,Niveau,Date,Heure,Duree,Lieu,Statut,MoyenPaiement,StatutPaiement,Montant,DateCreation\n");

        for (Booking b : bookings) {
            csv.append(b.getId()).append(",")
               .append(b.getStudentId()).append(",")
               .append(b.getTutorId()).append(",")
               .append(escapeCsv(b.getSubject())).append(",")
               .append(escapeCsv(b.getLevel())).append(",")
               .append(b.getScheduledDate()).append(",")
               .append(b.getStartTime()).append(",")
               .append(b.getDuration()).append(",")
               .append(escapeCsv(b.getLocation())).append(",")
               .append(b.getStatus()).append(",")
               .append(b.getPaymentMethod()).append(",")
               .append(b.getPaymentStatus()).append(",")
               .append(b.getAmount() != null ? b.getAmount() : "").append(",")
               .append(b.getCreatedAt()).append("\n");
        }
        return csv.toString();
    }

    private String escapeCsv(String value) {
        if (value == null) return "";
        if (value.contains(",") || value.contains("\"") || value.contains("\n")) {
            return "\"" + value.replace("\"", "\"\"") + "\"";
        }
        return value;
    }

    // ── Mapper entité → DTO ───────────────────────────────────────────────
    private BookingResponse toResponse(Booking b) {
        BookingResponse res = new BookingResponse();
        res.setId(b.getId());
        res.setStudentId(b.getStudentId());
        res.setTutorId(b.getTutorId());
        res.setSubject(b.getSubject());
        res.setLevel(b.getLevel());
        res.setScheduledDate(b.getScheduledDate());
        res.setStartTime(b.getStartTime());
        res.setDuration(b.getDuration());
        res.setLocation(b.getLocation());
        res.setStatus(b.getStatus());
        res.setStudentNote(b.getStudentNote());
        res.setTutorNote(b.getTutorNote());
        res.setCreatedAt(b.getCreatedAt());
        res.setPaymentMethod(b.getPaymentMethod());
        res.setPaymentStatus(b.getPaymentStatus());
        res.setAmount(b.getAmount());
        res.setGrade(b.getGrade()); // ✎ AJOUT
        return res;
    }
}