package com.tutorlink.tutorservice.service;

import com.tutorlink.tutorservice.dto.ReviewRequest;
import com.tutorlink.tutorservice.dto.ReviewResponse;
import com.tutorlink.tutorservice.entity.Review;
import com.tutorlink.tutorservice.entity.TutorProfile;
import com.tutorlink.tutorservice.exception.BookingNotCompletedException;
import com.tutorlink.tutorservice.feign.BookingServiceClient;
import com.tutorlink.tutorservice.repository.AvailabilityRepository;
import com.tutorlink.tutorservice.repository.ReviewRepository;
import com.tutorlink.tutorservice.repository.TutorProfileRepository;
import com.tutorlink.tutorservice.repository.VerificationDocumentRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

import static org.assertj.core.api.Assertions.*;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class ReviewServiceTest {

    @Mock private TutorProfileRepository tutorProfileRepository;
    @Mock private AvailabilityRepository availabilityRepository;
    @Mock private ReviewRepository reviewRepository;
    @Mock private VerificationDocumentRepository verificationDocumentRepository;
    @Mock private BookingServiceClient bookingServiceClient;

    @InjectMocks private TutorServiceImpl tutorService;

    private TutorProfile tutorProfile;

    @BeforeEach
    void setUp() {
        tutorProfile = TutorProfile.builder()
                .id(1L).userId(1L).city("Dschang")
                .isVerified(false).rating(0.0).totalReviews(0)
                .build();
    }

    @Test
    @DisplayName("Ajouter un avis apres reservation COMPLETED")
    void addReview_success() {
        ReviewRequest request = ReviewRequest.builder()
                .studentId(2L).bookingId(10L)
                .rating(5).comment("Excellent repetiteur !")
                .build();

        Review saved = Review.builder()
                .id(1L).tutorId(1L).studentId(2L).bookingId(10L)
                .rating(5).comment("Excellent repetiteur !")
                .createdAt(LocalDateTime.now()).build();

        when(tutorProfileRepository.findById(1L)).thenReturn(Optional.of(tutorProfile));
        when(bookingServiceClient.getBookingStatus(10L)).thenReturn("COMPLETED");
        when(reviewRepository.existsByBookingId(10L)).thenReturn(false);
        when(reviewRepository.save(any(Review.class))).thenReturn(saved);
        when(reviewRepository.findByTutorId(1L)).thenReturn(List.of(saved));
        when(reviewRepository.calculateAverageRating(1L)).thenReturn(5.0);

        ReviewResponse response = tutorService.addReview(1L, request);

        assertThat(response).isNotNull();
        assertThat(response.getRating()).isEqualTo(5);
        assertThat(response.getComment()).isEqualTo("Excellent repetiteur !");
    }

    @Test
    @DisplayName("Avis refuse si reservation non COMPLETED")
    void addReview_bookingNotCompleted() {
        ReviewRequest request = ReviewRequest.builder()
                .studentId(2L).bookingId(10L).rating(4).comment("Bien").build();

        when(tutorProfileRepository.findById(1L)).thenReturn(Optional.of(tutorProfile));
        when(bookingServiceClient.getBookingStatus(10L)).thenReturn("PENDING");

        assertThatThrownBy(() -> tutorService.addReview(1L, request))
                .isInstanceOf(BookingNotCompletedException.class)
                .hasMessageContaining("10");
    }

    @Test
    @DisplayName("Avis en double sur la meme reservation")
    void addReview_duplicateBooking() {
        ReviewRequest request = ReviewRequest.builder()
                .studentId(2L).bookingId(10L).rating(3).comment("Correct").build();

        when(tutorProfileRepository.findById(1L)).thenReturn(Optional.of(tutorProfile));
        when(bookingServiceClient.getBookingStatus(10L)).thenReturn("COMPLETED");
        when(reviewRepository.existsByBookingId(10L)).thenReturn(true);

        assertThatThrownBy(() -> tutorService.addReview(1L, request))
                .isInstanceOf(RuntimeException.class)
                .hasMessageContaining("avis existe deja");
    }

    @Test
    @DisplayName("Recuperer les avis d un tuteur")
    void getReviewsByTutor_success() {
        Review review = Review.builder()
                .id(1L).tutorId(1L).studentId(2L).bookingId(10L)
                .rating(4).comment("Tres bien").createdAt(LocalDateTime.now()).build();

        when(tutorProfileRepository.findById(1L)).thenReturn(Optional.of(tutorProfile));
        when(reviewRepository.findByTutorId(1L)).thenReturn(List.of(review));

        List<ReviewResponse> result = tutorService.getReviewsByTutor(1L);

        assertThat(result).hasSize(1);
        assertThat(result.get(0).getRating()).isEqualTo(4);
    }

    @Test
    @DisplayName("Recuperer les avis d un etudiant")
    void getReviewsByStudent_success() {
        Review review = Review.builder()
                .id(1L).tutorId(1L).studentId(2L).bookingId(10L)
                .rating(5).comment("Top !").createdAt(LocalDateTime.now()).build();

        when(reviewRepository.findByStudentId(2L)).thenReturn(List.of(review));

        List<ReviewResponse> result = tutorService.getReviewsByStudent(2L);

        assertThat(result).hasSize(1);
        assertThat(result.get(0).getStudentId()).isEqualTo(2L);
    }
}