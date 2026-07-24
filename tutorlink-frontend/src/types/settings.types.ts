// ============================================================
// FICHIER : src/types/settings.types.ts
// RÔLE    : Tous les types TypeScript pour la page Paramètres
//           du répétiteur. Couvre le profil, les matières,
//           la sécurité et les notifications.
// ============================================================

// ── Profil du répétiteur ──────────────────────────────────────

/**
 * Données du profil public du répétiteur.
 * ⚠️ BACKEND : GET  /api/tutor/profile
 *              PUT  /api/tutor/profile
 */
export interface TutorProfile {
  firstName: string;       // Prénom
  lastName: string;        // Nom
  email: string;           // Adresse email
  phone: string;           // Téléphone / Mobile Money
  district: string;        // Quartier à Dschang
  bio: string;             // Biographie / description
  pricePerHour: number;    // Tarif horaire en FCFA
  avatarUrl?: string;      // URL photo de profil (optionnel)
  formation: string;       // Diplôme / formation ex: "Licence Maths UDs"
}

// ── Matières enseignées ───────────────────────────────────────

/**
 * Une matière enseignée par le répétiteur.
 * ⚠️ BACKEND : GET    /api/tutor/subjects
 *              POST   /api/tutor/subjects
 *              DELETE /api/tutor/subjects/:id
 */
export interface TutorSubjectSetting {
  id: string;
  name: string;    // ex: "Mathématiques"
  level: string;   // ex: "Terminale C/D"
}

// ── Sécurité ──────────────────────────────────────────────────

/**
 * Données pour changer le mot de passe.
 * ⚠️ BACKEND : PUT /api/tutor/security/password
 */
export interface ChangePasswordData {
  currentPassword: string;
  newPassword: string;
  confirmPassword: string;
}

// ── Notifications ─────────────────────────────────────────────

/**
 * Préférences de notifications du répétiteur.
 * ⚠️ BACKEND : GET /api/tutor/notifications/preferences
 *              PUT /api/tutor/notifications/preferences
 */
export interface NotificationPreferences {
  smsNewRequest: boolean;      // SMS à chaque nouvelle demande
  smsPaymentReceived: boolean; // SMS quand un paiement est reçu
  smsNewReview: boolean;       // SMS quand un avis est posté
  emailWeeklySummary: boolean; // Email récap hebdomadaire
  emailNewRequest: boolean;    // Email à chaque nouvelle demande
}

// ── Sections de la page Paramètres ───────────────────────────

/** Identifiants des sections (pour la navigation par ancre) */
export type SettingsSection =
  | "profile"
  | "subjects"
  | "security"
  | "notifications";

/** Onglet actif */
export interface SettingsTab {
  id: SettingsSection;
  label: string;
  icon: string;
}

export const SETTINGS_TABS: SettingsTab[] = [
  { id: "profile",       label: "Profil",        icon: "👤" },
  { id: "subjects",      label: "Matières",       icon: "📚" },
  { id: "security",      label: "Sécurité",       icon: "🔒" },
  { id: "notifications", label: "Notifications",  icon: "🔔" },
];

// ── Quartiers Dschang ─────────────────────────────────────────
export const SETTING_DISTRICTS = [
  "Centre Dschang",
  "Quartier Foto",
  "Ngui Dschang",
  "Tsinkop",
  "Foréké",
];

// ── Matières disponibles ──────────────────────────────────────
export const SETTING_SUBJECTS = [
  "Mathématiques",
  "Physique-Chimie",
  "SVT",
  "Français",
  "Anglais",
  "Informatique",
  "Histoire-Géographie",
  "Philosophie",
  "Économie",
];

// ── Niveaux scolaires ─────────────────────────────────────────
export const SETTING_LEVELS = [
  "Primaire CM1/CM2",
  "6ème", "5ème", "4ème",
  "3ème (BEPC)",
  "Seconde", "Première",
  "Terminale C", "Terminale D", "Terminale A/B",
  "Collège & Lycée",
  "Tous niveaux",
];