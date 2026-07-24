// ============================================================
// FICHIER : src/components/tutor/settings/SubjectsSection.tsx
// RÔLE    : Section "Matières" des paramètres.
//           Liste les matières déjà ajoutées avec un bouton
//           de suppression, et un formulaire pour en ajouter
//           de nouvelles (matière + niveau).
//
// ⚠️ BACKEND :
//   GET    /api/tutor/subjects
//   POST   /api/tutor/subjects
//   DELETE /api/tutor/subjects/:id
// ============================================================

import React, { useState } from "react";
import type { TutorSubjectSetting } from "../../../types/settings.types";
import { SETTING_SUBJECTS, SETTING_LEVELS } from "../../../types/settings.types";

interface SubjectsSectionProps {
  subjects: TutorSubjectSetting[] | undefined;
  isLoading: boolean;
  onAdd: (name: string, level: string) => void;
  onRemove: (id: string) => void;
  isAdding: boolean;
  isRemoving: boolean;
  removingId: string | null;
}

const SubjectsSection: React.FC<SubjectsSectionProps> = ({
  subjects,
  isLoading,
  onAdd,
  onRemove,
  isAdding,
  isRemoving,
  removingId,
}) => {

  // État local du formulaire d'ajout
  const [newSubject, setNewSubject] = useState("Mathématiques");
  const [newLevel,   setNewLevel]   = useState("Terminale C");
  const [addError,   setAddError]   = useState("");

  // Gère l'ajout d'une matière
  const handleAdd = () => {
    setAddError("");

    // Vérifie que la matière n'existe pas déjà
    const alreadyExists = (subjects ?? []).some(
      (s) =>
        s.name.toLowerCase() === newSubject.toLowerCase() &&
        s.level.toLowerCase() === newLevel.toLowerCase()
    );

    if (alreadyExists) {
      setAddError("Cette matière avec ce niveau existe déjà.");
      return;
    }

    onAdd(newSubject, newLevel);
  };

  // ── Skeleton ──────────────────────────────────────────────
  if (isLoading) {
    return (
      <div className="space-y-3 animate-pulse">
        {[1, 2, 3].map((i) => (
          <div key={i} className="h-12 bg-gray-100 rounded-lg" />
        ))}
      </div>
    );
  }

  return (
    <div className="space-y-6">

      {/* ── Liste des matières actuelles ─────────────────── */}
      <div>
        <h3 className="text-sm font-semibold text-gray-700 mb-3">
          Vos matières enseignées
        </h3>

        {(!subjects || subjects.length === 0) ? (
          // État vide
          <div className="text-center py-6 text-gray-400 text-sm
                          border-2 border-dashed border-gray-200 rounded-lg">
            <span className="text-2xl block mb-1">📚</span>
            Aucune matière ajoutée.
          </div>
        ) : (
          <div className="space-y-2">
            {subjects.map((subject) => {
              const isThisRemoving =
                isRemoving && removingId === subject.id;

              return (
                <div
                  key={subject.id}
                  className="flex items-center justify-between
                             bg-gray-50 border border-gray-200
                             rounded-lg px-4 py-3"
                >
                  <div className="flex items-center gap-3">
                    {/* Icône matière */}
                    <span className="text-lg">📘</span>
                    <div>
                      <p className="text-sm font-semibold text-[#1a2744]">
                        {subject.name}
                      </p>
                      <p className="text-xs text-gray-500">
                        {subject.level}
                      </p>
                    </div>
                  </div>

                  {/* Bouton supprimer */}
                  <button
                    type="button"
                    onClick={() => onRemove(subject.id)}
                    disabled={isRemoving}
                    className="
                      w-7 h-7 rounded-full border border-red-200
                      text-red-500 text-xs font-bold
                      hover:bg-red-50 hover:border-red-400
                      transition-colors flex items-center justify-center
                      disabled:opacity-40 disabled:cursor-not-allowed
                    "
                    title="Supprimer cette matière"
                    aria-label={`Supprimer ${subject.name} · ${subject.level}`}
                  >
                    {isThisRemoving ? (
                      <svg className="animate-spin w-3 h-3"
                           viewBox="0 0 24 24" fill="none">
                        <circle className="opacity-25" cx="12" cy="12"
                          r="10" stroke="currentColor" strokeWidth="4" />
                        <path className="opacity-75" fill="currentColor"
                          d="M4 12a8 8 0 018-8v8z" />
                      </svg>
                    ) : (
                      "×"
                    )}
                  </button>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* ── Formulaire d'ajout ───────────────────────────── */}
      <div className="bg-blue-50 border border-blue-200
                      rounded-lg p-4">
        <h3 className="text-sm font-semibold text-[#1a2744] mb-3">
          ➕ Ajouter une matière
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-3">
          {/* Select Matière */}
          <div>
            <label className="block text-xs font-medium text-gray-600 mb-1">
              Matière
            </label>
            <select
              value={newSubject}
              onChange={(e) => setNewSubject(e.target.value)}
              disabled={isAdding}
              className="w-full border border-gray-300 rounded-lg
                         px-3 py-2 text-sm bg-white
                         focus:outline-none focus:ring-2 focus:ring-[#1a2744]
                         disabled:bg-gray-50"
            >
              {SETTING_SUBJECTS.map((s) => (
                <option key={s} value={s}>{s}</option>
              ))}
            </select>
          </div>

          {/* Select Niveau */}
          <div>
            <label className="block text-xs font-medium text-gray-600 mb-1">
              Niveau
            </label>
            <select
              value={newLevel}
              onChange={(e) => setNewLevel(e.target.value)}
              disabled={isAdding}
              className="w-full border border-gray-300 rounded-lg
                         px-3 py-2 text-sm bg-white
                         focus:outline-none focus:ring-2 focus:ring-[#1a2744]
                         disabled:bg-gray-50"
            >
              {SETTING_LEVELS.map((l) => (
                <option key={l} value={l}>{l}</option>
              ))}
            </select>
          </div>
        </div>

        {/* Erreur doublon */}
        {addError && (
          <p className="text-red-500 text-xs mb-2 flex items-center gap-1">
            ⚠ {addError}
          </p>
        )}

        {/* Bouton Ajouter */}
        <button
          type="button"
          onClick={handleAdd}
          disabled={isAdding}
          className="
            flex items-center gap-2 px-5 py-2 rounded-lg
            bg-[#1a2744] text-white font-semibold text-sm
            hover:bg-[#243566] transition-colors
            disabled:opacity-50 disabled:cursor-not-allowed
          "
        >
          {isAdding ? (
            <>
              <svg className="animate-spin w-3 h-3" viewBox="0 0 24 24" fill="none">
                <circle className="opacity-25" cx="12" cy="12" r="10"
                  stroke="currentColor" strokeWidth="4" />
                <path className="opacity-75" fill="currentColor"
                  d="M4 12a8 8 0 018-8v8z" />
              </svg>
              Ajout...
            </>
          ) : (
            "+ Ajouter"
          )}
        </button>
      </div>
    </div>
  );
};

export default SubjectsSection;