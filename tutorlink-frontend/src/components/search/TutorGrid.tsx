// ============================================================
// Grille de cartes des répétiteurs
// Gère : skeleton de chargement, état vide, grille responsive
// ============================================================

import React from "react";
import type { SearchTutor } from "../../types/searchs.types";
import TutorCard from "./TutorCard";

interface Props {
  tutors: SearchTutor[];                // Liste des répétiteurs filtrés
  isLoading: boolean;                   // Affiche le skeleton si true
  onViewProfile: (id: string) => void;  // Callback voir profil
  onBook: (id: string) => void;         // Callback réserver
  onResetFilters: () => void;           // Pour le bouton dans l'état vide
}

const TutorGrid: React.FC<Props> = ({
  tutors,
  isLoading,
  onViewProfile,
  onBook,
  onResetFilters,
}) => {

  // ── Skeleton de chargement ────────────────────────────────
  if (isLoading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
        {Array.from({ length: 6 }).map((_, i) => (
          <div
            key={i}
            className="bg-white rounded-xl border border-gray-200
                       shadow-sm overflow-hidden animate-pulse"
          >
            {/* Header skeleton */}
            <div className="bg-gray-300 h-20" />
            {/* Corps skeleton */}
            <div className="p-5 space-y-3">
              <div className="flex justify-between">
                <div className="h-3 w-28 bg-gray-200 rounded" />
                <div className="h-3 w-16 bg-gray-200 rounded" />
              </div>
              <div className="h-3 bg-gray-200 rounded" />
              <div className="h-3 w-3/4 bg-gray-200 rounded" />
              <div className="h-6 w-28 bg-gray-200 rounded mt-1" />
            </div>
            {/* Boutons skeleton */}
            <div className="px-5 pb-5 grid grid-cols-2 gap-2">
              <div className="h-10 bg-gray-200 rounded-lg" />
              <div className="h-10 bg-gray-200 rounded-lg" />
            </div>
          </div>
        ))}
      </div>
    );
  }

  // ── État vide (aucun résultat pour les filtres choisis) ───
  if (tutors.length === 0) {
    return (
      <div
        className="bg-white rounded-xl border border-gray-200
                   shadow-sm py-16 text-center"
      >
        <span className="text-5xl block mb-4">🔍</span>
        <h3 className="text-lg font-bold text-[#1a2744] mb-2">
          Aucun répétiteur trouvé
        </h3>
        <p className="text-gray-500 text-sm mb-6 max-w-xs mx-auto">
          Aucun répétiteur ne correspond à vos critères.
          Essayez d'élargir vos filtres.
        </p>
        <button
          type="button"
          onClick={onResetFilters}
          className="
            inline-flex items-center gap-2 px-6 py-2.5 rounded-lg
            bg-[#f5a623] text-[#1a2744] font-bold text-sm
            hover:bg-[#e09415] transition-colors cursor-pointer
          "
        >
          Réinitialiser les filtres
        </button>
      </div>
    );
  }

  // ── Grille principale ─────────────────────────────────────
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
      {tutors.map((tutor) => (
        <TutorCard
          key={tutor.id}
          tutor={tutor}
          onViewProfile={onViewProfile}
          onBook={onBook}
        />
      ))}
    </div>
  );
};

export default TutorGrid;