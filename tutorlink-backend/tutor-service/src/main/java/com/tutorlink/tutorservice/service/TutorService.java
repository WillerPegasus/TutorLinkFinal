package com.tutorlink.tutorservice.service;

import com.tutorlink.tutorservice.dto.*;
import com.tutorlink.tutorservice.entity.VerificationDocument;
import com.tutorlink.tutorservice.enums.DocumentStatus;
import java.util.List;

public interface TutorService {
    TutorProfileResponse createTutorProfile(TutorProfileRequest request);
    TutorProfileResponse getTutorById(Long id);
    TutorProfileResponse getTutorByUserId(Long userId);
    TutorProfileResponse updateProfile(Long id, TutorProfileRequest request);
    List<TutorProfileResponse> searchTutors(TutorSearchRequest request);
    List<TutorProfileResponse> getAllVerifiedTutors();
    List<TutorProfileResponse> getPendingTutors();
    List<String> getAllAvailableSubjects();
    List<String> getAllAvailableDistricts();

    List<AvailabilityRequest> getAvailability(Long tutorId);
    void setAvailability(Long tutorId, List<AvailabilityRequest> availabilities);

    ReviewResponse addReview(Long tutorId, ReviewRequest request);
    List<ReviewResponse> getReviewsByTutor(Long tutorId);
    List<ReviewResponse> getReviewsByStudent(Long studentId);

    VerificationDocument submitDocument(Long tutorId, VerificationDocumentRequest request);
    VerificationDocument reviewDocument(Long documentId, DocumentStatus status, String note);
    void verifyTutor(Long tutorId);
    void rejectTutor(Long tutorId, String reason); 
    List<String> getSubjects(Long tutorId);
    List<String> addSubject(Long tutorId, String subject);
    List<String> removeSubject(Long tutorId, String subject);
    ReviewResponse replyToReview(Long reviewId, String reply);
    ReviewResponse updateReview(Long reviewId, Long studentId, ReviewRequest request);
    void deleteReview(Long reviewId, Long studentId);
    void deleteTutorProfileByUserId(Long userId);
}