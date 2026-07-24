import { useAdminReservations } from '../../hooks/useAdminReservations';
import ReservationsTable from '../../components/admin/ReservationsTable';
import ReservationDetailsDrawer from '../../components/admin/ReservationDetailsDrawer';

const AdminReservationsPage = () => {
  const {
    filtered, filters, setFilters, stats,
    selectedReservation, setSelectedReservation,
    handleCancel,
  } = useAdminReservations();

  return (
    <div className="flex flex-col gap-6">

      {/* Titre */}
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-bold text-gray-800">
          Suivi des réservations
        </h2>
        <span className="text-sm text-gray-400">
          {filtered.length} réservation(s)
        </span>
      </div>

      {/* Bannière modèle paiement */}
      <div className="bg-yellow-50 border border-yellow-200
                      rounded-xl px-4 py-3 flex gap-3 items-center">
        <span className="text-yellow-500 text-lg">💡</span>
        <p className="text-yellow-700 text-xs">
          <strong> modèle paiement :</strong> Les paiements des cours
          individuels sont directs entre élèves et répétiteurs
          (MTN MoMo / Orange Money). TutorLink ne gère que les
          abonnements répétiteurs et groupes.
        </p>
      </div>

      {/* Cartes statistiques — ❌ SUPPRIMÉ : Revenus, Paiements en attente */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          { label: 'Total', value: stats.total, color: 'bg-gray-50 text-gray-700' },
          { label: 'Confirmées', value: stats.confirmees, color: 'bg-blue-50 text-blue-700' },
          { label: 'Terminées', value: stats.terminees, color: 'bg-green-50 text-green-700' },
          { label: 'Annulées', value: stats.annulees, color: 'bg-red-50 text-red-700' },
        ].map(s => (
          <div key={s.label}
            className={`${s.color} rounded-xl p-4 text-center`}>
            <div className="text-2xl font-bold">{s.value}</div>
            <div className="text-xs font-medium mt-1">{s.label}</div>
          </div>
        ))}
      </div>

      {/* Filtres simplifiés — ❌ SUPPRIMÉ : filtre paiement */}
      <div className="bg-white rounded-xl shadow-sm p-4 flex flex-wrap gap-3">
        <input
          placeholder="🔍 Élève, répétiteur, référence..."
          value={filters.search}
          onChange={e => setFilters({ ...filters, search: e.target.value })}
          className="border border-gray-200 rounded-lg px-3 py-2
                     text-sm flex-1 min-w-48 focus:outline-none
                     focus:ring-2 focus:ring-blue-300"
        />
        <select
          value={filters.courseStatus}
          onChange={e => setFilters({
            ...filters,
            courseStatus: e.target.value as ReservationFilters['courseStatus']
          })}
          className="border border-gray-200 rounded-lg px-3 py-2
                     text-sm focus:outline-none focus:ring-2 focus:ring-blue-300"
        >
          <option value="TOUS">Tous les statuts</option>
          <option value="confirmee">Confirmée</option>
          <option value="en_cours">En cours</option>
          <option value="terminee">Terminée</option>
          <option value="annulee">Annulée</option>
        </select>
        <input type="date" value={filters.dateFrom}
          onChange={e => setFilters({ ...filters, dateFrom: e.target.value })}
          className="border border-gray-200 rounded-lg px-3 py-2 text-sm"
        />
        <input type="date" value={filters.dateTo}
          onChange={e => setFilters({ ...filters, dateTo: e.target.value })}
          className="border border-gray-200 rounded-lg px-3 py-2 text-sm"
        />
      </div>

      {/* Tableau */}
      <ReservationsTable
        reservations={filtered}
        onSelect={setSelectedReservation}
        onCancel={handleCancel}
      />

      {selectedReservation && (
        <ReservationDetailsDrawer
          reservation={selectedReservation}
          onClose={() => setSelectedReservation(null)}
          onCancel={handleCancel}
        />
      )}
    </div>
  );
};

// Import manquant — à ajouter en haut
import { ReservationFilters } from '../../types/adminReservation.types';

export default AdminReservationsPage;