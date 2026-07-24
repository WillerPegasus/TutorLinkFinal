// ============================================================
// FICHIER : src/components/booking/PaymentSelector.tsx
// RÔLE    : Sélecteur de moyen de paiement.
//           Deux boutons : MTN Mobile Money / Orange Money.
//           Contrôlé par react-hook-form via Controller.
//
// ⚠️ BACKEND : La valeur est envoyée dans POST /api/bookings.
//              Le débit réel se fait côté serveur après
//              confirmation du répétiteur (API MTN / Orange).
// ============================================================

import React from "react";
import type { PaymentMethod } from "../../types/booking.types";

// Configuration des deux méthodes de paiement
const METHODS = [
  {
    value: "MTN_MOMO"     as PaymentMethod,
    label: "MTN Mobile Money",
    icon: "📱",
    activeRing: "ring-2 ring-yellow-400",
    activeBg:   "bg-yellow-50 border-yellow-400",
    check:      "bg-yellow-500",
  },
  {
    value: "ORANGE_MONEY" as PaymentMethod,
    label: "Orange Money",
    icon: "🟠",
    activeRing: "ring-2 ring-orange-400",
    activeBg:   "bg-orange-50 border-orange-400",
    check:      "bg-orange-500",
  },
];

interface PaymentSelectorProps {
  value: PaymentMethod;
  onChange: (method: PaymentMethod) => void;
  disabled?: boolean;
}

const PaymentSelector: React.FC<PaymentSelectorProps> = ({
  value,
  onChange,
  disabled = false,
}) => {
  return (
    <div className="grid grid-cols-2 gap-3">
      {METHODS.map((method) => {
        const isSelected = value === method.value;

        return (
          <button
            key={method.value}
            type="button"
            onClick={() => !disabled && onChange(method.value)}
            disabled={disabled}
            aria-pressed={isSelected}
            aria-label={`Payer avec ${method.label}`}
            className={`
              relative flex items-center justify-center gap-2
              h-14 rounded-lg border-2 font-semibold text-sm
              transition-all duration-150
              ${disabled ? "opacity-50 cursor-not-allowed" : "cursor-pointer"}
              ${isSelected
                ? `${method.activeBg} ${method.activeRing}`
                : "bg-white border-gray-300 text-gray-700 hover:border-gray-400 hover:bg-gray-50"
              }
            `}
          >
            <span className="text-xl">{method.icon}</span>
            <span>{method.label}</span>

            {/* Checkmark si sélectionné */}
            {isSelected && (
              <span
                className={`
                  absolute top-1.5 right-1.5
                  w-4 h-4 rounded-full ${method.check}
                  text-white text-xs flex items-center justify-center
                `}
              >
                ✓
              </span>
            )}
          </button>
        );
      })}
    </div>
  );
};

export default PaymentSelector;