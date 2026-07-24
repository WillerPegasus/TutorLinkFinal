import { ReservationFilters } from '../../types/adminReservation.types';

interface Props {
  filters: ReservationFilters;
  onChange: (f: ReservationFilters) => void;
}

const ReservationFilterBar = ({ filters, onChange }: Props) => (
  <div className="bg-white rounded-xl shadow-sm p-4
                  flex flex-wrap gap-3 mb-4">

    {/* Recherche globale */}
    <input
      placeholder="🔍 Élève, répétiteur, référence..."
      value={filters.search}
      onChange={e => onChange({ ...filters, search: e.target.value })}
      className="border border-gray-200 rounded-lg px-3 py-2
                 text-sm flex-1 min-w-48 focus:outline-none
                 focus:ring-2 focus:ring-blue-300"
    />

    {/* Filtre statut cours */}
    <select
      value={filters.courseStatus}
      onChange={e => onChange({ ...filters, courseStatus: e.target.value as ReservationFilters['courseStatus'] })}
      className="border border-gray-200 rounded-lg px-3 py-2
                 text-sm focus:outline-none focus:ring-2 focus:ring-blue-300"
    >
      <option value="TOUS">Tous les statuts cours</option>
      <option value="confirmee">Confirmée</option>
      <option value="en_cours">En cours</option>
      <option value="terminee">Terminée</option>
      <option value="annulee">Annulée</option>
    </select>

    {/* Filtre statut paiement */}
    
     
      <div className="border border-gray-200 rounded-lg px-3 py-2
                 text-sm focus:outline-none focus:ring-2 focus:ring-blue-300">paiement: directement au repetiteur</div>
                                      
     
    

    {/* Filtre matière */}
    <input
      placeholder="📚 Matière..."
      value={filters.subject}
      onChange={e => onChange({ ...filters, subject: e.target.value })}
      className="border border-gray-200 rounded-lg px-3 py-2
                 text-sm w-36 focus:outline-none focus:ring-2 focus:ring-blue-300"
    />

    {/* Dates */}
    <input
      type="date" value={filters.dateFrom}
      onChange={e => onChange({ ...filters, dateFrom: e.target.value })}
      className="border border-gray-200 rounded-lg px-3 py-2 text-sm"
    />
    <input
      type="date" value={filters.dateTo}
      onChange={e => onChange({ ...filters, dateTo: e.target.value })}
      className="border border-gray-200 rounded-lg px-3 py-2 text-sm"
    />

    {/* Réinitialiser */}
    <button
      onClick={() => onChange({
        search: '', courseStatus: 'TOUS', 
        dateFrom: '', dateTo: '', subject: '',
      })}
      className="bg-gray-100 hover:bg-gray-200 text-gray-600
                 rounded-lg px-4 py-2 text-sm cursor-pointer transition-colors"
    >
      ✖ Réinitialiser
    </button>
  </div>
);

export default ReservationFilterBar;