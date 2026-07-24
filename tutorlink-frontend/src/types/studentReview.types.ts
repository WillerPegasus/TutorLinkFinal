// Statut d'un avis
export type ReviewStatus = 'publie' | 'en_attente' | 'refuse';

// Un avis laissé par l'élève sur un répétiteur
export interface StudentReview {
  id: string;
  tutorId: string;
  tutorName: string;        // nom du répétiteur
  tutorSubject: string;     // matière enseignée
  courseDate: string;       // date du cours concerné
  rating: number;           // note donnée sur 5
  comment: string;          // commentaire de l'élève
  status: ReviewStatus;     // statut de publication
  createdAt: string;        // date de création
  tutorReply?: string;      // réponse du répétiteur
}

// Cours terminé en attente d'avis
export interface PendingReview {
  id: string;
  tutorId: string;
  tutorName: string;
  tutorSubject: string;
  courseDate: string;       // date du cours passé
  courseTime: string;       // horaire du cours
}

// Statistiques des avis de l'élève
export interface StudentReviewStats {
  totalReviews: number;     // nombre total d'avis publiés
  averageGiven: number;     // note moyenne donnée
  pendingCount: number;     // cours en attente d'avis
}