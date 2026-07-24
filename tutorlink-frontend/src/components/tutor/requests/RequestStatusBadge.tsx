import { RequestStatus } from '../../../types/courseRequest.types';

interface Props { status: RequestStatus; }

const config: Record<RequestStatus, { label: string; className: string }> = {
  en_attente: { label: '⏳ En attente', className: 'bg-orange-100 text-orange-700' },
  accepte:    { label: '✅ Acceptée',   className: 'bg-green-100 text-green-700' },
  refuse:     { label: '❌ Refusée',    className: 'bg-red-100 text-red-700' },
};

const RequestStatusBadge = ({ status }: Props) => {
  const { label, className } = config[status];
  return (
    <span className={`${className} text-xs font-bold
                     px-2 py-1 rounded-full`}>
      {label}
    </span>
  );
};

export default RequestStatusBadge;