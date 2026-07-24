import { PaymentFilters } from '../../../types/studentPayment.types';

interface Props {
  filters: PaymentFilters;
  onChange: (f: PaymentFilters) => void;
}

const PaymentFilterBar = ({ filters, onChange }: Props) => (
  <div className="bg-white rounded-xl shadow-sm p-4
                  flex flex-wrap gap-3">

    {/* Recherche */}
    <input
      placeholder="🔍 Rechercher transaction, répétiteur..."
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
        ...filters, status: e.target.value as PaymentFilters['status']
      })}
      className="border border-gray-200 rounded-lg px-3 py-2
                 text-sm focus:outline-none focus:ring-2 focus:ring-blue-300"
    >
      <option value="TOUS">Tous les statuts</option>
      <option value="reussi">Réussi</option>
      <option value="en_attente">En attente</option>
      <option value="echoue">Échoué</option>
      <option value="rembourse">Remboursé</option>
    </select>

    {/* Filtre type */}
    <select
      value={filters.type}
      onChange={e => onChange({
        ...filters, type: e.target.value as PaymentFilters['type']
      })}
      className="border border-gray-200 rounded-lg px-3 py-2
                 text-sm focus:outline-none focus:ring-2 focus:ring-blue-300"
    >
      <option value="TOUS">Tous les types</option>
      <option value="cours_individuel">Cours individuel</option>
      <option value="groupe">Groupe</option>
    </select>

    {/* Réinitialiser */}
    <button
      onClick={() => onChange({
        search: '', status: 'TOUS', type: 'TOUS',
        dateFrom: '', dateTo: '',
      })}
      className="bg-gray-100 hover:bg-gray-200 text-gray-600
                 rounded-lg px-4 py-2 text-sm cursor-pointer
                 transition-colors"
    >
      ✖ Réinitialiser
    </button>
  </div>
);

export default PaymentFilterBar;