import { useNavigate } from 'react-router-dom';
import { FeaturedGroup } from '../../types/home.types';

interface Props { groups: FeaturedGroup[]; }

// Carte groupe vedette
const GroupCard = ({
  group: g, onView, onJoin
}: {
  group: FeaturedGroup;
  onView: () => void;
  onJoin: () => void;
}) => {
  const placePct = (g.currentMembers / g.maxMembers) * 100;
  const isFull = g.currentMembers >= g.maxMembers;

  return (
    <div className="bg-white rounded-2xl shadow-sm overflow-hidden
                    border border-gray-100 hover:shadow-lg
                    transition-all hover:-translate-y-0.5">

      {/* En-tête */}
      <div className="bg-[#1a2744] p-4">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-full bg-yellow-400
                          flex items-center justify-center
                          text-2xl flex-shrink-0">
            👥
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-1">
              <h3 className="text-white font-bold text-sm truncate">
                {g.name}
              </h3>
              {g.isVerified && (
                <span className="text-blue-300 text-xs flex-shrink-0">
                  ✓
                </span>
              )}
            </div>
            <p className="text-blue-200 text-xs">{g.subject}</p>
          </div>
          <span className="text-yellow-400 text-xs font-bold flex-shrink-0">
            ★ {g.rating}
          </span>
        </div>
      </div>

      {/* Corps */}
      <div className="p-4">
        {/* Admin */}
        <p className="text-xs text-gray-500 mb-2">
          👨‍🏫 {g.tutorName}
        </p>

        {/* Horaires */}
        <p className="text-xs text-blue-600 font-medium mb-3">
          🗓️ {g.schedule}
        </p>

        {/* Jauge places */}
        <div className="mb-1">
          <div className="flex justify-between text-xs text-gray-400 mb-1">
            <span>{g.currentMembers}/{g.maxMembers} places</span>
            {isFull && (
              <span className="text-red-500 font-bold">Complet</span>
            )}
          </div>
          <div className="bg-gray-100 rounded-full h-1.5">
            <div
              className={`h-1.5 rounded-full transition-all
                ${isFull ? 'bg-red-400' : 'bg-blue-500'}`}
              style={{ width: `${placePct}%` }}
            />
          </div>
        </div>

        {/* Prix */}
        <p className="font-bold text-[#1a2744] text-lg mt-3 mb-4">
          {g.monthlyPrice.toLocaleString()} FCFA
          <span className="text-xs text-gray-400 font-normal"> / mois</span>
        </p>

        {/* Boutons */}
        <div className="flex gap-2">
          <button
            onClick={onView}
            className="flex-1 border border-gray-200 text-gray-600
                       text-xs py-2 rounded-lg hover:bg-gray-50
                       cursor-pointer transition-colors"
          >
            Voir détails
          </button>
          <button
            onClick={onJoin}
            disabled={isFull}
            className={`flex-1 font-bold text-xs py-2 rounded-lg
                        cursor-pointer transition-colors
                        ${isFull
                          ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                          : 'bg-[#1a2744] hover:bg-blue-900 text-white'
                        }`}
          >
            {isFull ? 'Liste d\'attente' : 'Rejoindre'}
          </button>
        </div>
      </div>
    </div>
  );
};

const FeaturedGroupsSection = ({ groups }: Props) => {
  const navigate = useNavigate();

  return (
    <section className="bg-gray-50 py-16 px-6">
      <div className="max-w-5xl mx-auto">

        {/* En-tête */}
        <div className="flex justify-between items-end mb-10">
          <div>
            <span className="bg-purple-100 text-purple-700 text-xs
                             font-bold px-3 py-1 rounded-full uppercase
                             tracking-wide">
              Apprentissage collaboratif
            </span>
            <h2 className="text-3xl font-bold text-gray-900 mt-3">
              👥 Nos groupes vedettes
            </h2>
            <p className="text-gray-500 mt-1 text-sm">
              Économisez jusqu'à 25 000 FCFA/mois vs cours individuels.
            </p>
          </div>
          <button
            onClick={() => navigate('/groupes')}
            className="hidden md:block border border-gray-200
                       text-gray-600 text-sm px-5 py-2 rounded-xl
                       hover:bg-gray-50 cursor-pointer transition-colors"
          >
            Voir tous les groupes →
          </button>
        </div>

        {/* Grille cartes */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          {groups.map(group => (
            <GroupCard
              key={group.id}
              group={group}
              onView={() => navigate(`/groupes/${group.id}`)}
              onJoin={() => navigate(`/groupes/${group.id}`)}
            />
          ))}
        </div>

        {/* Avantage groupes */}
        <div className="mt-8 bg-[#1a2744] rounded-2xl p-6
                        flex flex-col md:flex-row items-center
                        justify-between gap-4">
          <div>
            <h3 className="text-white font-bold text-lg">
              💡 Pourquoi rejoindre un groupe ?
            </h3>
            <div className="flex flex-wrap gap-4 mt-2">
              {[
                '✅ Tarif réduit vs cours individuel',
                '👥 Émulation collective',
                '📝 Examens blancs inclus',
              ].map(a => (
                <span key={a} className="text-blue-200 text-xs">{a}</span>
              ))}
            </div>
          </div>
          <button
            onClick={() => navigate('/groupes')}
            className="bg-yellow-400 hover:bg-yellow-500 text-gray-900
                       font-bold px-6 py-3 rounded-xl cursor-pointer
                       transition-colors flex-shrink-0 text-sm"
          >
            Découvrir les groupes →
          </button>
        </div>

        {/* Bouton mobile */}
        <div className="md:hidden mt-6 text-center">
          <button
            onClick={() => navigate('/groupes')}
            className="border border-gray-200 text-gray-600 text-sm
                       px-6 py-2.5 rounded-xl hover:bg-gray-50
                       cursor-pointer transition-colors"
          >
            Voir tous les groupes →
          </button>
        </div>
      </div>
    </section>
  );
};

export default FeaturedGroupsSection;