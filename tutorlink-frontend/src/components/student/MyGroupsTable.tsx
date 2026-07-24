import { useNavigate } from 'react-router-dom';
import { StudentGroup } from '../../types/student.types';

interface Props { groups: StudentGroup[]; }

const MyGroupsTable = ({ groups }: Props) => {
  const navigate = useNavigate();

  return (
    <div className="bg-white rounded-xl shadow-sm overflow-hidden">
      <div className="flex justify-between items-center px-5 py-4
                      border-b border-gray-100">
        <h3 className="font-bold text-gray-700">
          👥 Mes groupes de répétition
        </h3>
        <button
          onClick={() => navigate('/groupes')}
          className="bg-[#1a2744] hover:bg-blue-900 text-white
                     text-xs font-bold px-3 py-1.5 rounded-lg
                     cursor-pointer transition-colors"
        >
          + Rejoindre un groupe
        </button>
      </div>

      <table className="w-full text-sm">
        <thead>
          <tr className="bg-gray-50 text-gray-500 text-xs uppercase">
            <th className="text-left px-5 py-3 font-semibold">Groupe</th>
            <th className="text-left px-5 py-3 font-semibold">Matière</th>
            <th className="text-left px-5 py-3 font-semibold">Admin</th>
            <th className="text-left px-5 py-3 font-semibold">Prochaine séance</th>
            {/* ✅ Cotisation groupe — passe par la plateforme */}
            <th className="text-left px-5 py-3 font-semibold">Cotisation</th>
            <th className="text-left px-5 py-3 font-semibold">Statut</th>
          </tr>
        </thead>
        <tbody>
          {groups.map((g, i) => (
            <tr key={g.id}
              className={`border-t border-gray-50
                ${i % 2 === 0 ? 'bg-white' : 'bg-gray-50/40'}`}>
              <td className="px-5 py-3 font-medium text-gray-800">
                {g.name}
              </td>
              <td className="px-5 py-3 text-gray-600">{g.subject}</td>
              <td className="px-5 py-3 text-gray-600">{g.tutorName}</td>
              <td className="px-5 py-3 text-gray-500 text-xs">
                {g.nextSession}
              </td>
              <td className="px-5 py-3">
                <div className="flex items-center gap-1">
                  <span className="text-xs font-medium text-gray-600">
                    {(g.monthlyPrice ?? 0).toLocaleString()} F/mois
                  </span>
                  <span className={`text-xs font-bold px-2 py-0.5 rounded-full
                    ${g.paymentStatus === 'a_jour'
                      ? 'bg-green-100 text-green-700'
                      : 'bg-red-100 text-red-700'}`}>
                    {g.paymentStatus === 'a_jour' ? 'À JOUR' : 'EN RETARD'}
                  </span>
                </div>
              </td>
              <td className="px-5 py-3">
                <span className={`text-xs font-bold px-2 py-1 rounded-full
                  ${g.status === 'actif'
                    ? 'bg-blue-100 text-blue-700'
                    : 'bg-red-100 text-red-700'}`}>
                  {g.status === 'actif' ? 'ACTIF' : 'SUSPENDU'}
                </span>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default MyGroupsTable;