// Statut de l'abonnement du répétiteur
export type SubscriptionStatus =
  | 'trial'       // période d'essai gratuite (2 mois)
  | 'active'      // abonnement payé et actif
  | 'grace'       // délai de grâce (3 jours après expiration)
  | 'suspended'   // compte suspendu pour non paiement
  | 'expired';    // abonnement expiré définitivement

// Opérateur Mobile Money
export type SubscriptionOperator = 'MTN' | 'Orange';

// Détail de l'abonnement actuel
export interface TutorSubscription {
  id: string;
  tutorId: string;
  status: SubscriptionStatus;
  trialStartDate: string;       // date début essai gratuit
  trialEndDate: string;         // date fin essai (J+60)
  currentPeriodStart: string;   // début période abonnement actuel
  currentPeriodEnd: string;     // fin période abonnement actuel
  monthlyPrice: number;         // 3000 FCFA/mois
  daysRemaining: number;        // jours restants (essai ou abonnement)
  isTrialPeriod: boolean;       // true si encore en essai
  autoRenew: boolean;           // renouvellement automatique
}

// Une transaction d'abonnement payée
export interface SubscriptionPayment {
  id: string;
  reference: string;            // ex: "SUB-2026-001"
  amount: number;               // 3000 FCFA
  operator: SubscriptionOperator;
  transactionId: string;        // ID Mobile Money
  status: 'reussi' | 'echoue' | 'en_attente';
  date: string;
  period: string;               // ex: "Juillet 2026"
}

// Notification d'abonnement
export interface SubscriptionNotification {
  id: string;
  type:
    | 'trial_ending_soon'    // essai se termine dans X jours
    | 'trial_expired'        // essai expiré
    | 'payment_due'          // paiement à faire
    | 'payment_success'      // paiement réussi
    | 'payment_failed'       // paiement échoué
    | 'account_suspended';   // compte suspendu
  message: string;
  daysLeft?: number;
  date: string;
  isRead: boolean;
}