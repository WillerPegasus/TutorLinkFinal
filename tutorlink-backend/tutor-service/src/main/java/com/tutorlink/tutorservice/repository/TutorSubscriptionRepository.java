package com.tutorlink.tutorservice.repository;

import com.tutorlink.tutorservice.entity.TutorSubscription;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.Optional;

public interface TutorSubscriptionRepository extends JpaRepository<TutorSubscription, Long> {
    Optional<TutorSubscription> findByTutorId(Long tutorId);
}