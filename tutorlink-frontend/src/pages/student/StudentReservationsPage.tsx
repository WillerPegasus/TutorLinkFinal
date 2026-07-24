import { useStudentReservations } from '../../hooks/useStudentReservations';
import { useNavigate } from 'react-router-dom';
import ReservationCard from '../../components/student/reservations/ReservationCard';
import ReservationStatusBadge from '../../components/student/reservations/ReservationStatusBadge';
import ReviewForm from '@/components/student/reviews/ReviewForm';
import ReservationDetailModal from '@/components/student/reservations/ReservationDetailModal';
const StudentReservationsPage = () => {
  const navigate = useNavigate();
  const {
    filteredReservations, filters, setFilters, stats,
    selectedReservation, setSelectedReservation,
    handleCancel, handleContact,
  } = useStudentReservations();

  return (
    <div className="flex flex-col gap-6">

      {/* Titre */}
      <div className="flex justify-between items-start">
        <div>
          <h2 className="text-xl font-bold text-gray-800">
            📅 Mes réservations
          </h2>
          <p className="text-gray-400 text-sm mt-1">
            Gérez vos demandes de cours avec vos répétiteurs.
          </p>
        </div>
        <button
          onClick={() => navigate('/eleve/repetiteurs')}
          className="bg-[#1a2744] hover:bg-blue-900 text-white
                     font-bold px-4 py-2 rounded-xl text-sm
                     cursor-pointer transition-colors"
        >
          + Nouvelle réservation
        </button>
      </div>

      {/* Bannière modèle paiement */}
      <div className="bg-yellow-50 border border-yellow-200
                      rounded-xl px-4 py-3 flex gap-3 items-start">
        <span className="text-yellow-500 text-xl flex-shrink-0">💳</span>
        <div>
          <p className="font-bold text-yellow-800 text-sm">
            Paiement direct à votre répétiteur
          </p>
          <p className="text-yellow-700 text-xs mt-0.5 leading-relaxed">
            Une fois votre cours confirmé, payez directement votre
            répétiteur via MTN MoMo ou Orange Money au numéro affiché
            sur chaque carte. Aucun paiement ne passe par TutorLink
            pour les cours individuels.
          </p>
        </div>
      </div>

      {/* Cartes statistiques */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          { label: 'Total', value: stats.total, color: 'bg-gray-50 text-gray-700' },
          { label: 'Confirmées', value: stats.confirmees, color: 'bg-blue-50 text-blue-700' },
          { label: 'En attente', value: stats.enAttente, color: 'bg-orange-50 text-orange-700' },
          { label: 'Terminées', value: stats.terminees, color: 'bg-green-50 text-green-700' },
        ].map(s => (
          <div key={s.label}
            className={`${s.color} rounded-xl p-4 text-center`}>
            <p className="text-2xl font-bold">{s.value}</p>
            <p className="text-xs font-medium mt-1">{s.label}</p>
          </div>
        ))}
      </div>

      {/* Filtres */}
      <div className="bg-white rounded-xl shadow-sm p-4
                      flex flex-wrap gap-3">
        <input
          placeholder="🔍 Répétiteur, matière, référence..."
          value={filters.search}
          onChange={e => setFilters({ ...filters, search: e.target.value })}
          className="border border-gray-200 rounded-lg px-3 py-2
                     text-sm flex-1 min-w-48 focus:outline-none
                     focus:ring-2 focus:ring-blue-300"
        />
        <div className="flex gap-2 flex-wrap">
          {[
            { label: 'Toutes', value: 'TOUS' },
            { label: 'Confirmées', value: 'confirme' },
            { label: 'En attente', value: 'en_attente' },
            { label: 'Terminées', value: 'termine' },
            { label: 'Annulées', value: 'annule' },
          ].map(opt => (
            <button
              key={opt.value}
              onClick={() => setFilters({
                ...filters,
                status: opt.value as typeof filters.status
              })}
              className={`px-3 py-2 rounded-lg text-xs font-medium
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

      {/* Liste réservations */}
      {filteredReservations.length === 0 ? (
        <div className="bg-white rounded-xl shadow-sm p-12 text-center">
          <p className="text-4xl mb-4">📅</p>
          <h3 className="font-bold text-gray-700 mb-2">
            Aucune réservation trouvée
          </h3>
          <button
            onClick={() => navigate('/eleve/repetiteurs')}
            className="bg-[#1a2744] text-white font-bold px-6 py-2.5
                       rounded-xl cursor-pointer mt-4"
          >
            Trouver un répétiteur
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          {filteredReservations.map(r => (
            <ReservationCard
              key={r.id}
              reservation={r}
              onDetail={setSelectedReservation}
              onCancel={handleCancel}
              onContact={handleContact}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default StudentReservationsPage;