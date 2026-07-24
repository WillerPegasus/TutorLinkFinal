package com.tutorlink.tutorservice.repository;

import com.tutorlink.tutorservice.entity.SubscriptionPayment;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface SubscriptionPaymentRepository extends JpaRepository<SubscriptionPayment, Long> {
    List<SubscriptionPayment> findByTutorIdOrderByPaidAtDesc(Long tutorId);
}