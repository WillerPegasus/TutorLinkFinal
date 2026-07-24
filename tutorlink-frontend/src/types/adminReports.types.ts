// Période sélectionnée pour les rapports
export type ReportPeriod = '7j' | '30j' | '3m' | '6m' | '1an';

// Un point de données pour les graphiques
export interface ChartDataPoint {
  month: string;      // ex: "Jan", "Fév", "Lun 16"
  reservations: number;
  revenus: number;
  inscriptions: number;

}

// Statistiques globales de la période
export interface ReportStats {
  totalReservations: number;
  totalRevenus: number;
  totalEleves: number;
  totalRepetiteurs: number;
  tauxSatisfaction: number;     // pourcentage
  totalGroupsActifs:number;         // par réservation
  reservationsParJour: number;  // moyenne
  totalTutorsActifs: number;
  tutorSubscriptionRevenue:number;
  groupSubscriptionRevenue:number;
}

// Performance d'une matière
export interface SubjectPerformance {
  subject: string;
  reservations: number;
  revenus: number;
  satisfaction: number;         // note moyenne
  pct: number;                  // % du total
}

// Performance d'un quartier
export interface QuartierStats {
  quartier: string;
  reservations: number;
  revenus: number;
  pct: number;
}

// Filtre du rapport
export interface ReportFilters {
  period: ReportPeriod;
  subject: string;
  quartier: string;
}