import { DayAvailability, TimeSlotOption } from '../../../types/availability.types';
import DayColumn from './DayColumn';

interface Props {
  availability: DayAvailability[];
  timeSlots: TimeSlotOption[];
  onToggle: (dayIndex: number, slotId: string) => void;
  onSelectAll: (dayIndex: number) => void;
  onClear: (dayIndex: number) => void;
}

// Grille complète des disponibilités — 7 colonnes
const AvailabilityGrid = ({
  availability, timeSlots,
  onToggle, onSelectAll, onClear
}: Props) => (
  <div className="bg-white rounded-xl shadow-sm p-6">

    {/* Légende */}
    <div className="flex gap-4 mb-5 text-xs text-gray-500">
      <div className="flex items-center gap-1">
        <div className="w-4 h-4 rounded bg-[#1a2744]" />
        Disponible — cliquez pour désactiver
      </div>
      <div className="flex items-center gap-1">
        <div className="w-4 h-4 rounded bg-white border-2 border-gray-100" />
        Indisponible — cliquez pour activer
      </div>
    </div>

    {/* Grille 7 colonnes */}
    <div className="grid grid-cols-7 gap-3">
      {availability.map((day, i) => (
        <DayColumn
          key={day.day}
          day={day}
          dayIndex={i}
          timeSlots={timeSlots}
          onToggle={onToggle}
          onSelectAll={onSelectAll}
          onClear={onClear}
        />
      ))}
    </div>

    {/* Note importante */}
    <div className="mt-5 bg-yellow-50 border border-yellow-200
                    rounded-lg px-4 py-3 text-xs text-yellow-700">
      ⚠️ Si vous supprimez un créneau déjà réservé par un élève,
      celui-ci sera automatiquement notifié et remboursé.
    </div>
  </div>
);

export default AvailabilityGrid;