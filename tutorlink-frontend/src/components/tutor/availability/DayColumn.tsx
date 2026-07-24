import { DayAvailability, TimeSlotOption } from '../../../types/availability.types';

interface Props {
  day: DayAvailability;
  dayIndex: number;
  timeSlots: TimeSlotOption[];
  onToggle: (dayIndex: number, slotId: string) => void;
  onSelectAll: (dayIndex: number) => void;
  onClear: (dayIndex: number) => void;
}

// Colonne d'un jour avec ses créneaux cliquables
const DayColumn = ({
  day, dayIndex, timeSlots,
  onToggle, onSelectAll, onClear
}: Props) => {
  const availableCount = day.slots.filter(s => s.available).length;

  return (
    <div className="flex flex-col gap-2">

      {/* Nom du jour + compteur */}
      <div className="text-center">
        <p className="font-bold text-gray-700 text-sm">{day.label}</p>
        <p className="text-xs text-gray-400">
          {availableCount}/{timeSlots.length} créneaux
        </p>
      </div>

      {/* Créneaux cliquables */}
      {timeSlots.map(slot => {
        const daySlot = day.slots.find(s => s.slotId === slot.id);
        const isAvailable = daySlot?.available ?? false;

        return (
          <button
            key={slot.id}
            onClick={() => onToggle(dayIndex, slot.id)}
            className={`py-2 px-1 rounded-lg text-xs font-medium
                        transition-all cursor-pointer border-2
                        ${isAvailable
                          ? 'bg-[#1a2744] text-white border-[#1a2744] shadow-sm'
                          : 'bg-white text-gray-300 border-gray-100 hover:border-blue-200 hover:text-blue-400'
                        }`}
          >
            {slot.label}
          </button>
        );
      })}

      {/* Boutons Tout / Aucun */}
      <div className="flex gap-1 mt-1">
        <button
          onClick={() => onSelectAll(dayIndex)}
          className="flex-1 text-xs text-blue-600 hover:text-blue-800
                     border border-blue-200 rounded py-1 cursor-pointer
                     hover:bg-blue-50 transition-colors"
        >
          Tout
        </button>
        <button
          onClick={() => onClear(dayIndex)}
          className="flex-1 text-xs text-gray-400 hover:text-gray-600
                     border border-gray-200 rounded py-1 cursor-pointer
                     hover:bg-gray-50 transition-colors"
        >
          Aucun
        </button>
      </div>
    </div>
  );
};

export default DayColumn;