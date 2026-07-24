package com.tutorlink.tutorservice.repository;

import com.tutorlink.tutorservice.entity.Review;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import java.util.List;

public interface ReviewRepository extends JpaRepository<Review, Long> {
    List<Review> findByTutorId(Long tutorId);
    List<Review> findByStudentId(Long studentId);
    boolean existsByBookingId(Long bookingId);

    @Query("SELECT AVG(r.rating) FROM Review r WHERE r.tutorId = :tutorId")
    Double calculateAverageRating(@Param("tutorId") Long tutorId);
}