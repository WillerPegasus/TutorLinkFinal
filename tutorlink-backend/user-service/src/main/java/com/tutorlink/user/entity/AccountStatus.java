package com.tutorlink.user.entity;

// ✎ AJOUT V4 : statut du compte, utilisé par le back-office admin
// (boutons "Suspendre" / "Réactiver" sur admin-users)
public enum AccountStatus {
    ACTIVE,      // Compte actif, peut utiliser la plateforme normalement
    SUSPENDED,   // Compte suspendu par un admin
    PENDING      // En attente de validation (réservé à un usage futur)
}