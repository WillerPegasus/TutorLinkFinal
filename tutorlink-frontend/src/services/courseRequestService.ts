import api from './api';

// ⚠️ BACKEND REQUIS
const courseRequestService = {

  // GET /tutor/requests — toutes les demandes
  getRequests: async () => {
    const res = await api.get('/tutor/requests');
    return res.data;
  },

  // PATCH /tutor/requests/:id/accept — accepter
  // → backend confirme la réservation
  // → backend déclenche le paiement Mobile Money
  // → backend notifie l'élève par SMS
  acceptRequest: async (id: string) => {
    const res = await api.patch(`/tutor/requests/${id}/accept`);
    return res.data;
  },

  // PATCH /tutor/requests/:id/refuse — refuser
  // → backend notifie l'élève par SMS
  // → backend libère le créneau
  refuseRequest: async (id: string, reason?: string) => {
    const res = await api.patch(
      `/tutor/requests/${id}/refuse`,
      { reason }
    );
    return res.data;
  },
};

export default courseRequestService;