// ============================================================
// FICHIER : src/components/tutor/settings/SecuritySection.tsx
// RÔLE    : Section "Sécurité" des paramètres.
//           Formulaire pour changer le mot de passe avec
//           confirmation et affichage/masquage du mot de passe.
//
// ⚠️ BACKEND : PUT /api/tutor/security/password
// ============================================================

import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import type { ChangePasswordData } from "../../../types/settings.types";

// ── Schéma de validation ──────────────────────────────────────
const passwordSchema = z
  .object({
    currentPassword: z
      .string()
      .min(1, "Mot de passe actuel requis"),

    newPassword: z
      .string()
      .min(8, "Le nouveau mot de passe doit faire au moins 8 caractères")
      .regex(/[A-Z]/, "Doit contenir au moins une majuscule")
      .regex(/[0-9]/, "Doit contenir au moins un chiffre"),

    confirmPassword: z
      .string()
      .min(1, "Confirmez le nouveau mot de passe"),
  })
  .refine((data) => data.newPassword === data.confirmPassword, {
    message: "Les mots de passe ne correspondent pas",
    path: ["confirmPassword"],
  });

type PasswordFormValues = z.infer<typeof passwordSchema>;

// ── Props ─────────────────────────────────────────────────────
interface SecuritySectionProps {
  onSubmit: (data: ChangePasswordData) => void;
  isSubmitting: boolean;
  success: boolean;
  error: string | null;
}

