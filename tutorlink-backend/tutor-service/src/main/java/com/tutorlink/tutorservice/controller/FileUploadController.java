package com.tutorlink.tutorservice.controller;

import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.nio.file.StandardCopyOption;
import java.util.Map;
import java.util.UUID;

// ✎ AJOUT — Upload des documents de vérification tuteur (stockage local disque)
@RestController
@RequestMapping("/api/tutors")
@RequiredArgsConstructor
public class FileUploadController {

    @Value("${app.upload.dir}")
    private String uploadDir;

    @Value("${app.upload.public-base-url}")
    private String publicBaseUrl;

    @PostMapping("/{tutorId}/documents/upload")
    public ResponseEntity<Map<String, String>> uploadDocument(
            @PathVariable Long tutorId,
            @RequestParam("file") MultipartFile file) throws IOException {

        if (file.isEmpty()) {
            return ResponseEntity.badRequest().body(Map.of("error", "Fichier vide"));
        }

        Path dir = Paths.get(uploadDir);
        Files.createDirectories(dir);

        String originalName = file.getOriginalFilename() != null ? file.getOriginalFilename() : "fichier";
        String ext = originalName.contains(".") ? originalName.substring(originalName.lastIndexOf(".")) : "";
        String storedName = "tutor" + tutorId + "-" + UUID.randomUUID() + ext;

        Path target = dir.resolve(storedName);
        Files.copy(file.getInputStream(), target, StandardCopyOption.REPLACE_EXISTING);

        String fileUrl = publicBaseUrl + "/" + storedName;
        return ResponseEntity.ok(Map.of("fileUrl", fileUrl));
    }
}