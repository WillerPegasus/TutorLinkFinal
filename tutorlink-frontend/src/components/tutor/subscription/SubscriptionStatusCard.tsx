import { TutorSubscription, SubscriptionStatus } from '../../../types/subscription.types';

interface Props {
  subscription: TutorSubscription;
  onPay: () => void;
}

// Config couleurs et messages selon le statut
const statusConfig: Record<SubscriptionStatus, {
  label: string;
  className: string;
  bgClass: string;
  icon: string;
}> = {
  trial: {
    label: 'Essai gratuit',
    className: 'text-blue-700',
    bgClass: 'bg-blue-50 border-blue-200',
    icon: '🎁',
  },
  active: {
    label: 'Abonnement actif',
    className: 'text-green-700',
    bgClass: 'bg-green-50 border-green-200',
    icon: '✅',
  },
  grace: {
    label: 'Délai de grâce',
    className: 'text-orange-700',
    bgClass: 'bg-orange-50 border-orange-200',
    icon: '⚠️',
  },
  suspended: {
    label: 'Compte suspendu',
    className: 'text-red-700',
    bgClass: 'bg-red-50 border-red-200',
    icon: '🚫',
  },
  expired: {
    label: 'Abonnement expiré',
    className: 'text-red-700',
    bgClass: 'bg-red-50 border-red-200',
    icon: '❌',
  },
};

// Barre de progression des jours restants
const DaysProgressBar = ({
  daysRemaining, totalDays, status
}: {
  daysRemaining: number;
  totalDays: number;
  status: SubscriptionStatus;
}) => {
  const pct = Math.max(0, Math.min(100, (daysRemaining / totalDays) * 100));
  const barColor =
    status === 'suspended' || status === 'expired' ? 'bg-red-400'
    : daysRemaining <= 5 ? 'bg-red-400'
    : daysRemaining <= 10 ? 'bg-orange-400'
    : 'bg-green-500';

  return (
    <div>
      <div className="flex justify-between text-xs text-gray-500 mb-1">
        <span>{daysRemaining} jours restants</span>
        <span>{totalDays} jours au total</span>
      </div>
      <div className="bg-gray-100 rounded-full h-2">
        <div
          className={`${barColor} h-2 rounded-full transition-all`}
          style={{ width: `${pct}%` }}
        />
      </div>
    </div>
  );
};

const SubscriptionStatusCard = ({ subscription: s, onPay }: Props) => {
  const config = statusConfig[s.status];
  const totalDays = s.isTrialPeriod ? 60 : 30;

  return (
    <div className={`${config.bgClass} border rounded-2xl p-6`}>

      {/* En-tête statut */}
      <div className="flex justify-between items-start mb-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-2xl">{config.icon}</span>
            <span className={`font-bold text-lg ${config.className}`}>
              {config.label}
            </span>
          </div>
          <p className="text-gray-500 text-sm mt-1">
            {s.isTrialPeriod
              ? `Période d'essai gratuite — fin le ${s.trialEndDate}`
              : `Abonnement mensuel — renouvellement le ${s.currentPeriodEnd}`
            }
          </p>
        </div>
        {/* Prix */}
        <div className="text-right">
          <p className="text-2xl font-bold text-gray-800">
            {s.monthlyPrice.toLocaleString()} F
          </p>
          <p className="text-xs text-gray-400">/ mois</p>
        </div>
      </div>

      {/* Barre de progression */}
      <DaysProgressBar
        daysRemaining={s.daysRemaining}
        totalDays={totalDays}
        status={s.status}
      />

      {/* Alerte selon le statut */}
      {s.daysRemaining <= 10 && s.status !== 'suspended' && (
        <div className="mt-4 bg-orange-50 border border-orange-200
                        rounded-xl px-4 py-3 flex gap-2">
          <span className="text-orange-500 flex-shrink-0">⚠️</span>
          <p className="text-xs text-orange-700">
            {s.isTrialPeriod
              ? `Votre essai gratuit se termine dans ${s.daysRemaining} jours. Activez votre abonnement pour continuer à recevoir des élèves.`
              : `Votre abonnement expire dans ${s.daysRemaining} jours. Renouvelez maintenant pour éviter la suspension.`
            }
          </p>
        </div>
      )}

      {/* Message compte suspendu */}
      {s.status === 'suspended' && (
        <div className="mt-4 bg-red-50 border border-red-200
                        rounded-xl px-4 py-3">
          <p className="text-xs text-red-700 font-bold mb-1">
            🚫 Votre compte est suspendu
          </p>
          <p className="text-xs text-red-600">
            Vous ne pouvez plus recevoir de nouvelles réservations.
            Payez votre abonnement pour réactiver votre compte immédiatement.
          </p>
        </div>
      )}

      {/* Bouton payer */}
      {s.status !== 'active' && (
        <button
          onClick={onPay}
          className="w-full mt-5 bg-[#1a2744] hover:bg-blue-900
                     text-white font-bold py-3 rounded-xl
                     cursor-pointer transition-colors"
        >
          {s.status === 'suspended'
            ? '🔓 Réactiver mon compte — 3 000 FCFA'
            : s.isTrialPeriod
              ? '💳 Activer mon abonnement — 3 000 FCFA/mois'
              : '🔄 Renouveler mon abonnement — 3 000 FCFA'
          }
        </button>
      )}
    </div>
  );
};

export default SubscriptionStatusCard;