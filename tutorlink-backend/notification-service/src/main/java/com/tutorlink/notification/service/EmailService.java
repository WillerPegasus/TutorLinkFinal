package com.tutorlink.notification.service;

import com.tutorlink.notification.dto.EmailRequest;
import jakarta.mail.MessagingException;
import jakarta.mail.internet.MimeMessage;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.MimeMessageHelper;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
@Slf4j
public class EmailService {

    private final JavaMailSender mailSender;

    // ─── T5 : Envoi générique ─────────────────────────────────────────────────

    public void sendSimpleEmail(EmailRequest request) {
        try {
            MimeMessage message = mailSender.createMimeMessage();
            MimeMessageHelper helper = new MimeMessageHelper(message, true, "UTF-8");
            helper.setTo(request.getTo());
            helper.setSubject(request.getSubject());
            helper.setText(request.getBody(), true); // true = HTML
            mailSender.send(message);
            log.info("Email envoyé à {}", request.getTo());
        } catch (MessagingException e) {
            log.error("Erreur envoi email à {} : {}", request.getTo(), e.getMessage());
        }
    }

    // ─── T5 : Email OTP ──────────────────────────────────────────────────────

    public void sendOtpEmail(String to, String otpCode) {
        String html = """
                <div style="font-family:Arial,sans-serif;max-width:500px;margin:auto;padding:24px;
                            border:1px solid #e0e0e0;border-radius:8px;">
                  <h2 style="color:#1a237e;">TutorLink — Code de vérification</h2>
                  <p>Voici votre code OTP :</p>
                  <div style="font-size:32px;font-weight:bold;letter-spacing:8px;
                              color:#1a237e;text-align:center;padding:16px;
                              background:#e8eaf6;border-radius:6px;">
                    %s
                  </div>
                  <p style="color:#757575;font-size:12px;margin-top:16px;">
                    Ce code expire dans 10 minutes. Ne le partagez jamais.
                  </p>
                </div>
                """.formatted(otpCode);

        sendSimpleEmail(EmailRequest.builder()
                .to(to)
                .subject("TutorLink — Votre code de vérification")
                .body(html)
                .build());
    }

    // ─── T5 : Confirmation de réservation ────────────────────────────────────

    public void sendBookingConfirmationEmail(String to, String bookingDetails) {
        String html = """
                <div style="font-family:Arial,sans-serif;max-width:500px;margin:auto;padding:24px;
                            border:1px solid #e0e0e0;border-radius:8px;">
                  <h2 style="color:#2e7d32;">✅ Réservation confirmée</h2>
                  <p>Votre réservation a été confirmée :</p>
                  <div style="background:#e8f5e9;padding:16px;border-radius:6px;white-space:pre-wrap;">%s</div>
                  <p style="color:#757575;font-size:12px;margin-top:16px;">
                    Connectez-vous sur TutorLink pour consulter les détails.
                  </p>
                </div>
                """.formatted(bookingDetails);

        sendSimpleEmail(EmailRequest.builder()
                .to(to)
                .subject("TutorLink — Réservation confirmée")
                .body(html)
                .build());
    }

    // ─── T5 : Annulation de réservation ──────────────────────────────────────

    public void sendBookingCancelledEmail(String to, String reason) {
        String html = """
                <div style="font-family:Arial,sans-serif;max-width:500px;margin:auto;padding:24px;
                            border:1px solid #e0e0e0;border-radius:8px;">
                  <h2 style="color:#c62828;">❌ Réservation annulée</h2>
                  <p>Une réservation a été annulée.</p>
                  %s
                  <p style="color:#757575;font-size:12px;margin-top:16px;">
                    Contactez le support TutorLink si nécessaire.
                  </p>
                </div>
                """.formatted(reason != null && !reason.isBlank()
                ? "<p><strong>Motif :</strong> " + reason + "</p>"
                : "");

        sendSimpleEmail(EmailRequest.builder()
                .to(to)
                .subject("TutorLink — Réservation annulée")
                .body(html)
                .build());
    }

    // ─── T5 : Rappel J-1 ─────────────────────────────────────────────────────

    public void sendReminderEmail(String to, String bookingDetails) {
        String html = """
                <div style="font-family:Arial,sans-serif;max-width:500px;margin:auto;padding:24px;
                            border:1px solid #e0e0e0;border-radius:8px;">
                  <h2 style="color:#e65100;">⏰ Rappel — Séance demain</h2>
                  <p>Vous avez une séance prévue demain :</p>
                  <div style="background:#fff3e0;padding:16px;border-radius:6px;white-space:pre-wrap;">%s</div>
                  <p style="color:#757575;font-size:12px;margin-top:16px;">
                    Bonne séance avec TutorLink !
                  </p>
                </div>
                """.formatted(bookingDetails);

        sendSimpleEmail(EmailRequest.builder()
                .to(to)
                .subject("TutorLink — Rappel : séance demain")
                .body(html)
                .build());
    }
}