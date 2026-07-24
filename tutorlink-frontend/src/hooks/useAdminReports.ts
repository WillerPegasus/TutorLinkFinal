import { useState, useEffect, useCallback } from 'react';
import {
  ReportFilters, ReportStats,
  ChartDataPoint, SubjectPerformance, QuartierStats
} from '../types/adminReports.types';
import adminReportsService from '../services/adminReportsService';
import adminReservationService from '../services/adminReservationService';
import adminSubscriptionService from '../services/adminSubscriptionService';

// Convertit la période sélectionnée en date de début (pour filtrer les
// réservations côté client — le backend ne fait pas ce filtrage lui-même).
const periodStartDate = (period: ReportFilters['period']): Date => {
  const now = new Date();
  const d = new Date(now);
  switch (period) {
    case '7j': d.setDate(d.getDate() - 7); break;
    case '30j': d.setDate(d.getDate() - 30); break;
    case '3m': d.setMonth(d.getMonth() - 3); break;
    case '6m': d.setMonth(d.getMonth() - 6); break;
    case '1an': d.setFullYear(d.getFullYear() - 1); break;
  }
  return d;
};

const MONTH_LABELS = ['Jan', 'Fév', 'Mar', 'Avr', 'Mai', 'Jun', 'Jul', 'Aoû', 'Sep', 'Oct', 'Nov', 'Déc'];

export const useAdminReports = () => {
  const [filters, setFilters] = useState<ReportFilters>({
    period: '30j', subject: '', quartier: '',
  });

  const [stats, setStats] = useState<ReportStats>({
    totalReservations: 0, totalRevenus: 0, totalEleves: 0, totalRepetiteurs: 0,
    tauxSatisfaction: 0, totalGroupsActifs: 0, reservationsParJour: 0,
    totalTutorsActifs: 0, tutorSubscriptionRevenue: 0, groupSubscriptionRevenue: 0,
  });
  const [chartData, setChartData] = useState<ChartDataPoint[]>([]);
  const [subjectPerformance, setSubjectPerformance] = useState<SubjectPerformance[]>([]);
  const [quartierStats, setQuartierStats] = useState<QuartierStats[]>([]);
  const [loading, setLoading] = useState(true);

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const [bookingsRaw, tutorSubs, groupOverview, monthlyRegs] = await Promise.all([
        adminReservationService.getReservations({ page: 0, size: 1000 }),
        adminSubscriptionService.getTutorSubscriptions(),
        adminSubscriptionService.getGroupSubscriptions(),
        adminReportsService.getMonthlyRegistrations().catch(() => ({})),
      ]);

      const allBookings: any[] = bookingsRaw?.content ?? bookingsRaw ?? [];
      const startDate = periodStartDate(filters.period);
      const bookings = allBookings.filter((b: any) =>
        b.scheduledDate && new Date(b.scheduledDate) >= startDate
      );

      // ── Revenus abonnements (vrais, déjà calculés comme sur la page Abonnements) ──
      const activeTutorSubs = (tutorSubs ?? []).filter((s: any) => s.status === 'ACTIVE');
      const activeGroupSubs = (groupOverview ?? []).filter((g: any) =>
        g.status === 'ACTIVE' || g.status === 'FULL'
      );
      const tutorSubscriptionRevenue = activeTutorSubs.length * 3000;
      const groupSubscriptionRevenue = activeGroupSubs.reduce(
        (sum: number, g: any) => sum + (g.monthlyPrice ?? 0), 0
      );

      // ── Répartition par matière (à partir des vraies réservations) ──
      const bySubject = new Map<string, { reservations: number; revenus: number }>();
      const byQuartier = new Map<string, { reservations: number; revenus: number }>();
      for (const b of bookings) {
        const subj = b.subject || 'Non renseigné';
        const q = b.location || 'Non renseigné';
        const amount = b.amount ?? 0;
        const s = bySubject.get(subj) ?? { reservations: 0, revenus: 0 };
        s.reservations += 1; s.revenus += amount;
        bySubject.set(subj, s);
        const qq = byQuartier.get(q) ?? { reservations: 0, revenus: 0 };
        qq.reservations += 1; qq.revenus += amount;
        byQuartier.set(q, qq);
      }
      const total = bookings.length || 1;
      const subjectPerf: SubjectPerformance[] = [...bySubject.entries()]
        .map(([subject, v]) => ({
          subject, reservations: v.reservations, revenus: v.revenus,
          satisfaction: 0, // ⚠️ non trackée par le backend actuel
          pct: Math.round((v.reservations / total) * 100),
        }))
        .sort((a, b) => b.reservations - a.reservations);
      const quartierPerf: QuartierStats[] = [...byQuartier.entries()]
        .map(([quartier, v]) => ({
          quartier, reservations: v.reservations, revenus: v.revenus,
          pct: Math.round((v.reservations / total) * 100),
        }))
        .sort((a, b) => b.reservations - a.reservations);

      // ── Graphique mensuel (6 derniers mois) : réservations+revenus réels,
      //    inscriptions réelles via user-service ──
      const chart: ChartDataPoint[] = [];
      const now = new Date();
      for (let i = 5; i >= 0; i--) {
        const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
        const key = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`;
        const monthBookings = allBookings.filter((b: any) =>
          b.scheduledDate && b.scheduledDate.startsWith(key)
        );
        chart.push({
          month: MONTH_LABELS[d.getMonth()],
          reservations: monthBookings.length,
          revenus: monthBookings.reduce((sum: number, b: any) => sum + (b.amount ?? 0), 0),
          inscriptions: Number((monthlyRegs as any)?.[key] ?? 0),
        });
      }

      setStats({
        totalReservations: bookings.length,
        totalRevenus: tutorSubscriptionRevenue + groupSubscriptionRevenue,
        totalEleves: new Set(bookings.map((b: any) => b.studentId)).size,
        totalRepetiteurs: new Set(bookings.map((b: any) => b.tutorId)).size,
        tauxSatisfaction: 0, // ⚠️ non trackée par le backend actuel
        totalGroupsActifs: activeGroupSubs.length,
        reservationsParJour: Math.round((bookings.length / 30) * 10) / 10,
        totalTutorsActifs: activeTutorSubs.length,
        tutorSubscriptionRevenue,
        groupSubscriptionRevenue,
      });
      setChartData(chart);
      setSubjectPerformance(subjectPerf);
      setQuartierStats(quartierPerf);
    } catch (err) {
      console.error('Erreur chargement rapports:', err);
    } finally {
      setLoading(false);
    }
  }, [filters.period]);

  useEffect(() => { load(); }, [load]);

  const handleExportCSV = () => {
    const rows = [
      ['Mois', 'Réservations', 'Revenus abonnements (part du mois non calculée)', 'Inscriptions'],
      ...chartData.map(d => [d.month, d.reservations, d.revenus, d.inscriptions]),
    ];
    const csv = rows.map(r => r.join(',')).join('\n');
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `rapport-tutorlink-${filters.period}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return {
    loading,
    filters, setFilters,
    stats, chartData,
    subjectPerformance, quartierStats,
    handleExportCSV,
  };
};
