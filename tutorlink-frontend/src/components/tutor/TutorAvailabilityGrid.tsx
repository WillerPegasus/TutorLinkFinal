import { useNavigate } from 'react-router-dom';
import { AvailabilitySlot } from '../../types/tutor.types';

interface Props { slots: AvailabilitySlot[]; }

const DAYS = ['LUN', 'MAR', 'MER', 'JEU', 'VEN', 'SAM', 'DIM'];

// Grille de disponibilités hebdomadaires — lecture seule sur le dashboard
const TutorAvailabilityGrid = ({ slots }: Props) => {
  const navigate = useNavigate();

  return (
    <div className="bg-white rounded-xl shadow-sm p-5">

      {/* En-tête */}
      <div className="flex justify-between items-center mb-4">
        <h3 className="font-bold text-gray-700">
          📅 Mes disponibilités cette semaine
        </h3>
        <button
          onClick={() => navigate('/repetiteur/disponibilites')}
          className="text-xs border border-gray-200 text-gray-500
                     px-3 py-1.5 rounded-lg hover:bg-gray-50
                     cursor-pointer transition-colors"
        >
          ✏️ Modifier
        </button>
      </div>

      {/* Grille jours */}
      <div className="grid grid-cols-7 gap-2">
        {DAYS.map(day => (
          <div key={day} className="text-center">
            <p className="text-xs text-gray-400 font-semibold mb-2">{day}</p>
            <div className="flex flex-col gap-1">
              {slots
                .filter(s => s.day === day)
                .map((slot, i) => (
                  <div
                    key={i}
                    className={`text-xs py-1.5 px-1 rounded-lg font-medium
                      ${slot.available
                        ? 'bg-blue-50 text-blue-700 border border-blue-200'
                        : 'bg-gray-100 text-gray-300'
                      }`}
                  >
                    {slot.startTime}-{slot.endTime}
                  </div>
                ))}
              {slots.filter(s => s.day === day).length === 0 && (
                <span className="text-gray-200 text-sm text-center">—</span>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default TutorAvailabilityGrid;