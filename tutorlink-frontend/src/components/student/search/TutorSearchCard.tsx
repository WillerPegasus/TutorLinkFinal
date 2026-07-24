import { SearchTutor } from '../../../types/search.types';

interface Props {
  tutor: SearchTutor;
  onViewProfile: (id: string) => void;
  onBook: (id: string) => void;
}

const TutorSearchCard = ({ tutor: t, onViewProfile, onBook }: Props) => (
  <div className="bg-white rounded-xl shadow-sm overflow-hidden
                  hover:shadow-md transition-shadow border border-gray-100">

    {/* En-tête */}
    <div className="bg-[#1a2744] p-4 flex items-center gap-3">
      <div className="w-14 h-14 rounded-full bg-yellow-400
                      flex items-center justify-center
                      text-gray-900 font-bold text-xl flex-shrink-0">
        {t.name.charAt(0)}
      </div>
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2">
          <h3 className="text-white font-bold text-base truncate">
            {t.name}
          </h3>
          {t.isVerified && (
            <span className="bg-blue-500 text-white text-xs
                             px-1.5 py-0.5 rounded font-bold flex-shrink-0">
              ✓
            </span>
          )}
        </div>
        <p className="text-blue-200 text-xs">
          {t.subject} · {t.level}
        </p>
      </div>
      <div className="text-right flex-shrink-0">
        <p className="text-yellow-400 font-bold text-lg">
          {t.hourlyPrice.toLocaleString()}
        </p>
        <p className="text-blue-300 text-xs">FCFA/h</p>
      </div>
    </div>

    {/* Corps */}
    <div className="p-4">
      <div className="flex justify-between text-xs text-gray-500 mb-2">
        <span>📍 {t.quartier}</span>
        <span className="font-bold text-yellow-500">
          ★ {t.rating} ({t.reviewCount})
        </span>
      </div>

      <p className="text-xs text-gray-400 mb-2">
        📚 {t.totalSessions} cours donnés
      </p>

      <p className="text-sm text-gray-600 line-clamp-2 mb-3 leading-relaxed">
        {t.bio}
      </p>

      {/* Badge paiement direct */}
      <div className="flex items-center gap-1 mb-3">
        <span className="bg-green-100 text-green-700 text-xs
                         font-bold px-2 py-0.5 rounded-full">
          💳 Paiement direct MTN/Orange
        </span>
        {t.isAvailable && (
          <span className="bg-blue-100 text-blue-700 text-xs
                           font-bold px-2 py-0.5 rounded-full">
            🟢 Disponible
          </span>
        )}
      </div>

      {/* Boutons */}
      <div className="flex gap-2">
        <button
          onClick={() => onViewProfile(t.id)}
          className="flex-1 border border-gray-200 text-gray-600
                     text-sm py-2 rounded-lg hover:bg-gray-50
                     cursor-pointer transition-colors"
        >
          Voir profil
        </button>
        <button
          onClick={() => onBook(t.id)}
          disabled={!t.isAvailable}
          className="flex-1 bg-[#1a2744] hover:bg-blue-900
                     text-white font-bold text-sm py-2 rounded-lg
                     cursor-pointer transition-colors
                     disabled:opacity-40 disabled:cursor-not-allowed"
        >
          📅 Demander un cours
        </button>
      </div>
    </div>
  </div>
);

export default TutorSearchCard;