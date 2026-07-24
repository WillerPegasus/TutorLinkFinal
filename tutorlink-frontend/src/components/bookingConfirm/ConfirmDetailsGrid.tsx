// ============================================================
// Grille des détails chiffrés de la réservation confirmée
// Affiche : montant total et date de réservation en 2 cartes
// ============================================================

import React from "react";
import type { BookingConfirmData } from "../../types/bookingConfirm.types";

interface Props {
  booking: BookingConfirmData; // Données complètes de la réservation
}

const ConfirmDetailsGrid: React.FC<Props> = ({ booking }) => {

  // Formate la date de création lisiblement
  const formattedDate = new Date(booking.createdAt).toLocaleDateString(
    "fr-FR",
    {
      day: "numeric",
      month: "long",
      year: "numeric",
    }
  );

  // Formate l'heure de création
  const formattedTime = new Date(booking.createdAt).toLocaleTimeString(
    "fr-FR",
    { hour: "2-digit", minute: "2-digit" }
  );

  // Configuration des 2 cartes de détails
  const details = [
    {
      icon: "💰",
      label: "Montant total",
      value: `${booking.totalAmount.toLocaleString("fr-FR")} FCFA`,
      highlight: true,
      sublabel: booking.durationHours
        ? `${booking.durationHours}h de cours`
        : undefined,
    },
    {
      icon: "📅",
      label: "Date de la demande",
      value: formattedDate,
      highlight: false,
      sublabel: `à ${formattedTime}`,
    },
  ];

  return (
    <div className="grid grid-cols-2 gap-3">
      {details.map(({ icon, label, value, highlight, sublabel }) => (
        <div
          key={label}
          className={`
            rounded-xl p-4 border
            ${highlight
              ? "bg-[#f5a623]/10 border-[#f5a623]/30"
              : "bg-gray-50 border-gray-200"
            }
          `}
        >
          <p className="text-xs text-gray-500 mb-1.5 flex items-center gap-1">
            <span>{icon}</span>
            {label}
          </p>
          <p
            className={`font-bold text-sm leading-tight ${
              highlight ? "text-[#1a2744]" : "text-gray-800"
            }`}
          >
            {value}
          </p>
          {sublabel && (
            <p className="text-xs text-gray-400 mt-0.5">{sublabel}</p>
          )}
        </div>
      ))}
    </div>
  );
};

export default ConfirmDetailsGrid;