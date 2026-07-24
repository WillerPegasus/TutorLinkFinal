import { BookingTutor, TimeSlot } from '../../types/booking.types';

interface Props {
  tutor: BookingTutor;
  selectedSlot: TimeSlot | null;
  duration: number;
  estimatedAmount: number;
  loading: boolean;
  submitted: boolean;
  onConfirm: () => void;
}

const TutorBookingCard = ({
  tutor, selectedSlot, duration,
  estimatedAmount, loading, submitted, onConfirm,
}: Props) => (
  <div className="bg-[#1a2744] text-white rounded-xl p-5
                  flex flex-col gap-4 sticky top-6">

    <div className="flex items-center gap-3">
      <div className="w-14 h-14 rounded-full bg-yellow-400
                      flex items-center justify-center text-2xl flex-shrink-0">
        👨‍🏫
      </div>
      <div>
        <h3 className="font-bold text-base">{tutor.name}</h3>
        <p className="text-blue-200 text-xs">
          {tutor.subject} · {tutor.level}
        </p>
        <p className="text-yellow-400 text-xs font-bold mt-0.5">
          ★ {tutor.rating} ({tutor.reviewCount} avis)
        </p>
      </div>
    </div>

    <div className="border-t border-blue-700" />

    <div className="flex flex-col gap-2 text-sm">
      <div className="flex justify-between">
        <span className="text-blue-300">Lieu</span>
        <span>📍 {tutor.quartier}</span>
      </div>
      {selectedSlot && (
        <div className="flex justify-between">
          <span className="text-blue-300">Créneau</span>
          <span>{selectedSlot.day} · {selectedSlot.startTime}-{selectedSlot.endTime}</span>
        </div>
      )}
      <div className="flex justify-between">
        <span className="text-blue-300">Durée</span>
        <span>{duration}h</span>
      </div>
      <div className="flex justify-between">
        <span className="text-blue-300">Tarif</span>
        <span className="font-bold text-yellow-400">
          {tutor.hourlyPrice.toLocaleString()} FCFA/h
        </span>
      </div>
    </div>

    <div className="border-t border-blue-700" />

    <div className="bg-blue-800 rounded-xl p-3">
      <p className="text-xs text-blue-300 mb-1">Montant estimatif</p>
      <p className="text-xl font-bold text-yellow-400">
        {estimatedAmount.toLocaleString()} FCFA
      </p>
      <p className="text-xs text-blue-300 mt-1">
        Paiement à régler directement avec le répétiteur
      </p>
    </div>

    {submitted ? (
      <div className="bg-green-500 rounded-xl p-3 text-center">
        <p className="font-bold text-sm">✅ Demande envoyée !</p>
        <p className="text-xs mt-1">Redirection...</p>
      </div>
    ) : (
      <button
        onClick={onConfirm}
        disabled={loading || !selectedSlot}
        className="w-full bg-yellow-400 hover:bg-yellow-300
                   text-gray-900 font-bold py-3 rounded-xl
                   cursor-pointer transition-colors
                   disabled:opacity-40 disabled:cursor-not-allowed text-sm"
      >
        {loading ? '⏳ Envoi...' : '📅 Envoyer ma demande de cours'}
      </button>
    )}

    <p className="text-xs text-blue-300 text-center">
      Le répétiteur confirme votre demande sous 24h.
    </p>
  </div>
);

export default TutorBookingCard;
