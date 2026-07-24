import api from './api';

const studentReservationService = {
  // GET /bookings/student/:userId — toutes les réservations d'un élève
  getMyReservations: async (studentId: number) => {
    const res = await api.get(`/bookings/student/${studentId}`);
    return res.data;
  },
  // PATCH /bookings/:id/cancel — annuler une demande
  cancelReservation: async (bookingId: string) => {
    const res = await api.patch(`/bookings/${bookingId}/cancel`);
    return res.data;
  },
};

export default studentReservationService;
