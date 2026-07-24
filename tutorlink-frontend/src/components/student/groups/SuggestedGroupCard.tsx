import { SuggestedGroup } from '../../../types/studentGroup.types';

interface Props {
  group: SuggestedGroup;
  onJoin: (id: string) => void;
}

const SuggestedGroupCard = ({ group: g, onJoin }: Props) => {
  const placePct = (g.currentMembers / g.maxMembers) * 100;
  const isComplet = g.currentMembers >= g.maxMembers;

  return (
    <div className="bg-white rounded-xl shadow-sm p-4
                    border border-gray-100 flex gap-4 items-center">

      <div className="w-12 h-12 rounded-full bg-blue-100
                      flex items-center justify-center
                      text-xl flex-shrink-0">
        👥
      </div>

      <div className="flex-1 min-w-0">
        <h4 className="font-bold text-gray-800 text-sm truncate">
          {g.name}
        </h4>
        <p className="text-xs text-gray-500">
          {g.tutorName}{g.rating > 0 ? ` · ★ ${g.rating}` : ''}
        </p>
        <div className="flex items-center gap-2 mt-1">
          <div className="flex-1 bg-gray-100 rounded-full h-1.5">
            <div
              className={`h-1.5 rounded-full
                ${isComplet ? 'bg-red-400' : 'bg-blue-500'}`}
              style={{ width: `${placePct}%` }}
            />
          </div>
          <span className="text-xs text-gray-400 flex-shrink-0">
            {g.currentMembers}/{g.maxMembers}
          </span>
        </div>
      </div>

      <div className="flex flex-col items-end gap-2 flex-shrink-0">
        <p className="font-bold text-blue-900 text-sm">
          {g.monthlyPrice.toLocaleString()} F/mois
        </p>
        <button
          onClick={() => onJoin(g.id)}
          disabled={isComplet}
          className={`text-xs font-bold px-3 py-1.5 rounded-lg
                      cursor-pointer transition-colors
                      ${isComplet
                        ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                        : 'bg-[#1a2744] hover:bg-blue-900 text-white'
                      }`}
        >
          {isComplet ? 'Complet' : 'Rejoindre'}
        </button>
      </div>
    </div>
  );
};

export default SuggestedGroupCard;
