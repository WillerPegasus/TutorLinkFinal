// ============================================================
// FICHIER : src/components/tutor/settings/ProfileSection.tsx
// RÔLE    : Section "Profil" des paramètres.
//           Formulaire pour modifier : prénom, nom, email,
//           téléphone, quartier, biographie, tarif, formation.
//           Validation avec react-hook-form + Zod.
//
// ⚠️ BACKEND : PUT /api/tutor/profile
// ============================================================

import React, { useEffect } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import type { TutorProfile } from "../../../types/settings.types";
import { SETTING_DISTRICTS } from "../../../types/settings.types";

// ── Schéma de validation ──────────────────────────────────────
const profileSchema = z.object({
  firstName: z.string().min(2, "Minimum 2 caractères"),
  lastName:  z.string().min(2, "Minimum 2 caractères"),
  email:     z.string().email("Adresse email invalide"),
  phone:     z.string().min(9, "Numéro de téléphone invalide"),
  district:  z.string().min(1, "Choisissez un quartier"),
  bio: z
    .string()
    .min(20, "La bio doit faire au moins 20 caractères")
    .max(500, "Maximum 500 caractères"),
  pricePerHour: z
    .number()
    .min(500,   "Prix minimum : 500 FCFA")
    .max(20000, "Prix maximum : 20 000 FCFA"),
  formation: z.string().min(5, "Décrivez votre formation"),
  avatarUrl: z.string().optional(),
});

type ProfileFormValues = z.infer<typeof profileSchema>;

// ── Props ─────────────────────────────────────────────────────
interface ProfileSectionProps {
  profile: TutorProfile | undefined;
  isLoading: boolean;
  onSubmit: (data: TutorProfile) => void;
  isSubmitting: boolean;
  success: boolean;
  error: string | null;
}

