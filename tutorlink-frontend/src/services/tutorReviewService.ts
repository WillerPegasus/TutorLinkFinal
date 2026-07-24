import api from './api';

const tutorReviewService = {
  // GET /tutors/me/reviews — avis reçus par le tuteur connecté
  getMyReviews: async () => {
    const res = await api.get('/tutors/me/reviews');
    return res.data;
  },

  // GET /tutors/me/reviews/stats
  getMyReviewStats: async () => {
    const res = await api.get('/tutors/me/reviews/stats');
    return res.data;
  },

  // POST /tutors/me/reviews/:reviewId/reply
  replyToReview: async (reviewId: number, reply: string) => {
    const res = await api.post(`/tutors/me/reviews/${reviewId}/reply`, { reply });
    return res.data;
  },
};

export default tutorReviewService;
