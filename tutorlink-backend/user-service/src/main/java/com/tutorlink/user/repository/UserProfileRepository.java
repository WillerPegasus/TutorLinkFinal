package com.tutorlink.user.repository;

import com.tutorlink.user.entity.UserProfile;
import com.tutorlink.user.entity.Role;
import com.tutorlink.user.entity.AccountStatus;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import java.util.List;
import java.util.Optional;

public interface UserProfileRepository extends JpaRepository<UserProfile, Long> {
    Optional<UserProfile> findByUserId(Long userId);
    Optional<UserProfile> findByEmail(String email);
    List<UserProfile> findByRole(Role role);
    List<UserProfile> findAllByOrderByCreatedAtDesc();
    Optional<UserProfile> findByPhone(String phone);

    // ✎ AJOUT — recherche admin par nom/email + filtres rôle/statut (tous optionnels)
    @Query("SELECT u FROM UserProfile u WHERE " +
           "(:search IS NULL OR LOWER(u.firstName) LIKE LOWER(CONCAT('%', :search, '%')) " +
           "  OR LOWER(u.lastName) LIKE LOWER(CONCAT('%', :search, '%')) " +
           "  OR LOWER(u.email) LIKE LOWER(CONCAT('%', :search, '%'))) " +
           "AND (:role IS NULL OR u.role = :role) " +
           "AND (:status IS NULL OR u.status = :status)")
    List<UserProfile> searchUsers(@Param("search") String search,
                                   @Param("role") Role role,
                                   @Param("status") AccountStatus status);
}