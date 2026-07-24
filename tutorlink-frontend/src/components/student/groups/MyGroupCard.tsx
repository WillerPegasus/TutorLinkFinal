import { StudentGroupItem } from '../../../types/studentGroup.types';

interface Props {
  group: StudentGroupItem;
  onViewGroup: (id: string) => void;
  onLeave: (id: string) => void;
}

const MyGroupCard = ({ group: g, onViewGroup, onLeave }: Props) => {
  const placePct = (g.currentMembers / g.maxMembers) * 100;

  return (
    <div className="bg-white rounded-xl shadow-sm overflow-hidden
                    border border-gray-100 hover:shadow-md transition-shadow">

      <div className="bg-[#1a2744] p-4">
        <div className="flex justify-between items-start">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-full bg-yellow-400
                            flex items-center justify-center
                            text-2xl flex-shrink-0">
              👥
            </div>
            <div>
              <h3 className="text-white font-bold text-sm leading-tight">
                {g.name}
              </h3>
              <p className="text-blue-200 text-xs">
                {g.subject} · {g.level}
              </p>
            </div>
          </div>
          {g.rating > 0 && (
            <span className="text-yellow-400 text-xs font-bold">
              ★ {g.rating}
            </span>
          )}
        </div>
      </div>

      <div className="p-4 flex flex-col gap-3">

        <div className="grid grid-cols-2 gap-2 text-xs text-gray-500">
          <span>👨‍🏫 {g.tutorName}</span>
          <span>📍 {g.quartier}</span>
          <span className="col-span-2">💰 {g.monthlyPrice.toLocaleString()} F/mois</span>
        </div>

        {g.description && (
          <p className="text-xs text-gray-500">{g.description}</p>
        )}

        <div>
          <div className="flex justify-between text-xs mb-1">
            <span className="text-gray-500">
              {g.currentMembers}/{g.maxMembers} membres
            </span>
            <span className="text-gray-400">
              Inscrit le {g.joinedAt}
            </span>
          </div>
          <div className="bg-gray-100 rounded-full h-1.5">
            <div
              className="bg-blue-600 h-1.5 rounded-full"
              style={{ width: `${placePct}%` }}
            />
          </div>
        </div>

        {g.schedules && (
          <div className="bg-blue-50 text-blue-700 text-xs
                          font-medium px-3 py-2 rounded-lg border
                          border-blue-100">
            🗓 {g.schedules}
          </div>
        )}

        <div className="flex gap-2 pt-1">
          <button
            onClick={() => onViewGroup(g.id)}
            className="flex-1 border border-gray-200 text-gray-600
                       text-xs py-2 rounded-lg hover:bg-gray-50
                       cursor-pointer transition-colors"
          >
            👁 Voir détail
          </button>

          <button
            onClick={() => {
              if (window.confirm(
                `Quitter "${g.name}" ? Cette action est irréversible.`
              )) onLeave(g.id);
            }}
            className="border border-red-200 text-red-500 text-xs
                       py-2 px-3 rounded-lg hover:bg-red-50
                       cursor-pointer transition-colors"
          >
            Quitter
          </button>
        </div>
      </div>
    </div>
  );
};

export default MyGroupCard;
