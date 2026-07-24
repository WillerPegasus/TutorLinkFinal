// Statut d'un groupe
export type GroupStatus = 'actif' | 'complet' | 'suspendu';

// Séance hebdomadaire
export interface GroupSession {
  day: string;        // 'LUN' | 'MAR' | 'MER' | 'JEU' | 'VEN' | 'SAM' | 'DIM'
  startTime: string;  // ex: '16h'
  endTime: string;    // ex: '18h'
}

// Répétiteur admin du groupe (version simplifiée)
export interface GroupTutor {
  id: string;
  name: string;
  subject: string;
  rating: number;
  totalSessions: number;
  diploma: string;
  avatar?: string;
}

// Structure complète d'un groupe
export interface Group {
  id: string;
  name: string;            // ex: "Maths BAC C/D · Groupe Élite"
  subject: string;
  level: string;           // ex: "Terminale C/D"
  quartier: string;
  description: string;
  tutor: GroupTutor;
  rating: number;
  reviewCount: number;
  currentMembers: number;  // places occupées
  maxMembers: number;      // capacité totale
  monthlyPrice: number;    // en FCFA
  sessions: GroupSession[];
  themes: string[];        // tags matières abordées
  status: GroupStatus;
  isVerified: boolean;
  createdAt: string;
}

// Filtre page liste des groupes
export interface GroupFilters {
  subject: string;
  level: string;
  quartier: string;
  maxPrice: number | null;
}

// Avis d'un membre du groupe
export interface GroupReview {
  id: string;
  author: string;
  role: 'eleve' | 'parent';
  rating: number;
  comment: string;
  date: string;
}

// Membre inscrit dans un groupe
export interface GroupMember {
  id: string;
  name: string;
  role: 'eleve' | 'parent';
  joinedAt: string;
  paymentStatus: 'a_jour' | 'en_retard';
}

// Inscription en liste d'attente
export interface WaitlistEntry {
  userId: string;
  groupId: string;
  registeredAt: string;
}