import { Group } from '../../types/group.types';

interface Props {
  group: Group;
  onJoin: () => void;
  onWaitlist: () => void;
}

const GroupHeader = ({ group, onJoin }: Props) => (
  <div className="bg-[#1a2744] text-white rounded-xl p-6 mb-6">
    <div className="flex items-start gap-5">

      {/* Avatar groupe */}
      <div className="w-16 h-16 rounded-full bg-yellow-400 flex items-center justify-center text-3xl flex-shrink-0">
        👥
      </div>

      {/* Infos principales */}
      <div className="flex-1">
        <div className="flex items-center gap-3 mb-1">
          <h1 className="text-xl font-bold">{group.name}</h1>
          {group.isVerified && (
            <span className="bg-blue-500 text-white text-xs px-2 py-0.5 rounded-full">
              ✓ Groupe vérifié
            </span>
          )}
        </div>
        <p className="text-blue-200 text-sm mb-3">
          {group.subject} · {group.level} · {group.quartier}
        </p>
        <div className="flex flex-wrap gap-4 text-sm text-blue-100">
          <span>★ {group.rating} ({group.reviewCount} avis)</span>
          <span>👨‍🏫 Admin : {group.tutor.name}</span>
          <span>👥 {group.currentMembers}/{group.maxMembers} places</span>
          <span>📅 {group.sessions.map(s => `${s.day} ${s.startTime}-${s.endTime}`).join(' · ')}</span>
        </div>
      </div>

      {/* Prix + bouton */}
      <div className="text-right flex-shrink-0">
        <p className="text-2xl font-bold text-yellow-400">
          {group.monthlyPrice.toLocaleString()} FCFA
          <span className="text-sm text-blue-200 font-normal"> / mois</span>
        </p>
        {group.status !== 'complet' && (
          <button
            onClick={onJoin}
            className="mt-3 bg-yellow-400 hover:bg-yellow-500 text-gray-900 font-bold px-6 py-2 rounded-lg cursor-pointer transition-colors"
          >
            + Rejoindre ce groupe
          </button>
        )}
      </div>
    </div>
  </div>
);

export default GroupHeader;