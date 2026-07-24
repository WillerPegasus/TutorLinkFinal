import { QuartierStats } from '../../types/adminReports.types';

interface Props { data: QuartierStats[]; }

const QuartierStatsTable = ({ data }: Props) => (
  <div className="bg-white rounded-xl shadow-sm overflow-hidden">
    <div className="px-5 py-4 border-b border-gray-100">
      <h3 className="font-bold text-gray-700">📍 Activité par quartier</h3>
    </div>
    <table className="w-full text-sm">
      <thead>
        <tr className="bg-gray-50 text-gray-500 text-xs uppercase">
          <th className="text-left px-5 py-3">Quartier</th>
          <th className="text-left px-5 py-3">Réservations</th>
          <th className="text-left px-5 py-3">Revenus</th>
          <th className="text-left px-5 py-3">Part</th>
        </tr>
      </thead>
      <tbody>
        {data.map((q, i) => (
          <tr
            key={q.quartier}
            className={`border-t border-gray-50
              ${i % 2 === 0 ? 'bg-white' : 'bg-gray-50/50'}`}
          >
            <td className="px-5 py-3 font-medium text-gray-800">
              📍 {q.quartier}
            </td>
            <td className="px-5 py-3 text-gray-600">
              {q.reservations.toLocaleString()}
            </td>
            <td className="px-5 py-3 font-bold text-blue-800">
              {q.revenus.toLocaleString()} F
            </td>
            <td className="px-5 py-3">
              <div className="flex items-center gap-2">
                <div className="flex-1 bg-gray-100 rounded-full h-2">
                  <div
                    className="bg-yellow-500 h-2 rounded-full"
                    style={{ width: `${q.pct}%` }}
                  />
                </div>
                <span className="text-xs text-gray-500 w-8">{q.pct}%</span>
              </div>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  </div>
);

export default QuartierStatsTable;