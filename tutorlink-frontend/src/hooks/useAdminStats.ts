import { useState, useEffect, useCallback } from 'react';
import { DashboardStats, MonthlyData, ModerationAlert, RecentRegistration } from '../types/admin.types';
import adminReportsService from '../services/adminReportsService';
import adminSubscriptionService from '../services/adminSubscriptionService';
import adminReservationService from '../services/adminReservationService';
import adminUserService from '../services/adminUserService';

// Le backend utilise STUDENT/TUTOR/PARENT — on garde le libellé pour l'affichage.
const ROLE_LABEL: Record<string, string> = {
  STUDENT: 'ELEVE',
  TUTOR: 'REPETITEUR',
  PARENT: 'PARENT',
};

const MONTH_LABELS = ['Jan', 'Fév', 'Mar', 'Avr', 'Mai', 'Jun', 'Jul', 'Aoû', 'Sep', 'Oct', 'Nov', 'Déc'];

const daysUntil = (dateStr?: string) => {
  if (!dateStr) return Infinity;
  return Math.ceil((new Date(dateStr).getTime() - Date.now()) / (1000 * 60 * 60 * 24));
};

export const useAdminStats = () => {
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState<DashboardStats>({
    totalUsers: 0, totalTutors: 0, totalReservations: 0,
    totalRevenue: 0, tutorSubscriptionRevenue: 0, groupSubscriptionRevenue: 0,
    pendingValidations: 0, activeSessionsToday: 0,
    tutorsExpiringThisWeek: 0, groupsExpiringThisWeek: 0,
  });
  const [monthlyData, setMonthlyData] = useState<MonthlyData[]>([]);
  const [alerts, setAlerts] = useState<ModerationAlert[]>([]);
  const [recentRegistrations, setRecentRegistrations] = useState<RecentRegistration[]>([]);
  const [subjectStats, setSubjectStats] = useState<{ name: string; pct: number }[]>([]);

  const load = useCallback(async () => {
    setLoading(true);
    try {
      // ⚠️ getStats() vient de AdminStatsController (/admin/reports/stats) —
      // testé indirectement via la page Rapports, mais pas encore appelé
      // ailleurs. .catch(() => null) évite de casser tout le dashboard s'il
      // renvoie une erreur ; les KPI se recalculent alors depuis les autres
      // appels ci-dessous.
      const [reportStats, tutorSubs, groupSubs, bookingsRaw, allUsers, monthlyRegs] = await Promise.all([
        adminReportsService.getStats().catch(() => null),
        adminSubscriptionService.getTutorSubscriptions().catch(() => []),
        adminSubscriptionService.getGroupSubscriptions().catch(() => []),
        adminReservationService.getReservations({ page: 0, size: 1000 }).catch(() => []),
        adminUserService.getAllUsers().catch(() => []),
        adminReportsService.getMonthlyRegistrations().catch(() => ({})),
      ]);

      const bookings: any[] = bookingsRaw?.content ?? bookingsRaw ?? [];

      const activeTutorSubs = (tutorSubs ?? []).filter((s: any) => s.status === 'ACTIVE');
      const activeGroupSubs = (groupSubs ?? []).filter((g: any) => g.status === 'ACTIVE' || g.status === 'FULL');
      const tutorSubscriptionRevenue = activeTutorSubs.length * 3000;
      const groupSubscriptionRevenue = activeGroupSubs.reduce((sum: number, g: any) => sum + (g.monthlyPrice ?? 0), 0);

      const tutorsExpiringThisWeek = (tutorSubs ?? []).filter((s: any) => {
        const d = daysUntil(s.expiryDate);
        return s.status === 'ACTIVE' && d >= 0 && d <= 7;
      }).length;
      // ⚠️ Pas de date d'expiration exposée pour les groupes côté backend
      // actuel (getGroupSubscriptions() ne renvoie pas expiryDate) → 0 honnête.
      const groupsExpiringThisWeek = 0;

      setStats({
        totalUsers: reportStats?.totalUsers ?? allUsers.length,
        totalTutors: reportStats?.activeTutors ?? allUsers.filter((u: any) => u.role === 'TUTOR').length,
        totalReservations: reportStats?.totalBookings ?? bookings.length,
        totalRevenue: tutorSubscriptionRevenue + groupSubscriptionRevenue,
        tutorSubscriptionRevenue,
        groupSubscriptionRevenue,
        pendingValidations: reportStats?.pendingDocuments ?? 0,
        activeSessionsToday: 0, // ⚠️ non tracké par le backend actuel
        tutorsExpiringThisWeek,
        groupsExpiringThisWeek,
      });

      // Graphique 6 derniers mois : réservations réelles + inscriptions réelles
      const now = new Date();
      const chart: MonthlyData[] = [];
      for (let i = 5; i >= 0; i--) {
        const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
        const key = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`;
        const monthBookings = bookings.filter((b: any) => b.scheduledDate?.startsWith(key));
        chart.push({
          month: MONTH_LABELS[d.getMonth()],
          reservations: monthBookings.length,
          inscriptions: Number((monthlyRegs as any)?.[key] ?? 0),
        });
      }
      setMonthlyData(chart);

      // Alertes réelles — uniquement des comptages vérifiables, jamais de
      // noms ou signalements inventés (le backend ne fournit pas de détail
      // par répétiteur ici).
      const builtAlerts: ModerationAlert[] = [];
      const today = new Date().toISOString().slice(0, 10);
      if ((reportStats?.pendingDocuments ?? 0) > 0) {
        builtAlerts.push({
          id: 'pending-docs', type: 'validation',
          message: `${reportStats.pendingDocuments} répétiteurs en attente de validation`,
          date: today, urgent: true,
        });
      }
      if ((reportStats?.unresolvedReports ?? 0) > 0) {
        builtAlerts.push({
          id: 'unresolved-reports', type: 'signalement',
          message: `${reportStats.unresolvedReports} signalement(s) non résolu(s)`,
          date: today, urgent: true,
        });
      }
      if (tutorsExpiringThisWeek > 0) {
        builtAlerts.push({
          id: 'tutors-expiring', type: 'validation',
          message: `${tutorsExpiringThisWeek} répétiteurs dont l'abonnement expire cette semaine`,
          date: today, urgent: false,
        });
      }
      setAlerts(builtAlerts);

      // Dernières inscriptions réelles (triées par date décroissante)
      const recent: RecentRegistration[] = [...(allUsers ?? [])]
        .filter((u: any) => ROLE_LABEL[u.role])
        .sort((a: any, b: any) => (b.createdAt ?? '').localeCompare(a.createdAt ?? ''))
        .slice(0, 4)
        .map((u: any) => ({
          id: String(u.id),
          name: `${u.firstName ?? ''} ${u.lastName ?? ''}`.trim(),
          role: ROLE_LABEL[u.role] as RecentRegistration['role'],
          date: u.createdAt ?? '',
          status: u.status === 'PENDING' ? 'en_attente' : 'actif',
        }));
      setRecentRegistrations(recent);

      // Matières populaires — répartition réelle des réservations par matière
      const bySubject = new Map<string, number>();
      for (const b of bookings) {
        const subj = b.subject || 'Non renseigné';
        bySubject.set(subj, (bySubject.get(subj) ?? 0) + 1);
      }
      const total = bookings.length || 1;
      const subjArr = [...bySubject.entries()]
        .map(([name, count]) => ({ name, pct: Math.round((count / total) * 100) }))
        .sort((a, b) => b.pct - a.pct)
        .slice(0, 5);
      setSubjectStats(subjArr);
    } catch (err) {
      console.error('Erreur chargement dashboard admin:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { load(); }, [load]);

  return { stats, monthlyData, alerts, recentRegistrations, subjectStats, loading };
};
