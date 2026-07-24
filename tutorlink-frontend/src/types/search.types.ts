// Répétiteur dans les résultats de recherche
export interface SearchTutor {
  id: string;
  name: string;
  subject: string;          // matière principale
  subjects: string[];       // toutes les matières
  level: string;            // ex: "Terminale C/D"
  quartier: string;         // quartier de Dschang
  rating: number;           // note moyenne sur 5
  reviewCount: number;      // nombre d'avis
  hourlyPrice: number;      // prix par heure en FCFA
  totalSessions: number;    // nombre de cours donnés
  bio: string;              // courte description
  isVerified: boolean;      // profil vérifié par admin
  isAvailable: boolean;     // disponible cette semaine
  diploma: string;          // diplôme principal
  avatar?: string;          // photo de profil
}

// Filtres de recherche
export interface SearchFilters {
  search: string;           // recherche par nom ou matière
  subject: string;          // filtre matière
  level: string;            // filtre niveau scolaire
  quartier: string;         // filtre quartier
  maxPrice: number | null;  // prix maximum par heure
  minRating: number | null; // note minimum
  verifiedOnly: boolean;    // uniquement profils vérifiés
}

// Options de tri
export type SortOption =
  'rating'    |   // mieux notés
  'price_asc' |   // prix croissant
  'price_desc'|   // prix décroissant
  'sessions';     // plus expérimentés