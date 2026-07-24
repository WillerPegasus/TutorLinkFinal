package com.tutorlink.tutorservice.repository;

import com.tutorlink.tutorservice.entity.VerificationDocument;
import com.tutorlink.tutorservice.enums.DocumentStatus;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface VerificationDocumentRepository extends JpaRepository<VerificationDocument, Long> {
    List<VerificationDocument> findByTutorId(Long tutorId);
    List<VerificationDocument> findByStatus(DocumentStatus status);
}