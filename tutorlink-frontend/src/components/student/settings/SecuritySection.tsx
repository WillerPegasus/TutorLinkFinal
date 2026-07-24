import { PasswordChangeData } from '../../../types/studentSettings.types';

interface Props {
  passwordData: PasswordChangeData;
  onChange: (d: PasswordChangeData) => void;
  onSubmit: () => void;
  error: string;
  success: boolean;
  saving: boolean;
}

// Section changement de mot de passe
const SecuritySection = ({
  passwordData, onChange, onSubmit,
  error, success, saving,
}: Props) => (
  <div className="bg-white rounded-xl shadow-sm p-6">
    <h3 className="font-bold text-gray-700 mb-5">
      🔒 Sécurité du compte
    </h3>

    <div className="flex flex-col gap-4 max-w-md">

      {/* Mot de passe actuel */}
      <div>
        <label className="text-xs text-gray-500 font-semibold
                          uppercase mb-1 block">
          Mot de passe actuel
        </label>
        <input
          type="password"
          value={passwordData.currentPassword}
          onChange={e => onChange({
            ...passwordData, currentPassword: e.target.value
          })}
          className="w-full border border-gray-200 rounded-lg
                     px-3 py-2 text-sm focus:outline-none
                     focus:ring-2 focus:ring-blue-300"
        />
      </div>

      {/* Nouveau mot de passe */}
      <div>
        <label className="text-xs text-gray-500 font-semibold
                          uppercase mb-1 block">
          Nouveau mot de passe
        </label>
        <input
          type="password"
          value={passwordData.newPassword}
          onChange={e => onChange({
            ...passwordData, newPassword: e.target.value
          })}
          placeholder="Min. 8 caractères"
          className="w-full border border-gray-200 rounded-lg
                     px-3 py-2 text-sm focus:outline-none
                     focus:ring-2 focus:ring-blue-300"
        />
      </div>

      {/* Confirmation */}
      <div>
        <label className="text-xs text-gray-500 font-semibold
                          uppercase mb-1 block">
          Confirmer le nouveau mot de passe
        </label>
        <input
          type="password"
          value={passwordData.confirmPassword}
          onChange={e => onChange({
            ...passwordData, confirmPassword: e.target.value
          })}
          className="w-full border border-gray-200 rounded-lg
                     px-3 py-2 text-sm focus:outline-none
                     focus:ring-2 focus:ring-blue-300"
        />
      </div>

      {/* Message erreur */}
      {error && (
        <p className="text-red-500 text-xs">{error}</p>
      )}

      {/* Message succès */}
      {success && (
        <p className="text-green-600 text-xs font-medium">
          ✅ Mot de passe modifié avec succès.
        </p>
      )}

      {/* Bouton */}
      <button
        onClick={onSubmit}
        disabled={saving}
        className="bg-[#1a2744] hover:bg-blue-900 text-white
                   font-bold py-2.5 rounded-xl cursor-pointer
                   transition-colors disabled:opacity-50"
      >
        {saving ? '⏳ Modification...' : '🔒 Modifier le mot de passe'}
      </button>
    </div>
  </div>
);

export default SecuritySection;