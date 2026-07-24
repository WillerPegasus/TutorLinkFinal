import api from './api';
import { DayAvailability } from '../types/availability.types';

// ⚠️ BACKEND REQUIS
const availabilityService = {

  // GET /tutor/availability — récupère les disponibilités
  getAvailability: async () => {
    const res = await api.get('/tutor/availability');
    return res.data;
  },

  // PUT /tutor/availability — sauvegarde les disponibilités
  // Le backend met à jour et notifie les élèves si des créneaux
  // déjà réservés sont supprimés
  saveAvailability: async (availability: DayAvailability[]) => {
    const res = await api.put('/tutor/availability', { availability });
    return res.data;
  },
};

export default availabilityService;