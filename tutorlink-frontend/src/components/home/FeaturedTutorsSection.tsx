import { useNavigate } from 'react-router-dom';
import { FeaturedTutor } from '../../types/home.types';

interface Props { tutors: FeaturedTutor[]; }

// Carte répétiteur vedette
const TutorCard = ({
  tutor: t, onView, onBook
}: {
  tutor: FeaturedTutor;
  onView: () => void;
  onBook: () => void;
}) => (
  <div className="bg-white rounded-2xl shadow-sm overflow-hidden
                  border border-gray-100 hover:shadow-lg
                  transition-all hover:-translate-y-0.5">

    {/* En-tête carte */}
    <div className="bg-[#1a2744] p-4 relative">
      {/* Badge si présent */}
      {t.badge && (
        <div className="absolute top-3 right-3 bg-yellow-400
                        text-gray-900 text-xs font-bold px-2 py-0.5
                        rounded-full">
          {t.badge}
        </div>
      )}

      <div className="flex items-center gap-3">
        {/* Avatar */}
        <div className="w-14 h-14 rounded-full bg-yellow-400
                        flex items-center justify-center
                        text-2xl font-bold text-gray-900 flex-shrink-0">
          {t.name.split(' ').pop()?.charAt(0)}
        </div>
        <div>
          <div className="flex items-center gap-1">
            <h3 className="text-white font-bold text-sm">{t.name}</h3>
            {t.isVerified && (
              <span className="text-blue-300 text-xs">✓</span>
            )}
          </div>
          <p className="text-blue-200 text-xs">
            {t.subject} · {t.level}
          </p>
        </div>
      </div>
    </div>

    {/* Corps */}
    <div className="p-4">
      {/* Stats */}
      <div className="flex justify-between text-xs text-gray-500 mb-3">
        <span>📍 {t.quartier}</span>
        <span className="font-bold text-yellow-500">
          ★ {t.rating} ({t.reviewCount})
        </span>
      </div>

      {/* Séances */}
      <p className="text-xs text-gray-400 mb-3">
        📚 {t.totalSessions} cours donnés
      </p>

      {/* Prix */}
      <p className="font-bold text-[#1a2744] text-lg mb-4">
        {t.hourlyPrice.toLocaleString()} FCFA
        <span className="text-xs text-gray-400 font-normal"> / heure</span>
      </p>

      {/* Boutons */}
      <div className="flex gap-2">
        <button
          onClick={onView}
          className="flex-1 border border-gray-200 text-gray-600
                     text-xs py-2 rounded-lg hover:bg-gray-50
                     cursor-pointer transition-colors"
        >
          Voir profil
        </button>
        <button
          onClick={onBook}
          className="flex-1 bg-[#1a2744] hover:bg-blue-900
                     text-white font-bold text-xs py-2 rounded-lg
                     cursor-pointer transition-colors"
        >
           📅 Demander un cours
        </button>
      </div>
    </div>
  </div>
);

const FeaturedTutorsSection = ({ tutors }: Props) => {
  const navigate = useNavigate();

  return (
    <section className="bg-white py-16 px-6">
      <div className="max-w-5xl mx-auto">

        {/* En-tête */}
        <div className="flex justify-between items-end mb-10">
          <div>
            <span className="bg-yellow-100 text-yellow-700 text-xs
                             font-bold px-3 py-1 rounded-full uppercase
                             tracking-wide">
              Sélection du mois
            </span>
            <h2 className="text-3xl font-bold text-gray-900 mt-3">
              🏆 Nos répétiteurs vedettes
            </h2>
            <p className="text-gray-500 mt-1 text-sm">
              Découvrez quelques-uns des meilleurs enseignants de Dschang.
            </p>
          </div>
          <button
            onClick={() => navigate('/repetiteurs')}
            className="hidden md:block border border-gray-200
                       text-gray-600 text-sm px-5 py-2 rounded-xl
                       hover:bg-gray-50 cursor-pointer transition-colors"
          >
            Voir tous les répétiteurs →
          </button>
        </div>

        {/* Grille cartes */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          {tutors.map(tutor => (
            <TutorCard
              key={tutor.id}
              tutor={tutor}
              onView={() => navigate(`/repetiteurs/${tutor.id}`)}
              onBook={() => navigate(`/reserver/${tutor.id}`)}
            />
          ))}
        </div>

        {/* Bouton mobile */}
        <div className="md:hidden mt-6 text-center">
          <button
            onClick={() => navigate('/repetiteurs')}
            className="border border-gray-200 text-gray-600 text-sm
                       px-6 py-2.5 rounded-xl hover:bg-gray-50
                       cursor-pointer transition-colors"
          >
            Voir tous les répétiteurs →
          </button>
        </div>
      </div>
    </section>
  );
};

export default FeaturedTutorsSection;