package com.tutorlink.tutorservice.repository;

import com.tutorlink.tutorservice.TutorServiceApplication;
import com.tutorlink.tutorservice.entity.TutorProfile;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.orm.jpa.DataJpaTest;
import org.springframework.boot.test.autoconfigure.orm.jpa.AutoConfigureTestEntityManager;
import org.springframework.test.context.ActiveProfiles;
import org.springframework.test.context.ContextConfiguration;

import java.util.List;
import java.util.Optional;

import static org.assertj.core.api.Assertions.*;

@DataJpaTest
@ActiveProfiles("test")
@ContextConfiguration(classes = TutorServiceApplication.class)
class TutorProfileRepositoryTest {

    @Autowired
    private TutorProfileRepository tutorProfileRepository;

    private TutorProfile profile;

    @BeforeEach
    void setUp() {
        tutorProfileRepository.deleteAll();
        profile = TutorProfile.builder()
                .userId(1L)
                .subjects("Mathematiques,Physique")
                .levels("3eme,Terminale")
                .hourlyRate(5000)
                .bio("Repetiteur experimente")
                .city("Dschang")
                .districts("Centre,Foto")
                .isVerified(false)
                .rating(4.5)
                .totalReviews(10)
                .build();
        tutorProfileRepository.save(profile);
    }

    @Test
    @DisplayName("Trouver un profil par userId")
    void findByUserId_success() {
        Optional<TutorProfile> result = tutorProfileRepository.findByUserId(1L);
        assertThat(result).isPresent();
        assertThat(result.get().getCity()).isEqualTo("Dschang");
    }

    @Test
    @DisplayName("existsByUserId retourne true si existe")
    void existsByUserId_true() {
        assertThat(tutorProfileRepository.existsByUserId(1L)).isTrue();
    }

    @Test
    @DisplayName("existsByUserId retourne false si inexistant")
    void existsByUserId_false() {
        assertThat(tutorProfileRepository.existsByUserId(99L)).isFalse();
    }

    @Test
    @DisplayName("Recherche par matiere")
    void searchTutors_bySubject() {
        List<TutorProfile> results = tutorProfileRepository.searchTutors(
                "Mathematiques", null, null, null, null, null, null);
        assertThat(results).hasSize(1);
    }

    @Test
    @DisplayName("Recherche par ville et note minimale")
    void searchTutors_byCityAndRating() {
        List<TutorProfile> results = tutorProfileRepository.searchTutors(
                null, null, "Dschang", null, null, null, 4.0);
        assertThat(results).hasSize(1);
    }

    @Test
    @DisplayName("Recherche par prix max")
    void searchTutors_byMaxPrice() {
        List<TutorProfile> results = tutorProfileRepository.searchTutors(
                null, null, null, null, null, 6000, null);
        assertThat(results).hasSize(1);
    }

    @Test
    @DisplayName("Recherche avec prix trop bas retourne vide")
    void searchTutors_priceTooLow() {
        List<TutorProfile> results = tutorProfileRepository.searchTutors(
                null, null, null, null, null, 3000, null);
        assertThat(results).isEmpty();
    }

    @Test
    @DisplayName("findByIsVerifiedTrue retourne seulement les verifies")
    void findByIsVerifiedTrue() {
        profile.setIsVerified(true);
        tutorProfileRepository.save(profile);
        List<TutorProfile> results = tutorProfileRepository.findByIsVerifiedTrue();
        assertThat(results).hasSize(1);
        assertThat(results.get(0).getIsVerified()).isTrue();
    }
}