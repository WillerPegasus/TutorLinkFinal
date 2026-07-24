// ============================================================
// FICHIER : src/components/tutor/settings/NotificationsSection.tsx
// RÔLE    : Section "Notifications" des paramètres.
//           Toggles pour activer/désactiver les notifications
//           SMS et email du répétiteur.
//
// ⚠️ BACKEND :
//   GET /api/tutor/notifications/preferences
//   PUT /api/tutor/notifications/preferences
// ============================================================

import React, { useState, useEffect } from "react";
import type { NotificationPreferences } from "../../../types/settings.types";

interface NotificationsSectionProps {
  prefs: NotificationPreferences | undefined;
  isLoading: boolean;
  onSave: (prefs: NotificationPreferences) => void;
  isSaving: boolean;
  success: boolean;
}

const NotificationsSection: React.FC<NotificationsSectionProps> = ({
  prefs,
  isLoading,
  onSave,
  isSaving,
  success,
}) => {

  // État local des préférences (copie locale pour les toggles)
  const [localPrefs, setLocalPrefs] = useState<NotificationPreferences>({
    smsNewRequest:       true,
    smsPaymentReceived:  true,
    smsNewReview:        false,
    emailWeeklySummary:  true,
    emailNewRequest:     false,
  });

  // Synchronise quand les données de l'API arrivent
  useEffect(() => {
    if (prefs) setLocalPrefs({ ...prefs });
  }, [prefs]);

  // Toggle un champ booléen
  const toggle = (key: keyof NotificationPreferences) => {
    setLocalPrefs((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  // ── Skeleton ──────────────────────────────────────────────
  if (isLoading) {
    return (
      <div className="space-y-4 animate-pulse">
        {[1, 2, 3, 4, 5].map((i) => (
          <div key={i}
               className="h-14 bg-gray-100 rounded-lg" />
        ))}
      </div>
    );
  }

  // Configuration des notifications à afficher
  const smsNotifs: {
    key: keyof NotificationPreferences;
    label: string;
    description: string;
  }[] = [
    {
      key: "smsNewRequest",
      label: "Nouvelle demande de cours",
      description: "Recevez un SMS dès qu'un élève fait une demande",
    },
    {
      key: "smsPaymentReceived",
      label: "Paiement reçu",
      description: "SMS de confirmation après chaque paiement Mobile Money",
    },
    {
      key: "smsNewReview",
      label: "Nouvel avis posté",
      description: "SMS quand un élève ou parent laisse un avis",
    },
  ];

  const emailNotifs: {
    key: keyof NotificationPreferences;
    label: string;
    description: string;
  }[] = [
    {
      key: "emailWeeklySummary",
      label: "Récapitulatif hebdomadaire",
      description: "Email chaque lundi avec vos stats de la semaine",
    },
    {
      key: "emailNewRequest",
      label: "Nouvelle demande de cours",
      description: "Email en plus du SMS pour chaque nouvelle demande",
    },
  ];

  return (
    <div className="space-y-6">

      {/* Bannière succès */}
      {success && (
        <div className="bg-green-50 border border-green-200 rounded-lg
                        px-4 py-3 flex items-center gap-2
                        text-green-700 text-sm">
          ✅ Préférences de notifications mises à jour !
        </div>
      )}

      {/* ── Notifications SMS ────────────────────────────── */}
      <div>
        <div className="flex items-center gap-2 mb-3">
          <span className="text-lg">📱</span>
          <h3 className="text-sm font-bold text-[#1a2744]">
            Notifications SMS
          </h3>
        </div>

        <div className="space-y-2">
          {smsNotifs.map(({ key, label, description }) => (
            <ToggleRow
              key={key}
              label={label}
              description={description}
              checked={localPrefs[key]}
              onChange={() => toggle(key)}
              disabled={isSaving}
            />
          ))}
        </div>
      </div>

      {/* ── Notifications Email ───────────────────────────── */}
      <div>
        <div className="flex items-center gap-2 mb-3">
          <span className="text-lg">📧</span>
          <h3 className="text-sm font-bold text-[#1a2744]">
            Notifications Email
          </h3>
        </div>

        <div className="space-y-2">
          {emailNotifs.map(({ key, label, description }) => (
            <ToggleRow
              key={key}
              label={label}
              description={description}
              checked={localPrefs[key]}
              onChange={() => toggle(key)}
              disabled={isSaving}
            />
          ))}
        </div>
      </div>

      {/* Note informative */}
      <div className="bg-blue-50 border border-blue-200 rounded-lg px-4 py-3">
        <p className="text-xs text-blue-700 leading-relaxed">
          ℹ️ Les SMS sont envoyés sur votre numéro de téléphone enregistré
          dans votre profil. Assurez-vous qu'il est à jour.
          {/* ⚠️ BACKEND : Intégration avec API MTN/Orange pour les SMS */}
        </p>
      </div>

      {/* Bouton Enregistrer */}
      <div className="flex justify-end">
        <button
          type="button"
          onClick={() => onSave(localPrefs)}
          disabled={isSaving}
          className="
            flex items-center gap-2 px-8 py-2.5 rounded-lg
            bg-[#f5a623] text-[#1a2744] font-bold text-sm
            hover:bg-[#e09415] transition-colors shadow-md
            disabled:opacity-50 disabled:cursor-not-allowed
          "
        >
          {isSaving ? (
            <>
              <svg className="animate-spin w-4 h-4" viewBox="0 0 24 24" fill="none">
                <circle className="opacity-25" cx="12" cy="12" r="10"
                  stroke="currentColor" strokeWidth="4" />
                <path className="opacity-75" fill="currentColor"
                  d="M4 12a8 8 0 018-8v8z" />
              </svg>
              Enregistrement...
            </>
          ) : (
            "💾 Enregistrer"
          )}
        </button>
      </div>
    </div>
  );
};

// ── Toggle switch ─────────────────────────────────────────────
const ToggleRow: React.FC<{
  label: string;
  description: string;
  checked: boolean;
  onChange: () => void;
  disabled: boolean;
}> = ({ label, description, checked, onChange, disabled }) => (
  <div className={`
    flex items-center justify-between
    bg-gray-50 border border-gray-200 rounded-lg px-4 py-3
    transition-colors
    ${checked ? "bg-blue-50 border-blue-200" : ""}
  `}>
    <div className="flex-1 min-w-0 pr-4">
      <p className="text-sm font-medium text-[#1a2744]">{label}</p>
      <p className="text-xs text-gray-500 mt-0.5">{description}</p>
    </div>

    {/* Toggle switch */}
    <button
      type="button"
      role="switch"
      aria-checked={checked}
      onClick={onChange}
      disabled={disabled}
      className={`
        relative flex-shrink-0 w-11 h-6 rounded-full
        transition-colors duration-200 focus:outline-none
        disabled:opacity-50 disabled:cursor-not-allowed
        ${checked ? "bg-[#1a2744]" : "bg-gray-300"}
      `}
    >
      <span
        className={`
          absolute top-0.5 left-0.5 w-5 h-5 rounded-full bg-white
          shadow-sm transition-transform duration-200
          ${checked ? "translate-x-5" : "translate-x-0"}
        `}
      />
    </button>
  </div>
);

export default NotificationsSection;