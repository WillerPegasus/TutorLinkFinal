# TutorLink - Backend Microservices

Plateforme de mise en relation entre etudiants et repetiteurs,
developpee dans le cadre du projet de fin de formation a l'Universite de Dschang (Juin 2026).

---

## Architecture generale




---

## Microservices

| Service | Port | Responsable | Description |
|---------|------|-------------|-------------|
| api-gateway | 8080 | - | Point d entree unique, routage, JWT |
| auth-service | 8081 | - | Authentification, JWT, email |
| user-service | 8082 | - | Profils utilisateurs, roles |
| tutor-service | 8083 | MB3 - Charlie | Profils repetiteurs, disponibilites, avis |
| booking-service | 8084 | - | Reservations de sessions |
| notification-service | 8085 | - | Notifications email et systeme |
| message-service | 8086 | - | Messagerie temps reel WebSocket |

---

## Technologies utilisees

| Technologie | Version | Usage |
|-------------|---------|-------|
| Java | 21 | Langage principal |
| Spring Boot | 3.2.5 | Framework principal |
| Spring Cloud | 2023.0.1 | Microservices |
| Spring Cloud Gateway | 2023.0.1 | API Gateway |
| Spring Cloud Eureka | 2023.0.1 | Service Discovery |
| Spring Cloud OpenFeign | 2023.0.1 | Communication inter-services |
| Spring Security + JWT | 3.2.5 | Authentification |
| Spring Data JPA | 3.2.5 | Persistance |
| MySQL | 8.x | Base de donnees |
| WebSocket | - | Messagerie temps reel |
| Lombok | 1.18.30 | Reduction boilerplate |
| Maven | 3.9.x | Build |
| JUnit 5 + Mockito | - | Tests unitaires |

---

## Prerequis

- Java 21
- Maven 3.9+
- MySQL 8+
- Git

---

## Installation et demarrage

### 1. Cloner le projet

    git clone https://github.com/A1B2C3D3E/tutorlink-backend.git
    cd tutorlink-backend

### 2. Configurer MySQL

Creer les bases de donnees :

    CREATE DATABASE tutorlink_auth;
    CREATE DATABASE tutorlink_users;
    CREATE DATABASE tutorlink_tutors;
    CREATE DATABASE tutorlink_bookings;
    CREATE DATABASE tutorlink_notifications;
    CREATE DATABASE tutorlink_messages;

### 3. Configurer les application.properties

Dans chaque service, modifier src/main/resources/application.properties :

    spring.datasource.username=root
    spring.datasource.password=VOTRE_MOT_DE_PASSE

### 4. Ordre de demarrage

    # Etape 1 - Eureka Server
    cd eureka-server && mvn spring-boot:run

    # Etape 2 - Services metier
    cd auth-service && mvn spring-boot:run
    cd user-service && mvn spring-boot:run
    cd tutor-service && mvn spring-boot:run
    cd booking-service && mvn spring-boot:run
    cd notification-service && mvn spring-boot:run
    cd message-service && mvn spring-boot:run

    # Etape 3 - API Gateway (en dernier)
    cd api-gateway && mvn spring-boot:run

---

## Tests

    mvn test -pl tutor-service

Resultats tutor-service : 27 tests, 0 echecs

---

## Structure du projet

    tutorlink-backend/
    api-gateway/
    auth-service/
    user-service/
    tutor-service/          (MB3 - Charlie)
    booking-service/
    notification-service/
    message-service/
    pom.xml
    README.md

---

## API Gateway - Endpoints principaux

| Prefixe | Service cible |
|---------|---------------|
| /api/auth/** | auth-service |
| /api/users/** | user-service |
| /api/tutors/** | tutor-service |
| /api/bookings/** | booking-service |
| /api/notifications/** | notification-service |
| /api/messages/** | message-service |

---

## Communication inter-services

| Source | Destination | But |
|--------|-------------|-----|
| tutor-service | booking-service | Verifier statut reservation avant avis |
| auth-service | user-service | Creer profil apres inscription |
| booking-service | notification-service | Notifier apres reservation |
| api-gateway | auth-service | Valider token JWT |

---

## Equipe

| Membre | Service | Role |
|--------|---------|------|
| MB3 - Charlie | tutor-service | Profils repetiteurs, recherche, avis |
| Melvina | Frontend | SearchPage, TutorCard, FilterPanel |
| Marlysiakay | Frontend | TutorAvailability |

---

## Projet

- Universite de Dschang
- Projet de fin de formation
- Juin 2026
