import { TimeSlot } from '../../types/booking.types';

interface Props {
  slots: TimeSlot[];
  selectedSlot: TimeSlot | null;
  onSelect: (slot: TimeSlot) => void;
}

const DAYS = ['LUN', 'MAR', 'MER', 'JEU', 'VEN', 'SAM', 'DIM'];

const SlotCalendar = ({ slots, selectedSlot, onSelect }: Props) => (
  <div className="bg-white rounded-xl shadow-sm p-5">
    <h3 className="font-bold text-gray-700 mb-4">
      📅 Choisissez un créneau disponible
    </h3>

    {/* Grille jours de la semaine */}
    <div className="grid grid-cols-7 gap-2">

      {/* En-têtes jours */}
      {DAYS.map(day => (
        <div key={day} className="text-center">
          <p className="text-xs text-gray-400 font-semibold mb-2">{day}</p>

          {/* Créneaux du jour */}
          <div className="flex flex-col gap-1">
            {slots
              .filter(s => s.day === day)
              .map(slot => {
                const isSelected = selectedSlot?.id === slot.id;
                const isAvailable = slot.available;

                return (
                  <button
                    key={slot.id}
                    onClick={() => onSelect(slot)}
                    disabled={!isAvailable}
                    className={`text-xs py-1.5 px-1 rounded-lg
                      font-medium transition-colors cursor-pointer
                      ${isSelected
                        ? 'bg-[#1a2744] text-white'
                        : isAvailable
                          ? 'bg-blue-50 text-blue-700 hover:bg-blue-100 border border-blue-200'
                          : 'bg-gray-100 text-gray-300 cursor-not-allowed'
                      }`}
                  >
                    {slot.startTime}-{slot.endTime}
                  </button>
                );
              })}

            {/* Si pas de créneau ce jour */}
            {slots.filter(s => s.day === day).length === 0 && (
              <span className="text-gray-200 text-center text-sm">—</span>
            )}
          </div>
        </div>
      ))}
    </div>

    {/* Légende */}
    <div className="flex gap-4 mt-4 text-xs text-gray-500">
      <div className="flex items-center gap-1">
        <div className="w-3 h-3 rounded bg-blue-100 border border-blue-200" />
        Disponible
      </div>
      <div className="flex items-center gap-1">
        <div className="w-3 h-3 rounded bg-[#1a2744]" />
        Sélectionné
      </div>
      <div className="flex items-center gap-1">
        <div className="w-3 h-3 rounded bg-gray-100" />
        Indisponible
      </div>
    </div>

    {/* Message si pas de créneau sélectionné */}
    {!selectedSlot && (
      <div className="mt-3 bg-yellow-50 border border-yellow-200
                      rounded-lg px-4 py-2 text-xs text-yellow-700">
        ⚠️ Sélectionnez un créneau avant de confirmer.
      </div>
    )}
  </div>
);

export default SlotCalendar;