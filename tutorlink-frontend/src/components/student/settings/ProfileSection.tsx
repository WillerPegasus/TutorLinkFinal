import { StudentProfile } from '../../../types/studentSettings.types';

interface Props {
  profile: StudentProfile;
  onChange: (p: StudentProfile) => void;
  onSave: () => void;
  saving: boolean;
  saved: boolean;
}

const LEVELS = [
  'CM2', '6ème', '5ème', '4ème', '3ème',
  'Seconde', 'Première', 'Terminale C',
  'Terminale D', 'Terminale A',
];

// Section modification du profil
const ProfileSection = ({
  profile, onChange, onSave, saving, saved
}: Props) => (
  <div className="bg-white rounded-xl shadow-sm p-6">
    <h3 className="font-bold text-gray-700 mb-5">
      👤 Mon profil
    </h3>

    {/* Avatar */}
    <div className="flex items-center gap-4 mb-6">
      <div className="w-20 h-20 rounded-full bg-yellow-400
                      flex items-center justify-center
                      text-3xl font-bold text-gray-900">
        {profile.name.charAt(0)}
      </div>
      <div>
        <button className="border border-gray-200 text-gray-600
                           text-sm px-4 py-2 rounded-lg
                           hover:bg-gray-50 cursor-pointer
                           transition-colors">
          📷 Changer la photo
        </button>
        <p className="text-xs text-gray-400 mt-1">
          JPG ou PNG, max 2 Mo
        </p>
      </div>
    </div>

    {/* Formulaire */}
    <div className="grid grid-cols-2 gap-4">

      {/* Nom */}
      <div>
        <label className="text-xs text-gray-500 font-semibold
                          uppercase mb-1 block">
          Nom complet
        </label>
        <input
          value={profile.name}
          onChange={e => onChange({ ...profile, name: e.target.value })}
          className="w-full border border-gray-200 rounded-lg
                     px-3 py-2 text-sm focus:outline-none
                     focus:ring-2 focus:ring-blue-300"
        />
      </div>

      {/* Niveau */}
      <div>
        <label className="text-xs text-gray-500 font-semibold
                          uppercase mb-1 block">
          Niveau scolaire
        </label>
        <select
          value={profile.level}
          onChange={e => onChange({ ...profile, level: e.target.value })}
          className="w-full border border-gray-200 rounded-lg
                     px-3 py-2 text-sm focus:outline-none
                     focus:ring-2 focus:ring-blue-300"
        >
          {LEVELS.map(l => (
            <option key={l} value={l}>{l}</option>
          ))}
        </select>
      </div>

      {/* Email */}
      <div>
        <label className="text-xs text-gray-500 font-semibold
                          uppercase mb-1 block">
          Email
        </label>
        <input
          type="email"
          value={profile.email}
          onChange={e => onChange({ ...profile, email: e.target.value })}
          className="w-full border border-gray-200 rounded-lg
                     px-3 py-2 text-sm focus:outline-none
                     focus:ring-2 focus:ring-blue-300"
        />
      </div>

      {/* Téléphone */}
      <div>
        <label className="text-xs text-gray-500 font-semibold
                          uppercase mb-1 block">
          Téléphone
        </label>
        <input
          type="tel"
          value={profile.phone}
          onChange={e => onChange({ ...profile, phone: e.target.value })}
          className="w-full border border-gray-200 rounded-lg
                     px-3 py-2 text-sm focus:outline-none
                     focus:ring-2 focus:ring-blue-300"
        />
      </div>

      {/* Quartier — pleine largeur */}
      <div className="col-span-2">
        <label className="text-xs text-gray-500 font-semibold
                          uppercase mb-1 block">
          Quartier à Dschang
        </label>
        <input
          value={profile.quartier}
          onChange={e => onChange({ ...profile, quartier: e.target.value })}
          className="w-full border border-gray-200 rounded-lg
                     px-3 py-2 text-sm focus:outline-none
                     focus:ring-2 focus:ring-blue-300"
        />
      </div>

      {/* Bio — pleine largeur */}
      <div className="col-span-2">
        <label className="text-xs text-gray-500 font-semibold
                          uppercase mb-1 block">
          À propos de moi
        </label>
        <textarea
          value={profile.bio}
          onChange={e => onChange({ ...profile, bio: e.target.value })}
          rows={3}
          className="w-full border border-gray-200 rounded-lg
                     px-3 py-2 text-sm resize-none
                     focus:outline-none focus:ring-2
                     focus:ring-blue-300"
        />
      </div>
    </div>

    {/* Bouton sauvegarder */}
    <button
      onClick={onSave}
      disabled={saving}
      className={`mt-5 font-bold px-6 py-2.5 rounded-xl
                  cursor-pointer transition-colors
                  disabled:opacity-50
                  ${saved
                    ? 'bg-green-500 text-white'
                    : 'bg-[#1a2744] hover:bg-blue-900 text-white'
                  }`}
    >
      {saving ? '⏳ Sauvegarde...' : saved ? '✅ Sauvegardé !' : '💾 Sauvegarder'}
    </button>
  </div>
);

export default ProfileSection;