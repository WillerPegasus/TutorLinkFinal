import { SettingsSection } from '../../../types/studentSettings.types';

interface Props {
  activeSection: SettingsSection;
  onSelect: (section: SettingsSection) => void;
}

// Menu latéral des sections paramètres
const sections: { value: SettingsSection; label: string; icon: string }[] = [
  { value: 'profil',          label: 'Mon profil',         icon: '👤' },
  { value: 'securite',        label: 'Sécurité',           icon: '🔒' },
  { value: 'notifications',   label: 'Notifications',      icon: '🔔' },
  { value: 'confidentialite', label: 'Confidentialité',    icon: '🛡️' },
];

const SettingsSidebar = ({ activeSection, onSelect }: Props) => (
  <div className="bg-white rounded-xl shadow-sm p-3 w-56
                  flex-shrink-0 self-start">
    {sections.map(s => (
      <button
        key={s.value}
        onClick={() => onSelect(s.value)}
        className={`w-full text-left px-4 py-3 rounded-lg
                    text-sm font-medium cursor-pointer
                    transition-colors flex items-center gap-2
                    ${activeSection === s.value
                      ? 'bg-[#1a2744] text-white'
                      : 'text-gray-600 hover:bg-gray-50'
                    }`}
      >
        <span>{s.icon}</span>
        {s.label}
      </button>
    ))}
  </div>
);

export default SettingsSidebar;