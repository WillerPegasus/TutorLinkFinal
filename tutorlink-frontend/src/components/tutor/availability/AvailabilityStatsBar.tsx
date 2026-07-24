import { AvailabilityStats } from '../../../types/availability.types';

interface Props { stats: AvailabilityStats; }

// Barre de statistiques en haut de la page
const AvailabilityStatsBar = ({ stats }: Props) => (
  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
    {[
      {
        value: stats.totalSlotsPerWeek,
        label: 'Créneaux / semaine',
        color: 'bg-blue-50 text-blue-800',
      },
      {
        value: `${stats.totalHoursPerWeek}h`,
        label: 'Heures / semaine',
        color: 'bg-green-50 text-green-800',
      },
      {
        value: `${stats.totalHoursPerMonth}h`,
        label: 'Heures / mois',
        color: 'bg-purple-50 text-purple-800',
      },
      {
        value: `${stats.maxMonthlyRevenue.toLocaleString()} F`,
        label: 'Revenu max possible',
        color: 'bg-yellow-50 text-yellow-800',
      },
    ].map(s => (
      <div key={s.label} className={`${s.color} rounded-xl p-4 text-center`}>
        <p className="text-2xl font-bold">{s.value}</p>
        <p className="text-xs font-medium mt-1">{s.label}</p>
      </div>
    ))}
  </div>
);

export default AvailabilityStatsBar;