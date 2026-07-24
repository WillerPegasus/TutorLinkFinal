import { useAdminReports } from '../../hooks/useAdminReports';
import ReportKpiCard from '../../components/admin/ReportKpiCard';
import ReportPeriodSelector from '../../components/admin/ReportPeriodSelector';
import RevenueChart from '../../components/admin/RevenueChart';
import SubjectPerformanceTable from '../../components/admin/SubjectPerformanceTable';
import QuartierStatsTable from '../../components/admin/QuartierStatsTable';

const AdminReportsPage = () => {
  const {
    filters, setFilters,
    stats, chartData,
    subjectPerformance, quartierStats,
    handleExportCSV,
  } = useAdminReports();

  return (
    <div className="flex flex-col gap-6">

      {/* Titre */}
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-bold text-gray-800">
          Rapports & Statistiques
        </h2>
        <span className="text-sm text-gray-400">
          Période : {filters.period}
        </span>
      </div>

      {/* Sélecteur période */}
      <ReportPeriodSelector
        filters={filters}
        onChange={setFilters}
        onExport={handleExportCSV}
      />

      {/* KPI Revenus abonnements */}
      <div className="bg-[#1a2744] rounded-2xl p-5 text-white">
        <h3 className="font-bold mb-3">
          💰 Revenus TutorLink — Abonnements uniquement
        </h3>
        <div className="grid grid-cols-3 gap-4">
          <div className="bg-blue-800 rounded-xl p-4 text-center">
            <p className="text-2xl font-bold text-yellow-400">
              {stats.totalRevenus.toLocaleString()} F
            </p>
            <p className="text-blue-200 text-xs mt-1">Total mensuel</p>
          </div>
          <div className="bg-blue-800 rounded-xl p-4 text-center">
            <p className="text-2xl font-bold text-green-400">
              {stats.tutorSubscriptionRevenue.toLocaleString()} F
            </p>
            <p className="text-blue-200 text-xs mt-1">
              {stats.totalTutorsActifs} répétiteurs × 3 000 F
            </p>
          </div>
          <div className="bg-blue-800 rounded-xl p-4 text-center">
            <p className="text-2xl font-bold text-purple-400">
              {stats.groupSubscriptionRevenue.toLocaleString()} F
            </p>
            <p className="text-blue-200 text-xs mt-1">
              {stats.totalGroupsActifs} groupes × 5 000 F
            </p>
          </div>
        </div>
      </div>

      {/* KPI activité */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <ReportKpiCard
          label="Total réservations"
          value={stats.totalReservations.toLocaleString()}
          icon="📅"
          accent="border-blue-400"
        />
        <ReportKpiCard
          label="Élèves actifs"
          value={stats.totalEleves.toLocaleString()}
          icon="👤"
          accent="border-green-400"
        />
        <ReportKpiCard
          label="Répétiteurs actifs"
          value={stats.totalTutorsActifs.toLocaleString()}
          icon="🎓"
          accent="border-yellow-400"
        />
        <ReportKpiCard
          label="Satisfaction"
          value={`${stats.tauxSatisfaction}%`}
          icon="⭐"
          accent="border-orange-400"
        />
      </div>

      {/* Note paiements cours */}
      <div className="bg-gray-50 border border-gray-200
                      rounded-xl px-4 py-3 flex gap-3">
        <span className="text-lg">📱</span>
        <p className="text-gray-600 text-xs leading-relaxed">
          <strong>Note :</strong> Les paiements des cours individuels
          ne sont pas tracés ici — ils s'effectuent directement entre
          élèves et répétiteurs via MTN MoMo / Orange Money, hors
          de la plateforme TutorLink.
        </p>
      </div>

      {/* Graphique réservations */}
      <RevenueChart data={chartData} />

      {/* Tableaux */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <SubjectPerformanceTable data={subjectPerformance} />
        <QuartierStatsTable data={quartierStats} />
      </div>
    </div>
  );
};

export default AdminReportsPage;