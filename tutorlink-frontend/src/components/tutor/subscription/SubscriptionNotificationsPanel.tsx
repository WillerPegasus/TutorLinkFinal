import { SubscriptionNotification } from '../../../types/subscription.types';

interface Props { notifications: SubscriptionNotification[]; }

const iconMap: Record<string, string> = {
  trial_ending_soon: '⏳',
  trial_expired: '🎁',
  payment_due: '💳',
  payment_success: '✅',
  payment_failed: '❌',
  account_suspended: '🚫',
};

const colorMap: Record<string, string> = {
  trial_ending_soon: 'bg-blue-50 border-blue-200',
  trial_expired: 'bg-orange-50 border-orange-200',
  payment_due: 'bg-yellow-50 border-yellow-200',
  payment_success: 'bg-green-50 border-green-200',
  payment_failed: 'bg-red-50 border-red-200',
  account_suspended: 'bg-red-50 border-red-200',
};

// Panneau des notifications d'abonnement
const SubscriptionNotificationsPanel = ({ notifications }: Props) => (
  <div className="bg-white rounded-2xl shadow-sm p-5">
    <h3 className="font-bold text-gray-700 mb-4">
      🔔 Notifications abonnement
    </h3>

    {notifications.length === 0 ? (
      <p className="text-gray-400 text-sm text-center py-4">
        Aucune notification
      </p>
    ) : (
      <div className="flex flex-col gap-3">
        {notifications.map(notif => (
          <div
            key={notif.id}
            className={`${colorMap[notif.type]} border rounded-xl p-3
                        flex gap-3 items-start
                        ${!notif.isRead ? 'ring-2 ring-blue-100' : ''}`}
          >
            <span className="text-xl flex-shrink-0">
              {iconMap[notif.type]}
            </span>
            <div className="flex-1">
              <p className="text-sm text-gray-700">{notif.message}</p>
              <p className="text-xs text-gray-400 mt-1">{notif.date}</p>
            </div>
            {/* Point non lu */}
            {!notif.isRead && (
              <div className="w-2 h-2 rounded-full bg-blue-500
                              flex-shrink-0 mt-1" />
            )}
          </div>
        ))}
      </div>
    )}
  </div>
);

export default SubscriptionNotificationsPanel;