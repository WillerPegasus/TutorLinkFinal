// Statut d'un groupe côté admin
export type AdminGroupStatus = 'actif' | 'complet' | 'suspendu' | 'en_attente';

// Structure d'un groupe vu par l'admin
export interface AdminGroup {
  id: string;
  name: string;
  subject: string;
  level: string;
  quartier: string;
  tutorName: string;
  tutorId: string;
  currentMembers: number;
  maxMembers: number;
  monthlyPrice: number;
  totalRevenue: number;       // revenus générés depuis création
  status: AdminGroupStatus;
  isVerified: boolean;
  createdAt: string;
  sessionsPerWeek: number;
}

// Filtres du tableau admin
export interface AdminGroupFilters {
  search: string;
  status: AdminGroupStatus | 'TOUS';
  subject: string;
}