import { AdminReservation } from '../../types/adminReservation.types';

interface Props {
  reservation: AdminReservation;
  onClose: () => void;
  onCancel: (id: string) => void;
}

const InfoRow = ({ label, value }: { label: string; value: string }) => (
  <div className="flex justify-between items-center py-1
                  border-b border-gray-100 last:border-0">
    <span className="text-xs text-gray-500">{label}</span>
    <span className="text-sm font-medium text-gray-800">{value}</span>
  </div>
);

// ❌ SUPPRIMÉ : section "Paiement Mobile Money"
// ✅ AJOUTÉ : info contact répétiteur pour paiement direct
const ReservationDetailsDrawer = ({
  reservation: r, onClose, onCancel
}: Props) => (
  <div onClick={onClose}
    className="fixed inset-0 bg-black/50 z-50 flex justify-end">
    <div onClick={e => e.stopPropagation()}
      className="bg-white w-full max-w-md h-full
                 overflow-y-auto shadow-2xl flex flex-col">

      {/* En-tête */}
      <div className="bg-[#1a2744] text-white px-6 py-4
                      flex justify-between items-start">
        <div>
          <h3 className="font-bold text-lg">Détail réservation</h3>
          <p className="text-blue-300 text-sm">{r.reference}</p>
        </div>
        <button onClick={onClose}
          className="text-white hover:text-yellow-400 text-xl
                     cursor-pointer bg-transparent border-none">
          ✖
        </button>
      </div>

      {/* Corps */}
      <div className="flex-1 p-6 flex flex-col gap-5">

        {/* Élève */}
        <section>
          <h4 className="text-xs font-bold text-gray-400 uppercase mb-2">
            👤 Élève
          </h4>
          <div className="bg-gray-50 rounded-lg p-4">
            <InfoRow label="Nom" value={r.eleve.name} />
            <InfoRow label="Email" value={r.eleve.email} />
            <InfoRow label="Téléphone" value={r.eleve.phone} />
          </div>
        </section>

        {/* Répétiteur */}
        <section>
          <h4 className="text-xs font-bold text-gray-400 uppercase mb-2">
            🎓 Répétiteur
          </h4>
          <div className="bg-gray-50 rounded-lg p-4">
            <InfoRow label="Nom" value={r.repetiteur.name} />
            <InfoRow label="Email" value={r.repetiteur.email} />
            <InfoRow label="Matière" value={r.repetiteur.subject} />
            <InfoRow label="Téléphone" value={r.repetiteur.phone} />
          </div>
        </section>

        {/* Cours */}
        <section>
          <h4 className="text-xs font-bold text-gray-400 uppercase mb-2">
            📅 Cours
          </h4>
          <div className="bg-gray-50 rounded-lg p-4">
            <InfoRow label="Date" value={r.date} />
            <InfoRow label="Horaire" value={r.timeSlot} />
            <InfoRow label="Durée" value={`${r.duration}h`} />
            <InfoRow label="Quartier" value={r.quartier} />
          </div>
        </section>

        {/* ✅ INFO PAIEMENT DIRECT (remplace section paiement MoMo) */}
        <section>
          <h4 className="text-xs font-bold text-gray-400 uppercase mb-2">
            💰 Paiement
          </h4>
          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
            <p className="text-sm font-bold text-yellow-800 mb-2">
              Paiement direct hors plateforme
            </p>
            <p className="text-xs text-yellow-700 leading-relaxed">
              L'élève paie directement le répétiteur via MTN MoMo
              ou Orange Money. TutorLink ne gère pas ce flux financier
              pour les cours individuels.
            </p>
            <div className="mt-3 flex justify-between items-center">
              <span className="text-xs text-yellow-600">Montant estimatif</span>
              <span className="font-bold text-yellow-800">
                ~{r.estimatedAmount.toLocaleString()} FCFA
              </span>
            </div>
          </div>
        </section>

        {/* Annuler si confirmée */}
        {r.courseStatus === 'confirmee' && (
          <button
            onClick={() => {
              if (window.confirm('Annuler cette réservation ?')) {
                onCancel(r.id);
              }
            }}
            className="w-full bg-red-600 hover:bg-red-700 text-white
                       font-bold py-3 rounded-xl cursor-pointer
                       transition-colors mt-auto"
          >
            🚫 Annuler la réservation
          </button>
        )}
      </div>
    </div>
  </div>
);

export default ReservationDetailsDrawer;