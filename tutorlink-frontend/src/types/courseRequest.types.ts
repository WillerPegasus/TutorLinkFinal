export type RequestStatus = 'en_attente' | 'accepte' | 'refuse';

// ❌ SUPPRIMÉ : paymentMethod, amount
// → Le paiement se fait directement hors plateforme
export interface CourseRequestDetail {
  id: string;
  reference: string;
  student: {
    id: string;
    name: string;
    email: string;
    phone: string;
    level: string;
    quartier: string;
  };
  subject: string;
  requestedDate: string;
  requestedTime: string;
  duration: number;
  message: string;
  status: RequestStatus;
  createdAt: string;
  // ✅ AJOUTÉ : montant estimatif INFORMATIF seulement
  estimatedAmount: number;
}

export interface RequestFilters {
  search: string;
  status: RequestStatus | 'TOUS';
}