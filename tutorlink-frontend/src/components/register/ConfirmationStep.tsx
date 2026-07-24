import { RegisterRole } from '../../types/register.types';

interface Props {
  role: RegisterRole;
  name: string;
  onGoToLogin: () => void;
}

const ConfirmationStep = ({ role, name, onGoToLogin }: Props) => (
  <div className="text-center flex flex-col items-center gap-5 py-4">

    <div className="w-20 h-20 rounded-full bg-green-100
                    flex items-center justify-center text-4xl">
      {role === 'REPETITEUR' ? '⏳' : '✅'}
    </div>

    <div>
      <h2 className="text-xl font-bold text-gray-800">
        {role === 'REPETITEUR'
          ? 'Dossier soumis avec succès !'
          : 'Compte créé avec succès !'
        }
      </h2>
      <p className="text-gray-500 text-sm mt-2">
        Bienvenue sur TutorLink, <strong>{name}</strong> !
      </p>
    </div>

    {role === 'REPETITEUR' ? (
      <div className="flex flex-col gap-3 w-full">

        {/* Validation dossier */}
        <div className="bg-yellow-50 border border-yellow-200
                        rounded-xl px-5 py-4 text-left">
          <p className="text-sm font-bold text-yellow-700 mb-2">
            ⏳ Votre dossier est en cours de vérification
          </p>
          <ul className="text-xs text-yellow-600 flex flex-col gap-1.5">
            <li>✓ CNI et diplôme vérifiés par notre équipe</li>
            <li>✓ Notification SMS + email dès validation (24-48h)</li>
          </ul>
        </div>

        {/* ✅ NOUVEAU : Info abonnement */}
        <div className="bg-[#1a2744] rounded-xl px-5 py-4 text-left">
          <p className="text-sm font-bold text-white mb-2">
            🎁 Votre période d'essai gratuite commence maintenant
          </p>
          <ul className="text-xs text-blue-200 flex flex-col gap-1.5">
            <li>✓ <strong className="text-white">2 mois gratuits</strong> — aucun paiement requis</li>
            <li>✓ Après 2 mois : abonnement à <strong className="text-yellow-400">3 000 FCFA/mois</strong></li>
            <li>✓ <strong className="text-white">0% de commission</strong> sur vos cours individuels</li>
            <li>✓ Vos élèves vous paient directement (MTN MoMo / Orange Money)</li>
          </ul>
        </div>
      </div>
    ) : (
      <div className="bg-green-50 border border-green-200
                      rounded-xl px-5 py-4 text-left w-full">
        <p className="text-sm font-bold text-green-700 mb-2">
          ✅ Votre compte est actif
        </p>
        <ul className="text-xs text-green-600 flex flex-col gap-1.5">
          <li>✓ Recherchez des répétiteurs à Dschang</li>
          <li>✓ Demandez des cours et rejoignez des groupes</li>
          <li>✓ Payez directement votre répétiteur (MTN MoMo / Orange Money)</li>
        </ul>
      </div>
    )}

    <button
      onClick={onGoToLogin}
      className="w-full bg-[#1a2744] hover:bg-blue-900 text-white
                 font-bold py-3 rounded-xl cursor-pointer transition-colors"
    >
      {role === 'REPETITEUR'
        ? 'Compris, j\'attends la validation'
        : '🚀 Accéder à mon espace'
      }
    </button>
  </div>
);

export default ConfirmationStep;