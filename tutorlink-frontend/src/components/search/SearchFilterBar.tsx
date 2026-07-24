// ============================================================
// Barre de filtres de la page de recherche
// Contient 4 selects (matière, niveau, quartier, prix max)
// et le bouton "Filtrer" — reproduit la maquette Page 2
// ============================================================

import React from "react";
import type { SearchFilters } from "../../types/searchs.types";
import {
  FILTER_SUBJECTS,
  FILTER_LEVELS,
  FILTER_DISTRICTS,
  FILTER_MAX_PRICES,
} from "../../types/searchs.types";

interface Props {
  pendingFilters: SearchFilters;  // Valeurs en cours dans les selects
  onFilterChange: (
    key: keyof SearchFilters,
    value: string | number
  ) => void;                      // Mise à jour d'un filtre
  onApply: () => void;            // Déclenche le filtrage
  onReset: () => void;            // Remet à zéro tous les filtres
  totalCount: number;             // Nombre de résultats actuels (affiché)
}

const SearchFilterBar: React.FC<Props> = ({
  pendingFilters,
  onFilterChange,
  onApply,
  onReset,
  totalCount,
}) => {

  // Permet de soumettre en appuyant sur Entrée dans un select
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") onApply();
  };

  return (
    <div
      className="bg-white border border-gray-200 rounded-xl
                 shadow-sm px-5 py-4"
      onKeyDown={handleKeyDown}
    >
      <div className="flex flex-col lg:flex-row items-end gap-3">

        {/* ── Select Matière ───────────────────────────────── */}
        <div className="flex-1 min-w-0 w-full lg:w-auto">
          <label className="block text-xs font-semibold text-gray-600 mb-1">
            Matière
          </label>
          <select
            value={pendingFilters.subject}
            onChange={(e) => onFilterChange("subject", e.target.value)}
            className="
              w-full border border-gray-300 rounded-lg
              px-3 py-2.5 text-sm bg-white
              focus:outline-none focus:ring-2 focus:ring-[#1a2744]
              cursor-pointer transition-colors
            "
          >
            {FILTER_SUBJECTS.map(({ value, label }) => (
              <option key={value} value={value}>{label}</option>
            ))}
          </select>
        </div>

        {/* ── Select Niveau ────────────────────────────────── */}
        <div className="flex-none w-full lg:w-36">
          <label className="block text-xs font-semibold text-gray-600 mb-1">
            Niveau
          </label>
          <select
            value={pendingFilters.level}
            onChange={(e) => onFilterChange("level", e.target.value)}
            className="
              w-full border border-gray-300 rounded-lg
              px-3 py-2.5 text-sm bg-white
              focus:outline-none focus:ring-2 focus:ring-[#1a2744]
              cursor-pointer transition-colors
            "
          >
            {FILTER_LEVELS.map(({ value, label }) => (
              <option key={value} value={value}>{label}</option>
            ))}
          </select>
        </div>

        {/* ── Select Quartier ──────────────────────────────── */}
        <div className="flex-none w-full lg:w-40">
          <label className="block text-xs font-semibold text-gray-600 mb-1">
            Quartier
          </label>
          <select
            value={pendingFilters.district}
            onChange={(e) => onFilterChange("district", e.target.value)}
            className="
              w-full border border-gray-300 rounded-lg
              px-3 py-2.5 text-sm bg-white
              focus:outline-none focus:ring-2 focus:ring-[#1a2744]
              cursor-pointer transition-colors
            "
          >
            {FILTER_DISTRICTS.map(({ value, label }) => (
              <option key={value} value={value}>{label}</option>
            ))}
          </select>
        </div>

        {/* ── Select Prix max ──────────────────────────────── */}
        <div className="flex-none w-full lg:w-40">
          <label className="block text-xs font-semibold text-gray-600 mb-1">
            Prix max
          </label>
          <select
            value={pendingFilters.maxPrice}
            onChange={(e) =>
              onFilterChange("maxPrice", Number(e.target.value))
            }
            className="
              w-full border border-gray-300 rounded-lg
              px-3 py-2.5 text-sm bg-white
              focus:outline-none focus:ring-2 focus:ring-[#1a2744]
              cursor-pointer transition-colors
            "
          >
            {FILTER_MAX_PRICES.map(({ value, label }) => (
              <option key={value} value={value}>{label}</option>
            ))}
          </select>
        </div>

        {/* ── Bouton Filtrer ───────────────────────────────── */}
        <div className="flex gap-2 w-full lg:w-auto flex-shrink-0">
          <button
            type="button"
            onClick={onApply}
            className="
              flex-1 lg:flex-none flex items-center justify-center gap-2
              bg-[#1a2744] hover:bg-[#243566] text-white
              font-bold text-sm px-5 py-2.5 rounded-lg
              transition-colors cursor-pointer
              whitespace-nowrap
            "
          >
            🔍 Filtrer
          </button>

          {/* Bouton Reset (visible seulement si un filtre est actif) */}
          <button
            type="button"
            onClick={onReset}
            className="
              flex-none px-3 py-2.5 rounded-lg
              border border-gray-300 text-gray-500
              hover:bg-gray-50 hover:border-gray-400
              transition-colors cursor-pointer text-sm
            "
            title="Réinitialiser les filtres"
            aria-label="Réinitialiser"
          >
            ✕
          </button>
        </div>
      </div>
    </div>
  );
};

export default SearchFilterBar;