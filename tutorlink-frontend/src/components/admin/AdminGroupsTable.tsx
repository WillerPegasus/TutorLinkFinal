import { AdminGroup } from '../../types/adminGroup.types';
import AdminGroupStatusBadge from './AdminGroupStatusBadge';

interface Props {
  groups: AdminGroup[];
  onVerify: (id: string) => void;
  onSuspend: (id: string) => void;
  onDelete: (id: string) => void;
  onDetail: (g: AdminGroup) => void;
}

const AdminGroupsTable = ({ groups, onVerify, onSuspend, onDelete, onDetail }: Props) => (
  
  <div className="bg-white rounded-xl shadow-sm overflow-hidden">
    <table className="w-full text-sm dark:bg-gray-800">
      <thead>
        <tr className="bg-[#1a2744] dark:bg-gray-700 text-white text-xs uppercase">
          {['Nom du groupe', 'Matière / Niveau', 'Répétiteur',
            'Places', 'Prix/mois', 'Revenus', 'Statut', 'Actions'].map((h, i)=> (
            <th key={h} className="text-left px-4 py-3 font-semibold ">{h}</th>
            
          ))}
        </tr>
      </thead>
      <tbody>
        {groups.length === 0 ? (
          <tr>
            <td colSpan={8} className="text-center py-10 text-gray-400">
              Aucun groupe trouvé
            </td>
          </tr>
        ) : groups.map((g, i) => {
          const placePct = (g.currentMembers / g.maxMembers) * 100;
          return (
            <tr
              key={g.id}
              className={`border-t border-gray-50 hover:bg-blue-50
                transition-colors
                ${i % 2 === 0 ? 'bg-white' : 'bg-gray-50/40'}`}
            >
              {/* Nom */}
              <td className="px-4 py-3">
                <div className="font-medium text-gray-800">{g.name}</div>
                <div className="text-xs text-gray-400">📍 {g.quartier}</div>
                {g.isVerified && (
                  <span className="text-xs text-blue-600 font-bold">✓ Vérifié</span>
                )}
              </td>

              {/* Matière / Niveau */}
              <td className="px-4 py-3">
                <div className="text-gray-700">{g.subject}</div>
                <div className="text-xs text-gray-400">{g.level}</div>
              </td>

              {/* Répétiteur */}
              <td className="px-4 py-3 text-gray-600">{g.tutorName}</td>

              {/* Places */}
              <td className="px-4 py-3">
                <div className="text-xs text-gray-600 mb-1">
                  {g.currentMembers}/{g.maxMembers}
                </div>
                <div className="bg-gray-100 rounded-full h-1.5 w-16">
                  <div
                    className={`h-1.5 rounded-full
                      ${g.status === 'complet' ? 'bg-red-500' : 'bg-blue-600'}`}
                    style={{ width: `${placePct}%` }}
                  />
                </div>
              </td>

              {/* Prix */}
              <td className="px-4 py-3 font-bold text-blue-900">
                {g.monthlyPrice.toLocaleString()} F
              </td>

              {/* Revenus totaux */}
              <td className="px-4 py-3 font-bold text-green-700">
                {g.totalRevenue.toLocaleString()} F
              </td>

              {/* Statut */}
              <td className="px-4 py-3">
                <AdminGroupStatusBadge status={g.status} />
              </td>

              {/* Actions */}
              <td className="px-4 py-3">
                <div className="flex gap-1 flex-wrap">
                  {/* Détail */}
                  <button
                    onClick={() => onDetail(g)}
                    className="bg-blue-500 hover:bg-blue-600 text-white
                               text-xs font-bold px-2 py-1 rounded cursor-pointer"
                  >
                    👁 Détail
                  </button>

                  {/* Vérifier — si pas encore vérifié */}
                  {!g.isVerified && (
                    <button
                      onClick={() => onVerify(g.id)}
                      className="bg-green-600 hover:bg-green-700 text-white
                                 text-xs font-bold px-2 py-1 rounded cursor-pointer"
                    >
                      ✅ Vérifier
                    </button>
                  )}

                  {/* Suspendre — si actif ou complet */}
                  {(g.status === 'actif' || g.status === 'complet') && (
                    <button
                      onClick={() => onSuspend(g.id)}
                      className="bg-orange-500 hover:bg-orange-600 text-white
                                 text-xs font-bold px-2 py-1 rounded cursor-pointer"
                    >
                      ⏸ Suspendre
                    </button>
                  )}

                  {/* Supprimer */}
                  <button
                    onClick={() => {
                      if (window.confirm(`Supprimer "${g.name}" ?`)) onDelete(g.id);
                    }}
                    className="bg-red-600 hover:bg-red-700 text-white
                               text-xs font-bold px-2 py-1 rounded cursor-pointer"
                  >
                    🗑
                  </button>
                </div>
              </td>
            </tr>
          );
        })}
      </tbody>
    </table>
  </div>
);

export default AdminGroupsTable;