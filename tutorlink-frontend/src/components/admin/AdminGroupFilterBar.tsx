import { AdminGroupFilters } from '../../types/adminGroup.types';

interface Props {
  filters: AdminGroupFilters;
  onChange: (f: AdminGroupFilters) => void;
}

const AdminGroupFilterBar = ({ filters, onChange }: Props) => (
  <div className="bg-white rounded-xl shadow-sm p-4 flex flex-wrap gap-3 mb-4">

    {/* Recherche */}
    <input
      placeholder="🔍 Nom groupe, répétiteur, matière..."
      value={filters.search}
      onChange={e => onChange({ ...filters, search: e.target.value })}
      className="border border-gray-200 rounded-lg px-3 py-2
                 text-sm flex-1 min-w-48 focus:outline-none
                 focus:ring-2 focus:ring-blue-300"
    />

    {/* Filtre statut */}
    <select
      value={filters.status}
      onChange={e => onChange({ ...filters, status: e.target.value as AdminGroupFilters['status'] })}
      className="border border-gray-200 rounded-lg px-3 py-2
                 text-sm focus:outline-none focus:ring-2 focus:ring-blue-300"
    >
      <option value="TOUS">Tous les statuts</option>
      <option value="actif">Actif</option>
      <option value="complet">Complet</option>
      <option value="en_attente">En attente</option>
      <option value="suspendu">Suspendu</option>
    </select>

    {/* Filtre matière */}
    <input
      placeholder="📚 Matière..."
      value={filters.subject}
      onChange={e => onChange({ ...filters, subject: e.target.value })}
      className="border border-gray-200 rounded-lg px-3 py-2
                 text-sm w-36 focus:outline-none focus:ring-2 focus:ring-blue-300"
    />

    {/* Réinitialiser */}
    <button
      onClick={() => onChange({ search: '', status: 'TOUS', subject: '' })}
      className="bg-gray-100 hover:bg-gray-200 text-gray-600
                 rounded-lg px-4 py-2 text-sm cursor-pointer transition-colors"
    >
      ✖ Réinitialiser
    </button>
  </div>
);

export default AdminGroupFilterBar;