import { useNavigate } from 'react-router-dom';
import { TutorGroup } from '../../types/tutor.types';

interface Props {
  groups: TutorGroup[];
  groupRevenue: number;
  totalStudents: number;
}

const TutorGroupsTable = ({ groups, groupRevenue, totalStudents }: Props) => {
  const navigate = useNavigate();

  return (
    <div className="bg-white rounded-xl shadow-sm overflow-hidden">

      {/* En-tête */}
      <div className="flex justify-between items-center px-5 py-4 border-b border-gray-100">
        <h3 className="font-bold text-gray-700">👥 Mes groupes de répétition</h3>
        <button
          onClick={() => navigate('/groupes/creer')}
          className="bg-[#1a2744] hover:bg-blue-900 text-white
                     text-xs font-bold px-3 py-1.5 rounded-lg
                     cursor-pointer transition-colors"
        >
          + Créer un groupe
        </button>
      </div>

      {/* Tableau */}
      <table className="w-full text-sm">
        <thead>
          <tr className="bg-gray-50 text-gray-500 text-xs uppercase">
            {['Groupe', 'Matière', 'Inscrits', 'Horaires',
              'Prix/mois', 'Revenus/mois', 'Actions'].map(h => (
              <th key={h} className="text-left px-5 py-3 font-semibold">{h}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {groups.map((g, i) => (
            <tr
              key={g.id}
              className={`border-t border-gray-50
                ${i % 2 === 0 ? 'bg-white' : 'bg-gray-50/40'}`}
            >
              <td className="px-5 py-3 font-medium text-gray-800">{g.name}</td>
              <td className="px-5 py-3 text-gray-600">{g.subject}</td>
              <td className="px-5 py-3 text-gray-600">
                {g.currentMembers}/{g.maxMembers}
              </td>
              <td className="px-5 py-3 text-gray-500 text-xs">{g.schedule}</td>
              <td className="px-5 py-3 font-medium text-gray-700">
                {g.monthlyPrice.toLocaleString()} F
              </td>
              <td className="px-5 py-3 font-bold text-green-700">
                {g.monthlyRevenue.toLocaleString()} F
              </td>
              <td className="px-5 py-3">
                <div className="flex gap-1">
                  <button className="border border-gray-200 text-gray-600
                                     text-xs px-2 py-1 rounded cursor-pointer
                                     hover:bg-gray-50">
                    Modifier
                  </button>
                  <button className="border border-blue-200 text-blue-600
                                     text-xs px-2 py-1 rounded cursor-pointer
                                     hover:bg-blue-50">
                    Inscrits
                  </button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* Résumé revenus groupes */}
      <div className="px-5 py-3 bg-gray-50 border-t border-gray-100
                      text-xs text-gray-500">
        Revenus groupes ce mois :
        <span className="font-bold text-green-700 ml-1">
          {groupRevenue.toLocaleString()} FCFA
        </span>
        <span className="mx-2">·</span>
        Total élèves en groupes :
        <span className="font-bold text-gray-700 ml-1">{totalStudents}</span>
      </div>
    </div>
  );
};

export default TutorGroupsTable;