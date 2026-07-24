export type AdminRole = 'SUPER_ADMIN' | 'MODERATOR';

export interface AdminUser {
  id: string;
  email: string;
  name: string;
  role: AdminRole;
  token: string | null;
}
// Données envoyées au backend lors du login
export interface AdminLoginPayload {
  email: string;
  password: string;
}

// Données envoyées pour valider le code OTP
export interface OtpPayload {
  email: string;
  otp: string;
}
// Chiffres clés affichés sur les cartes KPI
// Ajouter ces champs dans DashboardStats
export interface DashboardStats {
  totalUsers: number;
  totalTutors: number;
  totalReservations: number;
  totalRevenue: number;
  // ✅ NOUVEAU : revenus détaillés abonnements
  tutorSubscriptionRevenue: number;
  groupSubscriptionRevenue: number;
  pendingValidations: number;
  activeSessionsToday: number;
  // ✅ NOUVEAU : alertes abonnements expirant
  tutorsExpiringThisWeek: number;
  groupsExpiringThisWeek: number;
}

// Un point de données pour le graphique mensuel
export interface MonthlyData {
  month: string;
  reservations: number;
  inscriptions: number;
}

// Une alerte de modération
export interface ModerationAlert {
  id: string;
  type: 'signalement' | 'validation' | 'litige';
  message: string;
  date: string;
  urgent: boolean;
}

// Une inscription récente
export interface RecentRegistration {
  id: string;
  name: string;
  role: 'ELEVE' | 'REPETITEUR';
  date: string;
  status: 'actif' | 'en_attente';
}