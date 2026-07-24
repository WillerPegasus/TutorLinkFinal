import adminApi from './adminApi';

// Ces routes passent par AdminReservationProxyController côté api-gateway
// (@RequestMapping("/api/admin/reservations")), qui relaie vers booking-service.
// ⚠️ FIX — les anciens chemins ('/reservations') ne correspondaient à aucune
// route de la gateway (pas de Path=/api/reservations/**) → 404 garanti.
const adminReservationService = {

  // GET /api/admin/reservations — liste paginée (Page<BookingResponse>)
  getReservations: async (filters: { status?: string; page?: number; size?: number } = {}) => {
    const res = await adminApi.get('/admin/reservations', { params: filters });
    return res.data;
  },

  // PATCH /api/admin/reservations/:id/cancel — annuler
  cancelReservation: async (id: string) => {
    const res = await adminApi.patch(`/admin/reservations/${id}/cancel`);
    return res.data;
  },
};

export default adminReservationService;
