import { CourseRequestDetail } from '../../../types/courseRequest.types';
import RequestStatusBadge from './RequestStatusBadge';

interface Props {
  request: CourseRequestDetail;
  onAccept: (id: string) => void;
  onRefuse: (id: string) => void;
  onDetail: (r: CourseRequestDetail) => void;
}

// Carte demande — ❌ SUPPRIMÉ : opérateur paiement (MTN/Orange)
// ✅ GARDÉ : montant estimatif pour information seulement
const RequestCard = ({ request: r, onAccept, onRefuse, onDetail }: Props) => (
  <div className={`bg-white rounded-xl shadow-sm border-l-4 p-5
                   hover:shadow-md transition-shadow
                   ${r.status === 'en_attente' ? 'border-l-orange-400'
                     : r.status === 'accepte' ? 'border-l-green-500'
                     : 'border-l-red-400'}`}>

    {/* En-tête */}
    <div className="flex justify-between items-start mb-3">
      <div>
        <p className="text-xs text-gray-400 font-mono mb-1">
          {r.reference}
        </p>
        <h3 className="font-bold text-gray-800">{r.student.name}</h3>
        <p className="text-xs text-gray-500">
          {r.student.level} · 📍 {r.student.quartier}
        </p>
      </div>
      <div className="flex flex-col items-end gap-1">
        <RequestStatusBadge status={r.status} />
        <p className="text-xs text-gray-400">{r.createdAt}</p>
      </div>
    </div>

    {/* Détails cours */}
    <div className="grid grid-cols-2 gap-3 mb-3">
      <div className="bg-gray-50 rounded-lg p-3">
        <p className="text-xs text-gray-400 mb-1">📅 Date souhaitée</p>
        <p className="text-sm font-medium text-gray-700">
          {r.requestedDate}
        </p>
        <p className="text-xs text-gray-500">{r.requestedTime}</p>
      </div>
      <div className="bg-gray-50 rounded-lg p-3">
        <p className="text-xs text-gray-400 mb-1">📚 Matière · Durée</p>
        <p className="text-sm font-medium text-gray-700">{r.subject}</p>
        <p className="text-xs text-gray-500">{r.duration}h de cours</p>
      </div>
    </div>

    {/* Message */}
    <div className="bg-blue-50 rounded-lg p-3 mb-3">
      <p className="text-xs text-blue-500 font-semibold mb-1">
        💬 Message de l'élève
      </p>
      <p className="text-sm text-gray-600 italic">"{r.message}"</p>
    </div>

    {/* ✅ MONTANT ESTIMATIF + INFO PAIEMENT DIRECT */}
    <div className="bg-yellow-50 border border-yellow-200
                    rounded-lg p-3 mb-4">
      <div className="flex justify-between items-center">
        <div>
          <p className="text-xs text-yellow-700 font-semibold">
            💰 Montant estimatif
          </p>
          <p className="text-xs text-yellow-600 mt-0.5">
            Paiement direct par l'élève (MTN/Orange)
          </p>
        </div>
        <p className="font-bold text-yellow-800 text-lg">
          {r.estimatedAmount.toLocaleString()} FCFA
        </p>
      </div>
      <p className="text-xs text-yellow-600 mt-2">
        📱 Contact élève : <strong>{r.student.phone}</strong>
      </p>
    </div>

    {/* Boutons */}
    <div className="flex gap-3">
      <button
        onClick={() => onDetail(r)}
        className="border border-gray-200 text-gray-600 text-sm
                   px-4 py-2 rounded-lg hover:bg-gray-50
                   cursor-pointer transition-colors"
      >
        👁 Détail
      </button>
      {r.status === 'en_attente' && (
        <>
          <button
            onClick={() => onAccept(r.id)}
            className="flex-1 bg-[#1a2744] hover:bg-blue-900
                       text-white font-bold py-2 rounded-lg
                       cursor-pointer transition-colors"
          >
            ✅ Accepter
          </button>
          <button
            onClick={() => onRefuse(r.id)}
            className="flex-1 bg-red-500 hover:bg-red-600
                       text-white font-bold py-2 rounded-lg
                       cursor-pointer transition-colors"
          >
            ❌ Refuser
          </button>
        </>
      )}
    </div>
  </div>
);

export default RequestCard;