package com.tutorlink.notification.service;

import com.tutorlink.notification.dto.NotificationRequest;
import com.tutorlink.notification.dto.NotificationResponse;
import com.tutorlink.notification.dto.SystemNotificationRequest;
import com.tutorlink.notification.entity.Notification;
import com.tutorlink.notification.entity.Notification.NotificationType;
import com.tutorlink.notification.exception.NotificationNotFoundException;
import com.tutorlink.notification.repository.NotificationRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@RequiredArgsConstructor
@Slf4j
public class NotificationService {

    private final NotificationRepository repository;
    private final EmailService emailService;

    // ─── T6 : Envoyer une notification ───────────────────────────────────────

    @Transactional
    public NotificationResponse sendNotification(NotificationRequest request) {
        Notification notification = Notification.builder()
                .userId(request.getUserId())
                .type(request.getType())
                .title(request.getTitle())
                .content(request.getContent())
                .build();

        Notification saved = repository.save(notification);
        log.info("Notification sauvegardée [id={}] pour userId={}", saved.getId(), saved.getUserId());

        // Si une adresse email est fournie, envoyer aussi un email
        if (request.getEmail() != null && !request.getEmail().isBlank()) {
            dispatchEmail(request);
        }

        return NotificationResponse.from(saved);
    }

    /** Aiguille vers le bon template email selon le type */
    private void dispatchEmail(NotificationRequest request) {
        switch (request.getType()) {
            case OTP ->
                emailService.sendOtpEmail(request.getEmail(), request.getContent());
            case BOOKING_CONFIRMED ->
                emailService.sendBookingConfirmationEmail(request.getEmail(), request.getContent());
            case BOOKING_CANCELLED ->
                emailService.sendBookingCancelledEmail(request.getEmail(), request.getContent());
            case REMINDER ->
                emailService.sendReminderEmail(request.getEmail(), request.getContent());
            default ->
                emailService.sendSimpleEmail(
                    com.tutorlink.notification.dto.EmailRequest.builder()
                        .to(request.getEmail())
                        .subject(request.getTitle())
                        .body(request.getContent())
                        .build()
                );
        }
    }

    // ─── T6 : Récupérer les notifications d'un user ──────────────────────────

    public List<NotificationResponse> getNotificationsByUser(Long userId) {
        return repository.findByUserIdOrderByCreatedAtDesc(userId)
                .stream()
                .map(NotificationResponse::from)
                .toList();
    }

    // ─── T6 : Marquer une notification comme lue ─────────────────────────────

    @Transactional
    public NotificationResponse markAsRead(Long notifId) {
        Notification notif = repository.findById(notifId)
                .orElseThrow(() -> new NotificationNotFoundException("Notification introuvable : id=" + notifId));
        notif.setIsRead(true);
        return NotificationResponse.from(repository.save(notif));
    }

    // ─── T6 : Tout marquer comme lu pour un user ─────────────────────────────

    @Transactional
    public void markAllAsRead(Long userId) {
        List<Notification> unread = repository.findByUserIdAndIsReadFalse(userId);
        unread.forEach(n -> n.setIsRead(true));
        repository.saveAll(unread);
        log.info("{} notifications marquées lues pour userId={}", unread.size(), userId);
    }

    // ─── T6 : Nombre de non lues (badge) ─────────────────────────────────────

    public long getUnreadCount(Long userId) {
        return repository.countByUserIdAndIsReadFalse(userId);
    }
    // ✎ AJOUT V4 : compteur total pour le dashboard admin
    public long getTotalNotificationsCount() {
        return repository.count();
    }

    // ─── T6 : Notification système (admin → plusieurs users) ─────────────────

    @Transactional
    public void sendSystemNotification(SystemNotificationRequest request) {
        List<Notification> notifications = request.getUserIds().stream()
                .map(uid -> Notification.builder()
                        .userId(uid)
                        .type(NotificationType.SYSTEM)
                        .title(request.getTitle())
                        .content(request.getContent())
                        .build())
                .toList();
        repository.saveAll(notifications);
        log.info("Notification système envoyée à {} utilisateurs", notifications.size());
    }
}