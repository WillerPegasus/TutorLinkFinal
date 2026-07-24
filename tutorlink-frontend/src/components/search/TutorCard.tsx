// ============================================================
// Carte d'un répétiteur dans la grille de recherche
// Reproduit fidèlement la maquette Page 2 :
// header bleu marine + corps avec bio, prix, boutons
// ============================================================

import React from "react";
import type { SearchTutor } from "../../types/searchs.types";
import TutorRating from "./TutorRating";
import TutorVerifiedBadge from "./TutorVerifiedBadge";

interface Props {
  tutor: SearchTutor;              // Données du répétiteur
  onViewProfile: (id: string) => void; // Clic sur "Voir profil"
  onBook: (id: string) => void;        // Clic sur "Réserver"
}

const TutorCard: React.FC<Props> = ({ tutor, onViewProfile, onBook }) => {
  return (
    <div
      className="
        bg-white rounded-xl border border-gray-200
        shadow-sm hover:shadow-md transition-shadow duration-200
        overflow-hidden flex flex-col
      "
    >
      {/* ── Header bleu marine ────────────────────────────── */}
      <div className="bg-[#1a2744] px-5 py-4">
        <div className="flex items-center gap-3">

          {/* Avatar initiales ou photo */}
          <div className="w-12 h-12 rounded-full bg-[#f5a623]
                          flex items-center justify-center
                          text-[#1a2744] font-bold text-base
                          flex-shrink-0 border-2 border-white/20">
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

          {/* Nom + matière + niveau */}
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 flex-wrap">
              <h3 className="font-bold text-white text-sm leading-tight">
                {tutor.firstName.startsWith("Mme") ||
                 tutor.firstName.startsWith("M.") ||
                 tutor.firstName.startsWith("Mlle")
                  ? tutor.firstName
                  : tutor.lastName.toLowerCase() === tutor.lastName
                  ? `${tutor.firstName} ${tutor.lastName}`
                  : `${tutor.firstName} ${tutor.lastName}`}
              </h3>
              <TutorVerifiedBadge isVerified={tutor.isVerified} />
            </div>
            <p className="text-white/70 text-xs mt-0.5 truncate">
              {tutor.subject} · {tutor.level}
            </p>
          </div>
        </div>
      </div>

      {/* ── Corps de la carte ─────────────────────────────── */}
      <div className="px-5 py-4 flex-1 flex flex-col gap-3">

        {/* Quartier + Note */}
        <div className="flex items-center justify-between text-xs">
          <span className="text-gray-500 flex items-center gap-1">
            <span className="text-red-500">📍</span>
            {tutor.district}
          </span>
          <TutorRating
            rating={tutor.rating}
            reviewCount={tutor.reviewCount}
          />
        </div>

        {/* Bio (2 lignes max) */}
        <p className="text-sm text-gray-600 leading-relaxed line-clamp-2 flex-1">
          {tutor.bio}
        </p>

        {/* Prix par heure */}
        <div>
          <span className="text-xl font-bold text-[#1a2744]">
            {tutor.pricePerHour.toLocaleString("fr-FR")} FCFA
          </span>
          <span className="text-gray-400 text-xs ml-1">/ heure</span>
        </div>
      </div>

      {/* ── Boutons d'action ──────────────────────────────── */}
      <div className="px-5 pb-5 grid grid-cols-2 gap-2">

        {/* Voir profil */}
        <button
          type="button"
          onClick={() => onViewProfile(tutor.id)}
          className="
            py-2.5 rounded-lg border-2 border-[#1a2744]
            text-[#1a2744] text-sm font-semibold
            hover:bg-[#1a2744] hover:text-white
            transition-colors cursor-pointer
          "
        >
          Voir profil
        </button>

        {/* Réserver */}
        <button
          type="button"
          onClick={() => onBook(tutor.id)}
          className="
            py-2.5 rounded-lg bg-[#1a2744]
            text-white text-sm font-bold
            hover:bg-[#243566] transition-colors cursor-pointer
          "
        >
          Réserver
        </button>
      </div>
    </div>
  );
};

export default TutorCard;