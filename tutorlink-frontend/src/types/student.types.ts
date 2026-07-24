// Statut d'un cours réservé
export type CourseStatus = 'confirme' | 'en_attente' | 'termine' | 'annule';

// Statut de paiement dans un groupe
export type GroupPaymentStatus = 'a_jour' | 'en_retard';

// Prochain cours de l'élève
export interface UpcomingCourse {
  id: string;
  date: string;           // ex: "Lun. 23 juin"
  time: string;           // ex: "16h – 18h"
  subject: string;
  tutorName: string;
  status: CourseStatus;
}

// Groupe de répétition de l'élève
export interface StudentGroup {
  id: string;
  name: string;           // ex: "Maths BAC C/D · Groupe Élite"
  subject: string;
  tutorName: string;
  nextSession: string;    // ex: "Sam. 28 juin · 16h"
  monthlyPrice: number;
  paymentStatus: GroupPaymentStatus;
  status: 'actif' | 'suspendu';
}

// Progression par matière
export interface SubjectProgress {
  subject: string;
  score: number;          // note sur 20
  color: string;          // couleur Tailwind pour la barre
}

// Activité récente
export interface RecentActivity {
  id: string;
  icon: string;
  message: string;        // ex: "Cours de maths complété avec M. Kamga"
  time: string;           // ex: "il y a 2h"
  isNew: boolean;
}

// Statistiques rapides de l'élève
export interface StudentStats {
  totalHours: number;          // heures de cours suivies
  activeTutors: number;        // répétiteurs actifs
  currentAverage: number;      // moyenne actuelle
  upcomingCourses: number;     // cours à venir
}