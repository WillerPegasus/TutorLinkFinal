import { CourseRequest } from '../../types/tutor.types';

interface Props {
  requests: CourseRequest[];
  onAccept: (id: string) => void;
  onRefuse: (id: string) => void;
}

const CourseRequestsTable = ({ requests, onAccept, onRefuse }: Props) => {
  // Filtrer seulement les demandes en attente
  const pending = requests.filter(r => r.status === 'en_attente');

  return (
    <div className="bg-white rounded-xl shadow-sm overflow-hidden">

      {/* En-tête */}
      <div className="px-5 py-4 border-b border-gray-100">
        <h3 className="font-bold text-gray-700">
          📩 Demandes de cours en attente
          {pending.length > 0 && (
            <span className="ml-2 bg-orange-100 text-orange-700
                             text-xs font-bold px-2 py-0.5 rounded-full">
              {pending.length}
            </span>
          )}
        </h3>
      </div>

      {/* Tableau */}
      <table className="w-full text-sm">
        <thead>
          <tr className="bg-gray-50 text-gray-500 text-xs uppercase">
            {['Élève', 'Matière', 'Date souhaitée', 'Durée', 'Message', 'Actions'].map(h => (
              <th key={h} className="text-left px-5 py-3 font-semibold">{h}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {pending.length === 0 ? (
            <tr>
              <td colSpan={6} className="text-center py-8 text-gray-300">
                Aucune demande en attente ✅
              </td>
            </tr>
          ) : pending.map((r, i) => (
            <tr
              key={r.id}
              className={`border-t border-gray-50
                ${i % 2 === 0 ? 'bg-white' : 'bg-gray-50/40'}`}
            >
              {/* Élève */}
              <td className="px-5 py-3 font-medium text-gray-800">
                {r.studentName}
              </td>

              {/* Matière */}
              <td className="px-5 py-3 text-gray-600">{r.subject}</td>

              {/* Date */}
              <td className="px-5 py-3 text-gray-600">{r.requestedDate}</td>

              {/* Durée */}
              <td className="px-5 py-3 text-gray-500">{r.duration}h</td>

              {/* Message */}
              <td className="px-5 py-3 text-gray-400 text-xs italic">
                {r.message}
              </td>

              {/* Actions */}
              <td className="px-5 py-3">
                <div className="flex gap-2">
                  <button
                    onClick={() => onAccept(r.id)}
                    className="bg-[#1a2744] hover:bg-blue-900 text-white
                               text-xs font-bold px-3 py-1.5 rounded-lg
                               cursor-pointer transition-colors"
                  >
                    Accepter
                  </button>
                  <button
                    onClick={() => onRefuse(r.id)}
                    className="bg-red-500 hover:bg-red-600 text-white
                               text-xs font-bold px-3 py-1.5 rounded-lg
                               cursor-pointer transition-colors"
                  >
                    Refuser
                  </button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default CourseRequestsTable;