// ── Composant ─────────────────────────────────────────────────
const ProfileSection: React.FC<ProfileSectionProps> = ({
  profile,
  isLoading,
  onSubmit,
  isSubmitting,
  success,
  error,
}) => {

  const {
    register,
    handleSubmit,
    reset,
    watch,
    formState: { errors, isDirty },
  } = useForm<ProfileFormValues>({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      firstName:    "",
      lastName:     "",
      email:        "",
      phone:        "",
      district:     "Centre Dschang",
      bio:          "",
      pricePerHour: 2000,
      formation:    "",
      avatarUrl:    "",
    },
  });

  // Pré-remplit quand le profil est chargé
  useEffect(() => {
    if (profile) {
      reset({
        firstName:    profile.firstName,
        lastName:     profile.lastName,
        email:        profile.email,
        phone:        profile.phone,
        district:     profile.district,
        bio:          profile.bio,
        pricePerHour: profile.pricePerHour,
        formation:    profile.formation,
        avatarUrl:    profile.avatarUrl ?? "",
      });
    }
  }, [profile, reset]);

  const bioLength = watch("bio")?.length ?? 0;

  // ── Skeleton ──────────────────────────────────────────────
  if (isLoading) {
    return (
      <div className="space-y-4 animate-pulse">
        {[1, 2, 3, 4, 5].map((i) => (
          <div key={i}>
            <div className="h-3 w-24 bg-gray-200 rounded mb-1" />
            <div className="h-10 bg-gray-100 rounded-lg" />
          </div>
        ))}
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} noValidate>

      {/* Bannière succès */}
      {success && (
        <div className="bg-green-50 border border-green-200 rounded-lg
                        px-4 py-3 mb-5 flex items-center gap-2 text-green-700 text-sm">
          ✅ Profil mis à jour avec succès !
        </div>
      )}

      {/* Bannière erreur */}
      {error && (
        <div className="bg-red-50 border border-red-200 rounded-lg
                        px-4 py-3 mb-5 flex items-center gap-2 text-red-700 text-sm">
          ❌ {error}
        </div>
      )}

      <div className="space-y-5">

        {/* ── Prénom + Nom ─────────────────────────────── */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <FormField
            label="Prénom"
            required
            error={errors.firstName?.message}
          >
            <input
              type="text"
              {...register("firstName")}
              disabled={isSubmitting}
              placeholder="Eric"
              className={inputClass(!!errors.firstName, isSubmitting)}
            />
          </FormField>

          <FormField
            label="Nom"
            required
            error={errors.lastName?.message}
          >
            <input
              type="text"
              {...register("lastName")}
              disabled={isSubmitting}
              placeholder="Kamga"
              className={inputClass(!!errors.lastName, isSubmitting)}
            />
          </FormField>
        </div>

        {/* ── Email ────────────────────────────────────── */}
        <FormField label="Adresse email" required error={errors.email?.message}>
          <input
            type="email"
            {...register("email")}
            disabled={isSubmitting}
            placeholder="e.kamga@tutorlink.cm"
            className={inputClass(!!errors.email, isSubmitting)}
          />
        </FormField>

        {/* ── Téléphone ────────────────────────────────── */}
        <FormField
          label="Téléphone (Mobile Money)"
          required
          error={errors.phone?.message}
          hint="Utilisé pour les paiements MTN MoMo / Orange Money"
        >
          <input
            type="tel"
            {...register("phone")}
            disabled={isSubmitting}
            placeholder="+237 6XX XX XX XX"
            className={inputClass(!!errors.phone, isSubmitting)}
          />
        </FormField>

        {/* ── Quartier ─────────────────────────────────── */}
        <FormField
          label="Quartier à Dschang"
          required
          error={errors.district?.message}
        >
          <select
            {...register("district")}
            disabled={isSubmitting}
            className={selectClass(!!errors.district, isSubmitting)}
          >
            {SETTING_DISTRICTS.map((d) => (
              <option key={d} value={d}>{d}</option>
            ))}
          </select>
        </FormField>

        {/* ── Formation ────────────────────────────────── */}
        <FormField
          label="Formation / Diplôme"
          required
          error={errors.formation?.message}
          hint="Ex: Licence Mathématiques · Université de Dschang"
        >
          <input
            type="text"
            {...register("formation")}
            disabled={isSubmitting}
            placeholder="Licence Mathématiques · Université de Dschang"
            className={inputClass(!!errors.formation, isSubmitting)}
          />
        </FormField>

        {/* ── Tarif horaire ────────────────────────────── */}
        <FormField
          label="Tarif horaire (FCFA / heure)"
          required
          error={errors.pricePerHour?.message}
          hint="Cours individuels : entre 500 et 20 000 FCFA/h"
        >
          <div className="relative">
            <input
              type="number"
              min={500}
              step={100}
              {...register("pricePerHour", { valueAsNumber: true })}
              disabled={isSubmitting}
              className={`${inputClass(!!errors.pricePerHour, isSubmitting)} pr-20`}
            />
            <span className="absolute right-3 top-1/2 -translate-y-1/2
                             text-gray-400 text-sm font-medium">
              FCFA/h
            </span>
          </div>
        </FormField>

        {/* ── Biographie ───────────────────────────────── */}
        <FormField
          label="Biographie"
          required
          error={errors.bio?.message}
        >
          <textarea
            rows={4}
            {...register("bio")}
            disabled={isSubmitting}
            placeholder="Décrivez votre expérience, votre méthode pédagogique et vos spécialités..."
            className={`${inputClass(!!errors.bio, isSubmitting)} resize-none`}
          />
          <div className="flex justify-between mt-1">
            {errors.bio ? (
              <p className="text-red-500 text-xs">⚠ {errors.bio.message}</p>
            ) : (
              <span />
            )}
            <span className="text-xs text-gray-400 ml-auto">
              {bioLength}/500
            </span>
          </div>
        </FormField>
      </div>

      {/* Bouton Enregistrer */}
      <div className="mt-6 flex justify-end">
        <button
          type="submit"
          disabled={isSubmitting || !isDirty}
          className="
            px-8 py-2.5 rounded-lg bg-[#f5a623] text-[#1a2744]
            font-bold text-sm hover:bg-[#e09415] transition-colors
            shadow-md disabled:opacity-50 disabled:cursor-not-allowed
            flex items-center gap-2
          "
        >
          {isSubmitting ? (
            <>
              <Spinner />
              Enregistrement...
            </>
          ) : (
            "💾 Enregistrer les modifications"
          )}
        </button>
      </div>
    </form>
  );
};

// ── Utilitaires internes ──────────────────────────────────────

const inputClass = (hasError: boolean, disabled: boolean) => `
  w-full border rounded-lg px-3 py-2.5 text-sm
  focus:outline-none focus:ring-2 focus:ring-[#1a2744]
  transition-colors
  ${disabled ? "bg-gray-50 text-gray-500" : "bg-white"}
  ${hasError ? "border-red-400 bg-red-50" : "border-gray-300"}
`;

const selectClass = (hasError: boolean, disabled: boolean) => `
  w-full border rounded-lg px-3 py-2.5 text-sm bg-white
  focus:outline-none focus:ring-2 focus:ring-[#1a2744]
  transition-colors
  ${disabled ? "bg-gray-50" : ""}
  ${hasError ? "border-red-400" : "border-gray-300"}
`;

// ── Sous-composant : champ de formulaire ─────────────────────
const FormField: React.FC<{
  label: string;
  required?: boolean;
  error?: string;
  hint?: string;
  children: React.ReactNode;
}> = ({ label, required, error, hint, children }) => (
  <div>
    <label className="block text-sm font-medium text-gray-700 mb-1">
      {label}
      {required && <span className="text-red-500 ml-1">*</span>}
    </label>
    {children}
    {hint && !error && (
      <p className="text-xs text-gray-400 mt-1">{hint}</p>
    )}
    {error && (
      <p className="text-red-500 text-xs mt-1 flex items-center gap-1">
        ⚠ {error}
      </p>
    )}
  </div>
);

// ── Spinner SVG ───────────────────────────────────────────────
const Spinner = () => (
  <svg className="animate-spin w-4 h-4" viewBox="0 0 24 24" fill="none">
    <circle className="opacity-25" cx="12" cy="12" r="10"
      stroke="currentColor" strokeWidth="4" />
    <path className="opacity-75" fill="currentColor"
      d="M4 12a8 8 0 018-8v8z" />
  </svg>
);

export default ProfileSection;