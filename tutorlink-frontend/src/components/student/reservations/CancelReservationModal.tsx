// ============================================================
// Modal de confirmation et raison d'annulation d'une réservation
// Propose une liste de raisons prédéfinies + option libre
// Affiche un avertissement si un remboursement est attendu
// ============================================================

import React, { useState, useEffect } from "react";
import type { Reservation } from "../../../types/studentReservation.types";
import { CANCEL_REASONS } from "../../../types/studentReservation.types";

interface Props {
  isOpen: boolean;                              // Contrôle l'affichage
  reservation: Reservation | null;             // Réservation à annuler
  onClose: () => void;                         // Annule et ferme
  onConfirm: (reason: string) => void;         // Confirme l'annulation
  isLoading: boolean;                          // Pendant l'appel API
}

const CancelReservationModal: React.FC<Props> = ({
  isOpen,
  reservation,
  onClose,
  onConfirm,
  isLoading,
}) => {
  const [selectedReason, setSelectedReason] = useState<string>("");
  const [customReason,   setCustomReason]   = useState("");

  // Réinitialise à chaque ouverture
  useEffect(() => {
    if (isOpen) {
      setSelectedReason("");
      setCustomReason("");
    }
  }, [isOpen]);

  // Fermer avec Escape
  useEffect(() => {
    if (!isOpen) return;
    const handler = (e: KeyboardEvent) => {
      if (e.key === "Escape" && !isLoading) onClose();
    };
    document.addEventListener("keydown", handler);
    return () => document.removeEventListener("keydown", handler);
  }, [isOpen, isLoading, onClose]);

  // Bloquer le scroll
  useEffect(() => {
    document.body.style.overflow = isOpen ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [isOpen]);

  if (!isOpen || !reservation) return null;

  // La raison finale est soit la raison personnalisée, soit la prédéfinie
  const finalReason =
    selectedReason === "Autre raison" ? customReason : selectedReason;

  const canConfirm = finalReason.trim().length > 0;
  const isPaid     = reservation.paymentStatus === "PAID";

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      role="dialog"
      aria-modal="true"
    >
      {/* Fond sombre */}
      <div
        className="absolute inset-0 bg-black/50 backdrop-blur-sm"
        onClick={() => !isLoading && onClose()}
      />

      {/* Contenu */}
      <div className="relative bg-white rounded-xl shadow-2xl
                      w-full max-w-md z-10">

        {/* Icône danger + Titre */}
        <div className="px-6 pt-7 pb-4 text-center border-b border-gray-100">
          <div className="w-14 h-14 bg-red-100 rounded-full
                          flex items-center justify-center
                          mx-auto mb-3">
            <span className="text-2xl">❌</span>
          </div>
          <h2 className="font-bold text-lg text-[#1a2744]">
            Annuler cette réservation ?
          </h2>
          <p className="text-sm text-gray-500 mt-1">
            {reservation.tutor.firstName} {reservation.tutor.lastName} ·{" "}
            {reservation.date} · {reservation.timeRange}
          </p>
        </div>

        {/* Avertissement remboursement */}
        {isPaid && (
          <div className="mx-6 mt-4 bg-amber-50 border border-amber-200
                          rounded-lg px-4 py-3">
            <p className="text-xs text-amber-700 leading-relaxed">
              💳 Un remboursement de{" "}
              <strong>
                {reservation.totalAmount.toLocaleString("fr-FR")} FCFA
              </strong>{" "}
              sera initié sur votre{" "}
              {reservation.paymentMethod === "MTN_MOMO"
                ? "MTN Mobile Money"
                : "Orange Money"}{" "}
              sous 24–48h.
              {/* ⚠️ BACKEND REQUIS : le remboursement est déclenché
                  automatiquement par le backend via l'API Mobile Money */}
            </p>
          </div>
        )}

        {/* Raisons d'annulation */}
        <div className="px-6 py-4 space-y-2">
          <p className="text-sm font-semibold text-gray-700 mb-3">
            Raison de l'annulation <span className="text-red-500">*</span>
          </p>

          {CANCEL_REASONS.map((reason) => (
            <button
              key={reason}
              type="button"
              onClick={() => setSelectedReason(reason)}
              disabled={isLoading}
              className={`
                w-full text-left px-4 py-3 rounded-lg text-sm
                border-2 transition-colors cursor-pointer
                disabled:opacity-50 disabled:cursor-not-allowed
                ${selectedReason === reason
                  ? "border-[#1a2744] bg-[#1a2744]/5 text-[#1a2744] font-semibold"
                  : "border-gray-200 text-gray-600 hover:border-gray-300 hover:bg-gray-50"
                }
              `}
            >
              {reason}
            </button>
          ))}

          {/* Champ libre si "Autre raison" */}
          {selectedReason === "Autre raison" && (
            <textarea
              rows={3}
              value={customReason}
              onChange={(e) => setCustomReason(e.target.value)}
              disabled={isLoading}
              placeholder="Précisez la raison..."
              className="
                w-full border border-gray-300 rounded-lg px-3 py-2.5
                text-sm resize-none mt-2
                focus:outline-none focus:ring-2 focus:ring-[#1a2744]
                disabled:bg-gray-50
              "
            />
          )}
        </div>

        {/* Boutons */}
        <div className="px-6 pb-6 flex gap-3">
          <button
            type="button"
            onClick={onClose}
            disabled={isLoading}
            className="
              flex-1 py-2.5 rounded-lg border border-gray-300
              text-gray-700 font-medium text-sm
              hover:bg-gray-50 transition-colors cursor-pointer
              disabled:opacity-40 disabled:cursor-not-allowed
            "
          >
            Conserver
          </button>

          <button
            type="button"
            onClick={() => onConfirm(finalReason)}
            disabled={!canConfirm || isLoading}
            className="
              flex-1 py-2.5 rounded-lg bg-red-500 text-white
              font-bold text-sm hover:bg-red-600
              transition-colors cursor-pointer shadow-md
              disabled:opacity-50 disabled:cursor-not-allowed
              flex items-center justify-center gap-2
            "
          >
            {isLoading ? (
              <>
                <svg className="animate-spin w-4 h-4" viewBox="0 0 24 24" fill="none">
                  <circle className="opacity-25" cx="12" cy="12" r="10"
                    stroke="currentColor" strokeWidth="4" />
                  <path className="opacity-75" fill="currentColor"
                    d="M4 12a8 8 0 018-8v8z" />
                </svg>
                Annulation...
              </>
            ) : (
              "Confirmer l'annulation"
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

export default CancelReservationModal;