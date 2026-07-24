import { Group } from '../../types/group.types';

interface Props {
  group: Group;
  individualCost: number;
  savings: number;
  onJoin: () => void;
  onWaitlist: () => void;
}

const GroupJoinPanel = ({ group, individualCost, savings, onJoin, onWaitlist }: Props) => {
  const isComplet = group.status === 'complet';
  const placePct = (group.currentMembers / group.maxMembers) * 100;

  return (
    <div className="flex flex-col gap-4">

      {/* Inscriptions */}
      <div className="bg-white rounded-xl shadow-sm p-5">
        <h3 className="font-bold text-gray-700 mb-4">👥 Inscriptions au groupe</h3>
        <div className="text-center mb-3">
          <span className="text-4xl font-bold text-gray-800">{group.currentMembers}</span>
          <span className="text-xl text-gray-400">/{group.maxMembers}</span>
          <p className="text-xs text-gray-400 mt-1 uppercase">Places occupées</p>
        </div>
        <div className="bg-gray-100 rounded-full h-2 mb-2">
          <div
            className={`h-2 rounded-full ${isComplet ? 'bg-red-500' : 'bg-blue-600'}`}
            style={{ width: `${placePct}%` }}
          />
        </div>
        {!isComplet && (
          <p className="text-xs text-center text-blue-600 font-medium mb-4">
            {group.maxMembers - group.currentMembers} places restantes
          </p>
        )}

        {isComplet ? (
          <button
            onClick={onWaitlist}
            className="w-full border-2 border-gray-300 text-gray-600 font-bold py-3 rounded-lg cursor-pointer hover:bg-gray-50"
          >
            📋 Liste d'attente
          </button>
        ) : (
          <button
            onClick={onJoin}
            className="w-full bg-[#1a2744] hover:bg-blue-900 text-white font-bold py-3 rounded-lg cursor-pointer transition-colors"
          >
            + Rejoindre ce groupe
          </button>
        )}
      </div>

      {/* Avantages */}
      <div className="bg-white rounded-xl shadow-sm p-5">
        <h3 className="font-bold text-gray-700 mb-3">💡 Avantages du groupe</h3>
        {[
          '✅ Tarif réduit vs cours individuel',
          '👥 Émulation collective',
          '📝 Examens blancs mensuels inclus',
          '🎯 Suivi pédagogique personnalisé',
        ].map(a => (
          <p key={a} className="text-sm text-gray-600 py-1.5 border-b border-gray-50 last:border-0">{a}</p>
        ))}
      </div>

      {/* Comparaison tarifaire */}
      <div className="bg-white rounded-xl shadow-sm p-5">
        <h3 className="font-bold text-gray-700 mb-3">📊 Comparaison tarifs</h3>
        <div className="flex justify-between text-sm py-2 border-b border-gray-100">
          <span className="text-gray-600">Cours individuel</span>
          <span className="text-gray-500">2 000 FCFA/h</span>
        </div>
        <div className="flex justify-between text-sm py-2 border-b border-gray-100">
          <span className="text-gray-600">Sur 16h / mois</span>
          <span className="text-gray-500">{individualCost.toLocaleString()} FCFA</span>
        </div>
        <div className="flex justify-between text-sm py-2 border-b border-gray-100">
          <span className="font-bold text-blue-800">Ce groupe</span>
          <span className="font-bold text-blue-800">{group.monthlyPrice.toLocaleString()} FCFA/mois</span>
        </div>
        <div className="bg-yellow-50 rounded-lg p-3 mt-3 text-center">
          <p className="text-yellow-700 font-bold text-sm">
            💰 Économisez {savings.toLocaleString()} FCFA / mois
          </p>
        </div>
      </div>
    </div>
  );
};

export default GroupJoinPanel;