import { StudentCourseStatus } from '../../../types/studentReservation.types';

interface Props { status: StudentCourseStatus; }

const config: Record<StudentCourseStatus, {
  label: string; className: string;
}> = {
  confirme:   { label: '✅ Confirmé',   className: 'bg-blue-100 text-blue-700' },
  en_attente: { label: '⏳ En attente', className: 'bg-orange-100 text-orange-700' },
  termine:    { label: '🏁 Terminé',    className: 'bg-gray-100 text-gray-600' },
  annule:     { label: '❌ Annulé',     className: 'bg-red-100 text-red-700' },
};

const ReservationStatusBadge = ({ status }: Props) => {
  const { label, className } = config[status];
  return (
    <span className={`${className} text-xs font-bold
                     px-2 py-1 rounded-full`}>
      {label}
    </span>
  );
};

export default ReservationStatusBadge;