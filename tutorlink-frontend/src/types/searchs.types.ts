// ============================================================
// Types TypeScript pour la page "Recherche" (espace public)
// Définit les interfaces des répétiteurs, filtres et résultats
// ============================================================

// ── Répétiteur affiché dans la grille de recherche ───────────

/**
 * Un répétiteur dans la liste de recherche.
 * ⚠️ BACKEND : provient de GET /api/tutors (avec filtres)
 */
export interface SearchTutor {
  id: string;            // Identifiant unique du répétiteur
  firstName: string;     // Prénom ex: "Eric"
  lastName: string;      // Nom de famille ex: "Kamga"
  subject: string;       // Matière principale ex: "Mathématiques"
  level: string;         // Niveau enseigné ex: "Terminale C/D"
  district: string;      // Quartier ex: "Centre Dschang"
  bio: string;           // Courte description visible sur la carte
  pricePerHour: number;  // Tarif horaire en FCFA ex: 2000
  rating: number;        // Note moyenne ex: 4.9
  reviewCount: number;   // Nombre d'avis ex: 87
  isVerified: boolean;   // Badge CNI + diplôme vérifié par l'admin
  avatarUrl?: string;    // URL photo de profil (optionnel)
  formation: string;     // Diplôme ex: "Licence Maths · UDs"
}

// ── Valeurs des filtres sélectionnés par l'utilisateur ───────

/**
 * Ensemble des filtres actifs sur la page de recherche.
 * Transmis comme query params à l'API backend.
 */
export interface SearchFilters {
  subject: string;       // Matière ex: "Mathématiques" ou "" pour toutes
  level: string;         // Niveau scolaire ex: "Terminale" ou "" pour tous
  district: string;      // Quartier ex: "Centre Dschang" ou "" pour tous
  maxPrice: number;      // Prix max en FCFA ex: 5000 (0 = pas de limite)
}

// ── Résultat paginé retourné par l'API ───────────────────────

/**
 * Réponse paginée de l'API de recherche.
 * ⚠️ BACKEND : GET /api/tutors?subject=...&level=...&district=...&maxPrice=...
 */
export interface SearchResult {
  tutors: SearchTutor[];   // Liste des répétiteurs pour la page courante
  total: number;           // Nombre total de résultats (pour affichage)
  page: number;            // Page courante (pagination future)
  hasMore: boolean;        // true s'il reste des pages
}

// ── Options des selects de filtre ─────────────────────────────

export const FILTER_SUBJECTS: { value: string; label: string }[] = [
  { value: "",                   label: "Toutes les matières"  },
  { value: "Mathématiques",      label: "Mathématiques"        },
  { value: "Physique-Chimie",    label: "Physique-Chimie"      },
  { value: "SVT",                label: "SVT"                  },
  { value: "Français",           label: "Français"             },
  { value: "Anglais",            label: "Anglais"              },
  { value: "Informatique",       label: "Informatique"         },
  { value: "Histoire-Géo",       label: "Histoire-Géo"         },
  { value: "Philosophie",        label: "Philosophie"          },
  { value: "Économie",           label: "Économie"             },
];

export const FILTER_LEVELS: { value: string; label: string }[] = [
  { value: "",              label: "Tous"          },
  { value: "Primaire",      label: "Primaire"      },
  { value: "6ème-5ème",     label: "6ème – 5ème"   },
  { value: "4ème-3ème",     label: "4ème – 3ème"   },
  { value: "Lycée",         label: "Lycée"         },
  { value: "Terminale",     label: "Terminale"     },
  { value: "Tous niveaux",  label: "Tous niveaux"  },
];

export const FILTER_DISTRICTS: { value: string; label: string }[] = [
  { value: "",                label: "Tous"            },
  { value: "Centre Dschang",  label: "Centre Dschang"  },
  { value: "Quartier Foto",   label: "Quartier Foto"   },
  { value: "Ngui Dschang",    label: "Ngui Dschang"    },
  { value: "Tsinkop",         label: "Tsinkop"         },
  { value: "Foréké",          label: "Foréké"          },
];

export const FILTER_MAX_PRICES: { value: number; label: string }[] = [
  { value: 0,     label: "Prix max"          },
  { value: 1500,  label: "1 500 FCFA"        },
  { value: 2000,  label: "2 000 FCFA"        },
  { value: 3000,  label: "3 000 FCFA"        },
  { value: 5000,  label: "5 000 FCFA"        },
  { value: 10000, label: "10 000 FCFA"       },
];

// ── Valeurs initiales des filtres (aucun filtre) ──────────────
export const DEFAULT_FILTERS: SearchFilters = {
  subject:  "",
  level:    "",
  district: "",
  maxPrice: 0,
};