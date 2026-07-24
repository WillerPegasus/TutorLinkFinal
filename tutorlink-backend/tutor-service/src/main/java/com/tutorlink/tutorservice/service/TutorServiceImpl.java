package com.tutorlink.tutorservice.service;

import com.tutorlink.tutorservice.dto.*;
import com.tutorlink.tutorservice.entity.*;
import com.tutorlink.tutorservice.enums.DocumentStatus;
import com.tutorlink.tutorservice.exception.*;
import com.tutorlink.tutorservice.feign.BookingServiceClient;
import com.tutorlink.tutorservice.repository.*;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import java.time.LocalDateTime;
import java.util.List;

@Service
@RequiredArgsConstructor
@Slf4j
@Transactional
public class TutorServiceImpl implements TutorService {

    private final TutorProfileRepository tutorProfileRepository;
    private final AvailabilityRepository availabilityRepository;
    private final ReviewRepository reviewRepository;
    private final VerificationDocumentRepository verificationDocumentRepository;
    private final BookingServiceClient bookingServiceClient;

    // PROFIL

    @Override
    public TutorProfileResponse createTutorProfile(TutorProfileRequest request) {
        if (tutorProfileRepository.existsByUserId(request.getUserId())) {
            throw new TutorAlreadyExistsException(request.getUserId());
        }
        TutorProfile profile = TutorProfile.builder()
                .userId(request.getUserId())
                .subjects(request.getSubjects())
                .levels(request.getLevels())
                .hourlyRate(request.getHourlyRate())
                .bio(request.getBio())
                .city(request.getCity())
                .districts(request.getDistricts())
                .build();
        return toResponse(tutorProfileRepository.save(profile));
    }

    @Override
    @Transactional(readOnly = true)
    public TutorProfileResponse getTutorById(Long id) {
        return toResponse(findTutorById(id));
    }

    @Override
    @Transactional(readOnly = true)
    public TutorProfileResponse getTutorByUserId(Long userId) {
        TutorProfile profile = tutorProfileRepository.findByUserId(userId)
                .orElseThrow(() -> new TutorNotFoundException("Aucun profil pour userId : " + userId));
        return toResponse(profile);
    }

    @Override
    public TutorProfileResponse updateProfile(Long id, TutorProfileRequest request) {
        TutorProfile profile = findTutorById(id);
        profile.setSubjects(request.getSubjects());
        profile.setLevels(request.getLevels());
        profile.setHourlyRate(request.getHourlyRate());
        profile.setBio(request.getBio());
        profile.setCity(request.getCity());
        profile.setDistricts(request.getDistricts());
        return toResponse(tutorProfileRepository.save(profile));
    }

    @Override
    @Transactional(readOnly = true)
    public List<TutorProfileResponse> searchTutors(TutorSearchRequest request) {
        return tutorProfileRepository.searchTutors(
                request.getSubject(),
                request.getLevel(),
                request.getCity(),
                request.getDistrict(),
                request.getMinPrice(),
                request.getMaxPrice(),
                request.getMinRating()
        ).stream().map(this::toResponse).toList();
    }

    @Override
    @Transactional(readOnly = true)
    public List<TutorProfileResponse> getAllVerifiedTutors() {
        return tutorProfileRepository.findByIsVerifiedTrue()
                .stream().map(this::toResponse).toList();
    }
    // ✎ AJOUT — matières distinctes, extraites du champ "subjects" (CSV)
    // de chaque tuteur vérifié
    @Override
    @Transactional(readOnly = true)
    public List<String> getAllAvailableSubjects() {
        return tutorProfileRepository.findByIsVerifiedTrue().stream()
                .filter(t -> t.getSubjects() != null)
                .flatMap(t -> java.util.Arrays.stream(t.getSubjects().split(",")))
                .map(String::trim)
                .filter(s -> !s.isEmpty())
                .distinct()
                .sorted()
                .toList();
    }

    // ✎ AJOUT — quartiers distincts, extraits du champ "districts" (CSV)
    @Override
    @Transactional(readOnly = true)
    public List<String> getAllAvailableDistricts() {
        return tutorProfileRepository.findByIsVerifiedTrue().stream()
                .filter(t -> t.getDistricts() != null)
                .flatMap(t -> java.util.Arrays.stream(t.getDistricts().split(",")))
                .map(String::trim)
                .filter(s -> !s.isEmpty())
                .distinct()
                .sorted()
                .toList();
    }
    // ✎ AJOUT — liste des tuteurs en attente de validation admin
    @Override
    @Transactional(readOnly = true)
    public List<TutorProfileResponse> getPendingTutors() {
        return tutorProfileRepository.findByIsVerifiedFalseAndRejectionReasonIsNull()
                .stream().map(this::toResponse).toList();
    }

