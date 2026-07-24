// ============================================================
// FICHIER : src/pages/tutor/TutorSettingsPage.tsx
// RÔLE    : Page principale "Paramètres" de l'espace répétiteur.
//           Organisée en 4 onglets :
//             👤 Profil        → modifier infos personnelles
//             📚 Matières      → gérer les matières enseignées
//             🔒 Sécurité      → changer le mot de passe
//             🔔 Notifications → préférences SMS / email
//
// ROUTING : /repetiteur/parametres (protégé par TutorLayout)
// ⚠️ BACKEND : Données via useSettings.ts → settingsService.ts
// ============================================================

import React from "react";
import { useSettings } from "../../hooks/useSettings";
import ProfileSection       from "../../components/tutor/settings/ProfileSection";
import SubjectsSection      from "../../components/tutor/settings/SubjectsSection";
import SecuritySection      from "../../components/tutor/settings/SecuritySection";
import NotificationsSection from "../../components/tutor/settings/NotificationsSection";
import { SETTINGS_TABS }    from "../../types/settings.types";
import type { SettingsSection } from "../../types/settings.types";

const TutorSettingsPage: React.FC = () => {

  // ── Toute la logique via le hook ──────────────────────────
  const {
    activeTab,
    setActiveTab,

    profile,
    isLoadingProfile,
    handleUpdateProfile,
    isUpdatingProfile,
    profileSuccess,
    profileError,

    subjects,
    isLoadingSubjects,
    handleAddSubject,
    handleRemoveSubject,
    isAddingSubject,
    isRemovingSubject,
    removingSubjectId,

    handleChangePassword,
    isChangingPassword,
    passwordSuccess,
    passwordError,

    notifPrefs,
    isLoadingNotifs,
    handleUpdateNotifs,
    isUpdatingNotifs,
    notifsSuccess,
  } = useSettings();

  return (
    <div className="space-y-6 max-w-3xl mx-auto">

      {/* ── En-tête ──────────────────────────────────────── */}
      <div>
        <h1 className="text-xl font-bold text-[#1a2744]">
          ⚙️ Paramètres
        </h1>
        <p className="text-sm text-gray-500 mt-0.5">
          Gérez votre profil, vos matières et vos préférences.
        </p>
      </div>

      {/* ── Onglets de navigation ─────────────────────────── */}
      <div className="bg-white rounded-xl border border-gray-200
                      shadow-sm overflow-hidden">

        {/* Barre d'onglets */}
        <div className="flex border-b border-gray-200 overflow-x-auto">
          {SETTINGS_TABS.map((tab) => {
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                type="button"
                onClick={() => setActiveTab(tab.id as SettingsSection)}
                className={`
                  flex items-center gap-2 px-5 py-3.5
                  text-sm font-medium whitespace-nowrap
                  border-b-2 transition-all duration-150
                  flex-shrink-0
                  ${isActive
                    ? "border-[#f5a623] text-[#1a2744] bg-[#f5a623]/5"
                    : "border-transparent text-gray-500 hover:text-[#1a2744] hover:bg-gray-50"
                  }
                `}
              >
                <span>{tab.icon}</span>
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>

        {/* ── Contenu de l'onglet actif ──────────────────── */}
        <div className="p-6">

          {/* Onglet Profil */}
          {activeTab === "profile" && (
            <ProfileSection
              profile={profile}
              isLoading={isLoadingProfile}
              onSubmit={handleUpdateProfile}
              isSubmitting={isUpdatingProfile}
              success={profileSuccess}
              error={profileError}
            />
          )}

          {/* Onglet Matières */}
          {activeTab === "subjects" && (
            <SubjectsSection
              subjects={subjects as any[]}
              isLoading={isLoadingSubjects}
              onAdd={handleAddSubject}
              onRemove={handleRemoveSubject}
              isAdding={isAddingSubject}
              isRemoving={isRemovingSubject}
              removingId={removingSubjectId}
            />
          )}

          {/* Onglet Sécurité */}
          {activeTab === "security" && (
            <SecuritySection
              onSubmit={handleChangePassword}
              isSubmitting={isChangingPassword}
              success={passwordSuccess}
              error={passwordError}
            />
          )}

          {/* Onglet Notifications */}
          {activeTab === "notifications" && (
            <NotificationsSection
              prefs={notifPrefs}
              isLoading={isLoadingNotifs}
              onSave={handleUpdateNotifs}
              isSaving={isUpdatingNotifs}
              success={notifsSuccess}
            />
          )}
        </div>
      </div>
    </div>
  );
};

export default TutorSettingsPage;