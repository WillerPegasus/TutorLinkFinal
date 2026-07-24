import { useAdminStats } from '../../hooks/useAdminStats';
import AdminKpiCard from '../../components/admin/AdminKpiCard';
import ReservationsChart from '../../components/admin/ReservationsChart';
import PopularSubjectsPanel from '../../components/admin/PopularSubjectsPanel';
import ModerationAlerts from '../../components/admin/ModerationAlerts';
import RecentRegistrationsTable from '../../components/admin/RecentRegistrationsTable';

const AdminDashboardPage = () => {
  const { stats, monthlyData, alerts, recentRegistrations, subjectStats, loading } = useAdminStats();

  if (loading) return (
    <div className="flex justify-center paddingTop-80">
      <p className="text-gray-400">Chargement...</p>
    </div>
  );

  return (
    <div>
      <h2 className="text-xl font-bold text-gray-800 mb-6">
        Vue d'ensemble
      </h2>

      {/* ✅ NOUVEAU : Bannière modèle économique */}
      <div className="bg-[#1a2744] rounded-xl p-4 mb-6
                      flex items-center justify-between">
        <div>
          <p className="text-white font-bold text-sm">
            💡 Modèle économique TutorLink
          </p>
          <p className="text-blue-200 text-xs mt-0.5">
            Revenus = Abonnements répétiteurs (3 000 F/mois) +
            Abonnements groupes (5 000 F/mois) · 0% commission sur les cours
          </p>
        </div>
        <div className="text-right">
          <p className="text-yellow-400 font-bold text-xl">
            {stats.totalRevenue.toLocaleString()} F
          </p>
          <p className="text-blue-300 text-xs">Revenus mensuels</p>
        </div>
      </div>

      {/* Grille KPI ligne 1 */}
      <div className="flex gap-4 mb-6 flex-wrap">
        <AdminKpiCard
          label="Utilisateurs"
          value={stats.totalUsers.toLocaleString()}
          icon="👤"
          accent="#2196F3"
        />
        <AdminKpiCard
          label="Répétiteurs"
          value={stats.totalTutors.toLocaleString()}
          icon="🎓"
          accent="#1a2744"
        />
        <AdminKpiCard
          label="Réservations"
          value={stats.totalReservations.toLocaleString()}
          icon="📅"
          accent="#E9A319"
        />
      </div>

      {/* Grille KPI ligne 2 — REVENUS ABONNEMENTS */}
      <div className="flex gap-4 mb-6 flex-wrap">
        <AdminKpiCard
          label="Abonnements répétiteurs"
          value={`${stats.tutorSubscriptionRevenue.toLocaleString()} F`}
          icon="🎓"
          accent="#4CAF50"
          sub="398 actifs × 3 000 F"
        />
        <AdminKpiCard
          label="Abonnements groupes"
          value={`${stats.groupSubscriptionRevenue.toLocaleString()} F`}
          icon="👥"
          accent="#9C27B0"
          sub="31 actifs × 5 000 F"
        />
        <AdminKpiCard
          label="En attente validation"
          value={String(stats.pendingValidations)}
          icon="⏳"
          accent="#FF5722"
          sub="répétiteurs"
        />
        <AdminKpiCard
          label="Abonnements expirant"
          value={String(stats.tutorsExpiringThisWeek + stats.groupsExpiringThisWeek)}
          icon="⚠️"
          accent="#F44336"
          sub="cette semaine"
        />
      </div>

      {/* Graphique + Matières */}
      <div className="flex gap-4 mb-6">
        <div className="flex-2"><ReservationsChart data={monthlyData} /></div>
        <div className="flex-1"><PopularSubjectsPanel subjects={subjectStats} /></div>
      </div>

      {/* Alertes + Inscriptions */}
      <div className="flex gap-4">
        <div className="flex-1"><ModerationAlerts alerts={alerts} /></div>
        <div className="flex-2">
          <RecentRegistrationsTable data={recentRegistrations} />
        </div>
      </div>
    </div>
  );
};

export default AdminDashboardPage;