    // DISPONIBILITES

    @Override
    @Transactional(readOnly = true)
    public List<AvailabilityRequest> getAvailability(Long tutorId) {
        findTutorById(tutorId);
        return availabilityRepository.findByTutorId(tutorId)
                .stream()
                .map(a -> AvailabilityRequest.builder()
                        .dayOfWeek(a.getDayOfWeek())
                        .startTime(a.getStartTime())
                        .endTime(a.getEndTime())
                        .isAvailable(a.getIsAvailable())
                        .build())
                .toList();
    }

    @Override
    public void setAvailability(Long tutorId, List<AvailabilityRequest> availabilities) {
        findTutorById(tutorId);
        availabilityRepository.deleteByTutorId(tutorId);
        List<Availability> entities = availabilities.stream()
                .map(r -> Availability.builder()
                        .tutorId(tutorId)
                        .dayOfWeek(r.getDayOfWeek())
                        .startTime(r.getStartTime())
                        .endTime(r.getEndTime())
                        .isAvailable(r.getIsAvailable() != null ? r.getIsAvailable() : true)
                        .build())
                .toList();
        availabilityRepository.saveAll(entities);
    }

    // AVIS

    @Override
    public ReviewResponse addReview(Long tutorId, ReviewRequest request) {
        findTutorById(tutorId);
        try {
            String status = bookingServiceClient.getBookingStatus(request.getBookingId());
            if (!"COMPLETED".equalsIgnoreCase(status)) {
                throw new BookingNotCompletedException(request.getBookingId());
            }
        } catch (BookingNotCompletedException e) {
            throw e;
        } catch (Exception e) {
            log.warn("booking-service indisponible, verification ignoree : {}", e.getMessage());
        }

        if (reviewRepository.existsByBookingId(request.getBookingId())) {
            throw new RuntimeException("Un avis existe deja pour cette reservation.");
        }

        Review review = Review.builder()
                .tutorId(tutorId)
                .studentId(request.getStudentId())
                .bookingId(request.getBookingId())
                .rating(request.getRating())
                .comment(request.getComment())
                .build();
        Review saved = reviewRepository.save(review);
        updateTutorRating(tutorId);
        return toReviewResponse(saved);
    }

    @Override
    @Transactional(readOnly = true)
    public List<ReviewResponse> getReviewsByTutor(Long tutorId) {
        findTutorById(tutorId);
        return reviewRepository.findByTutorId(tutorId)
                .stream().map(this::toReviewResponse).toList();
    }

    @Override
    @Transactional(readOnly = true)
    public List<ReviewResponse> getReviewsByStudent(Long studentId) {
        return reviewRepository.findByStudentId(studentId)
                .stream().map(this::toReviewResponse).toList();
    }

    // VERIFICATION

    @Override
    public VerificationDocument submitDocument(Long tutorId, VerificationDocumentRequest request) {
        findTutorById(tutorId);
        VerificationDocument doc = VerificationDocument.builder()
                .tutorId(tutorId)
                .documentType(request.getDocumentType())
                .fileUrl(request.getFileUrl())
                .status(DocumentStatus.PENDING)
                .build();
        return verificationDocumentRepository.save(doc);
    }

    @Override
    public VerificationDocument reviewDocument(Long documentId, DocumentStatus status, String note) {
        VerificationDocument doc = verificationDocumentRepository.findById(documentId)
                .orElseThrow(() -> new RuntimeException("Document introuvable : " + documentId));
        doc.setStatus(status);
        doc.setReviewNote(note);
        doc.setReviewedAt(LocalDateTime.now());
        return verificationDocumentRepository.save(doc);
    }
    
    // ✎ AJOUT — rejette explicitement un tuteur, avec motif optionnel
   // ✎ AJOUT — rejet explicite d'un tuteur, avec motif
    @Override
    public void rejectTutor(Long tutorId, String reason) {
        TutorProfile profile = findTutorById(tutorId);
        profile.setIsVerified(false);
        profile.setRejectionReason(reason != null ? reason : "Non spécifié");
        tutorProfileRepository.save(profile);
    }
    // ✎ AJOUT — gestion des matières (champ String "subjects" séparé par virgules)
    @Override
    @Transactional(readOnly = true)
    public List<String> getSubjects(Long tutorId) {
        TutorProfile profile = findTutorById(tutorId);
        return parseSubjects(profile.getSubjects());
    }

