import { RegisterRole } from '../../types/register.types';

interface Props {
  selected: RegisterRole | null;
  onSelect: (role: RegisterRole) => void;
}

// Étape 1 — Choix du rôle
const RoleSelector = ({ selected, onSelect }: Props) => (
  <div className="flex flex-col gap-4">
    <div>
      <h2 className="text-xl font-bold text-gray-800 mb-1">
        Je suis...
      </h2>
      <p className="text-gray-400 text-sm">
        Choisissez votre profil pour commencer.
      </p>
    </div>

    <div className="grid grid-cols-2 gap-4">

      {/* Élève / Parent */}
      <button
        onClick={() => onSelect('ELEVE_PARENT')}
        className={`flex flex-col items-center gap-3 p-6
                    border-2 rounded-xl cursor-pointer
                    transition-all text-left
                    ${selected === 'ELEVE_PARENT'
                      ? 'border-[#1a2744] bg-blue-50'
                      : 'border-gray-200 hover:border-blue-200'
                    }`}
      >
        <span className="text-4xl">👨‍👩‍👦</span>
        <div>
          <p className="font-bold text-gray-800">Élève / Parent</p>
          <p className="text-xs text-gray-500 mt-1">
            Trouvez un répétiteur pour votre enfant ou pour vous-même.
            Réservez des cours individuels ou rejoignez des groupes.
          </p>
        </div>
        {selected === 'ELEVE_PARENT' && (
          <span className="self-end text-[#1a2744] font-bold text-sm">
            ✓ Sélectionné
          </span>
        )}
      </button>

      {/* Répétiteur */}
      <button
        onClick={() => onSelect('REPETITEUR')}
        className={`flex flex-col items-center gap-3 p-6
                    border-2 rounded-xl cursor-pointer
                    transition-all text-left
                    ${selected === 'REPETITEUR'
                      ? 'border-[#1a2744] bg-blue-50'
                      : 'border-gray-200 hover:border-blue-200'
                    }`}
      >
        <span className="text-4xl">👨‍🏫</span>
        <div>
          <p className="font-bold text-gray-800">Répétiteur</p>
          <p className="text-xs text-gray-500 mt-1">
            Proposez vos services de soutien scolaire.
            Créez votre profil et gérez vos cours à Dschang.
          </p>
        </div>
        {selected === 'REPETITEUR' && (
          <span className="self-end text-[#1a2744] font-bold text-sm">
            ✓ Sélectionné
          </span>
        )}
      </button>
    </div>
  </div>
);

export default RoleSelector;