import { AdminSubscriptionFilters } from '../../../types/adminSubscription.types';

interface Props {
  filters: AdminSubscriptionFilters;
  onChange: (f: AdminSubscriptionFilters) => void;
  onExport: () => void;
}

const AdminSubscriptionFilterBar = ({
  filters, onChange, onExport
}: Props) => (
  <div className="bg-white rounded-xl shadow-sm p-4
                  flex flex-wrap gap-3 items-center">

    {/* Recherche */}
    <input
      placeholder="🔍 Nom, email, groupe..."
      value={filters.search}
      onChange={e => onChange({ ...filters, search: e.target.value })}
      className="border border-gray-200 rounded-lg px-3 py-2
                 text-sm flex-1 min-w-48 focus:outline-none
                 focus:ring-2 focus:ring-blue-300"
    />

    {/* Filtre statut */}
    <select
      value={filters.status}
      onChange={e => onChange({
        ...filters,
        status: e.target.value as AdminSubscriptionFilters['status']
      })}
      className="border border-gray-200 rounded-lg px-3 py-2
                 text-sm focus:outline-none focus:ring-2 focus:ring-blue-300"
    >
      <option value="TOUS">Tous les statuts</option>
      <option value="trial">Essai gratuit</option>
      <option value="active">Actif</option>
      <option value="grace">Délai de grâce</option>
      <option value="suspended">Suspendu</option>
      <option value="expired">Expiré</option>
    </select>

    {/* Export CSV */}
    <button
      onClick={onExport}
      className="bg-yellow-400 hover:bg-yellow-500 text-gray-900
                 font-bold px-4 py-2 rounded-lg text-sm
                 cursor-pointer transition-colors"
    >
      📥 Exporter CSV
    </button>
  </div>
);

export default AdminSubscriptionFilterBar;