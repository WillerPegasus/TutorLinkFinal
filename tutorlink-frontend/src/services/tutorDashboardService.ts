import api from './api';

// ⚠️ BACKEND REQUIS
const tutorDashboardService = {

  // GET /tutor/stats — statistiques du mois
  getStats: async () => {
    const res = await api.get('/tutor/stats');
    return res.data;
  },

  // GET /tutor/requests — demandes de cours en attente
  getRequests: async () => {
    const res = await api.get('/tutor/requests');
    return res.data;
  },

  // PATCH /tutor/requests/:id/accept — accepter une demande
  acceptRequest: async (requestId: string) => {
    const res = await api.patch(`/tutor/requests/${requestId}/accept`);
    return res.data;
  },

  // PATCH /tutor/requests/:id/refuse — refuser une demande
  refuseRequest: async (requestId: string) => {
    const res = await api.patch(`/tutor/requests/${requestId}/refuse`);
    return res.data;
  },

  // GET /tutor/courses/confirmed — cours confirmés à venir
  getConfirmedCourses: async () => {
    const res = await api.get('/tutor/courses/confirmed');
    return res.data;
  },

  // GET /tutor/availability — disponibilités
  getAvailability: async () => {
    const res = await api.get('/tutor/availability');
    return res.data;
  },

  // PUT /tutor/availability — mettre à jour disponibilités
  updateAvailability: async (slots: object[]) => {
    const res = await api.put('/tutor/availability', { slots });
    return res.data;
  },

  // GET /tutor/groups — mes groupes
  getMyGroups: async () => {
    const res = await api.get('/tutor/groups');
    return res.data;
  },

  // GET /tutor/revenue — revenus des 6 derniers mois
  getRevenue: async () => {
    const res = await api.get('/tutor/revenue');
    return res.data;
  },

  // GET /tutor/revenue/chart — historique mensuel pour le graphique
  getRevenueChart: async () => {
    const res = await api.get('/tutor/revenue/chart');
    return res.data;
  },

  // GET /tutor/revenue/transactions — liste des transactions
  getRevenueTransactions: async (period?: string) => {
    const res = await api.get('/tutor/revenue/transactions', { params: { period } });
    return res.data;
  },

  // GET /tutor/revenue/export — export CSV
  exportRevenue: async (period?: string) => {
    const res = await api.get('/tutor/revenue/export', {
      params: { period },
      responseType: 'blob',
    });
    return res.data;
  },

  // GET /tutor/activity — activité récente
  getActivity: async () => {
    const res = await api.get('/tutor/activity');
    return res.data;
  },
};

export default tutorDashboardService;