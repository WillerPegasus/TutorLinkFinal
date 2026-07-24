import api from './api';
import { SearchFilters, SortOption } from '../types/search.types';

// ⚠️ BACKEND REQUIS
const searchService = {

  // GET /tutors — liste filtrée et triée des répétiteurs
  // Le backend filtre, pagine et trie les résultats
  getTutors: async (
    filters: Partial<SearchFilters>,
    sort: SortOption
  ) => {
    const res = await api.get('/tutors', {
      params: { ...filters, sort }
    });
    return res.data;
  },

  // GET /tutors/subjects — liste toutes les matières disponibles
  getSubjects: async () => {
    const res = await api.get('/tutors/subjects');
    return res.data;
  },

  // GET /tutors/quartiers — liste tous les quartiers disponibles
  getQuartiers: async () => {
    const res = await api.get('/tutors/quartiers');
    return res.data;
  },
};

export default searchService;