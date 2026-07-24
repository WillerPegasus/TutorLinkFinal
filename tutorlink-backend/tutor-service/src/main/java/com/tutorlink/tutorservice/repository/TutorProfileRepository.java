package com.tutorlink.tutorservice.repository;

import com.tutorlink.tutorservice.entity.TutorProfile;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import java.util.List;
import java.util.Optional;

public interface TutorProfileRepository extends JpaRepository<TutorProfile, Long> {

    Optional<TutorProfile> findByUserId(Long userId);
    boolean existsByUserId(Long userId);
    List<TutorProfile> findByIsVerifiedTrue();
    List<TutorProfile> findByIsVerifiedFalseAndRejectionReasonIsNull();
    List<TutorProfile> findByCity(String city);

    @Query("SELECT t FROM TutorProfile t WHERE " +
            "(:subject IS NULL OR t.subjects LIKE %:subject%) AND " +
            "(:level IS NULL OR t.levels LIKE %:level%) AND " +
            "(:city IS NULL OR t.city = :city) AND " +
            "(:district IS NULL OR t.districts LIKE %:district%) AND " +
            "(:minPrice IS NULL OR t.hourlyRate >= :minPrice) AND " +
            "(:maxPrice IS NULL OR t.hourlyRate <= :maxPrice) AND " +
            "(:minRating IS NULL OR t.rating >= :minRating)")
    List<TutorProfile> searchTutors(
            @Param("subject") String subject,
            @Param("level") String level,
            @Param("city") String city,
            @Param("district") String district,
            @Param("minPrice") Integer minPrice,
            @Param("maxPrice") Integer maxPrice,
            @Param("minRating") Double minRating
    );
}