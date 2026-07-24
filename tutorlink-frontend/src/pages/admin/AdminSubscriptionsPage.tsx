import { useAdminSubscriptions } from '../../hooks/useAdminSubscriptions';
import SubscriptionGlobalStatsCards from '../../components/admin/subscriptions/SubscriptionGlobalStatsCards';
import AdminSubscriptionFilterBar from '../../components/admin/subscriptions/AdminSubscriptionFilterBar';
import TutorSubscriptionsTable from '../../components/admin/subscriptions/TutorSubscriptionsTable';
import GroupSubscriptionsTable from '../../components/admin/subscriptions/GroupSubscriptionsTable';

const AdminSubscriptionsPage = () => {
  const {
    activeTab, setActiveTab,
    filters, setFilters,
    stats,
    filteredTutors, filteredGroups,
    handleActivateTutor, handleSuspendTutor,
    handleActivateGroup, handleSuspendGroup,
    handleExportCSV,
  } = useAdminSubscriptions();

  // Rappel SMS mock
  const handleNotify = (id: string) => {
    alert(`SMS de rappel envoyé à l'abonné ${id}`);
  };

  return (
    <div className="flex flex-col gap-6">

      {/* Titre */}
      <div className="flex justify-between items-start">
        <div>
          <h2 className="text-xl font-bold text-gray-800">
            💳 Gestion des abonnements
          </h2>
          <p className="text-gray-400 text-sm mt-1">
            Répétiteurs : 3 000 FCFA/mois · Groupes : 5 000 FCFA/mois
          </p>
        </div>
      </div>

      {/* Statistiques globales */}
      <SubscriptionGlobalStatsCards stats={stats} />

      {/* Filtres + Export */}
      <AdminSubscriptionFilterBar
        filters={filters}
        onChange={setFilters}
        onExport={handleExportCSV}
      />

      {/* Onglets */}
      <div className="flex gap-2 border-b border-gray-100">
        {[
          { key: 'tutors', label: `🎓 Répétiteurs (${filteredTutors.length})` },
          { key: 'groups', label: `👥 Groupes (${filteredGroups.length})` },
        ].map(tab => (
          <button
            key={tab.key}
            onClick={() => setActiveTab(tab.key as 'tutors' | 'groups')}
            className={`px-5 py-2.5 text-sm font-medium cursor-pointer
                        transition-colors border-b-2 -mb-px
                        ${activeTab === tab.key
                          ? 'border-[#1a2744] text-[#1a2744]'
                          : 'border-transparent text-gray-500 hover:text-gray-700'
                        }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Tableau selon l'onglet actif */}
      {activeTab === 'tutors' ? (
        <TutorSubscriptionsTable
          subscriptions={filteredTutors}
          onActivate={handleActivateTutor}
          onSuspend={handleSuspendTutor}
          onNotify={handleNotify}
        />
      ) : (
        <GroupSubscriptionsTable
          subscriptions={filteredGroups}
          onActivate={handleActivateGroup}
          onSuspend={handleSuspendGroup}
          onNotify={handleNotify}
        />
      )}
    </div>
  );
};

export default AdminSubscriptionsPage;