import { PlatformAdvantage } from '../../types/home.types';

interface Props { advantages: PlatformAdvantage[]; }

const AdvantagesSection = ({ advantages }: Props) => (
  <section id="avantages" className="bg-gray-50 py-16 px-6">
    <div className="max-w-5xl mx-auto">

      {/* En-tête */}
      <div className="text-center mb-12">
        <span className="bg-blue-100 text-blue-700 text-xs
                         font-bold px-3 py-1 rounded-full uppercase
                         tracking-wide">
          Nos engagements
        </span>
        <h2 className="text-3xl font-bold text-gray-900 mt-3">
          Pourquoi TutorLink ?
        </h2>
        <p className="text-gray-500 mt-2">
          La plateforme éducative de référence à Dschang.
        </p>
      </div>

      {/* Grille avantages */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {advantages.map(adv => (
          <div key={adv.title}
            className={`${adv.color} rounded-2xl p-5 text-center
                        hover:shadow-md transition-shadow`}>
            <div className="text-4xl mb-3">{adv.icon}</div>
            <h3 className="font-bold text-gray-800 text-sm mb-1">
              {adv.title}
            </h3>
            <p className="text-gray-500 text-xs leading-relaxed">
              {adv.description}
            </p>
          </div>
        ))}
      </div>
    </div>
  </section>
);

export default AdvantagesSection;