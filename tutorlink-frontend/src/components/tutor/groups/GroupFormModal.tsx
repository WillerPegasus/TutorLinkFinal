// ============================================================
// FICHIER : src/components/tutor/groups/GroupFormModal.tsx
// RÔLE    : Modal de création et modification d'un groupe.
//           Utilisée en mode CRÉATION (aucun groupe passé)
//           ou en mode MODIFICATION (groupe existant passé).
//           Validation avec react-hook-form + Zod.
//
// ⚠️ BACKEND :
//   Création  → POST /api/tutor/groups
//   Modification → PUT /api/tutor/groups/:id
// ============================================================

import React, { useEffect } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import type { TutorGroupDetail } from "../../../types/tutorGroup.tytes";
import type { GroupFormData } from "../../../types/tutorGroup.tytes";
import {
  SCHEDULE_DAYS,
  SUBJECTS,
  LEVELS,
  DISTRICTS,
  SCHEDULE_TIMES,
} from "../../../types/tutorGroup.tytes";

// ── Schéma de validation ──────────────────────────────────────
const groupSchema = z.object({
  name: z
    .string()
    .min(5, "Le nom doit faire au moins 5 caractères")
    .max(80, "Le nom ne doit pas dépasser 80 caractères"),

  subject: z.string().min(1, "Veuillez choisir une matière"),

  level: z.string().min(1, "Veuillez choisir un niveau"),

  description: z
    .string()
    .min(20, "La description doit faire au moins 20 caractères")
    .max(500, "La description ne doit pas dépasser 500 caractères"),

  location: z.string().min(1, "Veuillez choisir un quartier"),

  scheduleDays: z
    .array(z.string())
    .min(1, "Sélectionnez au moins un jour de séance"),

  scheduleTime: z.string().min(1, "Veuillez choisir un horaire"),

  maxCapacity: z
    .number()
    .min(2, "Minimum 2 élèves")
    .max(15, "Maximum 15 élèves"),

  pricePerMonth: z
    .number()
    .min(1000, "Prix minimum : 1 000 FCFA")
    .max(50000, "Prix maximum : 50 000 FCFA"),

  themes: z.string().max(300, "Trop long").default(""),
});

type GroupFormValues = z.infer<typeof groupSchema>;

// ── Props ─────────────────────────────────────────────────────
interface GroupFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: GroupFormData) => void;
  editingGroup: TutorGroupDetail | null; // null = création
  isSubmitting: boolean;
  error: string | null;
}

