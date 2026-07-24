package com.tutorlink.auth.service;

import jakarta.mail.MessagingException;
import jakarta.mail.internet.MimeMessage;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.MimeMessageHelper;
import org.springframework.stereotype.Service;

// @Service : Spring gère cette classe automatiquement
// Elle sera injectée dans AuthService quand on en aura besoin
@Service
public class EmailService {

    // JavaMailSender est fourni automatiquement par Spring Boot
    // grâce aux paramètres spring.mail.* dans application.properties
    // @Autowired dit à Spring : "injecte ici l'objet JavaMailSender que tu gères"
    // C'est comme dire "donne-moi le facteur déjà formé, je n'ai pas besoin
    // de le créer moi-même"
    @Autowired
    private JavaMailSender mailSender;

    // L'adresse email de l'expéditeur lue depuis application.properties
    // Ce sera affiché comme "De : " dans l'email reçu
    @Value("${spring.mail.username}")
    private String fromEmail;

    // ============================================================
    // MÉTHODE PRINCIPALE : sendOtpEmail(to, otpCode)
    // Envoie un email HTML avec le code OTP à l'utilisateur
    // Paramètres :
    //   - to      : l'adresse email du destinataire
    //   - otpCode : le code à 6 chiffres généré par AuthService
    // ============================================================
    public void sendOtpEmail(String to, String otpCode) {
        try {
            // MimeMessage permet d'envoyer un email enrichi (HTML, pièces jointes...)
            // Contrairement à SimpleMailMessage qui ne fait que du texte brut
            MimeMessage message = mailSender.createMimeMessage();

            // MimeMessageHelper facilite la construction du MimeMessage
            // true = cet email supporte le HTML et les encodages UTF-8
            MimeMessageHelper helper = new MimeMessageHelper(message, true, "UTF-8");

            // Paramètres de base de l'email
            helper.setFrom(fromEmail);          // Expéditeur
            helper.setTo(to);                   // Destinataire
            helper.setSubject("TutorLink — Votre code de vérification"); // Objet

            // Corps de l'email en HTML
            // On appelle buildOtpEmailTemplate() pour obtenir le HTML
            helper.setText(buildOtpEmailTemplate(otpCode), true); // true = c'est du HTML

            // Envoie réellement l'email via le serveur Gmail SMTP
            mailSender.send(message);

        } catch (MessagingException e) {
            // Si l'envoi échoue (pas de connexion, mauvais email...)
            // On lance une RuntimeException pour signaler l'erreur à AuthService
            throw new RuntimeException("Erreur lors de l'envoi de l'email OTP : " + e.getMessage());
        }
    }

