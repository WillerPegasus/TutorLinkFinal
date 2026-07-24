// ============================================================
// FICHIER : src/services/settingsService.ts
// RÔLE    : Couche d'accès à l'API pour les paramètres
//           du répétiteur. Données MOCK pendant le dev.
//
// ⚠️ BACKEND — Endpoints :
//   GET  /api/tutor/profile                      → TutorProfile
//   PUT  /api/tutor/profile                      → TutorProfile
//   GET  /api/tutor/subjects                     → TutorSubjectSetting[]
//   POST /api/tutor/subjects                     → TutorSubjectSetting
//   DELETE /api/tutor/subjects/:id               → { message }
//   PUT  /api/tutor/security/password            → { message }
//   GET  /api/tutor/notifications/preferences    → NotificationPreferences
//   PUT  /api/tutor/notifications/preferences    → NotificationPreferences
// ============================================================

import type {
  TutorProfile,
  TutorSubjectSetting,
  ChangePasswordData,
  NotificationPreferences,
} from "../types/settings.types";

const BASE_URL = import.meta.env.VITE_API_URL ?? "http://localhost:3000/api";

const headers = () => ({
  "Content-Type": "application/json",
  Authorization: `Bearer ${localStorage.getItem("token") ?? ""}`,
});

const delay = (ms: number) => new Promise<void>((r) => setTimeout(r, ms));

// ══════════════════════════════════════════════════════════════
// DONNÉES MOCK
// ══════════════════════════════════════════════════════════════

let MOCK_PROFILE: TutorProfile = {
  firstName:    "Leonel",
  lastName:     "Nguimgo",
  email:        "l.nguimgo@tutorlink.cm",
  phone:        "+237 6 78 12 34 56",
  district:     "Centre Dschang",
  bio:          "10 ans d'expérience dans l'enseignement des mathématiques, " +
                "ancien enseignant titulaire au Lycée Classique de Dschang. " +
                "Spécialisé dans la préparation au BAC C et D. Plus de 300 élèves " +
                "accompagnés depuis 2016, avec un taux de réussite au BAC de 94%.",
  pricePerHour: 2000,
  formation:    "Licence Mathématiques · Université de Dschang",
};

let MOCK_SUBJECTS: TutorSubjectSetting[] = [
  { id: "sub1", name: "Mathématiques", level: "Terminale C"  },
  { id: "sub2", name: "Mathématiques", level: "Terminale D"  },
  { id: "sub3", name: "Mathématiques", level: "Première"     },
  { id: "sub4", name: "Préparation BAC", level: "Terminale"  },
  { id: "sub5", name: "Mathématiques", level: "3ème (BEPC)"  },
];

let MOCK_NOTIFICATIONS: NotificationPreferences = {
  smsNewRequest:       true,
  smsPaymentReceived:  true,
  smsNewReview:        false,
  emailWeeklySummary:  true,
  emailNewRequest:     false,
};

// ══════════════════════════════════════════════════════════════
// FONCTIONS EXPORTÉES
// ══════════════════════════════════════════════════════════════

/**
 * Charge le profil du répétiteur connecté.
 * ⚠️ BACKEND : GET /api/tutor/profile
 */
export async function getTutorProfile(): Promise<TutorProfile> {
  // ── MOCK ──────────────────────────────────────────────────
  await delay(400);
  return { ...MOCK_PROFILE };

  // ── PRODUCTION ────────────────────────────────────────────
  // const res = await fetch(`${BASE_URL}/tutor/profile`, {
  //   headers: headers(),
  // });
  // if (!res.ok) throw new Error("Erreur chargement profil");
  // return res.json();
}

/**
 * Met à jour le profil du répétiteur.
 * ⚠️ BACKEND : PUT /api/tutor/profile
 *   Retourne le profil mis à jour avec les nouvelles valeurs.
 */
export async function updateTutorProfile(
  data: TutorProfile
): Promise<TutorProfile> {
  // ── MOCK ──────────────────────────────────────────────────
  await delay(600);
  MOCK_PROFILE = { ...data };
  // Met à jour aussi le prénom stocké localement
  localStorage.setItem("tutor_first_name", data.firstName);
  return { ...MOCK_PROFILE };

  // ── PRODUCTION ────────────────────────────────────────────
  // const res = await fetch(`${BASE_URL}/tutor/profile`, {
  //   method: "PUT",
  //   headers: headers(),
  //   body: JSON.stringify(data),
  // });
  // if (!res.ok) throw new Error("Erreur mise à jour profil");
  // return res.json();
}

