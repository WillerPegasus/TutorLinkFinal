// ============================================================
// FICHIER : src/hooks/useSettings.ts
// RÔLE    : Hook central de la page Paramètres.
//           Gère : onglet actif, chargement de toutes les
//           données, et toutes les mutations (profil, matières,
//           mot de passe, notifications).
//
// ⚠️ BACKEND : Orchestre tous les appels via settingsService.ts
// ============================================================

import { useState, useCallback } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  getTutorProfile,
  updateTutorProfile,
  getTutorSubjects,
  addTutorSubject,
  removeTutorSubject,
  changePassword,
  getNotificationPreferences,
  updateNotificationPreferences,
} from "../services/settingsService";
import type {
  TutorProfile,
  ChangePasswordData,
  NotificationPreferences,
  SettingsSection,
} from "../types/settings.types";

// ── Interface de retour du hook ───────────────────────────────

interface UseSettingsReturn {
  // Onglet actif
  activeTab: SettingsSection;
  setActiveTab: (tab: SettingsSection) => void;

  // ── Profil ───────────────────────────────────────────────
  profile: TutorProfile | undefined;
  isLoadingProfile: boolean;
  handleUpdateProfile: (data: TutorProfile) => void;
  isUpdatingProfile: boolean;
  profileSuccess: boolean;
  profileError: string | null;

  // ── Matières ─────────────────────────────────────────────
  subjects: ReturnType<typeof useQuery>["data"];
  isLoadingSubjects: boolean;
  handleAddSubject: (name: string, level: string) => void;
  handleRemoveSubject: (id: string) => void;
  isAddingSubject: boolean;
  isRemovingSubject: boolean;
  removingSubjectId: string | null;

  // ── Sécurité ─────────────────────────────────────────────
  handleChangePassword: (data: ChangePasswordData) => void;
  isChangingPassword: boolean;
  passwordSuccess: boolean;
  passwordError: string | null;

  // ── Notifications ─────────────────────────────────────────
  notifPrefs: NotificationPreferences | undefined;
  isLoadingNotifs: boolean;
  handleUpdateNotifs: (prefs: NotificationPreferences) => void;
  isUpdatingNotifs: boolean;
  notifsSuccess: boolean;
}

// ── Hook ─────────────────────────────────────────────────────

