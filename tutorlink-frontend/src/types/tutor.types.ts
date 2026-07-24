// Statut d'une demande de cours
export type RequestStatus = 'en_attente' | 'accepte' | 'refuse';

// Statut d'un cours confirmé
export type ConfirmedCourseStatus = 'confirme' | 'en_attente' | 'termine';

// Demande de cours reçue d'un élève
export interface CourseRequest {
  id: string;
  studentName: string;
  subject: string;
  requestedDate: string;    // ex: "Sam. 28 juin · 14h"
  duration: number;         // en heures
  message: string;          // message de l'élève
  status: RequestStatus;
}

// Créneau de disponibilité
export interface AvailabilitySlot {
  day: string;              // 'LUN' | 'MAR' ...
  startTime: string;        // ex: '16h'
  endTime: string;          // ex: '18h'
  available: boolean;
}

// Cours confirmé à venir
export interface ConfirmedCourse {
  id: string;
  date: string;             // ex: "Lun. 23 juin"
  time: string;             // ex: "16h – 18h"
  studentName: string;
  subject: string;
  status: ConfirmedCourseStatus;
}

// Groupe géré par le répétiteur
export interface TutorGroup {
  id: string;
  name: string;
  subject: string;
  currentMembers: number;
  maxMembers: number;
  schedule: string;         // ex: "Mar & Sam · 16h-18h"
  monthlyPrice: number;
  monthlyRevenue: number;   // revenus du mois pour ce groupe
}

// Point de données revenus mensuel
export interface RevenueDataPoint {
  month: string;
  amount: number;           // en FCFA
}

// Statistiques rapides du répétiteur
export interface TutorStats {
  coursesThisMonth: number;
  activeStudents: number;
  monthlyRevenue: number;
  pendingRequests: number;
}

// Activité récente
export interface TutorActivity {
  id: string;
  icon: string;
  message: string;
  time: string;
  isNew: boolean;
}