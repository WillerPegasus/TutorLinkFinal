// ============================================================
// FICHIER : src/components/tutor/groups/DeleteGroupModal.tsx
// RÔLE    : Modal de confirmation avant suppression d'un groupe.
//           Affiche le nom du groupe et avertit que l'action
//           est irréversible.
//
// ⚠️ BACKEND : DELETE /api/tutor/groups/:id
// ============================================================

import React, { useEffect } from "react";
import type { TutorGroupDetail } from "../../../types/tutorGroup.tytes";

interface DeleteGroupModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  group: TutorGroupDetail | null;
  isDeleting: boolean;
}

const DeleteGroupModal: React.FC<DeleteGroupModalProps> = ({
  isOpen,
  onClose,
  onConfirm,
  group,
  isDeleting,
}) => {

  // Fermer avec Escape
  useEffect(() => {
    if (!isOpen) return;
    const handler = (e: KeyboardEvent) => {
      if (e.key === "Escape" && !isDeleting) onClose();
    };
    document.addEventListener("keydown", handler);
    return () => document.removeEventListener("keydown", handler);
  }, [isOpen, isDeleting, onClose]);

  // Bloquer le scroll
  useEffect(() => {
    document.body.style.overflow = isOpen ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [isOpen]);

  if (!isOpen || !group) return null;

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
        onClick={() => !isDeleting && onClose()}
      />

      {/* Contenu */}
      <div className="relative bg-white rounded-xl shadow-2xl
                      w-full max-w-sm z-10">

        {/* Icône danger */}
        <div className="pt-8 pb-4 px-6 text-center">
          <div className="w-16 h-16 bg-red-100 rounded-full
                          flex items-center justify-center
                          mx-auto mb-4">
            <span className="text-3xl">🗑️</span>
          </div>

          <h2 className="font-bold text-lg text-[#1a2744] mb-2">
            Supprimer ce groupe ?
          </h2>

          {/* Nom du groupe mis en avant */}
          <div className="bg-gray-50 border border-gray-200
                          rounded-lg px-4 py-2 mb-3">
            <p className="font-semibold text-sm text-[#1a2744]">
              {group.name}
            </p>
            <p className="text-xs text-gray-500 mt-0.5">
              {group.enrolledCount} élève{group.enrolledCount > 1 ? "s" : ""} inscrit{group.enrolledCount > 1 ? "s" : ""}
            </p>
          </div>

          {/* Avertissement si des élèves sont inscrits */}
          {group.enrolledCount > 0 && (
            <div className="bg-red-50 border border-red-200
                            rounded-lg px-4 py-3 mb-3 text-left">
              <p className="text-red-700 text-xs leading-relaxed">
                ⚠️ <strong>{group.enrolledCount} élève{group.enrolledCount > 1 ? "s" : ""}</strong>{" "}
                {group.enrolledCount > 1 ? "sont inscrits" : "est inscrit"} dans ce groupe.
                Ils seront notifiés de la fermeture.
              </p>
            </div>
          )}

          <p className="text-gray-500 text-xs">
            Cette action est <strong>irréversible</strong>.
            Le groupe et toutes ses données seront supprimés.
          </p>
        </div>

        {/* Boutons */}
        <div className="px-6 pb-6 flex gap-3">
          <button
            type="button"
            onClick={onClose}
            disabled={isDeleting}
            className="flex-1 py-2.5 rounded-lg border border-gray-300
                       text-gray-700 font-medium text-sm
                       hover:bg-gray-50 transition-colors
                       disabled:opacity-40 disabled:cursor-not-allowed"
          >
            Annuler
          </button>

          <button
            type="button"
            onClick={onConfirm}
            disabled={isDeleting}
            className="flex-1 py-2.5 rounded-lg bg-red-500 text-white
                       font-bold text-sm hover:bg-red-600
                       transition-colors shadow-md
                       disabled:opacity-60 disabled:cursor-not-allowed
                       flex items-center justify-center gap-2"
          >
            {isDeleting ? (
              <>
                <svg className="animate-spin w-4 h-4" viewBox="0 0 24 24" fill="none">
                  <circle className="opacity-25" cx="12" cy="12" r="10"
                    stroke="currentColor" strokeWidth="4" />
                  <path className="opacity-75" fill="currentColor"
                    d="M4 12a8 8 0 018-8v8z" />
                </svg>
                Suppression...
              </>
            ) : (
              "🗑 Supprimer"
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

export default DeleteGroupModal;