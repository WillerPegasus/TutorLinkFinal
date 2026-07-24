package com.tutorlink.apiGateway.service;

import org.apache.pdfbox.pdmodel.PDDocument;
import org.apache.pdfbox.pdmodel.PDPage;
import org.apache.pdfbox.pdmodel.PDPageContentStream;
import org.apache.pdfbox.pdmodel.common.PDRectangle;
import org.apache.pdfbox.pdmodel.font.PDType1Font;
import org.apache.pdfbox.pdmodel.font.Standard14Fonts;
import org.springframework.stereotype.Service;

import java.io.ByteArrayOutputStream;
import java.io.IOException;
import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.LinkedHashMap;
import java.util.Map;

// ✎ AJOUT V4 : génère le PDF téléchargé depuis admin-reports
// ("⬇ Télécharger PDF"). Pas d'accents dans le texte injecté dans le PDF
// pour rester sur l'encodage WinAnsi des polices standards PDFBox.
@Service
public class ReportPdfService {

    private static final Map<String, String> LABELS = new LinkedHashMap<>();
    static {
        LABELS.put("totalUsers", "Utilisateurs inscrits");
        LABELS.put("activeTutors", "Repetiteurs actifs");
        LABELS.put("pendingDocuments", "Documents KYC en attente");
        LABELS.put("activeGroups", "Groupes actifs");
        LABELS.put("totalBookings", "Reservations totales");
        LABELS.put("unresolvedReports", "Notifications envoyees");
    }

    public byte[] buildReportPdf(Map<String, Object> stats) throws IOException {
        try (PDDocument document = new PDDocument()) {
            PDPage page = new PDPage(PDRectangle.A4);
            document.addPage(page);

            try (PDPageContentStream content = new PDPageContentStream(document, page)) {
                float margin = 50;
                float y = page.getMediaBox().getHeight() - margin;

                content.beginText();
                content.setFont(new PDType1Font(Standard14Fonts.FontName.HELVETICA_BOLD), 20);
                content.newLineAtOffset(margin, y);
                content.showText("TutorLink - Rapport administrateur");
                content.endText();
                y -= 30;

                content.beginText();
                content.setFont(new PDType1Font(Standard14Fonts.FontName.HELVETICA), 11);
                content.newLineAtOffset(margin, y);
                String date = LocalDateTime.now().format(DateTimeFormatter.ofPattern("dd/MM/yyyy HH:mm"));
                content.showText("Genere le " + date);
                content.endText();
                y -= 40;

                for (Map.Entry<String, String> entry : LABELS.entrySet()) {
                    Object value = stats.getOrDefault(entry.getKey(), 0);
                    content.beginText();
                    content.setFont(new PDType1Font(Standard14Fonts.FontName.HELVETICA), 13);
                    content.newLineAtOffset(margin, y);
                    content.showText(entry.getValue() + " : " + value);
                    content.endText();
                    y -= 25;
                }

                content.beginText();
                content.setFont(new PDType1Font(Standard14Fonts.FontName.HELVETICA_OBLIQUE), 9);
                content.newLineAtOffset(margin, margin);
                content.showText("Universite de Dschang - Projet TutorLink");
                content.endText();
            }

            ByteArrayOutputStream out = new ByteArrayOutputStream();
            document.save(out);
            return out.toByteArray();
        }
    }
}