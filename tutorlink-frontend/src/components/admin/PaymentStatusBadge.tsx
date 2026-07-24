import { PaymentStatus } from '../../types/adminReservation.types';

interface Props { status: PaymentStatus; }

// Config couleurs + labels par statut de paiement
const config: Record<PaymentStatus, { label: string; className: string }> = {
  paye_mtn: {
    label: '✅ Payé MTN',
    className: 'bg-yellow-100 text-yellow-800',
  },
  paye_orange: {
    label: '✅ Payé Orange',
    className: 'bg-orange-100 text-orange-800',
  },
  en_attente: {
    label: '⏳ En attente',
    className: 'bg-gray-100 text-gray-600',
  },
  rembourse: {
    label: '↩️ Remboursé',
    className: 'bg-blue-100 text-blue-700',
  },
};

const PaymentStatusBadge = ({ status }: Props) => {
  const { label, className } = config[status];
  return (
    <span className={`${className} text-xs font-bold px-2 py-1 rounded-full`}>
      {label}
    </span>
  );
};

export default PaymentStatusBadge;