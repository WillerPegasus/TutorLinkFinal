// Statut de validation d'un répétiteur
export type TutorValidationStatus = 'en_attente' | 'approuve' | 'rejete';

// Document soumis par le répétiteur
export interface TutorDocument {
  type: 'CNI' | 'diplome' | 'photo';
  url: string;        // URL du fichier (image/PDF)
  label: string;      // Nom affiché
}

// Structure complète d'un répétiteur en attente
export interface TutorValidationItem {
  id: string;
  name: string;
  email: string;
  phone: string;
  subject: string;    // Matière enseignée
  level: string;      // Niveau (Primaire, Collège, Lycée)
  quartier: string;
  rating: number;     // Note moyenne (0-5)
  totalSessions: number;
  status: TutorValidationStatus;
  submittedAt: string;
  documents: TutorDocument[];
  rejectReason?: string; // Motif de rejet
}

// Répétiteur bien noté (tableau du bas)
export interface TopRatedTutor {
  id: string;
  name: string;
  subject: string;
  rating: number;
  totalSessions: number;
  quartier: string;
}