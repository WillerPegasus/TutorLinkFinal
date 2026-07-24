import { SubjectPerformance } from '../../types/adminReports.types';

interface Props { data: SubjectPerformance[]; }

// Étoiles selon la note
const Stars = ({ rating }: { rating: number }) => (
  <span className="text-yellow-400 text-xs">
    {'★'.repeat(Math.floor(rating))}
    <span className="text-gray-300">
      {'★'.repeat(5 - Math.floor(rating))}
    </span>
    <span className="text-gray-500 ml-1">{rating}</span>
  </span>
);

const SubjectPerformanceTable = ({ data }: Props) => (
  <div className="bg-white rounded-xl shadow-sm overflow-hidden">
    <div className="px-5 py-4 border-b border-gray-100">
      <h3 className="font-bold text-gray-700">📚 Performance par matière</h3>
    </div>
    <table className="w-full text-sm">
      <thead>
        <tr className="bg-gray-50 text-gray-500 text-xs uppercase">
          <th className="text-left px-5 py-3">Matière</th>
          <th className="text-left px-5 py-3">Réservations</th>
          <th className="text-left px-5 py-3">Revenus</th>
          <th className="text-left px-5 py-3">Satisfaction</th>
          <th className="text-left px-5 py-3">Part</th>
        </tr>
      </thead>
      <tbody>
        {data.map((s, i) => (
          <tr
            key={s.subject}
            className={`border-t border-gray-50
              ${i % 2 === 0 ? 'bg-white' : 'bg-gray-50/50'}`}
          >
            <td className="px-5 py-3 font-medium text-gray-800">
              {s.subject}
            </td>
            <td className="px-5 py-3 text-gray-600">
              {s.reservations.toLocaleString()}
            </td>
            <td className="px-5 py-3 font-bold text-blue-800">
              {s.revenus.toLocaleString()} F
            </td>
            <td className="px-5 py-3">
              <Stars rating={s.satisfaction} />
            </td>
            <td className="px-5 py-3">
              {/* Barre de progression */}
              <div className="flex items-center gap-2">
                <div className="flex-1 bg-gray-100 rounded-full h-2">
                  <div
                    className="bg-blue-700 h-2 rounded-full"
                    style={{ width: `${s.pct}%` }}
                  />
                </div>
                <span className="text-xs text-gray-500 w-8">{s.pct}%</span>
              </div>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  </div>
);

export default SubjectPerformanceTable;