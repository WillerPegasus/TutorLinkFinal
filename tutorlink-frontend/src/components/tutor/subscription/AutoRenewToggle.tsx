interface Props {
  enabled: boolean;
  onToggle: () => void;
}

// Interrupteur renouvellement automatique
const AutoRenewToggle = ({ enabled, onToggle }: Props) => (
  <div className="bg-white rounded-2xl shadow-sm p-5">
    <div className="flex items-center justify-between">
      <div>
        <h3 className="font-bold text-gray-700">
          🔄 Renouvellement automatique
        </h3>
        <p className="text-xs text-gray-400 mt-1">
          {enabled
            ? 'Votre abonnement sera renouvelé automatiquement chaque mois via votre Mobile Money enregistré.'
            : 'Activez pour ne jamais manquer un renouvellement.'
          }
        </p>
      </div>
      {/* Toggle switch */}
      <button
        onClick={onToggle}
        className={`w-14 h-7 rounded-full relative cursor-pointer
                    transition-colors flex-shrink-0
                    ${enabled ? 'bg-[#1a2744]' : 'bg-gray-200'}`}
      >
        <div className={`w-6 h-6 bg-white rounded-full absolute top-0.5
                         transition-all shadow-sm
                         ${enabled ? 'left-7' : 'left-0.5'}`} />
      </button>
    </div>

    {/* Avertissement si désactivé */}
    {!enabled && (
      <p className="text-xs text-orange-600 mt-3">
        ⚠️ Sans renouvellement automatique, votre compte sera suspendu
        si vous oubliez de payer avant la date d'expiration.
      </p>
    )}
  </div>
);

export default AutoRenewToggle;