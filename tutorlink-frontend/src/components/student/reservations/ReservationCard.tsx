import { StudentReservation } from '../../../types/studentReservation.types';
import ReservationStatusBadge from './ReservationStatusBadge';

interface Props {
  reservation: StudentReservation;
  onDetail: (r: StudentReservation) => void;
  onCancel: (id: string) => void;
  onContact: (tutorName: string) => void;
}

const ReservationCard = ({
  reservation: r, onDetail, onCancel, onContact
}: Props) => (
  <div className={`bg-white rounded-xl shadow-sm border-l-4 p-5
                   hover:shadow-md transition-shadow
                   ${r.status === 'confirme' ? 'border-l-blue-500'
                     : r.status === 'en_attente' ? 'border-l-orange-400'
                     : r.status === 'termine' ? 'border-l-gray-300'
                     : 'border-l-red-400'}`}>

    <div className="flex justify-between items-start mb-3">
      <div>
        <p className="text-xs text-gray-400 font-mono">{r.reference}</p>
        <h3 className="font-bold text-gray-800 mt-0.5">{r.tutorName}</h3>
        <p className="text-xs text-blue-600">{r.tutorSubject}</p>
      </div>
      <ReservationStatusBadge status={r.status} />
    </div>

    <div className="grid grid-cols-2 gap-3 mb-3">
      <div className="bg-gray-50 rounded-lg p-3">
        <p className="text-xs text-gray-400 mb-1">📅 Date</p>
        <p className="text-sm font-medium text-gray-700">{r.date}</p>
        <p className="text-xs text-gray-500">{r.time}</p>
      </div>
      <div className="bg-gray-50 rounded-lg p-3">
        <p className="text-xs text-gray-400 mb-1">📍 Lieu · Durée</p>
        <p className="text-sm font-medium text-gray-700">{r.quartier}</p>
        <p className="text-xs text-gray-500">{r.duration}h de cours</p>
      </div>
    </div>

    <div className="bg-yellow-50 border border-yellow-200
                    rounded-lg p-3 mb-3">
      <div className="flex justify-between items-center">
        <div>
          <p className="text-xs text-yellow-700 font-bold">
            💰 Paiement direct au répétiteur
          </p>
          <p className="text-xs text-yellow-600 mt-0.5">
            Coordonnées échangées via la messagerie
          </p>
        </div>
        <p className="font-bold text-yellow-800">
          ~{r.estimatedAmount.toLocaleString()} F
        </p>
      </div>
    </div>

    <div className="flex gap-2">
      <button
        onClick={() => onDetail(r)}
        className="border border-gray-200 text-gray-600
                   text-xs px-3 py-1.5 rounded-lg
                   hover:bg-gray-50 cursor-pointer transition-colors"
      >
        👁 Détail
      </button>
      {(r.status === 'confirme' || r.status === 'en_attente') && (
        <button
          onClick={() => onContact(r.tutorName)}
          className="flex-1 bg-[#1a2744] hover:bg-blue-900
                     text-white font-bold text-xs py-1.5 rounded-lg
                     cursor-pointer transition-colors"
        >
          💬 Contacter {r.tutorName.split(' ').pop()}
        </button>
      )}
      {r.status === 'en_attente' && (
        <button
          onClick={() => {
            if (window.confirm('Annuler cette demande ?')) onCancel(r.id);
          }}
          className="border border-red-200 text-red-500
                     text-xs px-3 py-1.5 rounded-lg
                     hover:bg-red-50 cursor-pointer transition-colors"
        >
          Annuler
        </button>
      )}
      {r.status === 'termine' && (
        <button
          className="flex-1 bg-yellow-400 hover:bg-yellow-500
                     text-gray-900 font-bold text-xs py-1.5 rounded-lg
                     cursor-pointer transition-colors"
        >
          ⭐ Laisser un avis
        </button>
      )}
    </div>
  </div>
);

export default ReservationCard;
