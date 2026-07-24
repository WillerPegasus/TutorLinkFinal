import adminApi from './adminApi';

// Ces routes passent par AdminSubscriptionProxyController côté api-gateway
// (@RequestMapping("/api/admin/subscriptions")), qui relaie vers tutor-service.
// ⚠️ FIX — les anciens chemins ('/subscriptions/...') ne correspondaient à
// aucune route de la gateway → 404 garanti. Il manquait le préfixe /admin.
const adminSubscriptionService = {

  getGlobalStats: async () => {
    const res = await adminApi.get('/admin/subscriptions/stats');
    return res.data;
  },

  getTutorSubscriptions: async () => {
    const res = await adminApi.get('/admin/subscriptions/tutors');
    return res.data;
  },

  getGroupSubscriptions: async () => {
    const res = await adminApi.get('/admin/subscriptions/groups');
    return res.data;
  },

  activateTutorSubscription: async (tutorId: string) => {
    const res = await adminApi.post(`/admin/subscriptions/tutors/${tutorId}/activate`);
    return res.data;
  },

  suspendTutorSubscription: async (tutorId: string) => {
    const res = await adminApi.post(`/admin/subscriptions/tutors/${tutorId}/suspend`);
    return res.data;
  },

  activateGroupSubscription: async (groupId: string) => {
    const res = await adminApi.post(`/admin/subscriptions/groups/${groupId}/activate`);
    return res.data;
  },

  suspendGroupSubscription: async (groupId: string) => {
    const res = await adminApi.post(`/admin/subscriptions/groups/${groupId}/suspend`);
    return res.data;
  },

  sendReminderManually: async (id: string, type: 'tutor' | 'group') => {
    const res = await adminApi.post('/admin/subscriptions/notify', { id, type });
    return res.data;
  },

  exportCSV: async () => {
    const res = await adminApi.get('/admin/subscriptions/export', { responseType: 'blob' });
    return res.data;
  },
};

export default adminSubscriptionService;