// ── Composant ─────────────────────────────────────────────────
const SecuritySection: React.FC<SecuritySectionProps> = ({
  onSubmit,
  isSubmitting,
  success,
  error,
}) => {

  // États pour afficher/masquer les mots de passe
  const [showCurrent, setShowCurrent] = useState(false);
  const [showNew,     setShowNew]     = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  const {
    register,
    handleSubmit,
    reset,
    watch,
    formState: { errors },
  } = useForm<PasswordFormValues>({
    resolver: zodResolver(passwordSchema),
    defaultValues: {
      currentPassword: "",
      newPassword:     "",
      confirmPassword: "",
    },
  });

  // Soumet et réinitialise le formulaire si succès
  const handleFormSubmit = (data: PasswordFormValues) => {
    onSubmit(data);
  };

  // Réinitialise après succès
  React.useEffect(() => {
    if (success) reset();
  }, [success, reset]);

  // Force du nouveau mot de passe
  const newPassword = watch("newPassword") ?? "";
  const strength = getPasswordStrength(newPassword);

  return (
    <div className="space-y-6">

      {/* ── Bannière succès ───────────────────────────────── */}
      {success && (
        <div className="bg-green-50 border border-green-200 rounded-lg
                        px-4 py-3 flex items-center gap-2 text-green-700 text-sm">
          ✅ Mot de passe modifié avec succès !
        </div>
      )}

      {/* ── Bannière erreur ───────────────────────────────── */}
      {error && (
        <div className="bg-red-50 border border-red-200 rounded-lg
                        px-4 py-3 flex items-center gap-2 text-red-700 text-sm">
          ❌ {error}
        </div>
      )}

      {/* ── Formulaire ────────────────────────────────────── */}
      <form onSubmit={handleSubmit(handleFormSubmit)} noValidate>
        <div className="space-y-4">

          {/* Mot de passe actuel */}
          <PasswordField
            id="currentPassword"
            label="Mot de passe actuel"
            required
            show={showCurrent}
            onToggleShow={() => setShowCurrent(!showCurrent)}
            error={errors.currentPassword?.message}
            disabled={isSubmitting}
            registration={register("currentPassword")}
            placeholder="Votre mot de passe actuel"
          />

          {/* Nouveau mot de passe */}
          <PasswordField
            id="newPassword"
            label="Nouveau mot de passe"
            required
            show={showNew}
            onToggleShow={() => setShowNew(!showNew)}
            error={errors.newPassword?.message}
            disabled={isSubmitting}
            registration={register("newPassword")}
            placeholder="Minimum 8 caractères"
          />

          {/* Indicateur de force */}
          {newPassword.length > 0 && (
            <PasswordStrengthBar strength={strength} />
          )}

          {/* Confirmation */}
          <PasswordField
            id="confirmPassword"
            label="Confirmer le nouveau mot de passe"
            required
            show={showConfirm}
            onToggleShow={() => setShowConfirm(!showConfirm)}
            error={errors.confirmPassword?.message}
            disabled={isSubmitting}
            registration={register("confirmPassword")}
            placeholder="Répétez le nouveau mot de passe"
          />
        </div>

        {/* Règles de sécurité */}
        <div className="mt-4 bg-gray-50 border border-gray-200
                        rounded-lg px-4 py-3">
          <p className="text-xs font-semibold text-gray-600 mb-2">
            📋 Règles du mot de passe :
          </p>
          <ul className="space-y-1">
            {[
              { rule: "Au moins 8 caractères",     ok: newPassword.length >= 8 },
              { rule: "Au moins une majuscule",     ok: /[A-Z]/.test(newPassword) },
              { rule: "Au moins un chiffre",        ok: /[0-9]/.test(newPassword) },
            ].map(({ rule, ok }) => (
              <li key={rule}
                  className={`text-xs flex items-center gap-2 ${
                    ok ? "text-green-600" : "text-gray-400"
                  }`}>
                <span>{ok ? "✅" : "⭕"}</span>
                {rule}
              </li>
            ))}
          </ul>
        </div>

        {/* Bouton */}
        <div className="mt-6 flex justify-end">
          <button
            type="submit"
            disabled={isSubmitting}
            className="
              flex items-center gap-2 px-8 py-2.5 rounded-lg
              bg-[#1a2744] text-white font-bold text-sm
              hover:bg-[#243566] transition-colors shadow-md
              disabled:opacity-50 disabled:cursor-not-allowed
            "
          >
            {isSubmitting ? (
              <>
                <svg className="animate-spin w-4 h-4" viewBox="0 0 24 24" fill="none">
                  <circle className="opacity-25" cx="12" cy="12" r="10"
                    stroke="currentColor" strokeWidth="4" />
                  <path className="opacity-75" fill="currentColor"
                    d="M4 12a8 8 0 018-8v8z" />
                </svg>
                Modification...
              </>
            ) : (
              "🔒 Changer le mot de passe"
            )}
          </button>
        </div>
      </form>
    </div>
  );
};

// ── Champ mot de passe avec toggle ───────────────────────────
const PasswordField: React.FC<{
  id: string;
  label: string;
  required?: boolean;
  show: boolean;
  onToggleShow: () => void;
  error?: string;
  disabled: boolean;
  registration: ReturnType<any>;
  placeholder: string;
}> = ({ id, label, required, show, onToggleShow, error, disabled,
        registration, placeholder }) => (
  <div>
    <label htmlFor={id}
           className="block text-sm font-medium text-gray-700 mb-1">
      {label}
      {required && <span className="text-red-500 ml-1">*</span>}
    </label>
    <div className="relative">
      <input
        id={id}
        type={show ? "text" : "password"}
        {...registration}
        disabled={disabled}
        placeholder={placeholder}
        className={`
          w-full border rounded-lg px-3 py-2.5 text-sm pr-10
          focus:outline-none focus:ring-2 focus:ring-[#1a2744]
          disabled:bg-gray-50 transition-colors
          ${error ? "border-red-400 bg-red-50" : "border-gray-300"}
        `}
      />
      {/* Bouton afficher/masquer */}
      <button
        type="button"
        onClick={onToggleShow}
        className="absolute right-3 top-1/2 -translate-y-1/2
                   text-gray-400 hover:text-gray-600 text-sm"
        aria-label={show ? "Masquer" : "Afficher"}
      >
        {show ? "🙈" : "👁"}
      </button>
    </div>
    {error && (
      <p className="text-red-500 text-xs mt-1 flex items-center gap-1">
        ⚠ {error}
      </p>
    )}
  </div>
);

// ── Calcul de la force du mot de passe ───────────────────────
function getPasswordStrength(password: string): number {
  let score = 0;
  if (password.length >= 8)         score++;
  if (/[A-Z]/.test(password))       score++;
  if (/[0-9]/.test(password))       score++;
  if (/[^A-Za-z0-9]/.test(password)) score++;
  return score;
}

// ── Barre de force ────────────────────────────────────────────
const PasswordStrengthBar: React.FC<{ strength: number }> = ({ strength }) => {
  const config = [
    { label: "Très faible", color: "bg-red-500" },
    { label: "Faible",      color: "bg-orange-400" },
    { label: "Moyen",       color: "bg-amber-400" },
    { label: "Fort",        color: "bg-green-400" },
    { label: "Très fort",   color: "bg-green-600" },
  ];
  const { label, color } = config[strength] ?? config[0];

  return (
    <div>
      <div className="flex gap-1 mb-1">
        {[0, 1, 2, 3].map((i) => (
          <div
            key={i}
            className={`h-1.5 flex-1 rounded-full transition-all duration-300 ${
              i < strength ? color : "bg-gray-200"
            }`}
          />
        ))}
      </div>
      <p className={`text-xs font-medium ${
        strength <= 1 ? "text-red-500" :
        strength === 2 ? "text-amber-500" :
        "text-green-600"
      }`}>
        Force : {label}
      </p>
    </div>
  );
};

export default SecuritySection;