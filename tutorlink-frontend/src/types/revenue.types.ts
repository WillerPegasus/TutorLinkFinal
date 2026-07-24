// Période de filtrage
export type RevenuePeriod = '7j' | '30j' | '3m' | '6m' | '1an';

// Un point de données mensuel
export interface RevenueDataPoint {
  month: string;
  individual: number;   // revenus cours individuels
  group: number;        // revenus groupes
  total: number;        // total
}

// Un versement reçu
export interface RevenueTransaction {
  id: string;
  reference: string;        // ex: "VRS-2026-001"
  studentName: string;      // élève ou groupe concerné
  type: 'individuel' | 'groupe';
  subject: string;
  date: string;
  amount: number;           // montant brut en FCFA
  commission: number;       // commission TutorLink (10%)
  netAmount: number;        // montant net reçu
  operator: 'MTN' | 'Orange';
  transactionId: string;    // ID transaction Mobile Money
  status: 'recu' | 'en_attente' | 'rembourse';
}

// Statistiques revenus
export interface RevenueStats {
  totalBrut: number;        // total brut du mois
  totalCommission: number;  // commission TutorLink
  totalNet: number;         // montant net reçu
  totalIndividuel: number;  // revenus cours individuels
  totalGroupe: number;      // revenus groupes
  evolution: number;        // % évolution vs mois dernier
}