/**
 * Charge les matières enseignées par le répétiteur.
 * ⚠️ BACKEND : GET /api/tutor/subjects
 */
export async function getTutorSubjects(): Promise<TutorSubjectSetting[]> {
  // ── MOCK ──────────────────────────────────────────────────
  await delay(300);
  return [...MOCK_SUBJECTS];

  // ── PRODUCTION ────────────────────────────────────────────
  // const res = await fetch(`${BASE_URL}/tutor/subjects`, {
  //   headers: headers(),
  // });
  // if (!res.ok) throw new Error("Erreur chargement matières");
  // return res.json();
}

/**
 * Ajoute une nouvelle matière enseignée.
 * ⚠️ BACKEND : POST /api/tutor/subjects
 */
export async function addTutorSubject(
  name: string,
  level: string
): Promise<TutorSubjectSetting> {
  // ── MOCK ──────────────────────────────────────────────────
  await delay(400);
  const newSubject: TutorSubjectSetting = {
    id: `sub${Date.now()}`,
    name,
    level,
  };
  MOCK_SUBJECTS = [...MOCK_SUBJECTS, newSubject];
  return newSubject;

  // ── PRODUCTION ────────────────────────────────────────────
  // const res = await fetch(`${BASE_URL}/tutor/subjects`, {
  //   method: "POST",
  //   headers: headers(),
  //   body: JSON.stringify({ name, level }),
  // });
  // if (!res.ok) throw new Error("Erreur ajout matière");
  // return res.json();
}

/**
 * Supprime une matière enseignée.
 * ⚠️ BACKEND : DELETE /api/tutor/subjects/:subjectId
 */
export async function removeTutorSubject(subjectId: string): Promise<void> {
  // ── MOCK ──────────────────────────────────────────────────
  await delay(350);
  MOCK_SUBJECTS = MOCK_SUBJECTS.filter((s) => s.id !== subjectId);

  // ── PRODUCTION ────────────────────────────────────────────
  // const res = await fetch(`${BASE_URL}/tutor/subjects/${subjectId}`, {
  //   method: "DELETE",
  //   headers: headers(),
  // });
  // if (!res.ok) throw new Error("Erreur suppression matière");
}

/**
 * Change le mot de passe du répétiteur.
 * ⚠️ BACKEND : PUT /api/tutor/security/password
 *   Le backend vérifie currentPassword avant de changer.
 */
export async function changePassword(
  data: ChangePasswordData
): Promise<void> {
  // ── MOCK ──────────────────────────────────────────────────
  await delay(700);
  // Simule une vérification : mot de passe actuel incorrect
  if (data.currentPassword === "wrong") {
    throw new Error("Mot de passe actuel incorrect");
  }

  // ── PRODUCTION ────────────────────────────────────────────
  // const res = await fetch(`${BASE_URL}/tutor/security/password`, {
  //   method: "PUT",
  //   headers: headers(),
  //   body: JSON.stringify(data),
  // });
  // if (!res.ok) {
  //   const err = await res.json();
  //   throw new Error(err.message ?? "Erreur changement mot de passe");
  // }
}

/**
 * Charge les préférences de notifications.
 * ⚠️ BACKEND : GET /api/tutor/notifications/preferences
 */
export async function getNotificationPreferences(): Promise<NotificationPreferences> {
  // ── MOCK ──────────────────────────────────────────────────
  await delay(300);
  return { ...MOCK_NOTIFICATIONS };

  // ── PRODUCTION ────────────────────────────────────────────
  // const res = await fetch(`${BASE_URL}/tutor/notifications/preferences`, {
  //   headers: headers(),
  // });
  // if (!res.ok) throw new Error("Erreur chargement notifications");
  // return res.json();
}

/**
 * Sauvegarde les préférences de notifications.
 * ⚠️ BACKEND : PUT /api/tutor/notifications/preferences
 */
export async function updateNotificationPreferences(
  prefs: NotificationPreferences
): Promise<NotificationPreferences> {
  // ── MOCK ──────────────────────────────────────────────────
  await delay(400);
  MOCK_NOTIFICATIONS = { ...prefs };
  return { ...MOCK_NOTIFICATIONS };

  // ── PRODUCTION ────────────────────────────────────────────
  // const res = await fetch(`${BASE_URL}/tutor/notifications/preferences`, {
  //   method: "PUT",
  //   headers: headers(),
  //   body: JSON.stringify(prefs),
  // });
  // if (!res.ok) throw new Error("Erreur mise à jour notifications");
  // return res.json();
}