// ── Composant ─────────────────────────────────────────────────
const GroupFormModal: React.FC<GroupFormModalProps> = ({
  isOpen,
  onClose,
  onSubmit,
  editingGroup,
  isSubmitting,
  error,
}) => {

  const isEditMode = editingGroup !== null;

  const {
    register,
    handleSubmit,
    reset,
    watch,
    setValue,
    formState: { errors },
  } = useForm<GroupFormValues>({
    resolver: zodResolver(groupSchema),
    defaultValues: {
      name:          "",
      subject:       "Mathématiques",
      level:         "Terminale C/D",
      description:   "",
      location:      "Centre Dschang",
      scheduleDays:  [],
      scheduleTime:  "16h-18h",
      maxCapacity:   8,
      pricePerMonth: 7000,
      themes:        "",
    },
  });

  // Pré-remplit le formulaire quand on ouvre en mode modification
  useEffect(() => {
    if (editingGroup) {
      reset({
        name:          editingGroup.name,
        subject:       editingGroup.subject,
        level:         editingGroup.level,
        description:   editingGroup.description,
        location:      editingGroup.location,
        scheduleDays:  editingGroup.scheduleDays,
        scheduleTime:  editingGroup.scheduleTime,
        maxCapacity:   editingGroup.maxCapacity,
        pricePerMonth: editingGroup.pricePerMonth,
        themes:        editingGroup.themes.join(", "),
      });
    } else {
      // Réinitialise pour la création
      reset({
        name: "", subject: "Mathématiques", level: "Terminale C/D",
        description: "", location: "Centre Dschang",
        scheduleDays: [], scheduleTime: "16h-18h",
        maxCapacity: 8, pricePerMonth: 7000, themes: "",
      });
    }
  }, [editingGroup, reset, isOpen]);

  // Fermer avec Escape
  useEffect(() => {
    if (!isOpen) return;
    const handler = (e: KeyboardEvent) => {
      if (e.key === "Escape" && !isSubmitting) onClose();
    };
    document.addEventListener("keydown", handler);
    return () => document.removeEventListener("keydown", handler);
  }, [isOpen, isSubmitting, onClose]);

  // Bloque le scroll du body
  useEffect(() => {
    document.body.style.overflow = isOpen ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [isOpen]);

  if (!isOpen) return null;

  // Valeurs observées pour l'aperçu en temps réel
  const watchedDays  = watch("scheduleDays");
  const watchedPrice = watch("pricePerMonth");
  const watchedMax   = watch("maxCapacity");

  // Gestion des jours (checkbox multiple)
  const toggleDay = (day: string) => {
    const current = watchedDays ?? [];
    const updated = current.includes(day)
      ? current.filter((d) => d !== day)
      : [...current, day];
    setValue("scheduleDays", updated, { shouldValidate: true });
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center
                 justify-center p-4 overflow-y-auto"
      role="dialog"
      aria-modal="true"
      aria-labelledby="group-modal-title"
    >
      {/* Fond sombre */}
      <div
        className="absolute inset-0 bg-black/50 backdrop-blur-sm"
        onClick={() => !isSubmitting && onClose()}
      />

      {/* Contenu */}
      <div className="relative bg-white rounded-xl shadow-2xl
                      w-full max-w-2xl z-10 my-4">

        {/* Header */}
        <div className="bg-[#1a2744] text-white px-6 py-4
                        rounded-t-xl flex items-center justify-between">
          <h2 id="group-modal-title" className="font-bold text-base">
            {isEditMode ? "✏️ Modifier le groupe" : "➕ Créer un nouveau groupe"}
          </h2>
          {!isSubmitting && (
            <button
              onClick={onClose}
              className="text-white/70 hover:text-white text-2xl leading-none"
              aria-label="Fermer"
            >
              ×
            </button>
          )}
        </div>

        {/* Formulaire scrollable */}
        <form
          onSubmit={handleSubmit(onSubmit)}
          noValidate
          className="overflow-y-auto max-h-[75vh]"
        >
          <div className="px-6 py-5 space-y-5">

            {/* Erreur globale */}
            {error && (
              <div className="bg-red-50 border border-red-200 rounded-lg
                              px-4 py-3 text-red-700 text-sm flex items-center gap-2">
                ❌ {error}
              </div>
            )}

            {/* ── Nom du groupe ─────────────────────────── */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Nom du groupe <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                {...register("name")}
                disabled={isSubmitting}
                placeholder="ex: Maths BAC C/D · Groupe Élite"
                className={`w-full border rounded-lg px-3 py-2.5 text-sm
                  focus:outline-none focus:ring-2 focus:ring-[#1a2744]
                  disabled:bg-gray-50 transition-colors
                  ${errors.name ? "border-red-400 bg-red-50" : "border-gray-300"}`}
              />
              <FieldError message={errors.name?.message} />
            </div>

            {/* ── Matière + Niveau (2 colonnes) ─────────── */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Matière <span className="text-red-500">*</span>
                </label>
                <select
                  {...register("subject")}
                  disabled={isSubmitting}
                  className={`w-full border rounded-lg px-3 py-2.5 text-sm bg-white
                    focus:outline-none focus:ring-2 focus:ring-[#1a2744]
                    disabled:bg-gray-50 transition-colors
                    ${errors.subject ? "border-red-400" : "border-gray-300"}`}
                >
                  {SUBJECTS.map((s) => (
                    <option key={s} value={s}>{s}</option>
                  ))}
                </select>
                <FieldError message={errors.subject?.message} />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Niveau <span className="text-red-500">*</span>
                </label>
                <select
                  {...register("level")}
                  disabled={isSubmitting}
                  className={`w-full border rounded-lg px-3 py-2.5 text-sm bg-white
                    focus:outline-none focus:ring-2 focus:ring-[#1a2744]
                    disabled:bg-gray-50 transition-colors
                    ${errors.level ? "border-red-400" : "border-gray-300"}`}
                >
                  {LEVELS.map((l) => (
                    <option key={l} value={l}>{l}</option>
                  ))}
                </select>
                <FieldError message={errors.level?.message} />
              </div>
            </div>

            {/* ── Description ───────────────────────────── */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Description <span className="text-red-500">*</span>
              </label>
              <textarea
                rows={3}
                {...register("description")}
                disabled={isSubmitting}
                placeholder="Décrivez le programme, les objectifs et le déroulement des séances..."
                className={`w-full border rounded-lg px-3 py-2.5 text-sm
                  resize-none placeholder-gray-400
                  focus:outline-none focus:ring-2 focus:ring-[#1a2744]
                  disabled:bg-gray-50 transition-colors
                  ${errors.description ? "border-red-400 bg-red-50" : "border-gray-300"}`}
              />
              <FieldError message={errors.description?.message} />
            </div>

            {/* ── Quartier ──────────────────────────────── */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Lieu / Quartier <span className="text-red-500">*</span>
              </label>
              <select
                {...register("location")}
                disabled={isSubmitting}
                className={`w-full border rounded-lg px-3 py-2.5 text-sm bg-white
                  focus:outline-none focus:ring-2 focus:ring-[#1a2744]
                  disabled:bg-gray-50 transition-colors
                  ${errors.location ? "border-red-400" : "border-gray-300"}`}
              >
                {DISTRICTS.map((d) => (
                  <option key={d} value={d}>{d}</option>
                ))}
              </select>
              <FieldError message={errors.location?.message} />
            </div>

            {/* ── Jours de séance ───────────────────────── */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Jours de séance <span className="text-red-500">*</span>
              </label>
              <div className="flex flex-wrap gap-2">
                {SCHEDULE_DAYS.map((day) => {
                  const isChecked = (watchedDays ?? []).includes(day.value);
                  return (
                    <button
                      key={day.value}
                      type="button"
                      onClick={() => toggleDay(day.value)}
                      disabled={isSubmitting}
                      className={`
                        px-3 py-2 rounded-lg text-sm font-medium
                        border-2 transition-all duration-150
                        ${isChecked
                          ? "bg-[#1a2744] text-white border-[#1a2744]"
                          : "bg-white text-gray-600 border-gray-300 hover:border-[#1a2744]"
                        }
                        disabled:opacity-50 disabled:cursor-not-allowed
                      `}
                    >
                      {day.label}
                    </button>
                  );
                })}
              </div>
              {errors.scheduleDays && (
                <FieldError message={errors.scheduleDays.message} />
              )}
            </div>

            {/* ── Horaire ───────────────────────────────── */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Horaire des séances <span className="text-red-500">*</span>
              </label>
              <select
                {...register("scheduleTime")}
                disabled={isSubmitting}
                className={`w-full border rounded-lg px-3 py-2.5 text-sm bg-white
                  focus:outline-none focus:ring-2 focus:ring-[#1a2744]
                  disabled:bg-gray-50 transition-colors
                  ${errors.scheduleTime ? "border-red-400" : "border-gray-300"}`}
              >
                {SCHEDULE_TIMES.map((t) => (
                  <option key={t} value={t}>{t}</option>
                ))}
              </select>
              <FieldError message={errors.scheduleTime?.message} />
            </div>

            {/* ── Capacité + Prix (2 colonnes) ──────────── */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Capacité max <span className="text-red-500">*</span>
                </label>
                <input
                  type="number"
                  min={2}
                  max={15}
                  {...register("maxCapacity", { valueAsNumber: true })}
                  disabled={isSubmitting}
                  className={`w-full border rounded-lg px-3 py-2.5 text-sm
                    focus:outline-none focus:ring-2 focus:ring-[#1a2744]
                    disabled:bg-gray-50 transition-colors
                    ${errors.maxCapacity ? "border-red-400 bg-red-50" : "border-gray-300"}`}
                />
                <p className="text-xs text-gray-400 mt-0.5">
                  Entre 2 et 15 élèves
                </p>
                <FieldError message={errors.maxCapacity?.message} />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Prix mensuel (FCFA) <span className="text-red-500">*</span>
                </label>
                <input
                  type="number"
                  min={1000}
                  step={500}
                  {...register("pricePerMonth", { valueAsNumber: true })}
                  disabled={isSubmitting}
                  className={`w-full border rounded-lg px-3 py-2.5 text-sm
                    focus:outline-none focus:ring-2 focus:ring-[#1a2744]
                    disabled:bg-gray-50 transition-colors
                    ${errors.pricePerMonth ? "border-red-400 bg-red-50" : "border-gray-300"}`}
                />
                <FieldError message={errors.pricePerMonth?.message} />
              </div>
            </div>

            {/* ── Aperçu revenu potentiel ───────────────── */}
            {watchedPrice > 0 && watchedMax > 0 && (
              <div className="bg-[#f5a623]/10 border border-[#f5a623]/30
                              rounded-lg px-4 py-3">
                <p className="text-sm text-[#1a2744]">
                  💰 Revenu potentiel si groupe plein :{" "}
                  <strong>
                    {(watchedPrice * watchedMax).toLocaleString("fr-FR")} FCFA / mois
                  </strong>
                </p>
              </div>
            )}

            {/* ── Thèmes abordés ────────────────────────── */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Thèmes abordés{" "}
                <span className="text-gray-400 font-normal">(optionnel)</span>
              </label>
              <input
                type="text"
                {...register("themes")}
                disabled={isSubmitting}
                placeholder="ex: Intégrales, Probabilités, Suites numériques"
                className="w-full border border-gray-300 rounded-lg px-3
                           py-2.5 text-sm focus:outline-none
                           focus:ring-2 focus:ring-[#1a2744]
                           disabled:bg-gray-50 transition-colors"
              />
              <p className="text-xs text-gray-400 mt-0.5">
                Séparez les thèmes par des virgules
              </p>
              <FieldError message={errors.themes?.message} />
            </div>
          </div>

          {/* Footer : boutons */}
          <div className="px-6 pb-6 flex gap-3 border-t border-gray-100 pt-4">
            <button
              type="button"
              onClick={onClose}
              disabled={isSubmitting}
              className="flex-1 py-2.5 rounded-lg border border-gray-300
                         text-gray-700 font-medium text-sm
                         hover:bg-gray-50 transition-colors
                         disabled:opacity-40 disabled:cursor-not-allowed"
            >
              Annuler
            </button>

            <button
              type="submit"
              disabled={isSubmitting}
              className="flex-1 py-2.5 rounded-lg bg-[#f5a623]
                         text-[#1a2744] font-bold text-sm
                         hover:bg-[#e09415] transition-colors shadow-md
                         disabled:opacity-60 disabled:cursor-not-allowed
                         flex items-center justify-center gap-2"
            >
              {isSubmitting ? (
                <>
                  <svg className="animate-spin w-4 h-4" viewBox="0 0 24 24" fill="none">
                    <circle className="opacity-25" cx="12" cy="12" r="10"
                      stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-75" fill="currentColor"
                      d="M4 12a8 8 0 018-8v8z" />
                  </svg>
                  {isEditMode ? "Modification..." : "Création..."}
                </>
              ) : (
                isEditMode ? "✅ Enregistrer les modifications" : "✅ Créer le groupe"
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

// ── Message d'erreur de champ ─────────────────────────────────
const FieldError: React.FC<{ message?: string }> = ({ message }) => {
  if (!message) return null;
  return (
    <p className="text-red-500 text-xs mt-1 flex items-center gap-1">
      ⚠ {message}
    </p>
  );
};

export default GroupFormModal;