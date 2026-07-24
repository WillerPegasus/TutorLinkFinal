import { useAdminGroups } from '../../hooks/useAdminGroups';
import AdminGroupFilterBar from '../../components/admin/AdminGroupFilterBar';
import AdminGroupsTable from '../../components/admin/AdminGroupsTable';
import AdminGroupDetailModal from '../../components/admin/AdminGroupDetailModal';

const AdminGroupsPage = () => {
  const {
    filteredGroups, filters, setFilters, stats,
    selectedGroup, setSelectedGroup,
    handleVerify, handleSuspend, handleDelete,
  } = useAdminGroups();

  return (
    <div className="flex flex-col gap-6">

      {/* Titre */}
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-bold text-blue-900">
          Gestion des groupes
        </h2>
        <span className="text-sm text-gray-400">
          {filteredGroups.length} groupe(s)
        </span>
      </div>

      {/* Cartes stats rapides */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
        {[
          { label: 'Total groupes', value: stats.total, color: 'bg-blue-50 text-blue-800' },
          { label: 'Actifs', value: stats.actifs, color: 'bg-green-50 text-green-800' },
          { label: 'En attente', value: stats.enAttente, color: 'bg-orange-50 text-orange-800' },
          { label: 'Total élèves', value: stats.totalEleves, color: 'bg-purple-50 text-purple-800' },
          { label: 'Revenus générés', value: `${stats.totalRevenus.toLocaleString()} F`, color: 'bg-yellow-50 text-yellow-800' },
        ].map(s => (
          <div key={s.label} className={`${s.color} rounded-xl p-4 text-center`}>
            <div className="text-2xl font-bold">{s.value}</div>
            <div className="text-xs font-medium mt-1">{s.label}</div>
          </div>
        ))}
      </div>

      {/* Filtres */}
      <AdminGroupFilterBar filters={filters} onChange={setFilters} />

      {/* Tableau */}
      <AdminGroupsTable
        groups={filteredGroups}
        onVerify={handleVerify}
        onSuspend={handleSuspend}
        onDelete={handleDelete}
        onDetail={setSelectedGroup}
      />

      {/* Modal détail */}
      {selectedGroup && (
        <AdminGroupDetailModal
          group={selectedGroup}
          onClose={() => setSelectedGroup(null)}
          onSuspend={handleSuspend}
          onDelete={handleDelete}
        />
      )}
    </div>
  );
};

export default AdminGroupsPage;