// Un avis laissé par un élève ou parent
export interface TutorReview {
  id: string;
  author: string;           // nom de l'auteur
  authorRole: 'eleve' | 'parent';
  studentName?: string;     // si parent, nom de l'élève concerné
  rating: number;           // note sur 5
  comment: string;          // commentaire
  subject: string;          // matière du cours concerné
  date: string;             // date de l'avis
  isNew: boolean;           // nouvel avis non encore vu
  reply?: string;           // réponse du répétiteur
}

// Statistiques des avis
export interface ReviewStats {
  averageRating: number;    // note moyenne
  totalReviews: number;     // nombre total d'avis
  distribution: {           // répartition par note
    stars: number;
    count: number;
    pct: number;
  }[];
}

// Filtres de la page
export interface ReviewFilters {
  rating: number | null;    // filtrer par note (null = toutes)
  subject: string;
}