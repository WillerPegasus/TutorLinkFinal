// Statut cours uniquement
// ❌ SUPPRIMÉ : PaymentStatus, PaymentOperator, MobileMoneyOperator
export type CourseStatus = 'confirmee' | 'en_cours' | 'terminee' | 'annulee';

// Réservation vue par l'admin
// ❌ SUPPRIMÉ : amount, paymentStatus, operator, transactionId
export interface AdminReservation {
  id: string;
  reference: string;
  eleve: {
    name: string;
    email: string;
    phone: string;
  };
  repetiteur: {
    name: string;
    email: string;
    subject: string;
    phone: string;      // ← pour info contact
  };
  date: string;
  timeSlot: string;
  duration: number;
  courseStatus: CourseStatus;
  quartier: string;
  createdAt: string;
  notes?: string;
  // ✅ GARDÉ : montant estimatif seulement pour info
  estimatedAmount: number;
}

// Filtres simplifiés
export interface ReservationFilters {
  search: string;
  courseStatus: CourseStatus | 'TOUS';
  dateFrom: string;
  dateTo: string;
}