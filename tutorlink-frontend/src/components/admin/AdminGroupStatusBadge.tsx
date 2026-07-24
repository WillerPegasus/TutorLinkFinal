import { AdminGroupStatus } from '../../types/adminGroup.types';

interface Props { status: AdminGroupStatus; }

const config: Record<AdminGroupStatus, { label: string; className: string }> = {
  actif:      { label: 'Actif',       className: 'bg-green-100 text-green-700' },
  complet:    { label: 'Complet',     className: 'bg-blue-100 text-blue-700' },
  suspendu:   { label: 'Suspendu',    className: 'bg-red-100 text-red-700' },
  en_attente: { label: 'En attente',  className: 'bg-orange-100 text-orange-700' },
};

const AdminGroupStatusBadge = ({ status }: Props) => {
  const { label, className } = config[status];
  return (
    <span className={`${className} text-xs font-bold px-2 py-1 rounded-full`}>
      {label}
    </span>
  );
};

export default AdminGroupStatusBadge;