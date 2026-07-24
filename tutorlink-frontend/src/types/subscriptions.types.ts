// ============================================================
// FICHIER : src/types/subscription.types.ts
// RÔLE    : Types pour le modèle d'abonnement répétiteur
//           C'est le cœur du modèle économique de TutorLink.
// ============================================================

// ── Plans d'abonnement disponibles ───────────────────────────

export type SubscriptionPlan = "BASIC" | "PRO" | "PREMIUM";

export type SubscriptionStatus =
  | "ACTIVE"    // Abonnement actif
  | "EXPIRED"   // Expiré — répétiteur désactivé
  | "TRIAL"     // Période d'essai (14 jours)
  | "CANCELLED" // Annulé
  | "PENDING";  // Paiement en attente

// ── Détail d'un plan ──────────────────────────────────────────

/**
 * Description d'un plan d'abonnement répétiteur.
 * Affiché sur la page /tarifs et /devenir-repetiteur
 */
export interface SubscriptionPlanDetail {
  id: SubscriptionPlan;
  name: string;                // "Basic", "Pro", "Premium"
  pricePerMonth: number;       // Montant mensuel FCFA
  pricePerYear: number;        // Montant annuel FCFA (avec réduction)
  yearlyDiscount: number;      // % de réduction annuel ex: 20
  features: string[];          // Liste des fonctionnalités incluses
  maxStudents: number | null;  // null = illimité
  maxGroups: number;           // Nombre de groupes autorisés
  isRecommended: boolean;      // Affiche le badge "Recommandé"
  color: string;               // Couleur d'accent Tailwind
}

// ── Abonnement actif d'un répétiteur ─────────────────────────

/**
 * Abonnement en cours du répétiteur connecté.
 * ⚠️ BACKEND : GET /api/subscriptions/tutor/me
 */
export interface TutorSubscription {
  id: string;
  plan: SubscriptionPlan;
  status: SubscriptionStatus;
  startDate: string;           // ISO 8601
  endDate: string;             // ISO 8601
  autoRenew: boolean;
  daysRemaining: number;       // Calculé côté backend
  paymentMethod: "MTN_MOMO" | "ORANGE_MONEY";
  lastPaymentDate: string;
  nextPaymentDate: string;
  monthlyAmount: number;       // Montant mensuel payé
}

// ── Plans configurés ──────────────────────────────────────────

export const SUBSCRIPTION_PLANS: SubscriptionPlanDetail[] = [
  {
    id: "BASIC",
    name: "Basic",
    pricePerMonth: 2000,
    pricePerYear: 19200,  // 20% de réduction
    yearlyDiscount: 20,
    features: [
      "Profil répétiteur visible",
      "Jusqu'à 10 élèves actifs",
      "1 groupe de répétition",
      "Messagerie avec les élèves",
      "Gestion des disponibilités",
    ],
    maxStudents: 10,
    maxGroups: 1,
    isRecommended: false,
    color: "border-gray-300",
  },
  {
    id: "PRO",
    name: "Pro",
    pricePerMonth: 5000,
    pricePerYear: 48000,  // 20% de réduction
    yearlyDiscount: 20,
    features: [
      "Tout le plan Basic",
      "Élèves illimités",
      "3 groupes de répétition",
      "Badge 'Répétiteur Pro'",
      "Apparaître en haut des résultats",
      "Statistiques avancées",
    ],
    maxStudents: null,
    maxGroups: 3,
    isRecommended: true,
    color: "border-[#f5a623]",
  },
  {
    id: "PREMIUM",
    name: "Premium",
    pricePerMonth: 10000,
    pricePerYear: 96000,  // 20% de réduction
    yearlyDiscount: 20,
    features: [
      "Tout le plan Pro",
      "Groupes illimités",
      "Badge 'Répétiteur Premium'",
      "Position prioritaire absolue",
      "Support dédié TutorLink",
      "Tableau de bord analytique complet",
    ],
    maxStudents: null,
    maxGroups: 999,
    isRecommended: false,
    color: "border-[#1a2744]",
  },
];

// ── Payload souscription ──────────────────────────────────────

/**
 * ⚠️ BACKEND : POST /api/subscriptions
 * Le backend déclenche le prélèvement MTN MoMo / Orange Money
 * et active l'abonnement.
 */
export interface SubscribePayload {
  plan: SubscriptionPlan;
  billingCycle: "MONTHLY" | "YEARLY";
  paymentMethod: "MTN_MOMO" | "ORANGE_MONEY";
  phoneNumber: string;  // Numéro Mobile Money
}