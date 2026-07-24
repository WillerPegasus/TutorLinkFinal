import adminApi from './adminApi';

// Ces routes passent par AdminGroupProxyController côté api-gateway
// (@RequestMapping("/api/admin/groups")).
// ⚠️ FIX — '/groups' (sans préfixe /admin) tombait sur la route publique
// du group-service, qui exige un token élève/tuteur → 401 avec un token admin.
const adminGroupService = {

  getGroups: async (filters: object) => {
    const res = await adminApi.get('/admin/groups', { params: filters });
    return res.data;
  },

  verifyGroup: async (id: string) => {
    const res = await adminApi.patch(`/admin/groups/${id}/verify`);
    return res.data;
  },

  suspendGroup: async (id: string, reason: string) => {
    const res = await adminApi.patch(`/admin/groups/${id}/suspend`, { reason });
    return res.data;
  },

  deleteGroup: async (id: string) => {
    await adminApi.delete(`/admin/groups/${id}`);
  },

  getGroupMembers: async (id: string) => {
    const res = await adminApi.get(`/admin/groups/${id}/members`);
    return res.data;
  },
};

export default adminGroupService;
