import { PrivacySettings } from '../../../types/studentSettings.types';
import ToggleRow from './ToggleRow';

interface Props {
  settings: PrivacySettings;
  onToggle: (key: keyof PrivacySettings) => void;
  onDeleteAccount: () => void;
}

const PrivacySection = ({ settings, onToggle, onDeleteAccount }: Props) => (
  <div className="flex flex-col gap-5">

    {/* Confidentialité */}
    <div className="bg-white rounded-xl shadow-sm p-6">
      <h3 className="font-bold text-gray-700 mb-2">
        🛡️ Confidentialité
      </h3>
      <p className="text-xs text-gray-400 mb-4">
        Contrôlez la visibilité de vos informations.
      </p>

      <ToggleRow
        label="Profil visible aux répétiteurs"
        description="Les répétiteurs peuvent voir votre profil complet"
        checked={settings.showProfileToTutors}
        onToggle={() => onToggle('showProfileToTutors')}
      />
      <ToggleRow
        label="Apparaître dans les avis publics"
        description="Votre nom est visible sur vos avis publiés"
        checked={settings.showInReviews}
        onToggle={() => onToggle('showInReviews')}
      />
      <ToggleRow
        label="Autoriser l'export de mes données"
        description="Conforme au RGPD — exportez vos données à tout moment"
        checked={settings.allowDataExport}
        onToggle={() => onToggle('allowDataExport')}
      />
    </div>

    {/* Zone danger */}
    <div className="bg-red-50 border border-red-200 rounded-xl p-6">
      <h3 className="font-bold text-red-700 mb-2">
        ⚠️ Zone de danger
      </h3>
      <p className="text-xs text-red-500 mb-4">
        La suppression de votre compte est définitive et irréversible.
        Toutes vos données, réservations et avis seront supprimés.
      </p>
      <button
        onClick={onDeleteAccount}
        className="bg-red-600 hover:bg-red-700 text-white
                   font-bold px-5 py-2.5 rounded-xl
                   cursor-pointer transition-colors text-sm"
      >
        🗑 Supprimer mon compte
      </button>
    </div>
  </div>
);

export default PrivacySection;