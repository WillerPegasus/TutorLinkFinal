import { RequestFilters } from '../../../types/courseRequest.types';

interface Props {
  filters: RequestFilters;
  onChange: (f: RequestFilters) => void;
}

const RequestFilterBar = ({ filters, onChange }: Props) => (
  <div className="bg-white rounded-xl shadow-sm p-4
                  flex flex-wrap gap-3">

    {/* Recherche */}
    <input
      placeholder="🔍 Rechercher élève, référence..."
      value={filters.search}
      onChange={e => onChange({ ...filters, search: e.target.value })}
      className="border border-gray-200 rounded-lg px-3 py-2
                 text-sm flex-1 min-w-48 focus:outline-none
                 focus:ring-2 focus:ring-blue-300"
    />

    {/* Filtre statut */}
    <div className="flex gap-2">
      {[
        { label: 'Toutes', value: 'TOUS' },
        { label: 'En attente', value: 'en_attente' },
        { label: 'Acceptées', value: 'accepte' },
        { label: 'Refusées', value: 'refuse' },
      ].map(opt => (
        <button
          key={opt.value}
          onClick={() => onChange({ ...filters, status: opt.value as RequestFilters['status'] })}
          className={`px-4 py-2 rounded-lg text-sm font-medium
                      cursor-pointer transition-colors
                      ${filters.status === opt.value
                        ? 'bg-[#1a2744] text-white'
                        : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                      }`}
        >
          {opt.label}
        </button>
      ))}
    </div>
  </div>
);

export default RequestFilterBar;