// ============================================================
// Alerte affichant le statut "En attente" de la réservation
// avec une explication sur le processus de confirmation
// et une information sur le paiement différé
// ============================================================

import React from "react";
import type {
  BookingConfirmTutor,
  BookingConfirmPayment,
} from "../../types/bookingConfirm.types";
import { PAYMENT_METHOD_LABELS } from "../../types/bookingConfirm.types";

interface Props {
  tutor: BookingConfirmTutor;          // Pour personnaliser le message
  paymentMethod?: BookingConfirmPayment; // Moyen de paiement utilisé
  totalAmount: number;                  // Montant qui sera prélevé
}

const ConfirmStatusAlert: React.FC<Props> = ({
  tutor,
  paymentMethod,
  totalAmount,
}) => {

  const paymentLabel = paymentMethod
    ? PAYMENT_METHOD_LABELS[paymentMethod]
    : "Mobile Money";

  return (
    <div className="space-y-3">

      {/* ── Alerte statut EN ATTENTE ─────────────────────── */}
      <div
        className="
          flex items-start gap-3
          bg-amber-50 border border-amber-200
          rounded-xl px-4 py-4
        "
      >
        <span className="text-2xl flex-shrink-0 mt-0.5">⏳</span>
        <div>
          <p className="font-bold text-amber-800 text-sm">
            En attente de confirmation
          </p>
          <p className="text-amber-700 text-xs mt-1 leading-relaxed">
            <strong>{tutor.firstName} {tutor.lastName}</strong> doit
            confirmer votre demande. Vous recevrez un SMS dès sa réponse.
            {/* ⚠️ BACKEND REQUIS : notification SMS via API MTN/Orange
                déclenchée côté serveur après confirmation du répétiteur */}
          </p>
        </div>
      </div>

      {/* ── Info paiement différé ─────────────────────────── */}
      <div
        className="
          flex items-start gap-3
          bg-blue-50 border border-blue-200
          rounded-xl px-4 py-4
        "
      >
        <span className="text-xl flex-shrink-0 mt-0.5">💳</span>
        <p className="text-blue-700 text-xs leading-relaxed">
          Aucun paiement n'a encore été prélevé. Le montant de{" "}
          <strong className="text-blue-800">
            {totalAmount.toLocaleString("fr-FR")} FCFA
          </strong>{" "}
          sera débité sur votre{" "}
          <strong className="text-blue-800">{paymentLabel}</strong>{" "}
          uniquement après confirmation du répétiteur.
          {/* ⚠️ BACKEND REQUIS : débit Mobile Money déclenché
              par PATCH /api/bookings/:id/confirm côté répétiteur */}
        </p>
      </div>
    </div>
  );
};

export default ConfirmStatusAlert;