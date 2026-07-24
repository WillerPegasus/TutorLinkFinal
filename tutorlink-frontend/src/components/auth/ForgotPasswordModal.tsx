// ============================================================
// Modal de demande de réinitialisation de mot de passe
// Saisie de l'identifiant puis confirmation d'envoi du code
// ============================================================

import React, { useState, useEffect } from "react";

interface Props {
  isOpen: boolean;                        // Contrôle l'affichage
  onClose: () => void;                    // Ferme le modal
  onSubmit: (identifier: string) => void; // Envoie la demande
  isLoading: boolean;                     // Pendant l'appel API
  codeSent: boolean;                      // true après succès
}

const ForgotPasswordModal: React.FC<Props> = ({
  isOpen,
  onClose,
  onSubmit,
  isLoading,
  codeSent,
}) => {
  const [identifier, setIdentifier] = useState("");

  // Réinitialise à chaque ouverture
  useEffect(() => {
    if (isOpen) setIdentifier("");
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

  if (!isOpen) return null;

  const canSubmit = identifier.trim().length > 0;

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
                      w-full max-w-sm z-10">

        {/* ── Cas : code envoyé avec succès ────────────────── */}
        {codeSent ? (
          <div className="px-6 py-8 text-center">
            <div className="w-14 h-14 bg-green-100 rounded-full
                            flex items-center justify-center
                            mx-auto mb-4">
              <span className="text-2xl">✅</span>
            </div>
            <h2 className="font-bold text-lg text-[#1a2744] mb-2">
              Code envoyé !
            </h2>
            <p className="text-sm text-gray-500 mb-6">
              Un code de réinitialisation a été envoyé à{" "}
              <strong className="text-[#1a2744]">{identifier}</strong>.
              {/* ⚠️ BACKEND REQUIS : le code OTP est envoyé par SMS
                  (Mobile Money API) ou par email selon l'identifiant */}
            </p>
            <button
              type="button"
              onClick={onClose}
              className="
                w-full py-2.5 rounded-lg bg-[#1a2744] text-white
                font-semibold text-sm hover:bg-[#243566]
                transition-colors cursor-pointer
              "
            >
              Fermer
            </button>
          </div>
        ) : (

        // ── Cas : formulaire de saisie ────────────────────────
        <>
          <div className="px-6 pt-6 pb-2">
            <h2 className="font-bold text-lg text-[#1a2744] mb-1">
              Mot de passe oublié ?
            </h2>
            <p className="text-sm text-gray-500">
              Saisissez votre email ou téléphone pour recevoir
              un code de réinitialisation.
            </p>
          </div>

          <div className="px-6 py-4">
            <label
              htmlFor="reset-identifier"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Email ou téléphone
            </label>
            <input
              id="reset-identifier"
              type="text"
              value={identifier}
              onChange={(e) => setIdentifier(e.target.value)}
              disabled={isLoading}
              placeholder="exemple@email.com ou 6XX XX XX XX"
              className="
                w-full border border-gray-300 rounded-lg
                px-3 py-2.5 text-sm
                focus:outline-none focus:ring-2 focus:ring-[#1a2744]
                disabled:bg-gray-50
              "
            />
          </div>

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
              Annuler
            </button>

            <button
              type="button"
              onClick={() => onSubmit(identifier.trim())}
              disabled={!canSubmit || isLoading}
              className="
                flex-1 py-2.5 rounded-lg bg-[#f5a623]
                text-[#1a2744] font-bold text-sm
                hover:bg-[#e09415] transition-colors cursor-pointer
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
                  Envoi...
                </>
              ) : (
                "Envoyer le code"
              )}
            </button>
          </div>
        </>
        )}
      </div>
    </div>
  );
};

export default ForgotPasswordModal;