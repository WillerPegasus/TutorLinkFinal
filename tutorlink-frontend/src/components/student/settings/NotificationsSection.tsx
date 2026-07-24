import { NotificationPreferences } from '../../../types/studentSettings.types';
import ToggleRow from './ToggleRow';

interface Props {
  prefs: NotificationPreferences;
  onToggle: (key: keyof NotificationPreferences) => void;
}

const NotificationsSection = ({ prefs, onToggle }: Props) => (
  <div className="bg-white rounded-xl shadow-sm p-6">
    <h3 className="font-bold text-gray-700 mb-2">
      🔔 Préférences de notifications
    </h3>
    <p className="text-xs text-gray-400 mb-4">
      Choisissez comment vous souhaitez être informé.
    </p>

    {/* Section Email */}
    <p className="text-xs text-gray-500 font-semibold uppercase mb-2 mt-4">
      📧 Email
    </p>
    <ToggleRow
      label="Confirmation de réservation"
      description="Recevoir un email quand un cours est confirmé"
      checked={prefs.emailReservation}
      onToggle={() => onToggle('emailReservation')}
    />
    <ToggleRow
      label="Nouveaux messages"
      description="Recevoir un email pour chaque nouveau message"
      checked={prefs.emailMessage}
      onToggle={() => onToggle('emailMessage')}
    />

    {/* Section SMS */}
    <p className="text-xs text-gray-500 font-semibold uppercase mb-2 mt-5">
      📱 SMS
    </p>
    <ToggleRow
      label="Rappel avant cours"
      description="SMS de rappel 1h avant chaque cours"
      checked={prefs.smsReminder}
      onToggle={() => onToggle('smsReminder')}
    />
    <ToggleRow
      label="Confirmation de paiement"
      description="SMS après chaque paiement Mobile Money"
      checked={prefs.smsPayment}
      onToggle={() => onToggle('smsPayment')}
    />

    {/* Section Push */}
    <p className="text-xs text-gray-500 font-semibold uppercase mb-2 mt-5">
      🔔 Navigateur
    </p>
    <ToggleRow
      label="Notifications push"
      description="Recevoir des notifications dans le navigateur"
      checked={prefs.pushNotifications}
      onToggle={() => onToggle('pushNotifications')}
    />
  </div>
);

export default NotificationsSection;