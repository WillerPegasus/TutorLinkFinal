import { useNavigate } from 'react-router-dom';
import { Group } from '../../types/group.types';

interface Props { group: Group; }

const GroupCard = ({ group }: Props) => {
  const navigate = useNavigate();
  const isComplet = group.status === 'complet';
  const placePct = (group.currentMembers / group.maxMembers) * 100;

  return (
    <div className="bg-white rounded-xl shadow-sm overflow-hidden border border-gray-100 hover:shadow-md transition-shadow">

      {/* En-tête colorée */}
      <div className="bg-[#1a2744] p-4 flex items-center gap-3">
        <div className="w-12 h-12 rounded-full bg-yellow-400 flex items-center justify-center text-2xl flex-shrink-0">
          👥
        </div>
        <div>
          <h3 className="text-white font-bold text-sm leading-tight">{group.name}</h3>
          <p className="text-blue-200 text-xs">{group.subject} · {group.level}</p>
        </div>
      </div>

      {/* Corps */}
      <div className="p-4 flex flex-col gap-3">

        {/* Quartier + note */}
        <div className="flex justify-between items-center">
          <span className="text-xs text-gray-500">📍 {group.quartier}</span>
          <span className="text-xs font-bold text-yellow-500">
            ★ {group.rating} ({group.reviewCount})
          </span>
        </div>

        {/* Description */}
        <p className="text-xs text-gray-600 line-clamp-2">{group.description}</p>

        {/* Admin groupe */}
        <p className="text-xs text-gray-500">
          Admin : <span className="font-medium text-gray-700">{group.tutor.name}</span>
        </p>

        {/* Places */}
        <div>
          <div className="flex justify-between text-xs mb-1">
            <span className="text-gray-500">
              👥 {group.currentMembers}/{group.maxMembers} places
            </span>
            <span className="font-medium text-gray-600">
              {group.sessions.map(s => `${s.day}`).join(' & ')} · {group.sessions[0]?.startTime}-{group.sessions[0]?.endTime}
            </span>
          </div>
          {/* Barre de remplissage */}
          <div className="bg-gray-100 rounded-full h-1.5">
            <div
              className={`h-1.5 rounded-full ${isComplet ? 'bg-red-500' : 'bg-blue-600'}`}
              style={{ width: `${placePct}%` }}
            />
          </div>
        </div>

        {/* Prix */}
        <p className="font-bold text-gray-900 text-base">
          {group.monthlyPrice.toLocaleString()} FCFA
          <span className="text-xs text-gray-400 font-normal"> / mois</span>
        </p>

        {/* Boutons */}
        <div className="flex gap-2">
          <button
            onClick={() => navigate(`/groupes/${group.id}`)}
            className="flex-1 border border-gray-300 text-gray-700 text-sm py-2 rounded-lg hover:bg-gray-50 transition-colors cursor-pointer"
          >
            Voir détails
          </button>
          {isComplet ? (
            <button className="flex-1 border border-gray-300 text-gray-400 text-sm py-2 rounded-lg cursor-pointer hover:bg-gray-50">
              Liste d'attente
            </button>
          ) : (
            <button
              onClick={() => navigate(`/groupes/${group.id}`)}
              className="flex-1 bg-[#1a2744] text-white text-sm py-2 rounded-lg hover:bg-blue-900 transition-colors cursor-pointer"
            >
              Rejoindre
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default GroupCard;