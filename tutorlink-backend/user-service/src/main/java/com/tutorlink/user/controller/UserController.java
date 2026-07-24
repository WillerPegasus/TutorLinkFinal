package com.tutorlink.user.controller;

import com.tutorlink.user.dto.CreateUserRequest;
import com.tutorlink.user.dto.PublicUserProfileResponse;
import com.tutorlink.user.dto.UserProfileRequest;
import com.tutorlink.user.dto.UserProfileResponse;
import com.tutorlink.user.entity.AccountStatus;
import com.tutorlink.user.service.UserService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.List;
import com.tutorlink.user.entity.Role;
import com.tutorlink.user.dto.PrivacySettingsRequest;
import com.tutorlink.user.dto.PrivacySettingsResponse;

@RestController
@RequestMapping("/api/users")
@RequiredArgsConstructor
public class UserController {

    private final UserService userService;

    @PostMapping
    public ResponseEntity<UserProfileResponse> createProfile(@Valid @RequestBody CreateUserRequest request) {
        return new ResponseEntity<>(userService.createProfile(request), HttpStatus.CREATED);
    }

   // ✎ FIX — contrôle propriétaire (owner) ou ADMIN
    // La réponse contient des données sensibles (email, phone),
    // donc seul le propriétaire ou un ADMIN doit pouvoir la lire.
    // ✎ AJOUT — endpoint PUBLIC (pas de contrôle owner/admin), utilisé pour
    // l'affichage public des profils (ex: résultats de recherche de tuteurs).
    // Ne renvoie jamais email/phone — voir PublicUserProfileResponse.
    @GetMapping("/{userId}/public")
    public ResponseEntity<PublicUserProfileResponse> getPublicProfile(@PathVariable Long userId) {
        return ResponseEntity.ok(userService.getPublicProfileByUserId(userId));
    }
    // ✎ AJOUT — alias "moi-même" : évite au frontend de connaître son propre
    // userId pour appeler son profil. On le déduit du header X-User-Id
    // injecté par le gateway depuis le JWT.
    @GetMapping("/me")
    public ResponseEntity<UserProfileResponse> getMyProfile(
            @RequestHeader(value = "X-User-Id", required = false) String requesterId) {

        if (requesterId == null) {
            return ResponseEntity.status(401).build();
        }

        return ResponseEntity.ok(userService.getProfileByUserId(Long.parseLong(requesterId)));
    }

    // ✎ AJOUT — alias "moi-même" pour la mise à jour de profil
    @PutMapping("/me")
    public ResponseEntity<UserProfileResponse> updateMyProfile(
            @RequestBody UserProfileRequest request,
            @RequestHeader(value = "X-User-Id", required = false) String requesterId) {

        if (requesterId == null) {
            return ResponseEntity.status(401).build();
        }

        return ResponseEntity.ok(userService.updateProfile(Long.parseLong(requesterId), request));
    }
    @GetMapping("/{userId}")
    public ResponseEntity<UserProfileResponse> getProfileByUserId(
            @PathVariable Long userId,
            @RequestHeader(value = "X-User-Id", required = false) String requesterId,
            @RequestHeader(value = "X-User-Role", required = false) String requesterRole) {

        boolean isOwner = requesterId != null && requesterId.equals(String.valueOf(userId));
        boolean isAdmin = "ADMIN".equals(requesterRole);

        if (!isOwner && !isAdmin) {
            return ResponseEntity.status(403).build();
        }

        return ResponseEntity.ok(userService.getProfileByUserId(userId));
    }

