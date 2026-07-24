import adminApi from './adminApi';

const adminTutorService = {

  // GET /tutors/pending — liste des répétiteurs en attente
  getPendingTutors: async () => {
    const res = await adminApi.get('/tutors/pending');
    return res.data;
  },

  // GET /tutors/verified — répétiteurs déjà vérifiés (utilisé pour "top rated")
  getVerifiedTutors: async () => {
    const res = await adminApi.get('/tutors/verified');
    return res.data;
  },

  // PATCH /tutors/:id/approve — approuver un répétiteur
  approveTutor: async (tutorId: number) => {
    const res = await adminApi.patch(`/tutors/${tutorId}/approve`);
    return res.data;
  },

  // PATCH /tutors/:id/reject?reason=... — rejeter avec motif (query param, pas body)
  rejectTutor: async (tutorId: number, reason: string) => {
    const res = await adminApi.patch(`/tutors/${tutorId}/reject`, null, {
      params: { reason },
    });
    return res.data;
  },

  // GET /users/:userId — profil complet (nom, email, tel) — nécessite le rôle ADMIN
  getUserProfile: async (userId: number) => {
    const res = await adminApi.get(`/users/${userId}`);
    return res.data;
  },
};

export default adminTutorService;
