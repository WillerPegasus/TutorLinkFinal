import api from './api';

export interface CreateBookingPayload {
  studentId: number;
  tutorId: number;
  subject: string;
  level: string;
  scheduledDate: string; // yyyy-MM-dd
  startTime: string;     // HH:mm:ss
  duration: number;      // minutes
  location: string;
  studentNote?: string;
  // Requis par le backend (@NotNull) mais non exploité : le paiement se
  // fait directement entre élève et répétiteur, hors plateforme.
  paymentMethod: 'MTN_MOMO' | 'ORANGE_MONEY';
}

const bookingService = {
  getTutorById: async (tutorId: string) => {
    const res = await api.get(`/tutors/${tutorId}`);
    return res.data;
  },
  getTutorAvailability: async (tutorId: string) => {
    const res = await api.get(`/tutors/${tutorId}/availability`);
    return res.data;
  },
  createReservation: async (payload: CreateBookingPayload) => {
    const res = await api.post('/bookings', payload);
    return res.data;
  },
};

export default bookingService;