export function useSettings(): UseSettingsReturn {
  const queryClient = useQueryClient();

  // Onglet actif (défaut : profil)
  const [activeTab, setActiveTab] = useState<SettingsSection>("profile");

  // Messages de succès temporaires (3 secondes)
  const [profileSuccess, setProfileSuccess] = useState(false);
  const [profileError,   setProfileError]   = useState<string | null>(null);
  const [passwordSuccess, setPasswordSuccess] = useState(false);
  const [passwordError,   setPasswordError]   = useState<string | null>(null);
  const [notifsSuccess,   setNotifsSuccess]   = useState(false);

  // ID de la matière en cours de suppression
  const [removingSubjectId, setRemovingSubjectId] = useState<string | null>(null);

  // ── Chargement du profil ─────────────────────────────────
  // ⚠️ BACKEND : GET /api/tutor/profile
  const {
    data: profile,
    isLoading: isLoadingProfile,
  } = useQuery({
    queryKey: ["tutor-settings-profile"],
    queryFn: getTutorProfile,
    staleTime: 5 * 60 * 1000,
  });

  // ── Chargement des matières ──────────────────────────────
  // ⚠️ BACKEND : GET /api/tutor/subjects
  const {
    data: subjects,
    isLoading: isLoadingSubjects,
  } = useQuery({
    queryKey: ["tutor-settings-subjects"],
    queryFn: getTutorSubjects,
    staleTime: 5 * 60 * 1000,
  });

  // ── Chargement des préférences notifications ─────────────
  // ⚠️ BACKEND : GET /api/tutor/notifications/preferences
  const {
    data: notifPrefs,
    isLoading: isLoadingNotifs,
  } = useQuery({
    queryKey: ["tutor-settings-notifs"],
    queryFn: getNotificationPreferences,
    staleTime: 5 * 60 * 1000,
  });

  // ── Mutation : mettre à jour le profil ───────────────────
  // ⚠️ BACKEND : PUT /api/tutor/profile
  const updateProfileMutation = useMutation({
    mutationFn: updateTutorProfile,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["tutor-settings-profile"] });
      setProfileSuccess(true);
      setProfileError(null);
      // Masque le message de succès après 3 secondes
      setTimeout(() => setProfileSuccess(false), 3000);
    },
    onError: () => {
      setProfileError("Impossible de mettre à jour le profil. Réessayez.");
    },
  });

  // ── Mutation : ajouter une matière ───────────────────────
  // ⚠️ BACKEND : POST /api/tutor/subjects
  const addSubjectMutation = useMutation({
    mutationFn: ({ name, level }: { name: string; level: string }) =>
      addTutorSubject(name, level),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["tutor-settings-subjects"] });
    },
  });

  // ── Mutation : supprimer une matière ─────────────────────
  // ⚠️ BACKEND : DELETE /api/tutor/subjects/:id
  const removeSubjectMutation = useMutation({
    mutationFn: removeTutorSubject,
    onMutate: (id) => setRemovingSubjectId(id),
    onSettled: () => setRemovingSubjectId(null),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["tutor-settings-subjects"] });
    },
  });

  // ── Mutation : changer le mot de passe ───────────────────
  // ⚠️ BACKEND : PUT /api/tutor/security/password
  const changePasswordMutation = useMutation({
    mutationFn: changePassword,
    onSuccess: () => {
      setPasswordSuccess(true);
      setPasswordError(null);
      setTimeout(() => setPasswordSuccess(false), 3000);
    },
    onError: (error) => {
      setPasswordError(
        error instanceof Error
          ? error.message
          : "Erreur lors du changement de mot de passe."
      );
    },
  });

  // ── Mutation : mettre à jour les notifications ───────────
  // ⚠️ BACKEND : PUT /api/tutor/notifications/preferences
  const updateNotifsMutation = useMutation({
    mutationFn: updateNotificationPreferences,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["tutor-settings-notifs"] });
      setNotifsSuccess(true);
      setTimeout(() => setNotifsSuccess(false), 3000);
    },
  });

  // ── Handlers exposés ──────────────────────────────────────

  const handleUpdateProfile = useCallback(
    (data: TutorProfile) => {
      setProfileError(null);
      updateProfileMutation.mutate(data);
    },
    [updateProfileMutation]
  );

  const handleAddSubject = useCallback(
    (name: string, level: string) => {
      addSubjectMutation.mutate({ name, level });
    },
    [addSubjectMutation]
  );

  const handleRemoveSubject = useCallback(
    (id: string) => {
      removeSubjectMutation.mutate(id);
    },
    [removeSubjectMutation]
  );

  const handleChangePassword = useCallback(
    (data: ChangePasswordData) => {
      setPasswordError(null);
      changePasswordMutation.mutate(data);
    },
    [changePasswordMutation]
  );

  const handleUpdateNotifs = useCallback(
    (prefs: NotificationPreferences) => {
      updateNotifsMutation.mutate(prefs);
    },
    [updateNotifsMutation]
  );

  return {
    activeTab,
    setActiveTab,

    profile,
    isLoadingProfile,
    handleUpdateProfile,
    isUpdatingProfile: updateProfileMutation.isPending,
    profileSuccess,
    profileError,

    subjects,
    isLoadingSubjects,
    handleAddSubject,
    handleRemoveSubject,
    isAddingSubject:   addSubjectMutation.isPending,
    isRemovingSubject: removeSubjectMutation.isPending,
    removingSubjectId,

    handleChangePassword,
    isChangingPassword: changePasswordMutation.isPending,
    passwordSuccess,
    passwordError,

    notifPrefs,
    isLoadingNotifs,
    handleUpdateNotifs,
    isUpdatingNotifs: updateNotifsMutation.isPending,
    notifsSuccess,
  };
}