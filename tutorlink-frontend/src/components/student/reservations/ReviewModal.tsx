// ============================================================
// Modal pour poster un avis sur un cours complété
// Sélection d'étoiles interactive + champ commentaire
// Disponible uniquement pour les cours COMPLETED sans avis
// ============================================================

import React, { useState, useEffect } from "react";
import type { Reservation } from "../../../types/studentReservation.types";

interface Props {
  isOpen: boolean;                              // Contrôle l'affichage
  reservation: Reservation | null;             // Cours à noter
  onClose: () => void;                         // Ferme sans soumettre
  onSubmit: (rating: number, comment: string) => void; // Soumet l'avis
  isLoading: boolean;                          // Pendant l'appel API
}

const ReviewModal: React.FC<Props> = ({
  isOpen,
  reservation,
  onClose,
  onSubmit,
  isLoading,
}) => {
  const [rating,        setRating]        = useState(0);
  const [hoveredRating, setHoveredRating] = useState(0);
  const [comment,       setComment]       = useState("");

  // Réinitialise à chaque ouverture
  useEffect(() => {
    if (isOpen) {
      setRating(0);
      setHoveredRating(0);
      setComment("");
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

  const canSubmit = rating > 0 && comment.trim().length >= 10;

  // Labels selon la note
  const ratingLabels = ["", "Mauvais", "Passable", "Bien", "Très bien", "Excellent !"];

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

        {/* Header */}
        <div className="bg-[#1a2744] px-6 py-4 rounded-t-xl
                        flex items-center justify-between">
          <div>
            <h2 className="font-bold text-white text-base">
              ⭐ Évaluer ce cours
            </h2>
            <p className="text-white/70 text-xs mt-0.5">
              {reservation.tutor.firstName} {reservation.tutor.lastName} ·{" "}
              {reservation.subject}
            </p>
          </div>
          {!isLoading && (
            <button
              onClick={onClose}
              className="text-white/70 hover:text-white text-2xl
                         leading-none cursor-pointer"
            >
              ×
            </button>
          )}
        </div>

        <div className="px-6 py-5 space-y-5">

          {/* Sélecteur d'étoiles */}
          <div className="text-center">
            <p className="text-sm text-gray-600 mb-3">
              Quelle note donnez-vous à ce cours ?
            </p>

            {/* Étoiles interactives */}
            <div className="flex items-center justify-center gap-2 mb-2">
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  key={star}
                  type="button"
                  onClick={() => setRating(star)}
                  onMouseEnter={() => setHoveredRating(star)}
                  onMouseLeave={() => setHoveredRating(0)}
                  disabled={isLoading}
                  className="
                    text-4xl transition-transform duration-100
                    hover:scale-110 cursor-pointer
                    disabled:cursor-not-allowed
                  "
                  aria-label={`${star} étoile${star > 1 ? "s" : ""}`}
                >
                  <span className={
                    star <= (hoveredRating || rating)
                      ? "text-[#f5a623]"
                      : "text-gray-300"
                  }>
                    ★
                  </span>
                </button>
              ))}
            </div>

            {/* Label de la note */}
            {(hoveredRating || rating) > 0 && (
              <p className="text-sm font-semibold text-[#f5a623]">
                {ratingLabels[hoveredRating || rating]}
              </p>
            )}
          </div>

          {/* Commentaire */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Votre commentaire{" "}
              <span className="text-red-500">*</span>
            </label>
            <textarea
              rows={4}
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              disabled={isLoading}
              placeholder="Décrivez votre expérience avec ce répétiteur : pédagogie, ponctualité, efficacité..."
              className="
                w-full border border-gray-300 rounded-lg px-3 py-2.5
                text-sm resize-none placeholder-gray-400
                focus:outline-none focus:ring-2 focus:ring-[#1a2744]
                disabled:bg-gray-50 transition-colors
              "
            />
            <div className="flex justify-between mt-1">
              {comment.length < 10 && comment.length > 0 ? (
                <p className="text-xs text-amber-500">
                  Minimum 10 caractères
                </p>
              ) : (
                <span />
              )}
              <span className="text-xs text-gray-400 ml-auto">
                {comment.length}/300
              </span>
            </div>
          </div>
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
              disabled:opacity-40
            "
          >
            Plus tard
          </button>

          <button
            type="button"
            onClick={() => onSubmit(rating, comment)}
            disabled={!canSubmit || isLoading}
            className="
              flex-1 py-2.5 rounded-lg bg-[#f5a623]
              text-[#1a2744] font-bold text-sm
              hover:bg-[#e09415] transition-colors cursor-pointer shadow-md
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
                Publication...
              </>
            ) : (
              "✅ Publier mon avis"
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ReviewModal;