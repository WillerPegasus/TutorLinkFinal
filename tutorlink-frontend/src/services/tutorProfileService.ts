import api from './api';

const tutorProfileService = {
  // GET /tutors/:id — profil pédagogique du tuteur
  getTutorById: async (tutorId: string) => {
    const res = await api.get(`/tutors/${tutorId}`);
    return res.data;
  },

  // GET /tutors/:id/reviews — avis publics
  getTutorReviews: async (tutorId: string) => {
    const res = await api.get(`/tutors/${tutorId}/reviews`);
    return res.data;
  },

  // GET /tutors/:id/availability — créneaux disponibles
  getTutorAvailability: async (tutorId: string) => {
    const res = await api.get(`/tutors/${tutorId}/availability`);
    return res.data;
  },
};

export default tutorProfileService;
