import { AdminGroup } from '../../types/adminGroup.types';
import AdminGroupStatusBadge from './AdminGroupStatusBadge';

interface Props {
  group: AdminGroup;
  onClose: () => void;
  onSuspend: (id: string) => void;
  onDelete: (id: string) => void;
}

const AdminGroupDetailModal = ({ group: g, onClose, onSuspend, onDelete }: Props) => (
  <div
    onClick={onClose}
    className="fixed inset-0 bg-black/50 z-50
               flex items-center justify-center p-4"
  >
    <div
      onClick={e => e.stopPropagation()}
      className="bg-white rounded-xl w-full max-w-lg
                 shadow-2xl overflow-hidden"
    >
      {/* En-tête modal */}
      <div className="bg-[#1a2744] text-white px-6 py-4
                      flex justify-between items-start">
        <div>
          <h3 className="font-bold text-lg">{g.name}</h3>
          <p className="text-blue-300 text-sm">{g.subject} · {g.level}</p>
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
      <div className="p-6 flex flex-col gap-4">

        {/* Infos principales */}
        <div className="bg-gray-50 rounded-lg p-4 flex flex-col gap-2">
          {[
            ['Répétiteur admin', g.tutorName],
            ['Quartier', g.quartier],
            ['Séances / semaine', `${g.sessionsPerWeek} séance(s)`],
            ['Créé le', g.createdAt],
          ].map(([label, value]) => (
            <div key={label} className="flex justify-between py-1
                                        border-b border-gray-100 last:border-0">
              <span className="text-xs text-gray-500">{label}</span>
              <span className="text-sm font-medium text-gray-800">{value}</span>
            </div>
          ))}
        </div>

        {/* Places + revenus */}
        <div className="grid grid-cols-3 gap-3">
          <div className="bg-blue-50 rounded-lg p-3 text-center">
            <p className="text-2xl font-bold text-blue-800">
              {g.currentMembers}/{g.maxMembers}
            </p>
            <p className="text-xs text-blue-500 mt-1">Places</p>
          </div>
          <div className="bg-green-50 rounded-lg p-3 text-center">
            <p className="text-lg font-bold text-green-800">
              {g.monthlyPrice.toLocaleString()} F
            </p>
            <p className="text-xs text-green-500 mt-1">/ mois</p>
          </div>
          <div className="bg-yellow-50 rounded-lg p-3 text-center">
            <p className="text-lg font-bold text-yellow-800">
              {g.totalRevenue.toLocaleString()} F
            </p>
            <p className="text-xs text-yellow-500 mt-1">Total revenus</p>
          </div>
        </div>

        {/* Statut + vérification */}
        <div className="flex justify-between items-center">
          <span className="text-xs text-gray-500">Statut</span>
          <AdminGroupStatusBadge status={g.status} />
        </div>
        <div className="flex justify-between items-center">
          <span className="text-xs text-gray-500">Vérification</span>
          <span className={`text-xs font-bold px-2 py-1 rounded-full
            ${g.isVerified
              ? 'bg-green-100 text-green-700'
              : 'bg-orange-100 text-orange-700'}`}>
            {g.isVerified ? '✓ Groupe vérifié' : '⏳ En attente vérification'}
          </span>
        </div>

        {/* Boutons actions */}
        <div className="flex gap-3 mt-2">
          {(g.status === 'actif' || g.status === 'complet') && (
            <button
              onClick={() => {
                if (window.confirm(`Suspendre "${g.name}" ?`)) onSuspend(g.id);
              }}
              className="flex-1 bg-orange-500 hover:bg-orange-600
                         text-white font-bold py-2 rounded-lg
                         cursor-pointer transition-colors"
            >
              ⏸ Suspendre
            </button>
          )}
          <button
            onClick={() => {
              if (window.confirm(`Supprimer définitivement "${g.name}" ?`)) {
                onDelete(g.id);
              }
            }}
            className="flex-1 bg-red-600 hover:bg-red-700
                       text-white font-bold py-2 rounded-lg
                       cursor-pointer transition-colors"
          >
            🗑 Supprimer
          </button>
        </div>
      </div>
    </div>
  </div>
);

export default AdminGroupDetailModal;