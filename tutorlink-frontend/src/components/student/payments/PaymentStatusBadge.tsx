import { PaymentStatus } from '../../../types/studentPayment.types';

interface Props { status: PaymentStatus; }

// Badge statut de transaction
const config: Record<PaymentStatus, {
  label: string; className: string;
}> = {
  reussi:     { label: '✅ Réussi',     className: 'bg-green-100 text-green-700' },
  echoue:     { label: '❌ Échoué',     className: 'bg-red-100 text-red-700' },
  en_attente: { label: '⏳ En attente', className: 'bg-orange-100 text-orange-700' },
  rembourse:  { label: '↩️ Remboursé', className: 'bg-blue-100 text-blue-700' },
};

const PaymentStatusBadge = ({ status }: Props) => {
  const { label, className } = config[status];
  return (
    <span className={`${className} text-xs font-bold
                     px-2 py-1 rounded-full`}>
      {label}
    </span>
  );
};

export default PaymentStatusBadge;