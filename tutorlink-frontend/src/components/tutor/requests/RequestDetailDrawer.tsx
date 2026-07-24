import { CourseRequestDetail } from '../../../types/courseRequest.types';
import RequestStatusBadge from './RequestStatusBadge';

interface Props {
  request: CourseRequestDetail;
  onClose: () => void;
  onAccept: (id: string) => void;
  onRefuse: (id: string) => void;
}

// Panneau latéral détail complet de la demande
const RequestDetailDrawer = ({
  request: r, onClose, onAccept, onRefuse
}: Props) => (

  <div
    onClick={onClose}
    className="fixed inset-0 bg-black/50 z-50 flex justify-end"
  >
    <div
      onClick={e => e.stopPropagation()}
      className="bg-white w-full max-w-md h-full
                 overflow-y-auto shadow-2xl flex flex-col"
    >
      {/* En-tête drawer */}
      <div className="bg-[#1a2744] text-white px-6 py-4
                      flex justify-between items-start">
        <div>
          <h3 className="font-bold text-lg">Détail de la demande</h3>
          <p className="text-blue-300 text-sm">{r.reference}</p>
        </div>
        <button
          onClick={onClose}
          className="text-white hover:text-yellow-400
                     text-xl cursor-pointer bg-transparent border-none"
        >
          ✖
        </button>
      </div>

      {/* Corps */}
      <div className="flex-1 p-6 flex flex-col gap-5">

        {/* Statut */}
        <div className="flex justify-between items-center">
          <span className="text-xs text-gray-500">Statut</span>
          <RequestStatusBadge status={r.status} />
        </div>

        {/* Infos élève */}
        <section>
          <h4 className="text-xs font-bold text-gray-400 uppercase mb-2">
            👤 Élève
          </h4>
          <div className="bg-gray-50 rounded-lg p-4 flex flex-col gap-2">
            {[
              ['Nom', r.student.name],
              ['Email', r.student.email],
              ['Téléphone', r.student.phone],
              ['Niveau', r.student.level],
              ['Quartier', r.student.quartier],
            ].map(([label, value]) => (
              <div key={label}
                className="flex justify-between py-1
                           border-b border-gray-100 last:border-0">
                <span className="text-xs text-gray-500">{label}</span>
                <span className="text-sm font-medium text-gray-800">
                  {value}
                </span>
              </div>
            ))}
          </div>
        </section>

        {/* Détails cours */}
        <section>
          <h4 className="text-xs font-bold text-gray-400 uppercase mb-2">
            📚 Cours demandé
          </h4>
          <div className="bg-gray-50 rounded-lg p-4 flex flex-col gap-2">
            {[
              ['Matière', r.subject],
              ['Date', r.requestedDate],
              ['Heure', r.requestedTime],
              ['Durée', `${r.duration}h`],
            ].map(([label, value]) => (
              <div key={label}
                className="flex justify-between py-1
                           border-b border-gray-100 last:border-0">
                <span className="text-xs text-gray-500">{label}</span>
                <span className="text-sm font-medium text-gray-800">
                  {value}
                </span>
              </div>
            ))}
          </div>
        </section>

        {/* Message élève */}
        <section>
          <h4 className="text-xs font-bold text-gray-400 uppercase mb-2">
            💬 Message
          </h4>
          <div className="bg-blue-50 rounded-lg p-4">
            <p className="text-sm text-gray-600 italic">"{r.message}"</p>
          </div>
        </section>

        {/* Paiement */}
        <section>
          <h4 className="text-xs font-bold text-gray-400 uppercase mb-2">
            💰 Paiement
          </h4>
          <div className="bg-gray-50 rounded-lg p-4 flex flex-col gap-2">
            <div className="flex justify-between">
              <span className="text-xs text-gray-500">Opérateur</span>
              <span className="text-sm font-medium">
                {r.paymentMethod === 'MTN'
                  ? '📱 MTN Mobile Money'
                  : '🟠 Orange Money'}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-xs text-gray-500">Montant</span>
              <span className="text-base font-bold text-blue-900">
                {(r?.estimatedAmount ?? 0).toLocaleString()} FCFA
              </span>
            </div>
          </div>
        </section>

        {/* Boutons action si en attente */}
        {r.status === 'en_attente' && (
          <div className="flex gap-3 mt-auto">
            <button
              onClick={() => onAccept(r.id)}
              className="flex-1 bg-[#1a2744] hover:bg-blue-900
                         text-white font-bold py-3 rounded-xl
                         cursor-pointer transition-colors"
            >
              ✅ Accepter
            </button>
            <button
              onClick={() => onRefuse(r.id)}
              className="flex-1 bg-red-500 hover:bg-red-600
                         text-white font-bold py-3 rounded-xl
                         cursor-pointer transition-colors"
            >
              ❌ Refuser
            </button>
          </div>
        )}
      </div>
    </div>
  </div>
);

export default RequestDetailDrawer;