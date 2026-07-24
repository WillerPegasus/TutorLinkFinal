package com.tutorlink.tutorservice.service;

import com.tutorlink.tutorservice.dto.AvailabilityRequest;
import com.tutorlink.tutorservice.entity.Availability;
import com.tutorlink.tutorservice.entity.TutorProfile;
import com.tutorlink.tutorservice.enums.DayOfWeek;
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

import java.time.LocalTime;
import java.util.List;
import java.util.Optional;

import static org.assertj.core.api.Assertions.*;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class AvailabilityServiceTest {

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
    @DisplayName("Definir les disponibilites d un tuteur")
    void setAvailability_success() {
        List<AvailabilityRequest> requests = List.of(
                AvailabilityRequest.builder()
                        .dayOfWeek(DayOfWeek.LUNDI)
                        .startTime(LocalTime.of(8, 0))
                        .endTime(LocalTime.of(12, 0))
                        .isAvailable(true).build(),
                AvailabilityRequest.builder()
                        .dayOfWeek(DayOfWeek.MERCREDI)
                        .startTime(LocalTime.of(14, 0))
                        .endTime(LocalTime.of(18, 0))
                        .isAvailable(true).build()
        );

        when(tutorProfileRepository.findById(1L)).thenReturn(Optional.of(tutorProfile));

        tutorService.setAvailability(1L, requests);

        verify(availabilityRepository).deleteByTutorId(1L);
        verify(availabilityRepository).saveAll(anyList());
    }

    @Test
    @DisplayName("Recuperer les disponibilites d un tuteur")
    void getAvailability_success() {
        Availability availability = Availability.builder()
                .id(1L).tutorId(1L).dayOfWeek(DayOfWeek.LUNDI)
                .startTime(LocalTime.of(8, 0))
                .endTime(LocalTime.of(12, 0))
                .isAvailable(true).build();

        when(tutorProfileRepository.findById(1L)).thenReturn(Optional.of(tutorProfile));
        when(availabilityRepository.findByTutorId(1L)).thenReturn(List.of(availability));

        List<AvailabilityRequest> result = tutorService.getAvailability(1L);

        assertThat(result).hasSize(1);
        assertThat(result.get(0).getDayOfWeek()).isEqualTo(DayOfWeek.LUNDI);
        assertThat(result.get(0).getStartTime()).isEqualTo(LocalTime.of(8, 0));
    }

    @Test
    @DisplayName("Disponibilites vides si aucun creneau defini")
    void getAvailability_empty() {
        when(tutorProfileRepository.findById(1L)).thenReturn(Optional.of(tutorProfile));
        when(availabilityRepository.findByTutorId(1L)).thenReturn(List.of());

        List<AvailabilityRequest> result = tutorService.getAvailability(1L);

        assertThat(result).isEmpty();
    }
}