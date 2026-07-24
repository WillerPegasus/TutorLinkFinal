// ============================================================
// Carte affichant les informations du répétiteur concerné
// par la réservation confirmée
// ============================================================

import React from "react";
import type { BookingConfirmTutor } from "../../types/bookingConfirm.types";

interface Props {
  tutor: BookingConfirmTutor;    // Données du répétiteur
  onViewProfile: () => void;     // Lien vers le profil
}

const ConfirmTutorCard: React.FC<Props> = ({ tutor, onViewProfile }) => {
  return (
    <div className="flex items-center gap-4 p-4
                    bg-gray-50 border border-gray-200 rounded-xl">

      {/* Avatar initiales ou photo */}
      <div
        className="
          w-14 h-14 rounded-full bg-[#f5a623]
          flex items-center justify-center
          text-[#1a2744] font-bold text-lg
          flex-shrink-0 border-2 border-white shadow-sm
        "
      >
        {tutor.avatarUrl ? (
          <img
            src={tutor.avatarUrl}
            alt={`${tutor.firstName} ${tutor.lastName}`}
            className="w-full h-full rounded-full object-cover"
          />
        ) : (
          `${tutor.firstName[0]}${tutor.lastName[0]}`
        )}
      </div>

      {/* Infos répétiteur */}
      <div className="flex-1 min-w-0">
        <p className="font-bold text-[#1a2744] text-base leading-tight">
          {tutor.firstName} {tutor.lastName}
        </p>
        <p className="text-sm text-gray-500 mt-0.5">
          {tutor.subject} · {tutor.level}
        </p>
        <p className="text-xs text-gray-400 flex items-center gap-1 mt-0.5">
          <span>📍</span>
          {tutor.location}
        </p>
      </div>

      {/* Lien profil */}
      <button
        type="button"
        onClick={onViewProfile}
        className="
          text-xs text-[#1a2744] font-semibold
          underline hover:no-underline
          transition-all cursor-pointer
          flex-shrink-0
        "
      >
        Voir profil
      </button>
    </div>
  );
};

export default ConfirmTutorCard;