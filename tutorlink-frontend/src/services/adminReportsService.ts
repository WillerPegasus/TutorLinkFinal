import adminApi from './adminApi';
import { ReportFilters } from '../types/adminReports.types';

// Toutes ces routes passent par AdminStatsController côté api-gateway
// (@RequestMapping("/api/admin")). ⚠️ FIX — il manquait le préfixe /admin,
// donc adminApi.get('/reports/stats') tapait http://localhost:8080/api/reports/stats
// qui ne correspond à aucune route → 404.
const adminReportsService = {

  // GET /api/admin/reports/stats — {totalUsers, activeTutors, pendingDocuments,
  // activeGroups, totalBookings, unresolvedReports} — PAS de revenus/satisfaction ici.
  getStats: async () => {
    const res = await adminApi.get('/admin/reports/stats');
    return res.data;
  },

  // GET /api/admin/dashboard/monthly — inscriptions groupées par mois {"2026-06": 12, ...}
  getMonthlyRegistrations: async () => {
    const res = await adminApi.get('/admin/dashboard/monthly');
    return res.data;
  },

  // GET /api/admin/reports/download — export PDF (le vrai bouton "Exporter" backend)
  exportPDF: async () => {
    const res = await adminApi.get('/admin/reports/download', { responseType: 'blob' });
    return res.data;
  },

  // Conservés pour compat mais non utilisés par le hook (pas de données
  // exploitables : subjects/quartiers ne comptent que des tuteurs, pas des
  // réservations — voir useAdminReports qui agrège les réservations à la place).
  getSubjectPerformance: async (filters: ReportFilters) => {
    const res = await adminApi.get('/admin/reports/subjects', { params: filters });
    return res.data;
  },
  getQuartierStats: async (filters: ReportFilters) => {
    const res = await adminApi.get('/admin/reports/quartiers', { params: filters });
    return res.data;
  },
};

export default adminReportsService;
