import { AdminGroupSubscription } from '../../../types/adminSubscription.types';
import AdminSubscriptionStatusBadge from './AdminSubscriptionStatusBadge';

interface Props {
  subscriptions: AdminGroupSubscription[];
  onActivate: (groupId: string) => void;
  onSuspend: (groupId: string) => void;
  onNotify: (groupId: string) => void;
}

const GroupSubscriptionsTable = ({
  subscriptions, onActivate, onSuspend, onNotify
}: Props) => (
  <div className="bg-white rounded-2xl shadow-sm overflow-hidden">
    <table className="w-full text-sm">
      <thead>
        <tr className="bg-[#1a2744] text-white text-xs uppercase">
          {['Groupe', 'Admin (répétiteur)', 'Places',
            'Statut', 'Jours restants', 'Total payé',
            'Dernier paiement', 'Actions'].map(h => (
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
              Aucun abonnement groupe trouvé
            </td>
          </tr>
        ) : subscriptions.map((g, i) => (
          <tr
            key={g.id}
            className={`border-t border-gray-50
              ${i % 2 === 0 ? 'bg-white' : 'bg-gray-50/40'}`}
          >
            {/* Groupe */}
            <td className="px-4 py-3">
              <p className="font-medium text-gray-800">{g.groupName}</p>
              <p className="text-xs text-blue-500">{g.subject}</p>
            </td>

            {/* Admin répétiteur */}
            <td className="px-4 py-3 text-gray-600">
              {g.tutorName}
            </td>

            {/* Places */}
            <td className="px-4 py-3">
              <p className="font-medium text-gray-700">
                {g.currentMembers}/{g.maxMembers}
              </p>
              <div className="bg-gray-100 rounded-full h-1.5 mt-1 w-16">
                <div
                  className="bg-blue-500 h-1.5 rounded-full"
                  style={{ width: `${(g.currentMembers / g.maxMembers) * 100}%` }}
                />
              </div>
            </td>

            {/* Statut */}
            <td className="px-4 py-3">
              <AdminSubscriptionStatusBadge status={g.status} />
              {g.isTrialPeriod && (
                <p className="text-xs text-blue-500 mt-1">1 mois gratuit</p>
              )}
            </td>

            {/* Jours restants */}
            <td className="px-4 py-3">
              <p className={`font-bold text-sm
                ${g.daysRemaining <= 5
                  ? 'text-red-500'
                  : g.daysRemaining <= 10
                    ? 'text-orange-500'
                    : 'text-green-600'
                }`}>
                {g.daysRemaining}j
              </p>
              <p className="text-xs text-gray-400">
                Fin : {g.currentPeriodEnd}
              </p>
            </td>

            {/* Total payé */}
            <td className="px-4 py-3">
              <p className="font-bold text-gray-800">
                {g.totalPaid.toLocaleString()} F
              </p>
              <p className="text-xs text-gray-400">
                {g.paymentsCount} paiement(s)
              </p>
            </td>

            {/* Dernier paiement */}
            <td className="px-4 py-3 text-gray-500 text-xs">
              {g.lastPaymentDate || '—'}
            </td>

            {/* Actions */}
            <td className="px-4 py-3">
              <div className="flex flex-col gap-1">
                {g.status === 'suspended' && (
                  <button
                    onClick={() => onActivate(g.groupId)}
                    className="bg-green-600 hover:bg-green-700 text-white
                               text-xs font-bold px-2 py-1 rounded
                               cursor-pointer"
                  >
                    ✅ Activer
                  </button>
                )}
                {g.status === 'active' && (
                  <button
                    onClick={() => onSuspend(g.groupId)}
                    className="bg-orange-500 hover:bg-orange-600 text-white
                               text-xs font-bold px-2 py-1 rounded
                               cursor-pointer"
                  >
                    ⏸ Suspendre
                  </button>
                )}
                <button
                  onClick={() => onNotify(g.groupId)}
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

export default GroupSubscriptionsTable;