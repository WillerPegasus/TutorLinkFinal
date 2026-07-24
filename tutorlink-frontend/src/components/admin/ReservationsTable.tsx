import { AdminReservation, CourseStatus } from '../../types/adminReservation.types';

interface Props {
  reservations: AdminReservation[];
  onSelect: (r: AdminReservation) => void;
  onCancel: (id: string) => void;
}

const courseConfig: Record<CourseStatus, { label: string; className: string }> = {
  confirmee: { label: 'Confirmée', className: 'bg-blue-100 text-blue-700' },
  en_cours:  { label: 'En cours',  className: 'bg-green-100 text-green-700' },
  terminee:  { label: 'Terminée',  className: 'bg-gray-100 text-gray-600' },
  annulee:   { label: 'Annulée',   className: 'bg-red-100 text-red-700' },
};

// ❌ SUPPRIMÉ : colonnes Montant, Opérateur, Statut paiement
const ReservationsTable = ({ reservations, onSelect, onCancel }: Props) => (
  <div className="bg-white rounded-xl shadow-sm overflow-hidden">
    <table className="w-full text-sm">
      <thead>
        <tr className="bg-[#1a2744] text-white text-xs uppercase">
          {['Réf.', 'Élève', 'Répétiteur', 'Matière',
            'Date / Heure', 'Statut cours', 'Actions'].map(h => (
            <th key={h} className="text-left px-4 py-3 font-semibold">
              {h}
            </th>
          ))}
        </tr>
      </thead>
      <tbody>
        {reservations.length === 0 ? (
          <tr>
            <td colSpan={7} className="text-center py-10 text-gray-400">
              Aucune réservation trouvée
            </td>
          </tr>
        ) : reservations.map((r, i) => {
          const course = courseConfig[r.courseStatus];
          return (
            <tr key={r.id}
              className={`border-t border-gray-50 hover:bg-blue-50
                transition-colors
                ${i % 2 === 0 ? 'bg-white' : 'bg-gray-50/40'}`}>

              {/* Référence */}
              <td className="px-4 py-3 font-mono text-xs text-gray-400">
                {r.reference}
              </td>

              {/* Élève */}
              <td className="px-4 py-3">
                <p className="font-medium text-gray-800">{r.eleve.name}</p>
                <p className="text-xs text-gray-400">{r.eleve.phone}</p>
              </td>

              {/* Répétiteur */}
              <td className="px-4 py-3">
                <p className="font-medium text-gray-800">
                  {r.repetiteur.name}
                </p>
                <p className="text-xs text-gray-400">
                  📱 {r.repetiteur.phone}
                </p>
              </td>

              {/* Matière */}
              <td className="px-4 py-3 text-gray-600">
                {r.repetiteur.subject}
              </td>

              {/* Date */}
              <td className="px-4 py-3">
                <p className="text-gray-700">{r.date}</p>
                <p className="text-xs text-gray-400">{r.timeSlot}</p>
              </td>

              {/* Statut cours */}
              <td className="px-4 py-3">
                <span className={`${course.className} text-xs
                  font-bold px-2 py-1 rounded-full`}>
                  {course.label}
                </span>
              </td>

              {/* Actions */}
              <td className="px-4 py-3">
                <div className="flex gap-1">
                  <button
                    onClick={() => onSelect(r)}
                    className="bg-blue-500 hover:bg-blue-600 text-white
                               text-xs font-bold px-2 py-1 rounded
                               cursor-pointer"
                  >
                    👁 Détail
                  </button>
                  {r.courseStatus === 'confirmee' && (
                    <button
                      onClick={() => {
                        if (window.confirm('Annuler cette réservation ?')) {
                          onCancel(r.id);
                        }
                      }}
                      className="bg-red-500 hover:bg-red-600 text-white
                                 text-xs font-bold px-2 py-1 rounded
                                 cursor-pointer"
                    >
                      Annuler
                    </button>
                  )}
                </div>
              </td>
            </tr>
          );
        })}
      </tbody>
    </table>
  </div>
);

export default ReservationsTable;