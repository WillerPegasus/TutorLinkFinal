interface TutorPedagogicData {
  subject: string;
  subjects: string[];
  level: string;
  hourlyPrice: number;
  bio: string;
}

interface Props {
  data: TutorPedagogicData;
  onChange: (d: TutorPedagogicData) => void;
  errors: Record<string, string>;
}

const SUBJECTS = [
  'Mathématiques', 'Physique-Chimie', 'Anglais',
  'Français', 'SVT', 'Informatique',
  'Histoire-Géo', 'Philosophie',
];

const LEVELS = [
  'Primaire (CM1-CM2)',
  'Collège (6ème-3ème)',
  'Lycée (2nde-1ère)',
  'Terminale C/D',
  'Terminale A/B',
  'Tous niveaux',
];

// Étape 3 — Informations pédagogiques répétiteur
const TutorPedagogicForm = ({ data, onChange, errors }: Props) => (
  <div className="flex flex-col gap-4">
    <div>
      <h2 className="text-xl font-bold text-gray-800 mb-1">
        Votre profil pédagogique
      </h2>
      <p className="text-gray-400 text-sm">
        Ces informations seront visibles sur votre profil public.
      </p>
    </div>

    {/* Matière principale */}
    <div>
      <label className="text-xs text-gray-500 font-semibold
                        uppercase mb-1 block">
        Matière principale
      </label>
      <select
        value={data.subject}
        onChange={e => onChange({ ...data, subject: e.target.value })}
        className={`w-full border rounded-lg px-3 py-2.5 text-sm
                    focus:outline-none focus:ring-2 focus:ring-blue-300
                    ${errors.subject
                      ? 'border-red-300' : 'border-gray-200'
                    }`}
      >
        <option value="">Choisir une matière</option>
        {SUBJECTS.map(s => (
          <option key={s} value={s}>{s}</option>
        ))}
      </select>
      {errors.subject && (
        <p className="text-red-500 text-xs mt-0.5">{errors.subject}</p>
      )}
    </div>

    {/* Autres matières — checkboxes */}
    <div>
      <label className="text-xs text-gray-500 font-semibold
                        uppercase mb-2 block">
        Autres matières enseignées
      </label>
      <div className="grid grid-cols-2 gap-2">
        {SUBJECTS.filter(s => s !== data.subject).map(s => (
          <label key={s}
            className="flex items-center gap-2 cursor-pointer">
            <input
              type="checkbox"
              checked={data.subjects.includes(s)}
              onChange={e => {
                const updated = e.target.checked
                  ? [...data.subjects, s]
                  : data.subjects.filter(sub => sub !== s);
                onChange({ ...data, subjects: updated });
              }}
              className="w-4 h-4 accent-blue-800"
            />
            <span className="text-sm text-gray-600">{s}</span>
          </label>
        ))}
      </div>
    </div>

    {/* Niveau enseigné */}
    <div>
      <label className="text-xs text-gray-500 font-semibold
                        uppercase mb-1 block">
        Niveau enseigné
      </label>
      <select
        value={data.level}
        onChange={e => onChange({ ...data, level: e.target.value })}
        className={`w-full border rounded-lg px-3 py-2.5 text-sm
                    focus:outline-none focus:ring-2 focus:ring-blue-300
                    ${errors.level
                      ? 'border-red-300' : 'border-gray-200'
                    }`}
      >
        <option value="">Choisir un niveau</option>
        {LEVELS.map(l => (
          <option key={l} value={l}>{l}</option>
        ))}
      </select>
      {errors.level && (
        <p className="text-red-500 text-xs mt-0.5">{errors.level}</p>
      )}
    </div>

    {/* Tarif horaire */}
    <div>
      <label className="text-xs text-gray-500 font-semibold
                        uppercase mb-1 block">
        Tarif horaire (FCFA / heure)
      </label>
      <input
        type="number"
        value={data.hourlyPrice}
        onChange={e => onChange({
          ...data, hourlyPrice: Number(e.target.value)
        })}
        min={1000}
        step={500}
        className={`w-full border rounded-lg px-3 py-2.5 text-sm
                    focus:outline-none focus:ring-2 focus:ring-blue-300
                    ${errors.hourlyPrice
                      ? 'border-red-300' : 'border-gray-200'
                    }`}
      />
      <p className="text-xs text-gray-400 mt-0.5">
        Recommandé : 1 500 à 3 000 FCFA/h selon votre niveau
      </p>
      {errors.hourlyPrice && (
        <p className="text-red-500 text-xs mt-0.5">{errors.hourlyPrice}</p>
      )}
    </div>

    {/* Présentation */}
    <div>
      <label className="text-xs text-gray-500 font-semibold
                        uppercase mb-1 block">
        Présentation
        <span className="text-gray-300 font-normal ml-1">
          (min. 50 caractères)
        </span>
      </label>
      <textarea
        value={data.bio}
        onChange={e => onChange({ ...data, bio: e.target.value })}
        placeholder="Décrivez votre expérience, vos méthodes et vos points forts..."
        rows={4}
        className={`w-full border rounded-lg px-3 py-2.5 text-sm
                    resize-none focus:outline-none
                    focus:ring-2 focus:ring-blue-300
                    ${errors.bio ? 'border-red-300' : 'border-gray-200'}`}
      />
      <p className="text-xs text-gray-400 text-right mt-0.5">
        {data.bio.length} / 50 min.
      </p>
      {errors.bio && (
        <p className="text-red-500 text-xs mt-0.5">{errors.bio}</p>
      )}
    </div>
  </div>
);

export default TutorPedagogicForm;