// Document de vérification affiché publiquement
export interface VerificationItem {
  type: 'identite' | 'diplome' | 'adresse';
  label: string;
  verified: boolean;
}

// Un avis sur le profil public
export interface PublicReview {
  id: string;
  userId: string;
  author: string;
  authorRole: 'eleve' | 'parent';
  rating: number;
  comment: string;
  date: string;
}

// Créneau de disponibilité affiché publiquement
export interface PublicAvailabilitySlot {
  day: string;          // 'LUN' | 'MAR' ...
  startTime: string;
  endTime: string;
  available: boolean;
}

// Profil public complet d'un répétiteur
export interface TutorPublicProfile {
  id: string;
  name: string;
  subject: string;           // matière principale
  level: string;             // ex: "Terminale C/D"
  quartier: string;
  rating: number;
  reviewCount: number;
  diploma: string;
  totalSessions: number;
  hourlyPrice: number;
  isVerified: boolean;
  bio: string;                // description complète
  subjectsTaught: {
    label: string;            // ex: "Mathématiques · Terminale C"
  }[];
  verifications: VerificationItem[];
  availability: PublicAvailabilitySlot[];
  reviews: PublicReview[];
}