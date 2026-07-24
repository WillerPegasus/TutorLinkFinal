package com.tutorlink.user.service;

import com.tutorlink.user.dto.CreateUserRequest;
import com.tutorlink.user.dto.PrivacySettingsRequest;
import com.tutorlink.user.dto.PrivacySettingsResponse;
import com.tutorlink.user.dto.PublicUserProfileResponse;
import com.tutorlink.user.dto.UserProfileRequest;
import com.tutorlink.user.dto.UserProfileResponse;
import com.tutorlink.user.exception.DuplicateProfileException;
import com.tutorlink.user.exception.UserProfileNotFoundException;
import com.tutorlink.user.entity.UserProfile;
import com.tutorlink.user.repository.UserProfileRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import java.util.List;
import java.util.stream.Collectors;
import com.tutorlink.user.entity.Role;
import com.tutorlink.user.entity.AccountStatus;

@Service
@RequiredArgsConstructor
public class UserService {

    private final UserProfileRepository repository;

    public UserProfileResponse createProfile(CreateUserRequest request) {
        if (repository.findByUserId(request.getUserId()).isPresent()) {
            throw new DuplicateProfileException("Le profil pour cet ID utilisateur existe déjà.");
        }

        UserProfile profile = UserProfile.builder()
                .userId(request.getUserId())
                .firstName(request.getFirstName())
                .lastName(request.getLastName())
                .email(request.getEmail())
                .role(request.getRole())
                .phone(request.getPhone())
                .build();

        UserProfile saved = repository.save(profile);
        return mapToResponse(saved);
    }

    public UserProfileResponse getProfileByUserId(Long userId) {
        UserProfile profile = repository.findByUserId(userId)
                .orElseThrow(() -> new UserProfileNotFoundException("Profil non trouvé pour l'userId : " + userId));
        return mapToResponse(profile);
    }
    // ✎ AJOUT — version publique, sans email/phone
    public PublicUserProfileResponse getPublicProfileByUserId(Long userId) {
        UserProfile profile = repository.findByUserId(userId)
                .orElseThrow(() -> new UserProfileNotFoundException("Profil non trouvé pour l'userId : " + userId));
        return mapToPublicResponse(profile);
    }

    public UserProfileResponse getProfileById(Long id) {
        UserProfile profile = repository.findById(id)
                .orElseThrow(() -> new UserProfileNotFoundException("Profil non trouvé pour l'ID : " + id));
        return mapToResponse(profile);
    }
    // ✎ AJOUT — confidentialité
    public PrivacySettingsResponse getPrivacySettings(Long userId) {
        UserProfile profile = repository.findByUserId(userId)
                .orElseThrow(() -> new UserProfileNotFoundException("Profil non trouvé pour l'userId : " + userId));
        return PrivacySettingsResponse.builder()
                .phoneVisible(profile.getPhoneVisible())
                .profilePublic(profile.getProfilePublic())
                .build();
    }

    public PrivacySettingsResponse updatePrivacySettings(Long userId, PrivacySettingsRequest request) {
        UserProfile profile = repository.findByUserId(userId)
                .orElseThrow(() -> new UserProfileNotFoundException("Profil non trouvé pour l'userId : " + userId));

        if (request.getPhoneVisible() != null) profile.setPhoneVisible(request.getPhoneVisible());
        if (request.getProfilePublic() != null) profile.setProfilePublic(request.getProfilePublic());

        repository.save(profile);
        return PrivacySettingsResponse.builder()
                .phoneVisible(profile.getPhoneVisible())
                .profilePublic(profile.getProfilePublic())
                .build();
    }

    // ✎ AJOUT — suppression de compte (anonymisation, pas de suppression physique,
    // pour préserver l'intégrité des réservations/avis liés à cet userId)
    public void deleteAccount(Long userId) {
        UserProfile profile = repository.findByUserId(userId)
                .orElseThrow(() -> new UserProfileNotFoundException("Profil non trouvé pour l'userId : " + userId));

        profile.setFirstName("Utilisateur");
        profile.setLastName("Supprimé");
        profile.setEmail("deleted-" + userId + "@tutorlink.local");
        profile.setPhone("0000000000");
        profile.setBio(null);
        profile.setProfilePicture(null);
        profile.setStatus(AccountStatus.SUSPENDED);

        repository.save(profile);
    }

    // ✎ AJOUT — mise à jour de l'avatar
    public UserProfileResponse updateAvatar(Long userId, String pictureUrl) {
        UserProfile profile = repository.findByUserId(userId)
                .orElseThrow(() -> new UserProfileNotFoundException("Profil non trouvé pour l'userId : " + userId));
        profile.setProfilePicture(pictureUrl);
        repository.save(profile);
        return mapToResponse(profile);
    }

