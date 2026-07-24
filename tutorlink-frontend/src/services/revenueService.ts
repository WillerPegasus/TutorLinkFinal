import api from './api';
import { RevenuePeriod } from '../types/revenue.types';

// ⚠️ BACKEND REQUIS
const revenueService = {

  // GET /tutor/revenue/stats — statistiques de la période
  getStats: async (period: RevenuePeriod) => {
    const res = await api.get('/tutor/revenue/stats', {
      params: { period }
    });
    return res.data;
  },

  // GET /tutor/revenue/chart — données graphique
  getChartData: async (period: RevenuePeriod) => {
    const res = await api.get('/tutor/revenue/chart', {
      params: { period }
    });
    return res.data;
  },

  // GET /tutor/revenue/transactions — liste des versements
  getTransactions: async (period: RevenuePeriod) => {
    const res = await api.get('/tutor/revenue/transactions', {
      params: { period }
    });
    return res.data;
  },

  // GET /tutor/revenue/export — export CSV
  exportCSV: async (period: RevenuePeriod) => {
    const res = await api.get('/tutor/revenue/export', {
      params: { period, format: 'csv' },
      responseType: 'blob',
    });
    return res.data;
  },
};

export default revenueService;