import api from './api';

// ⚠️ BACKEND REQUIS — actif quand l'API sera prête
const studentService = {

  // GET /student/profile — profil complet de l'élève connecté
  getProfile: async () => {
    const res = await api.get('/student/profile');
    return res.data;
  },

  // GET /student/stats — statistiques rapides du tableau de bord
  getStats: async () => {
    const res = await api.get('/student/stats');
    return res.data;
  },

  // GET /student/courses/upcoming — prochains cours confirmés
  getUpcomingCourses: async () => {
    const res = await api.get('/student/courses/upcoming');
    return res.data;
  },

  // GET /student/groups — groupes de l'élève
  getMyGroups: async () => {
    const res = await api.get('/student/groups');
    return res.data;
  },

  // GET /student/progress — progression par matière
  getProgress: async () => {
    const res = await api.get('/student/progress');
    return res.data;
  },

  // GET /student/activity — activité récente
  getRecentActivity: async () => {
    const res = await api.get('/student/activity');
    return res.data;
  },
};

export default studentService;