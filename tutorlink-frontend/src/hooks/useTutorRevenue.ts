import { useState, useEffect, useCallback } from 'react';
import {
  RevenuePeriod, RevenueStats,
  RevenueDataPoint, RevenueTransaction
} from '../types/revenue.types';
import tutorDashboardService from '../services/tutorDashboardService';

export const useTutorRevenue = () => {
  const [period, setPeriod] = useState<RevenuePeriod>('30j');
  const [loading, setLoading] = useState(true);

  const [stats, setStats] = useState<RevenueStats>({
    totalBrut: 0, totalCommission: 0, totalNet: 0,
    totalIndividuel: 0, totalGroupe: 0, evolution: 0,
  });
  const [chartData, setChartData] = useState<RevenueDataPoint[]>([]);
  const [transactions, setTransactions] = useState<RevenueTransaction[]>([]);

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const [rawStats, rawChart, rawTx] = await Promise.all([
        tutorDashboardService.getRevenue().catch(() => null),
        tutorDashboardService.getRevenueChart().catch(() => []),
        tutorDashboardService.getRevenueTransactions(period).catch(() => []),
      ]);

      if (rawStats) {
        setStats({
          totalBrut: rawStats.totalBrut ?? 0,
          totalCommission: rawStats.totalCommission ?? 0,
          totalNet: rawStats.totalNet ?? 0,
          totalIndividuel: rawStats.totalIndividuel ?? 0,
          // ⚠️ toujours 0 côté backend pour l'instant
          totalGroupe: rawStats.totalGroupe ?? 0,
          evolution: rawStats.evolution ?? 0,
        });
      }

      setChartData(
        (rawChart ?? []).map((p: any) => ({
          month: p.month,
          individual: p.revenue ?? 0,
          group: 0, // ⚠️ pas de découpage individuel/groupe côté backend
          total: p.revenue ?? 0,
        }))
      );

      setTransactions(
        (rawTx ?? []).map((t: any) => ({
          id: String(t.id),
          reference: t.reference,
          studentName: t.studentName,
          type: t.type ?? 'individuel',
          subject: t.subject ?? '',
          date: t.date,
          amount: t.amount ?? 0,
          commission: t.commission ?? 0,
          netAmount: t.netAmount ?? 0,
          operator: t.operator ?? '',
          transactionId: t.transactionId ?? '',
          status: t.status ?? 'recu',
        }))
      );
    } catch (err) {
      console.error('Erreur chargement revenus:', err);
    } finally {
      setLoading(false);
    }
  }, [period]);

  useEffect(() => { load(); }, [load]);

  const handleExportCSV = async () => {
    try {
      const blob = await tutorDashboardService.exportRevenue(period);
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `revenus-tutorlink-${period}.csv`;
      a.click();
      URL.revokeObjectURL(url);
    } catch (err) {
      console.error('Erreur export CSV:', err);
    }
  };

  return {
    loading, period, setPeriod,
    stats, chartData, transactions,
    handleExportCSV,
  };
};
