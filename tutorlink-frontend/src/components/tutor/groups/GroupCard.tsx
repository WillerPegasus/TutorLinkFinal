// ============================================================
// FICHIER : src/components/tutor/groups/GroupCard.tsx
// RÔLE    : Carte d'affichage d'un groupe de répétition.
//           Affiche toutes les infos du groupe et les 3 boutons
//           d'action : Modifier, Voir inscrits, Supprimer.
//           Reproduit le style des cartes de la maquette Page 4.
// ============================================================

import React from "react";
import type { TutorGroupDetail, GroupStatus } from "../../../types/tutorGroup.tytes";

interface GroupCardProps {
  group: TutorGroupDetail;
  onEdit: (group: TutorGroupDetail) => void;
  onViewStudents: (group: TutorGroupDetail) => void;
  onDelete: (group: TutorGroupDetail) => void;
}

const GroupCard: React.FC<GroupCardProps> = ({
  group,
  onEdit,
  onViewStudents,
  onDelete,
}) => {

  // Calcule le pourcentage de remplissage du groupe
  const fillPercent = Math.round(
    (group.enrolledCount / group.maxCapacity) * 100
  );

  // Détermine la couleur de la barre de remplissage
  const barColor =
    fillPercent >= 100
      ? "bg-red-500"     // Complet → rouge
      : fillPercent >= 75
      ? "bg-amber-400"   // Presque plein → orange
      : "bg-[#1a2744]";  // Normal → bleu marine

  return (
    <div className="bg-white rounded-xl border border-gray-200
                    shadow-sm hover:shadow-md transition-shadow
                    duration-200 overflow-hidden flex flex-col">

      {/* ── Header bleu marine ─────────────────────────── */}
      <div className="bg-[#1a2744] px-5 py-4">
        <div className="flex items-start justify-between gap-3">

          {/* Avatar du groupe (icône personnes) */}
          <div className="w-11 h-11 rounded-full bg-[#f5a623]
                          flex items-center justify-center
                          text-[#1a2744] text-xl flex-shrink-0">
            👥
          </div>

          {/* Nom + matière + niveau */}
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 flex-wrap">
              <h3 className="font-bold text-white text-sm leading-tight">
                {group.name}
              </h3>
              {/* Badge Vérifié */}
              {group.isVerified && (
                <span className="text-[10px] bg-green-500 text-white
                                 px-2 py-0.5 rounded-full font-bold
                                 whitespace-nowrap flex-shrink-0">
                  ✓ Vérifié
                </span>
              )}
            </div>
            <p className="text-white/70 text-xs mt-0.5">
              {group.subject} · {group.level}
            </p>
          </div>
        </div>
      </div>

      {/* ── Corps de la carte ──────────────────────────── */}
      <div className="px-5 py-4 flex-1 flex flex-col gap-3">

        {/* Localisation + Note */}
        <div className="flex items-center justify-between text-xs">
          <span className="text-gray-500 flex items-center gap-1">
            📍 {group.location}
          </span>
          {group.reviewCount > 0 && (
            <span className="text-[#f5a623] font-bold">
              ★ {group.rating} ({group.reviewCount})
            </span>
          )}
        </div>

        {/* Description (tronquée à 2 lignes) */}
        <p className="text-xs text-gray-600 leading-relaxed
                      line-clamp-2">
          {group.description}
        </p>

        {/* Places + Horaires */}
        <div className="flex items-center justify-between text-xs">
          {/* Compteur de places */}
          <span className="flex items-center gap-1 text-gray-600">
            👥
            <span className="font-medium">
              {group.enrolledCount}/{group.maxCapacity}
            </span>
            <span className="text-gray-400">places</span>
          </span>
          {/* Horaire */}
          <span className="text-[#1a2744] font-semibold">
            📅 {group.schedule}
          </span>
        </div>

        {/* Barre de remplissage */}
        <div>
          <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
            <div
              className={`h-full rounded-full transition-all duration-500 ${barColor}`}
              style={{ width: `${Math.min(fillPercent, 100)}%` }}
            />
          </div>
          {/* Label COMPLET si plein */}
          {fillPercent >= 100 && (
            <p className="text-red-500 text-[10px] font-bold mt-1">
              Complet
            </p>
          )}
        </div>

        {/* Thèmes abordés */}
        {group.themes.length > 0 && (
          <div className="flex flex-wrap gap-1">
            {group.themes.slice(0, 4).map((theme) => (
              <span
                key={theme}
                className="text-[10px] bg-gray-100 text-gray-600
                           px-2 py-0.5 rounded-full"
              >
                {theme}
              </span>
            ))}
            {group.themes.length > 4 && (
              <span className="text-[10px] text-gray-400 px-1">
                +{group.themes.length - 4}
              </span>
            )}
          </div>
        )}

        {/* Prix + Revenus */}
        <div className="flex items-center justify-between
                        pt-2 border-t border-gray-100">
          <div>
            <p className="text-[#f5a623] font-bold text-base leading-tight">
              {group.pricePerMonth.toLocaleString("fr-FR")} FCFA
              <span className="text-gray-400 font-normal text-xs"> / mois</span>
            </p>
          </div>
          <div className="text-right">
            <p className="text-xs text-gray-500">Revenu mensuel</p>
            <p className="text-sm font-bold text-[#1a2744]">
              {group.revenuePerMonth.toLocaleString("fr-FR")} F
            </p>
          </div>
        </div>
      </div>

      {/* ── Badge statut ───────────────────────────────── */}
      <div className="px-5 pb-3">
        <GroupStatusBadge status={group.status} />
      </div>

      {/* ── Boutons d'action ───────────────────────────── */}
      <div className="px-5 pb-5 grid grid-cols-3 gap-2">

        {/* Modifier */}
        <button
          type="button"
          onClick={() => onEdit(group)}
          className="py-2 rounded-lg border border-gray-300
                     text-gray-700 text-xs font-semibold
                     hover:bg-gray-50 hover:border-gray-400
                     transition-colors flex items-center
                     justify-center gap-1"
        >
          ✏️ Modifier
        </button>

        {/* Voir inscrits */}
        <button
          type="button"
          onClick={() => onViewStudents(group)}
          className="py-2 rounded-lg bg-[#1a2744] text-white
                     text-xs font-semibold
                     hover:bg-[#243566] transition-colors
                     flex items-center justify-center gap-1"
        >
          👥 Inscrits
          {/* Badge nombre d'élèves */}
          <span className="bg-[#f5a623] text-[#1a2744] text-[10px]
                           font-bold px-1.5 rounded-full">
            {group.enrolledCount}
          </span>
        </button>

        {/* Supprimer */}
        <button
          type="button"
          onClick={() => onDelete(group)}
          className="py-2 rounded-lg border border-red-200
                     text-red-500 text-xs font-semibold
                     hover:bg-red-50 hover:border-red-300
                     transition-colors flex items-center
                     justify-center gap-1"
        >
          🗑 Supprimer
        </button>
      </div>
    </div>
  );
};

// ── Badge statut du groupe ────────────────────────────────────

const GroupStatusBadge: React.FC<{ status: GroupStatus }> = ({ status }) => {
  const config: Record<
    GroupStatus,
    { label: string; className: string }
  > = {
    ACTIVE: {
      label: "Actif",
      className: "bg-green-100 text-green-700",
    },
    FULL: {
      label: "Complet",
      className: "bg-red-100 text-red-700",
    },
    PAUSED: {
      label: "En pause",
      className: "bg-amber-100 text-amber-700",
    },
    CLOSED: {
      label: "Fermé",
      className: "bg-gray-100 text-gray-500",
    },
  };

  const { label, className } = config[status];

  return (
    <span className={`
      inline-block text-[10px] font-bold
      px-2.5 py-1 rounded-full ${className}
    `}>
      {label}
    </span>
  );
};

export default GroupCard;