import api from './api';
import { GroupFilters } from '../types/group.types';

const groupService = {

  // GET /groups — liste publique filtrée
  getGroups: async (filters: Partial<GroupFilters>) => {
    const res = await api.get('/groups', { params: filters });
    return res.data;
  },

  // GET /groups/:id — détail complet d'un groupe
  getGroupById: async (id: string) => {
    const res = await api.get(`/groups/${id}`);
    return res.data;
  },

  // GET /groups/:id/reviews — avis des membres
  getGroupReviews: async (id: string) => {
    const res = await api.get(`/groups/${id}/reviews`);
    return res.data;
  },

  // POST /groups/:id/join — rejoindre un groupe (inscription seule,
  // aucun paiement géré par la plateforme)
  // ⚠️ FIX — le backend (JoinGroupRequest) attend { studentId }
  joinGroup: async (groupId: string, studentId: string | number) => {
    const res = await api.post(`/groups/${groupId}/join`, { studentId });
    return res.data;
  },

  // POST /groups/:id/waitlist — liste d'attente si complet
  // (le backend résout le studentId via le header X-User-Id)
  joinWaitlist: async (groupId: string) => {
    const res = await api.post(`/groups/${groupId}/waitlist`);
    return res.data;
  },
};

export default groupService;
