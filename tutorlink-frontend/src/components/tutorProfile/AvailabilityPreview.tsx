import { PublicAvailabilitySlot } from '../../types/tutorProfile.types';

interface Props {
  slots: PublicAvailabilitySlot[];
  selectedSlot: { day: string; startTime: string; endTime: string } | null;
  onSelect: (slot: { day: string; startTime: string; endTime: string }) => void;
  onBook: () => void;
}

const DAYS = ['LUN', 'MAR', 'MER', 'JEU', 'VEN', 'SAM', 'DIM'];

// Aperçu des disponibilités avec sélection rapide
const AvailabilityPreview = ({
  slots, selectedSlot, onSelect, onBook
}: Props) => (
  <div className="bg-white rounded-xl shadow-sm p-5">
    <h3 className="font-bold text-gray-700 mb-4">
      📅 Disponibilités cette semaine
    </h3>

    {/* Grille jours */}
    <div className="grid grid-cols-7 gap-1.5 mb-4">
      {DAYS.map(day => (
        <div key={day} className="text-center">
          <p className="text-xs text-gray-400 font-semibold mb-1.5">
            {day}
          </p>
          <div className="flex flex-col gap-1">
            {slots
              .filter(s => s.day === day)
              .map((slot, i) => {
                const isSelected =
                  selectedSlot?.day === day &&
                  selectedSlot?.startTime === slot.startTime;
                return (
                  <button
                    key={i}
                    onClick={() => slot.available && onSelect(slot)}
                    disabled={!slot.available}
                    className={`text-xs py-1 px-0.5 rounded-md
                      font-medium cursor-pointer transition-colors
                      ${isSelected
                        ? 'bg-[#1a2744] text-white'
                        : slot.available
                          ? 'bg-blue-50 text-blue-700 border border-blue-200 hover:bg-blue-100'
                          : 'bg-gray-50 text-gray-200 cursor-not-allowed'
                      }`}
                  >
                    {slot.startTime}
                  </button>
                );
              })}
            {slots.filter(s => s.day === day).length === 0 && (
              <span className="text-gray-200 text-xs">—</span>
            )}
          </div>
        </div>
      ))}
    </div>

    {/* Bouton choisir créneau */}
    <button
      onClick={onBook}
      className="w-full bg-[#1a2744] hover:bg-blue-900
                 text-white font-bold py-2.5 rounded-lg
                 cursor-pointer transition-colors text-sm"
    >
      Choisir un créneau →
    </button>
  </div>
);

export default AvailabilityPreview;