// Type d'abonnement
export type SubscriptionType = 'tutor' | 'group';

// Statut abonnement côté admin
export type AdminSubscriptionStatus =
  | 'trial'
  | 'active'
  | 'grace'
  | 'suspended'
  | 'expired';

// Abonnement répétiteur vu par l'admin
export interface AdminTutorSubscription {
  id: string;
  tutorId: string;
  tutorName: string;
  tutorEmail: string;
  tutorPhone: string;
  subject: string;
  quartier: string;
  status: AdminSubscriptionStatus;
  trialStartDate: string;
  trialEndDate: string;
  currentPeriodEnd: string;
  daysRemaining: number;
  isTrialPeriod: boolean;
  monthlyPrice: number;         // 3000 FCFA
  totalPaid: number;            // total cumulé
  paymentsCount: number;        // nombre de paiements
  autoRenew: boolean;
  lastPaymentDate: string;
  joinedAt: string;
}

// Abonnement groupe vu par l'admin
export interface AdminGroupSubscription {
  id: string;
  groupId: string;
  groupName: string;
  tutorName: string;            // admin du groupe
  tutorId: string;
  subject: string;
  currentMembers: number;
  maxMembers: number;
  status: AdminSubscriptionStatus;
  trialStartDate: string;
  trialEndDate: string;
  currentPeriodEnd: string;
  daysRemaining: number;
  isTrialPeriod: boolean;
  monthlyPrice: number;         // 5000 FCFA
  totalPaid: number;
  paymentsCount: number;
  lastPaymentDate: string;
}

// Statistiques globales abonnements
export interface SubscriptionGlobalStats {
  // Répétiteurs
  totalTutors: number;
  tutorsTrial: number;
  tutorsActive: number;
  tutorsSuspended: number;
  tutorsRevenue: number;        // revenus abonnements répétiteurs

  // Groupes
  totalGroups: number;
  groupsTrial: number;
  groupsActive: number;
  groupsSuspended: number;
  groupsRevenue: number;        // revenus abonnements groupes

  // Total plateforme
  totalMonthlyRevenue: number;
  totalAnnualRevenue: number;
}

// Filtres tableau admin
export interface AdminSubscriptionFilters {
  search: string;
  status: AdminSubscriptionStatus | 'TOUS';
  type: SubscriptionType | 'TOUS';
}