    // ✎ AJOUT — contrôle propriétaire (owner) ou ADMIN
    @PutMapping("/{userId}")
    public ResponseEntity<UserProfileResponse> updateProfile(
            @PathVariable Long userId,
            @RequestBody UserProfileRequest request,
            @RequestHeader(value = "X-User-Id", required = false) String requesterId,
            @RequestHeader(value = "X-User-Role", required = false) String requesterRole) {

        boolean isOwner = requesterId != null && requesterId.equals(String.valueOf(userId));
        boolean isAdmin = "ADMIN".equals(requesterRole);

        if (!isOwner && !isAdmin) {
            return ResponseEntity.status(403).build();
        }

        return ResponseEntity.ok(userService.updateProfile(userId, request));
    }
    // ✎ AJOUT — confidentialité "moi-même"
    @GetMapping("/me/privacy")
    public ResponseEntity<PrivacySettingsResponse> getMyPrivacy(
            @RequestHeader(value = "X-User-Id", required = false) String requesterId) {
        if (requesterId == null) return ResponseEntity.status(401).build();
        return ResponseEntity.ok(userService.getPrivacySettings(Long.parseLong(requesterId)));
    }

    @PutMapping("/me/privacy")
    public ResponseEntity<PrivacySettingsResponse> updateMyPrivacy(
            @RequestHeader(value = "X-User-Id", required = false) String requesterId,
            @RequestBody PrivacySettingsRequest request) {
        if (requesterId == null) return ResponseEntity.status(401).build();
        return ResponseEntity.ok(userService.updatePrivacySettings(Long.parseLong(requesterId), request));
    }

    // ✎ AJOUT — suppression (anonymisation) du compte "moi-même"
    @DeleteMapping("/me/account")
    public ResponseEntity<Void> deleteMyAccount(
            @RequestHeader(value = "X-User-Id", required = false) String requesterId) {
        if (requesterId == null) return ResponseEntity.status(401).build();
        userService.deleteAccount(Long.parseLong(requesterId));
        return ResponseEntity.noContent().build();
    }

    // ✎ FIX — contrôle propriétaire (owner) ou ADMIN
    // Avant : n'importe quel utilisateur authentifié pouvait supprimer
    // le profil de n'importe qui (IDOR).
    @DeleteMapping("/{userId}")
    public ResponseEntity<Void> deleteProfile(
            @PathVariable Long userId,
            @RequestHeader(value = "X-User-Id", required = false) String requesterId,
            @RequestHeader(value = "X-User-Role", required = false) String requesterRole) {

        boolean isOwner = requesterId != null && requesterId.equals(String.valueOf(userId));
        boolean isAdmin = "ADMIN".equals(requesterRole);

        if (!isOwner && !isAdmin) {
            return ResponseEntity.status(403).build();
        }

        userService.deleteProfile(userId);
        return ResponseEntity.noContent().build();
    }

    @GetMapping
    public ResponseEntity<List<UserProfileResponse>> getAllUsers(
            @RequestParam(required = false) String search,
            @RequestParam(required = false) Role role,
            @RequestParam(required = false) AccountStatus status) {
        if (search == null && role == null && status == null) {
            return ResponseEntity.ok(userService.getAllUsers()); // comportement inchangé si aucun filtre
        }
        return ResponseEntity.ok(userService.searchUsers(search, role, status));
    }
    // ============================================================
    // ✎ AJOUT V4 : PATCH /api/users/{userId}/suspend
    // ============================================================
    @PatchMapping("/{userId}/suspend")
    public ResponseEntity<UserProfileResponse> suspendAccount(@PathVariable Long userId) {
        return ResponseEntity.ok(userService.suspendAccount(userId));
    }

    // ============================================================
    // ✎ AJOUT V4 : PATCH /api/users/{userId}/reactivate
    // ============================================================
    @PatchMapping("/{userId}/reactivate")
    public ResponseEntity<UserProfileResponse> reactivateAccount(@PathVariable Long userId) {
        return ResponseEntity.ok(userService.reactivateAccount(userId));
    }

    // ============================================================
    // ✎ AJOUT V4 : GET /api/users/export
    // Renvoie un fichier CSV téléchargeable de tous les utilisateurs
    // ============================================================
    @GetMapping("/export")
    public ResponseEntity<byte[]> exportUsersCsv() {
        String csv = userService.exportUsersToCsv();
        byte[] bytes = csv.getBytes(java.nio.charset.StandardCharsets.UTF_8);

        return ResponseEntity.ok()
                .header("Content-Type", "text/csv; charset=UTF-8")
                .header("Content-Disposition", "attachment; filename=\"utilisateurs.csv\"")
                .body(bytes);
    }
}