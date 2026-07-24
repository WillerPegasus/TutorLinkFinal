import api from './api';

const studentGroupService = {
  // GET /groups/student/:studentId — memberships de l'élève
  getMyMemberships: async (studentId: number) => {
    const res = await api.get(`/groups/student/${studentId}`);
    return res.data;
  },
  // GET /groups/:id — détail complet d'un groupe
  getGroupById: async (groupId: string) => {
    const res = await api.get(`/groups/${groupId}`);
    return res.data;
  },
  // GET /groups/suggested — groupes suggérés
  getSuggestedGroups: async () => {
    const res = await api.get('/groups/suggested');
    return res.data;
  },
  // POST /groups/:id/leave — quitter un groupe (studentId via header X-User-Id)
  leaveGroup: async (groupId: string) => {
    await api.post(`/groups/${groupId}/leave`);
  },
};

export default studentGroupService;
