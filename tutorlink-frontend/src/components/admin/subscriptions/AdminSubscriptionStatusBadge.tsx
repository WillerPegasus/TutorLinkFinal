import { AdminSubscriptionStatus } from '../../../types/adminSubscription.types';

interface Props { status: AdminSubscriptionStatus; }

const config: Record<AdminSubscriptionStatus, {
  label: string; className: string;
}> = {
  trial:     { label: '🎁 Essai',     className: 'bg-blue-100 text-blue-700' },
  active:    { label: '✅ Actif',     className: 'bg-green-100 text-green-700' },
  grace:     { label: '⚠️ Grâce',    className: 'bg-orange-100 text-orange-700' },
  suspended: { label: '🚫 Suspendu', className: 'bg-red-100 text-red-700' },
  expired:   { label: '❌ Expiré',   className: 'bg-gray-100 text-gray-600' },
};

const AdminSubscriptionStatusBadge = ({ status }: Props) => {
  const { label, className } = config[status];
  return (
    <span className={`${className} text-xs font-bold
                     px-2 py-1 rounded-full`}>
      {label}
    </span>
  );
};

export default AdminSubscriptionStatusBadge;