

/**
 * Un groupe complet géré par le répétiteur connecté.
 * ⚠️ BACKEND : GET /api/tutor/groups
 *              GET /api/tutor/groups/:id
 */
export interface TutorGroupDetail {
  id: string;
  name: string;            // ex: "Maths BAC C/D · Groupe Élite"
  subject: string;         // ex: "Mathématiques"
  level: string;           // ex: "Terminale C/D"
  description: string;     // Description longue du groupe
  location: string;        // ex: "Centre Dschang"
  schedule: string;        // ex: "Mar & Sam · 16h-18h"
  scheduleDays: string[];  // ex: ["MAR", "SAM"]
  scheduleTime: string;    // ex: "16h-18h"
  enrolledCount: number;   // Élèves inscrits actuellement
  maxCapacity: number;     // Capacité maximale
  pricePerMonth: number;   // Tarif mensuel FCFA
  revenuePerMonth: number; // prix × inscrits
  isVerified: boolean;     // Groupe vérifié par l'admin
  rating: number;          // Note moyenne
  reviewCount: number;     // Nombre d'avis
  status: GroupStatus;
  createdAt: string;       // ISO 8601
  themes: string[];        // ex: ["Intégrales", "Probabilités"]
}

/** Statuts possibles d'un groupe */
export type GroupStatus = "ACTIVE" | "FULL" | "PAUSED" | "CLOSED";

/**
 * Un élève inscrit dans un groupe.
 * ⚠️ BACKEND : GET /api/tutor/groups/:id/students
 */
export interface GroupStudent {
  id: string;
  name: string;
  level: string;
  district: string;
  enrolledSince: string;       // ex: "Mars 2026"
  paymentStatus: PaymentStatus;
  lastPaymentDate: string;     // ex: "01/06/2026"
  phoneNumber: string;
}

/** Statut de paiement mensuel d'un élève */
export type PaymentStatus = "UP_TO_DATE" | "LATE" | "PENDING";

/**
 * Données du formulaire pour créer ou modifier un groupe.
 * ⚠️ BACKEND :
 *   POST /api/tutor/groups      → créer
 *   PUT  /api/tutor/groups/:id  → modifier
 */
export interface GroupFormData {
  name: string;
  subject: string;
  level: string;
  description: string;
  location: string;
  scheduleDays: string[];  // Jours cochés
  scheduleTime: string;    // ex: "16h-18h"
  maxCapacity: number;
  pricePerMonth: number;
  themes: string;          // Thèmes séparés par virgule
}

// ── Options des selects du formulaire ─────────────────────────

export const SCHEDULE_DAYS = [
  { value: "LUN", label: "Lundi"     },
  { value: "MAR", label: "Mardi"     },
  { value: "MER", label: "Mercredi"  },
  { value: "JEU", label: "Jeudi"     },
  { value: "VEN", label: "Vendredi"  },
  { value: "SAM", label: "Samedi"    },
  { value: "DIM", label: "Dimanche"  },
];

export const SUBJECTS = [
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

export const LEVELS = [
  "Primaire CM1/CM2",
  "6ème", "5ème", "4ème",
  "3ème (BEPC)",
  "Seconde", "Première",
  "Terminale C", "Terminale D", "Terminale A/B",
  "Collège & Lycée",
  "Tous niveaux",
];

export const DISTRICTS = [
  "Centre Dschang",
  "Quartier Foto",
  "Ngui Dschang",
  "Tsinkop",
  "Foréké",
];

export const SCHEDULE_TIMES = [
  "07h-09h", "09h-11h", "11h-13h",
  "13h-15h", "14h-16h", "15h-17h",
  "16h-18h", "17h-19h", "18h-20h",
  "19h-21h",
];