// ============================================================
// Modal de détail complet d'une réservation
// Affiche toutes les informations : répétiteur, date, paiement,
// message, statut, et les boutons d'action contextuels
// ============================================================

import React, { useEffect } from "react";
import type { Reservation } from "../../../types/studentReservation.types";
import ReservationStatusBadge from "./ReservationStatusBadge";
import PaymentBadge from "./PaymentBadge";

interface Props {
  isOpen: boolean;                                     // Contrôle l'affichage
  reservation: Reservation | null;                     // Réservation à afficher
  onClose: () => void;                                 // Ferme le modal
  onCancel: (reservation: Reservation) => void;        // Ouvre le modal d'annulation
  onReview: (reservation: Reservation) => void;        // Ouvre le modal d'avis
}

const ReservationDetailModal: React.FC<Props> = ({
  isOpen,
  reservation,
  onClose,
  onCancel,
  onReview,
}) => {

  // Fermer avec la touche Escape
  useEffect(() => {
    if (!isOpen) return;
    const handler = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    document.addEventListener("keydown", handler);
    return () => document.removeEventListener("keydown", handler);
  }, [isOpen, onClose]);

  // Bloquer le scroll du body
  useEffect(() => {
    document.body.style.overflow = isOpen ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [isOpen]);

  if (!isOpen || !reservation) return null;

  const { tutor } = reservation;
  const canCancel =
    reservation.status === "CONFIRMED" || reservation.status === "PENDING";
  const canReview =
    reservation.status === "COMPLETED" && !reservation.reviewPosted;

  const formatDate = (dateStr: string) =>
    new Date(dateStr).toLocaleDateString("fr-FR", {
      weekday: "long", day: "numeric",
      month: "long", year: "numeric",
    });

  return (
    <div
      className="fixed inset-0 z-50 flex items-center
                 justify-center p-4"
      role="dialog"
      aria-modal="true"
    >
      {/* Fond sombre */}
      <div
        className="absolute inset-0 bg-black/50 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* Contenu */}
      <div className="relative bg-white rounded-xl shadow-2xl
                      w-full max-w-lg z-10 overflow-hidden">

        {/* Header */}
        <div className="bg-[#1a2744] px-6 py-4 flex items-center
                        justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-[#f5a623]
                            flex items-center justify-center
                            text-[#1a2744] font-bold text-sm">
              {tutor.firstName[0]}{tutor.lastName[0]}
            </div>
            <div>
              <p className="font-bold text-white text-sm">
                {tutor.firstName} {tutor.lastName}
              </p>
              <p className="text-white/70 text-xs">
                {tutor.subject} · {tutor.level}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-white/70 hover:text-white text-2xl leading-none cursor-pointer"
            aria-label="Fermer"
          >
            ×
          </button>
        </div>

        {/* Corps */}
        <div className="px-6 py-5 space-y-4">

          {/* Référence + Statut */}
          <div className="flex items-center justify-between">
            <span className="text-sm font-mono text-gray-500">
              Réservation #{reservation.id}
            </span>
            <ReservationStatusBadge status={reservation.status} />
          </div>

          {/* Informations clés */}
          <div className="bg-gray-50 rounded-lg p-4 space-y-2">
            <DetailRow icon="📅" label="Date"
              value={formatDate(reservation.date)} />
            <DetailRow icon="🕐" label="Horaire"
              value={`${reservation.timeRange} (${reservation.durationHours}h)`} />
            <DetailRow icon="📚" label="Matière"
              value={reservation.subject} />
            <DetailRow icon="📍" label="Lieu"
              value={tutor.district} />
            <DetailRow icon="🎓" label="Élève"
              value={reservation.studentName} />
          </div>

          {/* Message */}
          {reservation.message && (
            <div>
              <p className="text-xs font-semibold text-gray-500 mb-1">
                Message au répétiteur
              </p>
              <p className="text-sm text-gray-700 bg-blue-50
                             border border-blue-100 rounded-lg px-4 py-3
                             italic">
                "{reservation.message}"
              </p>
            </div>
          )}

          {/* Paiement */}
          <div className="flex items-center justify-between
                          border-t border-gray-100 pt-3">
            <PaymentBadge
              method={reservation.paymentMethod}
              status={reservation.paymentStatus}
            />
            <span className="font-bold text-[#1a2744] text-lg">
              {reservation.totalAmount.toLocaleString("fr-FR")} FCFA
            </span>
          </div>

          {/* Date de création */}
          <p className="text-xs text-gray-400 text-center">
            Réservé le{" "}
            {new Date(reservation.createdAt).toLocaleDateString("fr-FR", {
              day: "numeric", month: "long", year: "numeric",
            })}
          </p>
        </div>

        {/* Footer actions */}
        <div className="px-6 pb-6 flex gap-3">
          <button
            type="button"
            onClick={onClose}
            className="
              flex-1 py-2.5 rounded-lg border border-gray-300
              text-gray-700 font-medium text-sm
              hover:bg-gray-50 transition-colors cursor-pointer
            "
          >
            Fermer
          </button>

          {canCancel && (
            <button
              type="button"
              onClick={() => { onClose(); onCancel(reservation); }}
              className="
                flex-1 py-2.5 rounded-lg border border-red-200
                text-red-500 font-semibold text-sm
                hover:bg-red-50 transition-colors cursor-pointer
              "
            >
              Annuler
            </button>
          )}

          {canReview && (
            <button
              type="button"
              onClick={() => { onClose(); onReview(reservation); }}
              className="
                flex-1 py-2.5 rounded-lg bg-[#f5a623]
                text-[#1a2744] font-bold text-sm
                hover:bg-[#e09415] transition-colors cursor-pointer
              "
            >
              ⭐ Noter
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

// ── Ligne de détail ───────────────────────────────────────────
const DetailRow: React.FC<{
  icon: string;
  label: string;
  value: string;
}> = ({ icon, label, value }) => (
  <div className="flex items-start gap-3 text-sm">
    <span className="flex-shrink-0 w-5">{icon}</span>
    <span className="text-gray-500 w-20 flex-shrink-0">{label}</span>
    <span className="font-medium text-[#1a2744]">{value}</span>
  </div>
);

export default ReservationDetailModal;