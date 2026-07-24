import { useAvailability, TIME_SLOTS } from '../../hooks/useAvailability';
import AvailabilityStatsBar from '../../components/tutor/availability/AvailabilityStatsBar';
import AvailabilityGrid from '../../components/tutor/availability/AvailabilityGrid';

const TutorAvailabilityPage = () => {
  const {
    availability, stats,
    saving, saved,
    toggleSlot, selectAllDay, clearDay, handleSave,
  } = useAvailability();

  return (
    <div className="flex flex-col gap-6">

      {/* Titre + bouton sauvegarder */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-bold text-gray-800">
            📅 Mes disponibilités
          </h2>
          <p className="text-gray-400 text-sm mt-1">
            Cliquez sur un créneau pour le rendre disponible ou indisponible.
          </p>
        </div>

        {/* Bouton sauvegarder */}
        <button
          onClick={handleSave}
          disabled={saving}
          className={`font-bold px-6 py-2.5 rounded-xl
                      cursor-pointer transition-colors
                      disabled:opacity-50 disabled:cursor-not-allowed
                      ${saved
                        ? 'bg-green-500 text-white'
                        : 'bg-[#1a2744] hover:bg-blue-900 text-white'
                      }`}
        >
          {saving ? '⏳ Sauvegarde...' : saved ? '✅ Sauvegardé !' : '💾 Sauvegarder'}
        </button>
      </div>

      {/* Statistiques */}
      <AvailabilityStatsBar stats={stats} />

      {/* Grille des disponibilités */}
      <AvailabilityGrid
        availability={availability}
        timeSlots={TIME_SLOTS}
        onToggle={toggleSlot}
        onSelectAll={selectAllDay}
        onClear={clearDay}
      />
    </div>
  );
};

export default TutorAvailabilityPage;