// Type de paiement
export type PaymentType = 'cours_individuel' | 'groupe';

// Opérateur Mobile Money utilisé
export type PaymentOperator = 'MTN' | 'Orange';

// Statut d'une transaction
export type PaymentStatus = 'reussi' | 'echoue' | 'en_attente' | 'rembourse';

// Une transaction de paiement
export interface StudentPayment {
  id: string;
  reference: string;          // ex: "PAY-2026-001"
  type: PaymentType;
  description: string;        // ex: "Cours Mathématiques" ou nom du groupe
  tutorName: string;
  amount: number;              // montant en FCFA
  operator: PaymentOperator;
  transactionId: string;       // ID transaction Mobile Money
  status: PaymentStatus;
  date: string;
  time: string;
}

// Moyen de paiement enregistré
export interface SavedPaymentMethod {
  id: string;
  operator: PaymentOperator;
  phoneNumber: string;         // numéro masqué ex: "677 XX XX 22"
  isDefault: boolean;          // moyen par défaut
}

// Statistiques de paiement
export interface PaymentStats {
  totalSpent: number;          // total dépensé ce mois
  totalTransactions: number;   // nombre de transactions
  pendingAmount: number;       // montant en attente
  averagePerCourse: number;    // dépense moyenne par cours
}

// Filtres de l'historique
export interface PaymentFilters {
  search: string;
  status: PaymentStatus | 'TOUS';
  type: PaymentType | 'TOUS';
  dateFrom: string;
  dateTo: string;
}