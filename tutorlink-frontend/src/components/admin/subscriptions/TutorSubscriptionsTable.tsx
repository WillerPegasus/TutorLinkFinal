import { AdminTutorSubscription } from '../../../types/adminSubscription.types';
import AdminSubscriptionStatusBadge from './AdminSubscriptionStatusBadge';

interface Props {
  subscriptions: AdminTutorSubscription[];
  onActivate: (tutorId: string) => void;
  onSuspend: (tutorId: string) => void;
  onNotify: (tutorId: string) => void;
}

const TutorSubscriptionsTable = ({
  subscriptions, onActivate, onSuspend, onNotify
}: Props) => (
  <div className="bg-white rounded-2xl shadow-sm overflow-hidden">
    <table className="w-full text-sm">
      <thead>
        <tr className="bg-[#1a2744] text-white text-xs uppercase">
          {['Répétiteur', 'Matière / Quartier', 'Statut',
            'Jours restants', 'Total payé', 'Dernier paiement',
            'Auto-renew', 'Actions'].map(h => (
            <th key={h} className="text-left px-4 py-3 font-semibold">
              {h}
            </th>
          ))}
        </tr>
      </thead>
      <tbody>
        {subscriptions.length === 0 ? (
          <tr>
            <td colSpan={8} className="text-center py-10 text-gray-400">
              Aucun abonnement trouvé
            </td>
          </tr>
        ) : subscriptions.map((t, i) => (
          <tr
            key={t.id}
            className={`border-t border-gray-50
              ${i % 2 === 0 ? 'bg-white' : 'bg-gray-50/40'}`}
          >
            {/* Répétiteur */}
            <td className="px-4 py-3">
              <p className="font-medium text-gray-800">{t.tutorName}</p>
              <p className="text-xs text-gray-400">{t.tutorEmail}</p>
              <p className="text-xs text-gray-400">{t.tutorPhone}</p>
            </td>

            {/* Matière / Quartier */}
            <td className="px-4 py-3">
              <p className="text-gray-700">{t.subject}</p>
              <p className="text-xs text-gray-400">{t.quartier}</p>
            </td>

            {/* Statut */}
            <td className="px-4 py-3">
              <AdminSubscriptionStatusBadge status={t.status} />
              {t.isTrialPeriod && (
                <p className="text-xs text-blue-500 mt-1">Essai gratuit</p>
              )}
            </td>

            {/* Jours restants */}
            <td className="px-4 py-3">
              <p className={`font-bold text-sm
                ${t.daysRemaining <= 5
                  ? 'text-red-500'
                  : t.daysRemaining <= 10
                    ? 'text-orange-500'
                    : 'text-green-600'
                }`}>
                {t.daysRemaining}j
              </p>
              <p className="text-xs text-gray-400">
                Fin : {t.currentPeriodEnd}
              </p>
            </td>

            {/* Total payé */}
            <td className="px-4 py-3">
              <p className="font-bold text-gray-800">
                {t.totalPaid.toLocaleString()} F
              </p>
              <p className="text-xs text-gray-400">
                {t.paymentsCount} paiement(s)
              </p>
            </td>

            {/* Dernier paiement */}
            <td className="px-4 py-3 text-gray-500 text-xs">
              {t.lastPaymentDate || '—'}
            </td>

            {/* Auto-renew */}
            <td className="px-4 py-3">
              <span className={`text-xs font-bold px-2 py-0.5 rounded-full
                ${t.autoRenew
                  ? 'bg-green-100 text-green-700'
                  : 'bg-gray-100 text-gray-500'
                }`}>
                {t.autoRenew ? '🔄 Oui' : '—'}
              </span>
            </td>

            {/* Actions */}
            <td className="px-4 py-3">
              <div className="flex flex-col gap-1">
                {t.status === 'suspended' && (
                  <button
                    onClick={() => onActivate(t.tutorId)}
                    className="bg-green-600 hover:bg-green-700 text-white
                               text-xs font-bold px-2 py-1 rounded
                               cursor-pointer"
                  >
                    ✅ Activer
                  </button>
                )}
                {t.status === 'active' && (
                  <button
                    onClick={() => onSuspend(t.tutorId)}
                    className="bg-orange-500 hover:bg-orange-600 text-white
                               text-xs font-bold px-2 py-1 rounded
                               cursor-pointer"
                  >
                    ⏸ Suspendre
                  </button>
                )}
                <button
                  onClick={() => onNotify(t.tutorId)}
                  className="border border-blue-200 text-blue-600
                             text-xs px-2 py-1 rounded cursor-pointer
                             hover:bg-blue-50"
                >
                  📨 Rappel SMS
                </button>
              </div>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  </div>
);

export default TutorSubscriptionsTable;