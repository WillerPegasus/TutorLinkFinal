// ============================================================
// FICHIER : src/pages/tutor/TutorGroupsPage.tsx
// RÔLE    : Page "Mes groupes" de l'espace répétiteur.
//           Affiche tous les groupes du répétiteur en grille
//           de cartes avec les actions : Créer, Modifier,
//           Voir inscrits, Supprimer.
//           Inclut un résumé statistique en haut de page.
//
// ROUTING : /tutor/groups (protégé par TutorLayout)
// ⚠️ BACKEND : Données via useGroups.ts → groupService.ts
// ============================================================

import React, { useMemo } from "react";
import { useTutorGroups } from "../../hooks/useTutorGroups";
import GroupCard           from "../../components/tutor/groups/GroupCard";
import GroupFormModal      from "../../components/tutor/groups/GroupFormModal";
import GroupStudentsModal  from "../../components/tutor/groups/GroupStudentsModal";
import DeleteGroupModal    from "../../components/tutor/groups/DeleteGroupModal";

const TutorGroupsPage: React.FC = () => {

  // ── Toute la logique est dans le hook ─────────────────────
  const {
    groups,
    isLoadingGroups,
    hasError,

    isFormModalOpen,
    editingGroup,
    openCreateModal,
    openEditModal,
    closeFormModal,
    handleFormSubmit,
    isSubmittingForm,
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
    isDeletingGroup,
  } = useTutorGroups();

  // ── Calcul des statistiques globales ─────────────────────
  // Calculé depuis la liste des groupes (pas d'appel API séparé)
  const stats = useMemo(() => ({
    totalGroups:          groups.length,
    totalStudents:        groups.reduce((s, g) => s + g.enrolledCount, 0),
    totalRevenue:         groups.reduce((s, g) => s + g.revenuePerMonth, 0),
    totalCapacity:        groups.reduce((s, g) => s + g.maxCapacity, 0),
  }), [groups]);

  return (
    <div className="space-y-6">

      {/* ── En-tête de la page ──────────────────────────── */}
      <div className="flex items-start justify-between gap-4">
        <div>
          <h1 className="text-xl font-bold text-[#1a2744]">
            Mes groupes de répétition
          </h1>
          <p className="text-sm text-gray-500 mt-0.5">
            Gérez vos groupes, suivez les inscriptions et les paiements.
          </p>
        </div>

        {/* Bouton Créer un groupe */}
        <button
          type="button"
          onClick={openCreateModal}
          className="
            flex items-center gap-2 px-5 py-2.5 rounded-lg
            bg-[#f5a623] text-[#1a2744] font-bold text-sm
            hover:bg-[#e09415] transition-colors shadow-md
            hover:shadow-lg active:scale-95 flex-shrink-0
          "
        >
          ➕ Nouveau groupe
        </button>
      </div>

      {/* ── Cartes statistiques ──────────────────────────── */}
      {!isLoadingGroups && groups.length > 0 && (
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <SummaryCard
            icon="👥"
            label="Groupes actifs"
            value={stats.totalGroups}
            accent="#f5a623"
          />
          <SummaryCard
            icon="🎓"
            label="Élèves inscrits"
            value={stats.totalStudents}
            accent="#1a2744"
          />
          <SummaryCard
            icon="💰"
            label="Revenus / mois"
            value={`${stats.totalRevenue.toLocaleString("fr-FR")} F`}
            accent="#27ae60"
          />
          <SummaryCard
            icon="📊"
            label="Places occupées"
            value={`${stats.totalStudents}/${stats.totalCapacity}`}
            accent="#2980b9"
          />
        </div>
      )}

      {/* ── Erreur ───────────────────────────────────────── */}
      {hasError && (
        <div className="bg-red-50 border border-red-200 rounded-lg
                        px-4 py-3 text-red-700 text-sm flex items-center gap-2">
          ⚠️ Impossible de charger les groupes. Veuillez rafraîchir la page.
        </div>
      )}

      {/* ── Skeleton de chargement ───────────────────────── */}
      {isLoadingGroups && (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
          {[1, 2, 3].map((i) => (
            <div
              key={i}
              className="bg-white rounded-xl border border-gray-200
                         shadow-sm overflow-hidden animate-pulse"
            >
              {/* Header skeleton */}
              <div className="bg-gray-200 h-20" />
              {/* Corps skeleton */}
              <div className="p-5 space-y-3">
                <div className="h-3 bg-gray-200 rounded w-3/4" />
                <div className="h-3 bg-gray-200 rounded w-1/2" />
                <div className="h-3 bg-gray-200 rounded" />
                <div className="h-2 bg-gray-200 rounded-full" />
                <div className="h-8 bg-gray-200 rounded" />
              </div>
            </div>
          ))}
        </div>
      )}

      {/* ── Grille des groupes ───────────────────────────── */}
      {!isLoadingGroups && groups.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
          {groups.map((group) => (
            <GroupCard
              key={group.id}
              group={group}
              onEdit={openEditModal}
              onViewStudents={openStudentsModal}
              onDelete={openDeleteModal}
            />
          ))}
        </div>
      )}

      {/* ── État vide (aucun groupe) ─────────────────────── */}
      {!isLoadingGroups && groups.length === 0 && !hasError && (
        <div className="bg-white rounded-xl border border-gray-200
                        shadow-sm py-16 text-center">
          <div className="text-5xl mb-4">👥</div>
          <h3 className="text-lg font-bold text-[#1a2744] mb-2">
            Aucun groupe créé
          </h3>
          <p className="text-gray-500 text-sm mb-6 max-w-xs mx-auto">
            Créez votre premier groupe de répétition pour accueillir
            plusieurs élèves à la fois.
          </p>
          <button
            type="button"
            onClick={openCreateModal}
            className="
              inline-flex items-center gap-2 px-6 py-3 rounded-lg
              bg-[#f5a623] text-[#1a2744] font-bold text-sm
              hover:bg-[#e09415] transition-colors shadow-md
            "
          >
            ➕ Créer mon premier groupe
          </button>
        </div>
      )}

      {/* ══ MODALS ══════════════════════════════════════════ */}

      {/* Modal Créer / Modifier */}
      <GroupFormModal
        isOpen={isFormModalOpen}
        onClose={closeFormModal}
        onSubmit={handleFormSubmit}
        editingGroup={editingGroup}
        isSubmitting={isSubmittingForm}
        error={formError}
      />

      {/* Modal Liste des élèves */}
      <GroupStudentsModal
        isOpen={isStudentsModalOpen}
        onClose={closeStudentsModal}
        group={selectedGroupForStudents}
      />

      {/* Modal Confirmation de suppression */}
      <DeleteGroupModal
        isOpen={isDeleteModalOpen}
        onClose={closeDeleteModal}
        onConfirm={handleConfirmDelete}
        group={groupToDelete}
        isDeleting={isDeletingGroup}
      />
    </div>
  );
};

// ── Carte de résumé statistique ───────────────────────────────
const SummaryCard: React.FC<{
  icon: string;
  label: string;
  value: number | string;
  accent: string;
}> = ({ icon, label, value, accent }) => (
  <div className="bg-white rounded-lg border border-gray-100
                  shadow-sm p-4 relative overflow-hidden">
    {/* Bordure gauche colorée */}
    <div
      className="absolute left-0 top-0 bottom-0 w-1 rounded-l-lg"
      style={{ backgroundColor: accent }}
    />
    <div className="pl-2">
      <span className="text-lg">{icon}</span>
      <p className="text-lg font-bold text-[#1a2744] mt-1 leading-tight">
        {value}
      </p>
      <p className="text-[11px] font-semibold tracking-wider
                    text-gray-400 uppercase mt-0.5">
        {label}
      </p>
    </div>
  </div>
);

export default TutorGroupsPage;