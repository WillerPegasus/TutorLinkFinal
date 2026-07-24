package com.tutorlink.user.repository;

import com.tutorlink.user.entity.SavedPaymentMethod;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface SavedPaymentMethodRepository extends JpaRepository<SavedPaymentMethod, Long> {
    List<SavedPaymentMethod> findByUserId(Long userId);
}