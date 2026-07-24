package com.tutorlink.booking.repository;

import com.tutorlink.booking.entity.Booking;
import com.tutorlink.booking.enums.BookingStatus;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import java.util.List;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

@Repository
public interface BookingRepository extends JpaRepository<Booking, Long> {

    List<Booking> findByStudentId(Long studentId);

    List<Booking> findByTutorId(Long tutorId);

    List<Booking> findByTutorIdAndStatus(Long tutorId, BookingStatus status);

    List<Booking> findByStudentIdAndStatus(Long studentId, BookingStatus status);
    List<Booking> findByTutorIdAndPaymentStatus(Long tutorId, com.tutorlink.booking.enums.PaymentStatus paymentStatus);
    List<Booking> findByStudentIdAndPaymentStatus(Long studentId, com.tutorlink.booking.enums.PaymentStatus paymentStatus);

    List<Booking> findByStudentIdAndScheduledDateAfter(Long studentId, LocalDate date);

    long countByStudentIdAndStatus(Long studentId, BookingStatus status);
    Page<Booking> findByStatus(BookingStatus status, Pageable pageable);

    @Query("SELECT COUNT(DISTINCT b.tutorId) FROM Booking b WHERE b.studentId = :studentId")
    long countDistinctTutorIdByStudentId(Long studentId);
}