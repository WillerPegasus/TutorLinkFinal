import { useNavigate } from 'react-router-dom';

// Section appel à l'action finale avant le footer
const CTASection = () => {
  const navigate = useNavigate();

  return (
    <section className="bg-[#1555e1] py-16 px-6">
      <div className="max-w-3xl mx-auto text-center">

        {/* Titre */}
        <h2 className="text-3xl font-bold text-white mb-3">
          Prêt à améliorer vos résultats ?
        </h2>
        <p className="text-blue-200 mb-8 text-sm leading-relaxed">
          Rejoignez plus de 300 élèves qui progressent chaque mois
          avec TutorLink à Dschang.
          Inscription gratuite, aucun engagement.
        </p>

        {/* Boutons */}
        <div className="flex flex-col sm:flex-row gap-3
                        justify-center max-w-sm mx-auto">
          <button
            onClick={() => navigate('/inscription')}
            className="flex-1 bg-yellow-400 hover:bg-yellow-300
                       text-gray-900 font-bold py-3.5 rounded-xl
                       cursor-pointer transition-all text-sm
                       hover:shadow-lg hover:shadow-yellow-400/30"
          >
            🚀 Commencer gratuitement
          </button>
          <button
            onClick={() => navigate('/repetiteurs')}
            className="flex-1 border-2 border-white/30
                       hover:border-white text-white font-bold
                       py-3.5 rounded-xl cursor-pointer
                       transition-all text-sm hover:bg-white/5"
          >
            🔍 Voir les répétiteurs
          </button>
        </div>

        {/* Réassurance */}
        <div className="flex flex-wrap justify-center gap-6 mt-8">
          {[
            '✅ Inscription gratuite',
            '🔒 Paiement sécurisé MTN/Orange',
            '⭐ 98% de satisfaction',
          ].map(item => (
            <span key={item} className="text-blue-300 text-xs">
              {item}
            </span>
          ))}
        </div>
      </div>
    </section>
  );
};

export default CTASection;