    // ============================================================
    // MÉTHODE PRIVÉE : buildOtpEmailTemplate(otpCode)
    // Construit le template HTML de l'email
    // Retourne une chaîne de caractères HTML
    // ============================================================
    private String buildOtpEmailTemplate(String otpCode) {
        return """
                <!DOCTYPE html>
                <html lang="fr">
                <head>
                    <meta charset="UTF-8">
                    <meta name="viewport" content="width=device-width, initial-scale=1.0">
                    <title>Code de vérification TutorLink</title>
                </head>
                <body style="margin: 0; padding: 0; font-family: Arial, sans-serif;
                             background-color: #f4f4f4;">
                
                    <table width="100%%" cellpadding="0" cellspacing="0"
                           style="background-color: #f4f4f4; padding: 40px 0;">
                        <tr>
                            <td align="center">
                
                                <!-- Carte principale -->
                                <table width="500" cellpadding="0" cellspacing="0"
                                       style="background-color: #ffffff;
                                              border-radius: 12px;
                                              box-shadow: 0 2px 8px rgba(0,0,0,0.1);
                                              overflow: hidden;">
                
                                    <!-- En-tête bleue avec le logo -->
                                    <tr>
                                        <td align="center"
                                            style="background-color: #2563EB;
                                                   padding: 32px 40px;">
                                            <h1 style="color: #ffffff; margin: 0;
                                                       font-size: 28px; font-weight: 700;">
                                                TutorLink
                                            </h1>
                                            <p style="color: #BFDBFE; margin: 8px 0 0 0;
                                                      font-size: 14px;">
                                                Plateforme de mise en relation élèves et répétiteurs
                                            </p>
                                        </td>
                                    </tr>
                
                                    <!-- Corps du message -->
                                    <tr>
                                        <td style="padding: 40px;">
                
                                            <h2 style="color: #1E293B; font-size: 20px;
                                                       margin: 0 0 16px 0;">
                                                Votre code de vérification
                                            </h2>
                
                                            <p style="color: #64748B; font-size: 15px;
                                                      line-height: 1.6; margin: 0 0 24px 0;">
                                                Bonjour,<br><br>
                                                Vous avez demandé un code de vérification
                                                pour votre compte TutorLink.
                                                Voici votre code :
                                            </p>
                
                                            <!-- Le code OTP mis en évidence -->
                                            <table width="100%%" cellpadding="0" cellspacing="0">
                                                <tr>
                                                    <td align="center"
                                                        style="background-color: #EFF6FF;
                                                               border: 2px dashed #2563EB;
                                                               border-radius: 8px;
                                                               padding: 24px;
                                                               margin: 24px 0;">
                                                        <span style="font-size: 40px;
                                                                     font-weight: 700;
                                                                     color: #2563EB;
                                                                     letter-spacing: 12px;">
                                                            %s
                                                        </span>
                                                    </td>
                                                </tr>
                                            </table>
                
                                            <p style="color: #EF4444; font-size: 13px;
                                                      margin: 24px 0 0 0;">
                                                ⚠️ Ce code expire dans <strong>10 minutes</strong>.
                                                Ne le partagez avec personne.
                                            </p>
                
                                            <p style="color: #94A3B8; font-size: 13px;
                                                      margin: 16px 0 0 0;">
                                                Si vous n'avez pas demandé ce code,
                                                ignorez cet email.
                                            </p>
                
                                        </td>
                                    </tr>
                
                                    <!-- Pied de page -->
                                    <tr>
                                        <td align="center"
                                            style="background-color: #F8FAFC;
                                                   padding: 20px 40px;
                                                   border-top: 1px solid #E2E8F0;">
                                            <p style="color: #94A3B8; font-size: 12px;
                                                      margin: 0;">
                                                © 2024 TutorLink — Université de Dschang<br>
                                                Projet de fin de formation
                                            </p>
                                        </td>
                                    </tr>
                
                                </table>
                            </td>
                        </tr>
                    </table>
                
                </body>
                </html>
                """.formatted(otpCode);
        // .formatted(otpCode) remplace le %s dans le HTML par le vrai code OTP
        // Exemple : si otpCode = "847291", le %s devient "847291" dans l'email
    }
    // ============================================================
    // ✎ AJOUT V4 : sendTempPasswordEmail()
    // Envoie le mot de passe temporaire quand un admin crée un compte
    // ============================================================
    public void sendTempPasswordEmail(String to, String tempPassword) {
        try {
            MimeMessage message = mailSender.createMimeMessage();
            MimeMessageHelper helper = new MimeMessageHelper(message, true, "UTF-8");
            helper.setFrom(fromEmail);
            helper.setTo(to);
            helper.setSubject("TutorLink — Votre compte a été créé");
            helper.setText(buildTempPasswordEmailTemplate(tempPassword), true);
            mailSender.send(message);
        } catch (MessagingException e) {
            throw new RuntimeException("Erreur lors de l'envoi de l'email de bienvenue : " + e.getMessage());
        }
    }

    private String buildTempPasswordEmailTemplate(String tempPassword) {
        return """
                <!DOCTYPE html>
                <html lang="fr">
                <body style="margin:0; padding:0; font-family: Arial, sans-serif; background-color:#f4f4f4;">
                    <table width="100%%" cellpadding="0" cellspacing="0" style="padding:40px 0;">
                        <tr><td align="center">
                            <table width="500" style="background:#fff; border-radius:12px; overflow:hidden;">
                                <tr><td style="background:#2563EB; padding:24px; text-align:center;">
                                    <h1 style="color:#fff; margin:0;">TutorLink</h1>
                                </td></tr>
                                <tr><td style="padding:32px;">
                                    <h2 style="color:#1E293B;">Bienvenue sur TutorLink</h2>
                                    <p style="color:#64748B;">Un administrateur a créé un compte pour vous.</p>
                                    <p style="color:#64748B;">Votre mot de passe temporaire :</p>
                                    <p style="font-size:28px; font-weight:700; color:#2563EB; letter-spacing:4px;">%s</p>
                                    <p style="color:#EF4444; font-size:13px;">⚠️ Connectez-vous puis changez ce mot de passe dès que possible.</p>
                                </td></tr>
                            </table>
                        </td></tr>
                    </table>
                </body>
                </html>
                """.formatted(tempPassword);
    }
}
