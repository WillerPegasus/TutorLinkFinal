import api from './api';

const searchTutorService = {
  // GET /tutors — tous les profils tuteurs (vérifiés ou non)
  getAllTutors: async () => {
    const res = await api.get('/tutors');
    return res.data;
  },
};

export default searchTutorService;
