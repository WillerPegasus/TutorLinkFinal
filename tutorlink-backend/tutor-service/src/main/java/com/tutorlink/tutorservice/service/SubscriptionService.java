package com.tutorlink.tutorservice.service;

import com.tutorlink.tutorservice.client.MtnMomoClient;
import com.tutorlink.tutorservice.client.OrangeMomoClient;
import com.tutorlink.tutorservice.entity.SubscriptionPayment;
import com.tutorlink.tutorservice.entity.TutorSubscription;
import com.tutorlink.tutorservice.entity.TutorSubscription.SubscriptionStatus;
import com.tutorlink.tutorservice.repository.SubscriptionPaymentRepository;
import com.tutorlink.tutorservice.repository.TutorSubscriptionRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.time.temporal.ChronoUnit;
import java.util.List;
import java.util.Map;

@Service
@RequiredArgsConstructor
public class SubscriptionService {

// ✎ FIX — corrigé de 5000 à 3000 pour matcher le tarif affiché partout dans l'UI
    private static final int MONTHLY_PRICE = 3000;
    private static final int SUBSCRIPTION_DAYS = 30;
    private static final int TRIAL_DAYS = 60;

    private final TutorSubscriptionRepository subscriptionRepository;
    private final SubscriptionPaymentRepository paymentRepository;
    private final MtnMomoClient mtnMomoClient;
    private final OrangeMomoClient orangeMomoClient;

   private TutorSubscription getOrCreate(Long tutorId) {
        return subscriptionRepository.findByTutorId(tutorId)
                .orElseGet(() -> subscriptionRepository.save(
                        TutorSubscription.builder()
                                .tutorId(tutorId)
                                .status(TutorSubscription.SubscriptionStatus.TRIAL)
                                .trialStartDate(LocalDate.now())
                                .trialEndDate(LocalDate.now().plusDays(TRIAL_DAYS))
                                .build()));
    }

   public TutorSubscription getSubscription(Long tutorId) {
        TutorSubscription sub = getOrCreate(tutorId);
        boolean trialEnded = sub.getStatus() == SubscriptionStatus.TRIAL
                && sub.getTrialEndDate() != null
                && sub.getTrialEndDate().isBefore(LocalDate.now());
        boolean subscriptionEnded = sub.getStatus() == SubscriptionStatus.ACTIVE
                && sub.getExpiryDate() != null
                && sub.getExpiryDate().isBefore(LocalDate.now());
        if (trialEnded || subscriptionEnded) {
            sub.setStatus(SubscriptionStatus.EXPIRED);
            subscriptionRepository.save(sub);
        }
        return sub;
    }

    public List<SubscriptionPayment> getPaymentHistory(Long tutorId) {
        return paymentRepository.findByTutorIdOrderByPaidAtDesc(tutorId);
    }

    public TutorSubscription payMtn(Long tutorId, String phoneNumber) {
        String referenceId = mtnMomoClient.requestPayment(phoneNumber, MONTHLY_PRICE, "SUB-" + tutorId);
        String status = mtnMomoClient.checkPaymentStatus(referenceId);

        if (!"SUCCESSFUL".equals(status)) {
            throw new RuntimeException("Paiement MTN MoMo échoué");
        }
        return activateSubscription(tutorId, "MTN");
    }

    public Map<String, String> initOrangePayment(Long tutorId) {
        String orderId = "SUB-" + tutorId + "-" + System.currentTimeMillis();
        Map<String, String> result = orangeMomoClient.initPayment(
                MONTHLY_PRICE, orderId, "Abonnement tuteur TutorLink");
        result.put("orderId", orderId);
        result.put("tutorId", String.valueOf(tutorId));
        return result;
    }

    public TutorSubscription confirmOrangePayment(Long tutorId, String orderId, String payToken) {
        String status = orangeMomoClient.checkPaymentStatus(orderId, MONTHLY_PRICE, payToken);
        if (!"SUCCESS".equalsIgnoreCase(status)) {
            throw new RuntimeException("Paiement Orange Money échoué");
        }
        return activateSubscription(tutorId, "Orange");
    }

    private TutorSubscription activateSubscription(Long tutorId, String operator) {
        TutorSubscription sub = getOrCreate(tutorId);
        LocalDate base = (sub.getExpiryDate() != null && sub.getExpiryDate().isAfter(LocalDate.now()))
                ? sub.getExpiryDate() : LocalDate.now();
        sub.setExpiryDate(base.plusDays(SUBSCRIPTION_DAYS));
        sub.setStatus(SubscriptionStatus.ACTIVE);
        subscriptionRepository.save(sub);

        paymentRepository.save(SubscriptionPayment.builder()
                .tutorId(tutorId).operator(operator).amount(MONTHLY_PRICE).build());

        return sub;
    }

    public TutorSubscription toggleAutoRenew(Long tutorId, boolean enabled) {
        TutorSubscription sub = getOrCreate(tutorId);
        sub.setAutoRenew(enabled);
        return subscriptionRepository.save(sub);
    }

   public Map<String, Object> getNotifications(Long tutorId) {
        TutorSubscription sub = getSubscription(tutorId);
        boolean isTrial = sub.getStatus() == SubscriptionStatus.TRIAL;
        LocalDate refDate = isTrial ? sub.getTrialEndDate() : sub.getExpiryDate();
        long daysLeft = refDate == null ? -1 :
                ChronoUnit.DAYS.between(LocalDate.now(), refDate);
        boolean expiringSoon = daysLeft >= 0 && daysLeft <= 7;
        return Map.of(
                "daysRemaining", daysLeft,
                "expiringSoon", expiringSoon,
                "isTrialPeriod", isTrial,
                "status", sub.getStatus()
        );
    }

    // ── Admin ────────────────────────────────────────────────────────────
    public List<TutorSubscription> getAllSubscriptions() {
        return subscriptionRepository.findAll();
    }

    public TutorSubscription adminSetStatus(Long tutorId, SubscriptionStatus status) {
        TutorSubscription sub = getOrCreate(tutorId);
        sub.setStatus(status);
        return subscriptionRepository.save(sub);
    }
}