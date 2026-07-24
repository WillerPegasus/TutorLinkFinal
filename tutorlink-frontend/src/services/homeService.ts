import api from './api';

// ⚠️ BACKEND REQUIS
const homeService = {

  // GET /home/tutors/featured — répétiteurs vedettes
  // Backend retourne les mieux notés du mois
  getFeaturedTutors: async () => {
    const res = await api.get('/home/tutors/featured');
    return res.data;
  },

  // GET /home/groups/featured — groupes vedettes
  // Backend retourne les groupes les plus actifs
  getFeaturedGroups: async () => {
    const res = await api.get('/home/groups/featured');
    return res.data;
  },

  // GET /home/stats — statistiques globales plateforme
  getPlatformStats: async () => {
    const res = await api.get('/home/stats');
    return res.data;
  },
};

export default homeService;