    public UserProfileResponse updateProfile(Long userId, UserProfileRequest request) {
        UserProfile profile = repository.findByUserId(userId)
                .orElseThrow(() -> new UserProfileNotFoundException("Profil non trouvé pour mise à jour."));

        if (request.getFirstName() != null) profile.setFirstName(request.getFirstName());
        if (request.getLastName() != null) profile.setLastName(request.getLastName());
        if (request.getPhone() != null) profile.setPhone(request.getPhone());
        if (request.getProfilePicture() != null) profile.setProfilePicture(request.getProfilePicture());
        if (request.getCity() != null) profile.setCity(request.getCity());
        if (request.getDistricts() != null) profile.setDistricts(request.getDistricts());
        if (request.getBio() != null) profile.setBio(request.getBio());

        return mapToResponse(repository.save(profile));
    }

    public void deleteProfile(Long userId) {
        UserProfile profile = repository.findByUserId(userId)
                .orElseThrow(() -> new UserProfileNotFoundException("Profil introuvable pour suppression."));
        repository.delete(profile);
    }

    public List<UserProfileResponse> getAllUsers() {
        return repository.findAllByOrderByCreatedAtDesc().stream()
                .map(this::mapToResponse)
                .collect(Collectors.toList());
    }

    // ✎ AJOUT — recherche/filtre admin
    public List<UserProfileResponse> searchUsers(String search, Role role, AccountStatus status) {
        return repository.searchUsers(search, role, status)
                .stream()
                .map(this::mapToResponse)
                .collect(Collectors.toList());
    }

    // ============================================================
    // ✎ AJOUT V4 : suspendAccount() / reactivateAccount()
    // ============================================================
    public UserProfileResponse suspendAccount(Long userId) {
        UserProfile profile = repository.findByUserId(userId)
                .orElseThrow(() -> new UserProfileNotFoundException("Profil non trouvé pour l'userId : " + userId));
        profile.setStatus(AccountStatus.SUSPENDED);
        return mapToResponse(repository.save(profile));
    }

    public UserProfileResponse reactivateAccount(Long userId) {
        UserProfile profile = repository.findByUserId(userId)
                .orElseThrow(() -> new UserProfileNotFoundException("Profil non trouvé pour l'userId : " + userId));
        profile.setStatus(AccountStatus.ACTIVE);
        return mapToResponse(repository.save(profile));
    }

    // ============================================================
    // ✎ AJOUT V4 : exportUsersToCsv()
    // ============================================================
    public String exportUsersToCsv() {
        List<UserProfile> profiles = repository.findAllByOrderByCreatedAtDesc();

        StringBuilder csv = new StringBuilder();
        csv.append("ID,UserId,Prenom,Nom,Email,Telephone,Ville,Role,Statut,DateCreation\n");

        for (UserProfile p : profiles) {
            csv.append(p.getId()).append(",")
               .append(p.getUserId()).append(",")
               .append(escapeCsv(p.getFirstName())).append(",")
               .append(escapeCsv(p.getLastName())).append(",")
               .append(escapeCsv(p.getEmail())).append(",")
               .append(escapeCsv(p.getPhone())).append(",")
               .append(escapeCsv(p.getCity())).append(",")
               .append(p.getRole()).append(",")
               .append(p.getStatus()).append(",")
               .append(p.getCreatedAt()).append("\n");
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
private PublicUserProfileResponse mapToPublicResponse(UserProfile profile) {
        return PublicUserProfileResponse.builder()
                .id(profile.getId())
                .userId(profile.getUserId())
                .firstName(profile.getFirstName())
                .lastName(profile.getLastName())
                .profilePicture(profile.getProfilePicture())
                .city(profile.getCity())
                .districts(profile.getDistricts())
                .role(profile.getRole())
                .bio(profile.getBio())
                .build();
    }
    private UserProfileResponse mapToResponse(UserProfile profile) {
        return UserProfileResponse.builder()
                .id(profile.getId())
                .userId(profile.getUserId())
                .firstName(profile.getFirstName())
                .lastName(profile.getLastName())
                .email(profile.getEmail())
                .phone(profile.getPhone())
                .profilePicture(profile.getProfilePicture())
                .city(profile.getCity())
                .districts(profile.getDistricts())
                .role(profile.getRole())
                .bio(profile.getBio())
                .status(profile.getStatus())
                .createdAt(profile.getCreatedAt())
                .build();
    }
}