import { TutorPublicProfile } from '../../types/tutorProfile.types';

interface Props {
  profile: TutorPublicProfile;
  onBook: () => void;
  onContact: () => void;
}

const TutorProfileHeader = ({ profile: p, onBook, onContact }: Props) => (
  <div className="bg-[#1a2744] text-white">
    <div className="max-w-5xl mx-auto px-6 py-6
                    flex items-center gap-5">
      {/* Avatar */}
      <div className="w-20 h-20 rounded-full bg-yellow-400
                      flex items-center justify-center
                      text-3xl font-bold text-gray-900 flex-shrink-0">
        {p.name.charAt(0)}
      </div>

      {/* Infos */}
      <div className="flex-1">
        <div className="flex items-center gap-2">
          <h1 className="text-xl font-bold">{p.name}</h1>
          {p.isVerified && (
            <span className="bg-blue-500 text-white text-xs
                             px-2 py-0.5 rounded-full">
              ✓ Vérifié
            </span>
          )}
        </div>
        <p className="text-blue-200 text-sm mt-1">
          {p.subject} · {p.level} · {p.quartier}
        </p>
        <div className="flex flex-wrap gap-4 text-sm text-blue-100 mt-2">
          <span>★ {p.rating} ({p.reviewCount} avis)</span>
          <span>🎓 {p.diploma}</span>
          <span>📚 {p.totalSessions} cours donnés</span>
        </div>
      </div>

      {/* Prix + bouton */}
      <div className="text-right flex-shrink-0">
        <p className="text-2xl font-bold text-yellow-400">
          {p.hourlyPrice.toLocaleString()} FCFA
          <span className="text-sm text-blue-200 font-normal"> / heure</span>
        </p>
        {/* ✅ MODIFIÉ : "Demander un cours" au lieu de "Réserver" */}
        <button
          onClick={onBook}
          className="mt-3 bg-yellow-400 hover:bg-yellow-500
                     text-gray-900 font-bold px-6 py-2.5
                     rounded-lg cursor-pointer transition-colors"
        >
          📅 Demander un cours
        </button>
        <button
          onClick={onContact}
          className="mt-2 bg-transparent border border-blue-300 text-blue-100
                     hover:bg-blue-800 font-bold text-sm
                     px-6 py-2 rounded-lg cursor-pointer transition-colors"
        >
          💬 Contacter
        </button>
        {/* ✅ NOUVEAU : badge paiement direct */}
        <p className="text-xs text-blue-300 mt-2">
          💳 Paiement direct MTN/Orange
        </p>
      </div>
    </div>
  </div>
);

export default TutorProfileHeader;