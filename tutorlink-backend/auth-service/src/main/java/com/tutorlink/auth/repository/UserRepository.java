package com.tutorlink.auth.repository;

import com.tutorlink.auth.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.Optional;

// @Repository dit à Spring : "cette interface gère l'accès à la base de données"
// Spring va créer automatiquement une implémentation complète de cette interface
// Tu n'as pas besoin d'écrire une seule ligne de SQL !
@Repository

// JpaRepository<User, Long> signifie :
// - On travaille avec l'entité User
// - La clé primaire (ID) est de type Long
// En étendant JpaRepository, tu hérites GRATUITEMENT de plein de méthodes :
// save(user)        → INSERT ou UPDATE en base
// findById(id)      → SELECT * FROM users WHERE id = ?
// findAll()         → SELECT * FROM users
// delete(user)      → DELETE FROM users WHERE id = ?
// existsById(id)    → SELECT COUNT(*) FROM users WHERE id = ?
// ... et bien d'autres !
public interface UserRepository extends JpaRepository<User, Long> {

    // Spring lit le nom de la méthode et génère le SQL automatiquement !
    // "findBy" + "Email" → SELECT * FROM users WHERE email = ?
    //
    // On retourne Optional<User> et non User directement car :
    // - Si l'email existe → Optional contient le User
    // - Si l'email n'existe pas → Optional est vide (pas de NullPointerException !)
    // C'est plus sûr que de retourner null
    Optional<User> findByEmail(String email);
// ✎ V3 : chercher un utilisateur par son numéro de téléphone
// Utilisé dans AuthService.login() si la recherche par email échoue
Optional<User> findByPhone(String phone);
    // "existsBy" + "Email" → SELECT COUNT(*) FROM users WHERE email = ?
    // Retourne true si un utilisateur avec cet email existe déjà
    // Retourne false sinon
    // On l'utilisera dans AuthService pour vérifier les doublons à l'inscription
    boolean existsByEmail(String email);
    boolean existsByPhone(String phone);
}