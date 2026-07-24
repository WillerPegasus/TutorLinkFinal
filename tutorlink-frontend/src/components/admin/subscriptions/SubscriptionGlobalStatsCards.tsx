import { SubscriptionGlobalStats } from '../../../types/adminSubscription.types';

interface Props { stats: SubscriptionGlobalStats; }

const SubscriptionGlobalStatsCards = ({ stats }: Props) => (
  <div className="flex flex-col gap-4">

    {/* Ligne 1 — Revenus globaux */}
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      <div className="bg-[#1a2744] text-white rounded-2xl p-5">
        <p className="text-blue-300 text-xs uppercase font-semibold mb-1">
          Revenus mensuels totaux
        </p>
        <p className="text-3xl font-bold text-yellow-400">
          {stats.totalMonthlyRevenue.toLocaleString()} F
        </p>
        <p className="text-blue-300 text-xs mt-1">FCFA / mois</p>
      </div>
      <div className="bg-white rounded-2xl shadow-sm p-5 border-l-4 border-blue-400">
        <p className="text-xs text-gray-400 uppercase font-semibold mb-1">
          Abonnements répétiteurs
        </p>
        <p className="text-2xl font-bold text-gray-800">
          {stats.tutorsRevenue.toLocaleString()} F
        </p>
        <p className="text-xs text-gray-400 mt-1">
          {stats.tutorsActive} répétiteurs actifs × 3 000 F
        </p>
      </div>
      <div className="bg-white rounded-2xl shadow-sm p-5 border-l-4 border-purple-400">
        <p className="text-xs text-gray-400 uppercase font-semibold mb-1">
          Abonnements groupes
        </p>
        <p className="text-2xl font-bold text-gray-800">
          {stats.groupsRevenue.toLocaleString()} F
        </p>
        <p className="text-xs text-gray-400 mt-1">
          {stats.groupsActive} groupes actifs × 5 000 F
        </p>
      </div>
    </div>

    {/* Ligne 2 — Détail répétiteurs */}
    <div className="bg-white rounded-2xl shadow-sm p-5">
      <h3 className="font-bold text-gray-700 mb-3">
        🎓 Répétiteurs — {stats.totalTutors} au total
      </h3>
      <div className="grid grid-cols-4 gap-3">
        {[
          { label: 'Essai gratuit', value: stats.tutorsTrial, color: 'bg-blue-50 text-blue-700' },
          { label: 'Actifs', value: stats.tutorsActive, color: 'bg-green-50 text-green-700' },
          { label: 'Suspendus', value: stats.tutorsSuspended, color: 'bg-red-50 text-red-700' },
          { label: 'Revenus', value: `${stats.tutorsRevenue.toLocaleString()} F`, color: 'bg-yellow-50 text-yellow-700' },
        ].map(s => (
          <div key={s.label} className={`${s.color} rounded-xl p-3 text-center`}>
            <p className="text-xl font-bold">{s.value}</p>
            <p className="text-xs font-medium mt-0.5">{s.label}</p>
          </div>
        ))}
      </div>
    </div>

    {/* Ligne 3 — Détail groupes */}
    <div className="bg-white rounded-2xl shadow-sm p-5">
      <h3 className="font-bold text-gray-700 mb-3">
        👥 Groupes — {stats.totalGroups} au total
      </h3>
      <div className="grid grid-cols-4 gap-3">
        {[
          { label: 'Essai gratuit', value: stats.groupsTrial, color: 'bg-blue-50 text-blue-700' },
          { label: 'Actifs', value: stats.groupsActive, color: 'bg-green-50 text-green-700' },
          { label: 'Suspendus', value: stats.groupsSuspended, color: 'bg-red-50 text-red-700' },
          { label: 'Revenus', value: `${stats.groupsRevenue.toLocaleString()} F`, color: 'bg-yellow-50 text-yellow-700' },
        ].map(s => (
          <div key={s.label} className={`${s.color} rounded-xl p-3 text-center`}>
            <p className="text-xl font-bold">{s.value}</p>
            <p className="text-xs font-medium mt-0.5">{s.label}</p>
          </div>
        ))}
      </div>
    </div>
  </div>
);

export default SubscriptionGlobalStatsCards;