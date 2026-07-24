import { VerificationItem } from '../../types/tutorProfile.types';

interface Props { verifications: VerificationItem[]; }

const iconMap: Record<string, string> = {
  identite: '🪪',
  diplome: '📜',
  adresse: '📍',
};

// Panneau des éléments vérifiés par l'admin
const VerificationsPanel = ({ verifications }: Props) => (
  <div className="bg-white rounded-xl shadow-sm p-5">
    <h3 className="font-bold text-gray-700 mb-4">
      🛡️ Vérifications
    </h3>
    <div className="flex flex-col gap-3">
      {verifications.map(v => (
        <div key={v.type}
          className="flex items-center justify-between">
          <span className="text-sm text-gray-600 flex items-center gap-2">
            <span>{iconMap[v.type]}</span>
            {v.label}
          </span>
          <span className={`text-xs font-bold px-2 py-1 rounded-full
            ${v.verified
              ? 'bg-green-100 text-green-700'
              : 'bg-gray-100 text-gray-400'
            }`}>
            {v.verified ? 'VÉRIFIÉE' : 'EN ATTENTE'}
          </span>
        </div>
      ))}
    </div>
  </div>
);

export default VerificationsPanel;