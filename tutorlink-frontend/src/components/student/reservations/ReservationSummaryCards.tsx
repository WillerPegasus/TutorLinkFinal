// ============================================================
// Bande de 4 cartes statistiques en haut de la page
// Affiche : total, complétées, dépenses, à venir
// ============================================================

import React from "react";

interface Props {
  totalReservations: number; // Nombre total de réservations
  totalCompleted: number;    // Nombre de cours complétés
  totalSpent: number;        // Total dépensé en FCFA
  upcomingCount: number;     // Cours confirmés ou en attente
  isLoading: boolean;        // Affiche un skeleton si true
}

const ReservationSummaryCards: React.FC<Props> = ({
  totalReservations,
  totalCompleted,
  totalSpent,
  upcomingCount,
  isLoading,
}) => {
  // Configuration des 4 cartes
  const cards = [
    {
      label: "TOTAL RÉSERVATIONS",
      value: totalReservations,
      icon: "📋",
      accent: "#f5a623",
      format: "number",
    },
    {
      label: "COURS COMPLÉTÉS",
      value: totalCompleted,
      icon: "✅",
      accent: "#27ae60",
      format: "number",
    },
    {
      label: "TOTAL DÉPENSÉ",
      value: totalSpent,
      icon: "💰",
      accent: "#2980b9",
      format: "fcfa",
    },
    {
      label: "COURS À VENIR",
      value: upcomingCount,
      icon: "📅",
      accent: "#c0392b",
      format: "number",
    },
  ];

  if (isLoading) {
    return (
      <div className="grid grid-cols-2 xl:grid-cols-4 gap-4">
        {[1, 2, 3, 4].map((i) => (
          <div
            key={i}
            className="bg-white rounded-lg p-5 border border-gray-100
                       shadow-sm animate-pulse"
          >
            <div className="h-7 w-16 bg-gray-200 rounded mb-2" />
            <div className="h-3 w-28 bg-gray-200 rounded" />
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className="grid grid-cols-2 xl:grid-cols-4 gap-4">
      {cards.map(({ label, value, icon, accent, format }) => (
        <div
          key={label}
          className="bg-white rounded-lg p-5 border border-gray-100
                     shadow-sm hover:shadow-md transition-shadow
                     relative overflow-hidden"
        >
          {/* Bordure gauche colorée */}
          <div
            className="absolute left-0 top-0 bottom-0 w-1 rounded-l-lg"
            style={{ backgroundColor: accent }}
          />

          <div className="pl-2">
            <span className="text-xl mb-1 block">{icon}</span>

            {/* Valeur principale */}
            <p className="text-2xl font-bold text-[#1a2744] leading-tight">
              {format === "fcfa"
                ? `${value.toLocaleString("fr-FR")} F`
                : value.toLocaleString("fr-FR")}
            </p>

            {/* Label */}
            <p className="text-[11px] font-semibold tracking-wider
                          text-gray-400 uppercase mt-1">
              {label}
            </p>
          </div>
        </div>
      ))}
    </div>
  );
};

export default ReservationSummaryCards;