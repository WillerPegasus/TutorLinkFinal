import api from './api';

// ⚠️ BACKEND REQUIS
const studentReviewService = {

  // GET /student/reviews — avis publiés par l'élève
  getMyReviews: async () => {
    const res = await api.get('/student/reviews');
    return res.data;
  },

  // GET /student/reviews/pending — cours terminés sans avis
  // Le backend retourne les cours marqués "terminé"
  // pour lesquels l'élève n'a pas encore laissé d'avis
  getPendingReviews: async () => {
    const res = await api.get('/student/reviews/pending');
    return res.data;
  },

  // POST /student/reviews — publier un nouvel avis
  // → le backend attend tutorId + studentId + bookingId (pas courseId)
  submitReview: async (data: {
    tutorId: string;
    studentId: string;
    bookingId: string;
    rating: number;
    comment: string;
  }) => {
    const res = await api.post('/student/reviews', data);
    return res.data;
  },

  // PUT /student/reviews/:id — modifier un avis existant
  updateReview: async (
    reviewId: string,
    data: { rating: number; comment: string }
  ) => {
    const res = await api.put(`/student/reviews/${reviewId}`, data);
    return res.data;
  },

  // DELETE /student/reviews/:id — supprimer un avis
  deleteReview: async (reviewId: string) => {
    await api.delete(`/student/reviews/${reviewId}`);
  },
};

export default studentReviewService;