    @Override
    public List<String> addSubject(Long tutorId, String subject) {
        TutorProfile profile = findTutorById(tutorId);
        List<String> current = new java.util.ArrayList<>(parseSubjects(profile.getSubjects()));
        if (!current.contains(subject)) {
            current.add(subject);
        }
        profile.setSubjects(String.join(",", current));
        tutorProfileRepository.save(profile);
        return current;
    }

    @Override
    public List<String> removeSubject(Long tutorId, String subject) {
        TutorProfile profile = findTutorById(tutorId);
        List<String> current = new java.util.ArrayList<>(parseSubjects(profile.getSubjects()));
        current.remove(subject);
        profile.setSubjects(String.join(",", current));
        tutorProfileRepository.save(profile);
        return current;
    }

    private List<String> parseSubjects(String raw) {
        if (raw == null || raw.isBlank()) return List.of();
        return java.util.Arrays.stream(raw.split(","))
                .map(String::trim)
                .filter(s -> !s.isEmpty())
                .toList();
    }

    @Override
    public void verifyTutor(Long tutorId) {
        TutorProfile profile = findTutorById(tutorId);
        profile.setIsVerified(true);
        tutorProfileRepository.save(profile);
    }

    // HELPERS

    private TutorProfile findTutorById(Long id) {
        return tutorProfileRepository.findById(id)
                .orElseThrow(() -> new TutorNotFoundException(id));
    }

    private void updateTutorRating(Long tutorId) {
        Double avg = reviewRepository.calculateAverageRating(tutorId);
        long count = reviewRepository.findByTutorId(tutorId).size();
        TutorProfile profile = findTutorById(tutorId);
        profile.setRating(avg != null ? Math.round(avg * 10.0) / 10.0 : 0.0);
        profile.setTotalReviews((int) count);
        tutorProfileRepository.save(profile);
    }

    private TutorProfileResponse toResponse(TutorProfile p) {
        return TutorProfileResponse.builder()
                .id(p.getId())
                .userId(p.getUserId())
                .subjects(p.getSubjects())
                .levels(p.getLevels())
                .hourlyRate(p.getHourlyRate())
                .bio(p.getBio())
                .city(p.getCity())
                .districts(p.getDistricts())
                .isVerified(p.getIsVerified())
                .rating(p.getRating())
                .totalReviews(p.getTotalReviews())
                .build();
    }

   private ReviewResponse toReviewResponse(Review r) {
        return ReviewResponse.builder()
                .id(r.getId())
                .tutorId(r.getTutorId())
                .studentId(r.getStudentId())
                .bookingId(r.getBookingId())
                .rating(r.getRating())
                .comment(r.getComment())
                .createdAt(r.getCreatedAt())
                .build();
    }
    public ReviewResponse replyToReview(Long reviewId, String reply) {
        Review review = reviewRepository.findById(reviewId)
                .orElseThrow(() -> new RuntimeException("Avis introuvable"));
        review.setTutorReply(reply);
        review.setRepliedAt(java.time.LocalDateTime.now());
        reviewRepository.save(review);
        return toReviewResponse(review); // adapte au nom réel de ton mapper existant
    }
    @Override
    public ReviewResponse updateReview(Long reviewId, Long studentId, ReviewRequest request) {
        Review review = reviewRepository.findById(reviewId)
                .orElseThrow(() -> new RuntimeException("Avis introuvable"));
        if (!review.getStudentId().equals(studentId)) {
            throw new RuntimeException("Vous ne pouvez modifier que vos propres avis.");
        }
        review.setRating(request.getRating());
        review.setComment(request.getComment());
        reviewRepository.save(review);
        return toReviewResponse(review);
    }

    @Override
    public void deleteReview(Long reviewId, Long studentId) {
        Review review = reviewRepository.findById(reviewId)
                .orElseThrow(() -> new RuntimeException("Avis introuvable"));
        if (!review.getStudentId().equals(studentId)) {
            throw new RuntimeException("Vous ne pouvez supprimer que vos propres avis.");
        }
        reviewRepository.delete(review);
    }
    @Override
    public void deleteTutorProfileByUserId(Long userId) {
        tutorProfileRepository.findByUserId(userId).ifPresent(profile -> {
            availabilityRepository.deleteByTutorId(profile.getId());
            tutorProfileRepository.delete(profile);
        });
        // Ne fait rien si ce n'était pas un tuteur (userId sans profil) —
        // permet d'appeler cette méthode sans risque pour tout type de compte.
    }
}