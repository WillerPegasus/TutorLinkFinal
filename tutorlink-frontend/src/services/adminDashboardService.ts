import adminApi from './adminApi';
import { DashboardStats, MonthlyData, ModerationAlert, RecentRegistration } from '../types/admin.types';

const adminDashboardService = {
  // Récupère les chiffres clés (KPI)
  getStats: async (): Promise<DashboardStats> => {
    const res = await adminApi.get('/dashboard/stats');
    return res.data;
  },

  // Récupère les données du graphique sur 6 mois
  getMonthlyData: async (): Promise<MonthlyData[]> => {
    const res = await adminApi.get('/dashboard/monthly');
    return res.data;
  },

  // Récupère les alertes de modération
  getAlerts: async (): Promise<ModerationAlert[]> => {
    const res = await adminApi.get('/dashboard/alerts');
    return res.data;
  },

  // Récupère les dernières inscriptions
  getRecentRegistrations: async (): Promise<RecentRegistration[]> => {
    const res = await adminApi.get('/dashboard/registrations/recent');
    return res.data;
  },
};

export default adminDashboardService;