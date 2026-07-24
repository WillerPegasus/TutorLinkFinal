// ============================================================
// Badge affichant le statut de paiement et le moyen utilisé
// Affiché dans la carte et le détail d'une réservation
// ============================================================

import React from "react";
import type {
  PaymentMethod,
  PaymentStatus,
} from "../../../types/studentReservation.types";

interface Props {
  method: PaymentMethod;     // Moyen de paiement utilisé
  status: PaymentStatus;     // Statut du paiement
}

// Libellés des moyens de paiement
const METHOD_LABELS: Record<PaymentMethod, string> = {
  MTN_MOMO:     "MTN MoMo",
  ORANGE_MONEY: "Orange Money",
  CASH:         "Espèces",
};

// Icônes des moyens de paiement
const METHOD_ICONS: Record<PaymentMethod, string> = {
  MTN_MOMO:     "📱",
  ORANGE_MONEY: "🟠",
  CASH:         "💵",
};

// Configuration visuelle par statut de paiement
const STATUS_CONFIG: Record<
  PaymentStatus,
  { label: string; className: string }
> = {
  PAID:     { label: "Payé ✓",       className: "text-green-600" },
  PENDING:  { label: "En attente",   className: "text-amber-600" },
  REFUNDED: { label: "Remboursé",    className: "text-purple-600" },
  FAILED:   { label: "Échoué",       className: "text-red-600" },
};

const PaymentBadge: React.FC<Props> = ({ method, status }) => {
  const { label, className } = STATUS_CONFIG[status];

  return (
    <div className="flex items-center gap-1.5">
      <span className="text-sm">{METHOD_ICONS[method]}</span>
      <span className="text-xs text-gray-600">{METHOD_LABELS[method]}</span>
      <span className={`text-xs font-semibold ${className}`}>
        · {label}
      </span>
    </div>
  );
};

export default PaymentBadge;