# TutorLink - Tutor Service

Microservice de gestion des repetiteurs de la plateforme TutorLink.
Developpe dans le cadre du projet de fin de formation a l Universite de Dschang (Juin 2026).

---

## Technologies utilisees

| Technologie | Version |
|-------------|---------|
| Java | 17 |
| Spring Boot | 3.2.5 |
| Spring Cloud Eureka | 2023.0.1 |
| Spring Cloud OpenFeign | 2023.0.1 |
| MySQL | 8.x |
| Lombok | 1.18.30 |
| Maven | 3.9.x |
| H2 (tests) | 2.2.x |
| JUnit 5 + Mockito | - |

---

## Prerequis

- Java 17+
- Maven 3.9+
- MySQL 8+
- Eureka Server sur le port 8761

---

## Lancer le service

    mvn clean install -DskipTests
    mvn spring-boot:run

Service accessible sur : http://localhost:8083

---

## Lancer les tests

    mvn test -pl tutor-service

Resultats : 27 tests, 0 echecs

    TutorProfileRepositoryTest   : 8/8
    AvailabilityServiceTest      : 3/3
    ReviewServiceTest            : 5/5
    TutorProfileServiceTest      : 10/10
    TutorServiceApplicationTests : 1/1

---

## Endpoints API

### Profils Tuteurs

| Methode | URL | Description |
|---------|-----|-------------|
| POST | /api/tutors | Creer un profil tuteur |
| GET | /api/tutors/{id} | Recuperer par ID |
| GET | /api/tutors/user/{userId} | Recuperer par userId |
| PUT | /api/tutors/{id} | Modifier un profil |
| GET | /api/tutors/verified | Tuteurs verifies |
| PATCH | /api/tutors/{id}/verify | Verifier (admin) |

### Recherche Multicritere

| Methode | URL | Parametres |
|---------|-----|------------|
| GET | /api/tutors/search | subject, level, city, district, minPrice, maxPrice, minRating |

### Disponibilites

| Methode | URL | Description |
|---------|-----|-------------|
| GET | /api/tutors/{tutorId}/availability | Voir les disponibilites |
| PUT | /api/tutors/{tutorId}/availability | Definir les disponibilites |

### Avis

| Methode | URL | Description |
|---------|-----|-------------|
| POST | /api/tutors/{tutorId}/reviews | Ajouter un avis |
| GET | /api/tutors/{tutorId}/reviews | Avis d un tuteur |
| GET | /api/reviews/tutor/{studentId} | Avis d un etudiant |

### Documents de Verification

| Methode | URL | Description |
|---------|-----|-------------|
| POST | /api/tutors/{tutorId}/documents | Soumettre un document |
| PATCH | /api/tutors/documents/{documentId}/review | Reviser (admin) |

---

## Communication inter-services

Ce service communique avec booking-service via OpenFeign pour verifier
qu une reservation est COMPLETED avant d accepter un avis.

    tutor-service -> booking-service
    GET /api/bookings/{bookingId}/status

---

## Auteur

- Assigne a : MB3 - Charlie
- Projet : TutorLink - Universite de Dschang
- Promotion : Juin 2026
