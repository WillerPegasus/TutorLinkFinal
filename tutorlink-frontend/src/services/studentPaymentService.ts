import api from './api';
import { PaymentFilters } from '../types/studentPayment.types';

// ⚠️ BACKEND REQUIS
const studentPaymentService = {

  // GET /student/payments/stats — statistiques de paiement
  getStats: async () => {
    const res = await api.get('/student/payments/stats');
    return res.data;
  },

  // GET /student/payments — historique des transactions
  getPayments: async (filters: Partial<PaymentFilters>) => {
    const res = await api.get('/student/payments', {
      params: filters
    });
    return res.data;
  },

  // GET /student/payment-methods — moyens de paiement enregistrés
  getPaymentMethods: async () => {
    const res = await api.get('/student/payment-methods');
    return res.data;
  },

  // POST /student/payment-methods — ajouter un moyen de paiement
  addPaymentMethod: async (
    operator: 'MTN' | 'Orange',
    phoneNumber: string
  ) => {
    const res = await api.post('/student/payment-methods', {
      operator, phoneNumber
    });
    return res.data;
  },

  // DELETE /student/payment-methods/:id — supprimer un moyen
  removePaymentMethod: async (id: string) => {
    await api.delete(`/student/payment-methods/${id}`);
  },

  // PATCH /student/payment-methods/:id/default — définir par défaut
  setDefaultMethod: async (id: string) => {
    const res = await api.patch(
      `/student/payment-methods/${id}/default`
    );
    return res.data;
  },

  // GET /student/payments/:id/receipt — télécharger le reçu PDF
  downloadReceipt: async (paymentId: string) => {
    const res = await api.get(
      `/student/payments/${paymentId}/receipt`,
      { responseType: 'blob' }
    );
    return res.data;
  },
};

export default studentPaymentService;