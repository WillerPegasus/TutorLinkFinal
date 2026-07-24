import api from './api';

// ⚠️ BACKEND REQUIS
const reviewService = {

  // GET /tutor/reviews — tous les avis du répétiteur
  getReviews: async () => {
    const res = await api.get('/tutor/reviews');
    return res.data;
  },

  // GET /tutor/reviews/stats — statistiques des avis
  getReviewStats: async () => {
    const res = await api.get('/tutor/reviews/stats');
    return res.data;
  },

  // POST /tutor/reviews/:id/reply — répondre à un avis
  replyToReview: async (reviewId: string, reply: string) => {
    const res = await api.post(
      `/tutor/reviews/${reviewId}/reply`,
      { reply }
    );
    return res.data;
  },
};

export default reviewService;