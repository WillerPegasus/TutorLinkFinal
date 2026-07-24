package com.tutorlink.tutorservice.service;

import com.tutorlink.tutorservice.dto.TutorProfileRequest;
import com.tutorlink.tutorservice.dto.TutorProfileResponse;
import com.tutorlink.tutorservice.dto.TutorSearchRequest;
import com.tutorlink.tutorservice.entity.TutorProfile;
import com.tutorlink.tutorservice.exception.TutorAlreadyExistsException;
import com.tutorlink.tutorservice.exception.TutorNotFoundException;
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

import java.util.List;
import java.util.Optional;

import static org.assertj.core.api.Assertions.*;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class TutorProfileServiceTest {

    @Mock private TutorProfileRepository tutorProfileRepository;
    @Mock private AvailabilityRepository availabilityRepository;
    @Mock private ReviewRepository reviewRepository;
    @Mock private VerificationDocumentRepository verificationDocumentRepository;
    @Mock private BookingServiceClient bookingServiceClient;

    @InjectMocks private TutorServiceImpl tutorService;

    private TutorProfileRequest validRequest;
    private TutorProfile savedProfile;

    @BeforeEach
    void setUp() {
        validRequest = TutorProfileRequest.builder()
                .userId(1L)
                .subjects("Mathematiques,Physique")
                .levels("3eme,Terminale")
                .hourlyRate(5000)
                .bio("Repetiteur experimente")
                .city("Dschang")
                .districts("Centre,Foto")
                .build();

        savedProfile = TutorProfile.builder()
                .id(1L)
                .userId(1L)
                .subjects("Mathematiques,Physique")
                .levels("3eme,Terminale")
                .hourlyRate(5000)
                .bio("Repetiteur experimente")
                .city("Dschang")
                .districts("Centre,Foto")
                .isVerified(false)
                .rating(0.0)
                .totalReviews(0)
                .build();
    }

    @Test
    @DisplayName("Creer un profil tuteur avec succes")
    void createTutorProfile_success() {
        when(tutorProfileRepository.existsByUserId(1L)).thenReturn(false);
        when(tutorProfileRepository.save(any(TutorProfile.class))).thenReturn(savedProfile);

        TutorProfileResponse response = tutorService.createTutorProfile(validRequest);

        assertThat(response).isNotNull();
        assertThat(response.getUserId()).isEqualTo(1L);
        assertThat(response.getSubjects()).isEqualTo("Mathematiques,Physique");
        assertThat(response.getCity()).isEqualTo("Dschang");
        assertThat(response.getIsVerified()).isFalse();
        verify(tutorProfileRepository).save(any(TutorProfile.class));
    }

    @Test
    @DisplayName("Creer un profil deja existant lance TutorAlreadyExistsException")
    void createTutorProfile_alreadyExists() {
        when(tutorProfileRepository.existsByUserId(1L)).thenReturn(true);

        assertThatThrownBy(() -> tutorService.createTutorProfile(validRequest))
                .isInstanceOf(TutorAlreadyExistsException.class)
                .hasMessageContaining("1");

        verify(tutorProfileRepository, never()).save(any());
    }

    @Test
    @DisplayName("Recuperer un tuteur par id")
    void getTutorById_success() {
        when(tutorProfileRepository.findById(1L)).thenReturn(Optional.of(savedProfile));

        TutorProfileResponse response = tutorService.getTutorById(1L);

        assertThat(response.getId()).isEqualTo(1L);
        assertThat(response.getHourlyRate()).isEqualTo(5000);
    }

    @Test
    @DisplayName("Tuteur introuvable lance TutorNotFoundException")
    void getTutorById_notFound() {
        when(tutorProfileRepository.findById(99L)).thenReturn(Optional.empty());

        assertThatThrownBy(() -> tutorService.getTutorById(99L))
                .isInstanceOf(TutorNotFoundException.class)
                .hasMessageContaining("99");
    }

    @Test
    @DisplayName("Recuperer un tuteur par userId")
    void getTutorByUserId_success() {
        when(tutorProfileRepository.findByUserId(1L)).thenReturn(Optional.of(savedProfile));

        TutorProfileResponse response = tutorService.getTutorByUserId(1L);

        assertThat(response.getUserId()).isEqualTo(1L);
    }

    @Test
    @DisplayName("Mettre a jour un profil tuteur")
    void updateProfile_success() {
        TutorProfileRequest updateRequest = TutorProfileRequest.builder()
                .userId(1L).subjects("Chimie").levels("Terminale")
                .hourlyRate(7000).bio("Bio mise a jour")
                .city("Bafoussam").districts("Tamdja")
                .build();

        when(tutorProfileRepository.findById(1L)).thenReturn(Optional.of(savedProfile));
        when(tutorProfileRepository.save(any())).thenAnswer(i -> i.getArgument(0));

        TutorProfileResponse response = tutorService.updateProfile(1L, updateRequest);

        assertThat(response.getSubjects()).isEqualTo("Chimie");
        assertThat(response.getCity()).isEqualTo("Bafoussam");
        assertThat(response.getHourlyRate()).isEqualTo(7000);
    }

    @Test
    @DisplayName("Recherche multicritere retourne des resultats")
    void searchTutors_withFilters() {
        TutorSearchRequest searchRequest = TutorSearchRequest.builder()
                .subject("Mathematiques").city("Dschang")
                .minPrice(3000).maxPrice(8000).build();

        when(tutorProfileRepository.searchTutors(
                "Mathematiques", null, "Dschang", null, 3000, 8000, null))
                .thenReturn(List.of(savedProfile));

        List<TutorProfileResponse> results = tutorService.searchTutors(searchRequest);

        assertThat(results).hasSize(1);
        assertThat(results.get(0).getCity()).isEqualTo("Dschang");
    }

    @Test
    @DisplayName("Recherche sans filtre retourne tous les tuteurs")
    void searchTutors_noFilters() {
        when(tutorProfileRepository.searchTutors(
                null, null, null, null, null, null, null))
                .thenReturn(List.of(savedProfile));

        List<TutorProfileResponse> results = tutorService.searchTutors(new TutorSearchRequest());

        assertThat(results).isNotEmpty();
    }

    @Test
    @DisplayName("Verifier un tuteur admin")
    void verifyTutor_success() {
        when(tutorProfileRepository.findById(1L)).thenReturn(Optional.of(savedProfile));
        when(tutorProfileRepository.save(any())).thenAnswer(i -> i.getArgument(0));

        tutorService.verifyTutor(1L);

        assertThat(savedProfile.getIsVerified()).isTrue();
        verify(tutorProfileRepository).save(savedProfile);
    }

    @Test
    @DisplayName("Recuperer uniquement les tuteurs verifies")
    void getAllVerifiedTutors_success() {
        savedProfile.setIsVerified(true);
        when(tutorProfileRepository.findByIsVerifiedTrue()).thenReturn(List.of(savedProfile));

        List<TutorProfileResponse> results = tutorService.getAllVerifiedTutors();

        assertThat(results).hasSize(1);
        assertThat(results.get(0).getIsVerified()).isTrue();
    }
}