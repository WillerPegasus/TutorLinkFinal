// ============================================================
// Onglets de filtre par statut pour la liste des réservations
// Affiche le nombre de réservations dans chaque statut
// ============================================================

import React from "react";
import type {
  ReservationFilter,
  FilterOption,
} from "../../../types/studentReservation.types";

interface Props {
  activeFilter: ReservationFilter;                     // Filtre actuellement sélectionné
  filterCounts: Record<ReservationFilter, number>;     // Compteurs par statut
  onChange: (filter: ReservationFilter) => void;       // Callback changement de filtre
}

// Configuration des onglets dans l'ordre d'affichage
const FILTER_OPTIONS: FilterOption[] = [
  { value: "ALL",       label: "Toutes"     },
  { value: "CONFIRMED", label: "Confirmées" },
  { value: "PENDING",   label: "En attente" },
  { value: "COMPLETED", label: "Terminées"  },
  { value: "CANCELLED", label: "Annulées"   },
];

const ReservationFilterTabs: React.FC<Props> = ({
  activeFilter,
  filterCounts,
  onChange,
}) => {
  return (
    <div className="flex gap-1 overflow-x-auto pb-1">
      {FILTER_OPTIONS.map(({ value, label }) => {
        const isActive = activeFilter === value;
        const count    = filterCounts[value];

        return (
          <button
            key={value}
            type="button"
            onClick={() => onChange(value)}
            className={`
              flex items-center gap-2 px-4 py-2 rounded-lg
              text-sm font-medium whitespace-nowrap
              transition-colors cursor-pointer flex-shrink-0
              ${isActive
                ? "bg-[#1a2744] text-white shadow-sm"
                : "bg-white text-gray-600 border border-gray-200 hover:bg-gray-50"
              }
            `}
          >
            {label}
            {/* Badge avec le compteur */}
            <span
              className={`
                text-[10px] font-bold px-1.5 py-0.5 rounded-full
                ${isActive
                  ? "bg-white/20 text-white"
                  : "bg-gray-100 text-gray-500"
                }
              `}
            >
              {count}
            </span>
          </button>
        );
      })}
    </div>
  );
};

export default ReservationFilterTabs;