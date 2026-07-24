// ============================================================
// FICHIER : src/hooks/useGroups.ts
// RÔLE    : Hook central de la page Mes groupes.
//           Gère : chargement, création, modification,
//           suppression, et affichage des élèves d'un groupe.
//           Expose aussi les états des modals.
//
// ⚠️ BACKEND : Orchestre tous les appels via groupService.ts
// ============================================================

import { useState, useCallback } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  getTutorGroups,
  getGroupStudents,
  createGroup,
  updateGroup,
  deleteGroup,
} from "../services/groupService";
import type {
  TutorGroupDetail,
  GroupFormData,
} from "../types/tutorGroup.tytes";

// ── Interface de retour du hook ───────────────────────────────

interface UseGroupsReturn {
  // Données
  groups: TutorGroupDetail[];
  isLoadingGroups: boolean;
  hasError: boolean;

  // ── Modal Formulaire (créer / modifier) ──────────────────
  isFormModalOpen: boolean;
  editingGroup: TutorGroupDetail | null; // null = création, sinon modification
  openCreateModal: () => void;
  openEditModal: (group: TutorGroupDetail) => void;
  closeFormModal: () => void;
  handleFormSubmit: (data: GroupFormData) => void;
  isSubmittingForm: boolean;
  formError: string | null;

  // ── Modal Élèves ─────────────────────────────────────────
  isStudentsModalOpen: boolean;
  selectedGroupForStudents: TutorGroupDetail | null;
  openStudentsModal: (group: TutorGroupDetail) => void;
  closeStudentsModal: () => void;

  // ── Modal Suppression ─────────────────────────────────────
  isDeleteModalOpen: boolean;
  groupToDelete: TutorGroupDetail | null;
  openDeleteModal: (group: TutorGroupDetail) => void;
  closeDeleteModal: () => void;
  handleConfirmDelete: () => void;
  isDeletingGroup: boolean;
}

// ── Hook ─────────────────────────────────────────────────────

export function useTutorGroups(): UseGroupsReturn {
  const queryClient = useQueryClient();

  // ── États des modals ──────────────────────────────────────
  const [isFormModalOpen,   setIsFormModalOpen]   = useState(false);
  const [editingGroup,      setEditingGroup]       = useState<TutorGroupDetail | null>(null);
  const [formError,         setFormError]          = useState<string | null>(null);

  const [isStudentsModalOpen,        setIsStudentsModalOpen]        = useState(false);
  const [selectedGroupForStudents,   setSelectedGroupForStudents]   = useState<TutorGroupDetail | null>(null);

  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [groupToDelete,     setGroupToDelete]     = useState<TutorGroupDetail | null>(null);

  // ── Chargement de la liste des groupes ───────────────────
  // ⚠️ BACKEND : GET /api/tutor/groups
  const {
    data: groups,
    isLoading: isLoadingGroups,
    error: groupsError,
  } = useQuery({
    queryKey: ["tutor-groups"],
    queryFn: getTutorGroups,
    staleTime: 5 * 60 * 1000,
  });

  // ── Mutation : créer un groupe ────────────────────────────
  // ⚠️ BACKEND : POST /api/tutor/groups
  const createMutation = useMutation({
    mutationFn: createGroup,
    onSuccess: () => {
      // Re-fetch la liste après création
      queryClient.invalidateQueries({ queryKey: ["tutor-groups"] });
      setIsFormModalOpen(false);
      setFormError(null);
    },
    onError: () => {
      setFormError("Impossible de créer le groupe. Réessayez.");
    },
  });

  // ── Mutation : modifier un groupe ─────────────────────────
  // ⚠️ BACKEND : PUT /api/tutor/groups/:id
  const updateMutation = useMutation({
    mutationFn: ({ id, data }: { id: string; data: GroupFormData }) =>
      updateGroup(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["tutor-groups"] });
      setIsFormModalOpen(false);
      setEditingGroup(null);
      setFormError(null);
    },
    onError: () => {
      setFormError("Impossible de modifier le groupe. Réessayez.");
    },
  });

  // ── Mutation : supprimer un groupe ────────────────────────
  // ⚠️ BACKEND : DELETE /api/tutor/groups/:id
  const deleteMutation = useMutation({
    mutationFn: deleteGroup,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["tutor-groups"] });
      setIsDeleteModalOpen(false);
      setGroupToDelete(null);
    },
    onError: () => {
      console.error("Erreur suppression groupe");
    },
  });

  // ── Actions : modal formulaire ────────────────────────────

  // Ouvre la modal en mode CRÉATION
  const openCreateModal = useCallback(() => {
    setEditingGroup(null);
    setFormError(null);
    setIsFormModalOpen(true);
  }, []);

  // Ouvre la modal en mode MODIFICATION avec les données pré-remplies
  const openEditModal = useCallback((group: TutorGroupDetail) => {
    setEditingGroup(group);
    setFormError(null);
    setIsFormModalOpen(true);
  }, []);

  const closeFormModal = useCallback(() => {
    setIsFormModalOpen(false);
    setEditingGroup(null);
    setFormError(null);
  }, []);

  // Soumet le formulaire (création ou modification selon editingGroup)
  const handleFormSubmit = useCallback(
    (data: GroupFormData) => {
      setFormError(null);
      if (editingGroup) {
        // Mode modification
        updateMutation.mutate({ id: editingGroup.id, data });
      } else {
        // Mode création
        createMutation.mutate(data);
      }
    },
    [editingGroup, createMutation, updateMutation]
  );

  // ── Actions : modal élèves ────────────────────────────────

  const openStudentsModal = useCallback((group: TutorGroupDetail) => {
    setSelectedGroupForStudents(group);
    setIsStudentsModalOpen(true);
  }, []);

  const closeStudentsModal = useCallback(() => {
    setIsStudentsModalOpen(false);
    setSelectedGroupForStudents(null);
  }, []);

  // ── Actions : modal suppression ───────────────────────────

  const openDeleteModal = useCallback((group: TutorGroupDetail) => {
    setGroupToDelete(group);
    setIsDeleteModalOpen(true);
  }, []);

  const closeDeleteModal = useCallback(() => {
    setIsDeleteModalOpen(false);
    setGroupToDelete(null);
  }, []);

  const handleConfirmDelete = useCallback(() => {
    if (!groupToDelete) return;
    deleteMutation.mutate(groupToDelete.id);
  }, [groupToDelete, deleteMutation]);

  // ── Retour ────────────────────────────────────────────────
  return {
    groups:        groups ?? [],
    isLoadingGroups,
    hasError:      !!groupsError,

    isFormModalOpen,
    editingGroup,
    openCreateModal,
    openEditModal,
    closeFormModal,
    handleFormSubmit,
    isSubmittingForm: createMutation.isPending || updateMutation.isPending,
    formError,

    isStudentsModalOpen,
    selectedGroupForStudents,
    openStudentsModal,
    closeStudentsModal,

    isDeleteModalOpen,
    groupToDelete,
    openDeleteModal,
    closeDeleteModal,
    handleConfirmDelete,
    isDeletingGroup: deleteMutation.isPending,
  };
}

