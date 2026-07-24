package com.tutorlink.user.controller;

import com.tutorlink.user.dto.UserProfileResponse;
import com.tutorlink.user.service.UserService;
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
import java.util.UUID;

// ✎ AJOUT — Upload de la photo de profil (même mécanisme que les documents tuteur)
@RestController
@RequestMapping("/api/users")
@RequiredArgsConstructor
public class AvatarUploadController {

    private final UserService userService;

    @Value("${app.upload.dir}")
    private String uploadDir;

    @Value("${app.upload.public-base-url}")
    private String publicBaseUrl;

    @PostMapping("/{userId}/avatar")
    public ResponseEntity<UserProfileResponse> uploadAvatar(
            @PathVariable Long userId,
            @RequestParam("file") MultipartFile file) throws IOException {

        if (file.isEmpty()) {
            return ResponseEntity.badRequest().build();
        }

        Path dir = Paths.get(uploadDir);
        Files.createDirectories(dir);

        String originalName = file.getOriginalFilename() != null ? file.getOriginalFilename() : "avatar";
        String ext = originalName.contains(".") ? originalName.substring(originalName.lastIndexOf(".")) : "";
        String storedName = "user" + userId + "-" + UUID.randomUUID() + ext;

        Path target = dir.resolve(storedName);
        Files.copy(file.getInputStream(), target, StandardCopyOption.REPLACE_EXISTING);

        String fileUrl = publicBaseUrl + "/" + storedName;
        return ResponseEntity.ok(userService.updateAvatar(userId, fileUrl));
    }
}