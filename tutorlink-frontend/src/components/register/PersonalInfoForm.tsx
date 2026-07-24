import { BaseRegisterData } from '../../types/register.types';

interface Props {
  data: BaseRegisterData;
  onChange: (d: BaseRegisterData) => void;
  errors: Record<string, string>;
  role: string | null;
}

const QUARTIERS = [
  'Centre Dschang', 'Quartier Foto', 'Ngui Dschang',
  'Bafoussam Road', 'Tsinkop', 'Foréké','Tchouale'
];

const LEVELS = [
  'CM1-CM2', '6ème-5ème', '4ème-3ème',
  'Seconde', 'Première', 'Terminale C',
  'Terminale D', 'Terminale A',
];

// Étape 2 — Informations personnelles communes
const PersonalInfoForm = ({ data, onChange, errors, role }: Props) => (
  <div className="flex flex-col gap-4">
    <div>
      <h2 className="text-xl font-bold text-gray-800 mb-1">
        Créer votre compte
      </h2>
      <p className="text-gray-400 text-sm">
        Rejoignez la communauté TutorLink Dschang.
      </p>
    </div>

    {/* Prénom + Nom */}
    <div className="grid grid-cols-2 gap-3">
      <div>
        <label className="text-xs text-gray-500 font-semibold
                          uppercase mb-1 block">
          Prénom
        </label>
        <input
          value={data.firstName}
          onChange={e => onChange({ ...data, firstName: e.target.value })}
          placeholder="Kamga"
          className={`w-full border rounded-lg px-3 py-2.5 text-sm
                      focus:outline-none focus:ring-2 focus:ring-blue-300
                      ${errors.firstName
                        ? 'border-red-300'
                        : 'border-gray-200'
                      }`}
        />
        {errors.firstName && (
          <p className="text-red-500 text-xs mt-0.5">{errors.firstName}</p>
        )}
      </div>
      <div>
        <label className="text-xs text-gray-500 font-semibold
                          uppercase mb-1 block">
          Nom
        </label>
        <input
          value={data.lastName}
          onChange={e => onChange({ ...data, lastName: e.target.value })}
          placeholder="Eric"
          className={`w-full border rounded-lg px-3 py-2.5 text-sm
                      focus:outline-none focus:ring-2 focus:ring-blue-300
                      ${errors.lastName
                        ? 'border-red-300'
                        : 'border-gray-200'
                      }`}
        />
        {errors.lastName && (
          <p className="text-red-500 text-xs mt-0.5">{errors.lastName}</p>
        )}
      </div>
    </div>

    {/* Téléphone */}
    <div>
      <label className="text-xs text-gray-500 font-semibold
                        uppercase mb-1 block">
        Téléphone (Mobile Money)
      </label>
      <input
        type="tel"
        value={data.phone}
        onChange={e => onChange({ ...data, phone: e.target.value })}
        placeholder="6XX XX XX XX"
        maxLength={9}
        className={`w-full border rounded-lg px-3 py-2.5 text-sm
                    focus:outline-none focus:ring-2 focus:ring-blue-300
                    ${errors.phone ? 'border-red-300' : 'border-gray-200'}`}
      />
      {errors.phone && (
        <p className="text-red-500 text-xs mt-0.5">{errors.phone}</p>
      )}
    </div>

    {/* Email */}
    <div>
      <label className="text-xs text-gray-500 font-semibold
                        uppercase mb-1 block">
        Email
      </label>
      <input
        type="email"
        value={data.email}
        onChange={e => onChange({ ...data, email: e.target.value })}
        placeholder="exemple@email.com"
        className={`w-full border rounded-lg px-3 py-2.5 text-sm
                    focus:outline-none focus:ring-2 focus:ring-blue-300
                    ${errors.email ? 'border-red-300' : 'border-gray-200'}`}
      />
      {errors.email && (
        <p className="text-red-500 text-xs mt-0.5">{errors.email}</p>
      )}
    </div>

    {/* Niveau — uniquement pour élève/parent */}
    {role === 'ELEVE_PARENT' && (
      <div>
        <label className="text-xs text-gray-500 font-semibold
                          uppercase mb-1 block">
          Niveau de l'élève
        </label>
        <select
          className="w-full border border-gray-200 rounded-lg
                     px-3 py-2.5 text-sm focus:outline-none
                     focus:ring-2 focus:ring-blue-300"
        >
          <option value="">Choisir un niveau</option>
          {LEVELS.map(l => (
            <option key={l} value={l}>{l}</option>
          ))}
        </select>
      </div>
    )}

    {/* Quartier */}
    <div>
      <label className="text-xs text-gray-500 font-semibold
                        uppercase mb-1 block">
        Quartier à Dschang
      </label>
      <select
        value={data.quartier}
        onChange={e => onChange({ ...data, quartier: e.target.value })}
        className={`w-full border rounded-lg px-3 py-2.5 text-sm
                    focus:outline-none focus:ring-2 focus:ring-blue-300
                    ${errors.quartier
                      ? 'border-red-300'
                      : 'border-gray-200'
                    }`}
      >
        <option value="">Choisir un quartier</option>
        {QUARTIERS.map(q => (
          <option key={q} value={q}>{q}</option>
        ))}
      </select>
      {errors.quartier && (
        <p className="text-red-500 text-xs mt-0.5">{errors.quartier}</p>
      )}
    </div>

    {/* Mot de passe + confirmation */}
    <div className="grid grid-cols-2 gap-3">
      <div>
        <label className="text-xs text-gray-500 font-semibold
                          uppercase mb-1 block">
          Mot de passe
        </label>
        <input
          type="password"
          value={data.password}
          onChange={e => onChange({ ...data, password: e.target.value })}
          placeholder="Min. 8 caractères"
          className={`w-full border rounded-lg px-3 py-2.5 text-sm
                      focus:outline-none focus:ring-2 focus:ring-blue-300
                      ${errors.password
                        ? 'border-red-300'
                        : 'border-gray-200'
                      }`}
        />
        {errors.password && (
          <p className="text-red-500 text-xs mt-0.5">{errors.password}</p>
        )}
      </div>
      <div>
        <label className="text-xs text-gray-500 font-semibold
                          uppercase mb-1 block">
          Confirmer
        </label>
        <input
          type="password"
          value={data.confirmPassword}
          onChange={e => onChange({ ...data, confirmPassword: e.target.value })}
          placeholder="Répéter le mot de passe"
          className={`w-full border rounded-lg px-3 py-2.5 text-sm
                      focus:outline-none focus:ring-2 focus:ring-blue-300
                      ${errors.confirmPassword
                        ? 'border-red-300'
                        : 'border-gray-200'
                      }`}
        />
        {errors.confirmPassword && (
          <p className="text-red-500 text-xs mt-0.5">
            {errors.confirmPassword}
          </p>
        )}
      </div>
    </div>

    {/* CGU */}
    <div>
      <div className="flex items-start gap-2">
        <input
          type="checkbox"
          id="cgu"
          checked={data.acceptCGU}
          onChange={e => onChange({ ...data, acceptCGU: e.target.checked })}
          className="mt-0.5 w-4 h-4 accent-blue-800 cursor-pointer"
        />
        <label htmlFor="cgu" className="text-sm text-gray-600 cursor-pointer">
          J'accepte les{' '}
          <span className="text-blue-600 underline cursor-pointer">
            CGU et la politique de confidentialité
          </span>
        </label>
      </div>
      {errors.acceptCGU && (
        <p className="text-red-500 text-xs mt-0.5">{errors.acceptCGU}</p>
      )}
    </div>
  </div>
);

export default PersonalInfoForm;