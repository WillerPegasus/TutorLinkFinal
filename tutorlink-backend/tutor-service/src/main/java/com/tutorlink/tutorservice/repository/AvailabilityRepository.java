package com.tutorlink.tutorservice.repository;

import com.tutorlink.tutorservice.entity.Availability;
import com.tutorlink.tutorservice.enums.DayOfWeek;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;
import java.util.Optional;

public interface AvailabilityRepository extends JpaRepository<Availability, Long> {
    List<Availability> findByTutorId(Long tutorId);
    List<Availability> findByTutorIdAndIsAvailableTrue(Long tutorId);
    Optional<Availability> findByTutorIdAndDayOfWeek(Long tutorId, DayOfWeek dayOfWeek);
    void deleteByTutorId(Long tutorId);
}