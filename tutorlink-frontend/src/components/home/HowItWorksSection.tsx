import { HowItWorksStep } from '../../types/home.types';

interface Props { steps: HowItWorksStep[]; }

const HowItWorksSection = ({ steps }: Props) => (
  <section id="comment-ca-marche" className="bg-white py-16 px-6">
    <div className="max-w-5xl mx-auto">

      {/* En-tête section */}
      <div className="text-center mb-12">
        <span className="bg-yellow-100 text-yellow-700 text-xs
                         font-bold px-3 py-1 rounded-full uppercase
                         tracking-wide">
          Simple & rapide
        </span>
        <h2 className="text-3xl font-bold text-gray-900 mt-3">
          Comment ça marche ?
        </h2>
        <p className="text-gray-500 mt-2 max-w-xl mx-auto">
          Trois étapes simples pour démarrer le soutien scolaire
          de votre enfant à Dschang.
        </p>
      </div>

      {/* Étapes */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 relative">

        {/* Ligne de connexion entre étapes (desktop) */}
        <div className="hidden md:block absolute top-12 left-1/4
                        right-1/4 h-0.5 bg-yellow-200 z-0" />

        {steps.map(step => (
          <div key={step.number}
            className="relative z-10 bg-white border border-gray-100
                       rounded-2xl p-6 shadow-sm hover:shadow-md
                       transition-shadow flex flex-col items-center
                       text-center">

            {/* Numéro */}
            <div className="w-14 h-14 rounded-full bg-[#1a2744]
                            flex items-center justify-center
                            text-yellow-400 font-bold text-xl mb-4
                            shadow-lg shadow-blue-900/20">
              {step.number}
            </div>

            {/* Icône */}
            <span className="text-3xl mb-3">{step.icon}</span>

            {/* Titre */}
            <h3 className="font-bold text-gray-800 text-lg mb-2">
              {step.title}
            </h3>

            {/* Description */}
            <p className="text-gray-500 text-sm leading-relaxed">
              {step.description}
            </p>
          </div>
        ))}
      </div>
    </div>
  </section>
);

export default HowItWorksSection;