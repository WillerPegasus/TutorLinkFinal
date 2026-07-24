// ============================================================
// FICHIER : src/components/tutor/groups/GroupStudentsModal.tsx
// RÔLE    : Modal affichant la liste des élèves inscrits
//           dans un groupe avec leur statut de paiement.
//           Colonnes : Nom, Niveau, Quartier, Inscrit le,
//                      Paiement, Dernier paiement, Téléphone.
//
// ⚠️ BACKEND : GET /api/tutor/groups/:id/students
// ============================================================

import React from "react";
import { useQuery } from "@tanstack/react-query";
import { getGroupStudents } from "../../../services/groupService";
import type {
  TutorGroupDetail,
  GroupStudent,
  PaymentStatus,
} from "../../../types/tutorGroup.tytes";

interface GroupStudentsModalProps {
  isOpen: boolean;
  onClose: () => void;
  group: TutorGroupDetail | null;
}

const GroupStudentsModal: React.FC<GroupStudentsModalProps> = ({
  isOpen,
  onClose,
  group,
}) => {

  // Charge les élèves uniquement quand la modal est ouverte
  // et qu'un groupe est sélectionné
  // ⚠️ BACKEND : GET /api/tutor/groups/:id/students
  const {
    data: students,
    isLoading,
  } = useQuery({
    queryKey: ["group-students", group?.id],
    queryFn: () => getGroupStudents(group!.id),
    enabled: isOpen && !!group,
    staleTime: 2 * 60 * 1000,
  });

  // Fermer avec Escape
  React.useEffect(() => {
    if (!isOpen) return;
    const handler = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    document.addEventListener("keydown", handler);
    return () => document.removeEventListener("keydown", handler);
  }, [isOpen, onClose]);

  // Bloquer le scroll
  React.useEffect(() => {
    document.body.style.overflow = isOpen ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [isOpen]);

  if (!isOpen || !group) return null;

  // Compte des élèves par statut de paiement
  const upToDate = students?.filter((s) => s.paymentStatus === "UP_TO_DATE").length ?? 0;
  const late     = students?.filter((s) => s.paymentStatus === "LATE").length ?? 0;
  const pending  = students?.filter((s) => s.paymentStatus === "PENDING").length ?? 0;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center
                 justify-center p-4"
      role="dialog"
      aria-modal="true"
    >
      {/* Fond sombre */}
      <div
        className="absolute inset-0 bg-black/50 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* Contenu */}
      <div className="relative bg-white rounded-xl shadow-2xl
                      w-full max-w-3xl z-10 flex flex-col
                      max-h-[85vh]">

        {/* Header */}
        <div className="bg-[#1a2744] text-white px-6 py-4
                        rounded-t-xl flex items-center justify-between
                        flex-shrink-0">
          <div>
            <h2 className="font-bold text-base">
              👥 Élèves inscrits
            </h2>
            <p className="text-white/70 text-xs mt-0.5">
              {group.name}
            </p>
          </div>
          <button
            onClick={onClose}
            className="text-white/70 hover:text-white
                       text-2xl leading-none"
            aria-label="Fermer"
          >
            ×
          </button>
        </div>

        {/* Résumé des paiements */}
        <div className="px-6 py-3 bg-gray-50 border-b border-gray-200
                        flex items-center gap-6 flex-shrink-0 flex-wrap">
          <span className="text-xs text-gray-500">
            Total :{" "}
            <strong className="text-[#1a2744]">
              {group.enrolledCount}/{group.maxCapacity} élèves
            </strong>
          </span>
          <PaymentSummaryItem
            count={upToDate}
            label="À jour"
            color="text-green-600"
            dot="bg-green-500"
          />
          <PaymentSummaryItem
            count={late}
            label="En retard"
            color="text-red-600"
            dot="bg-red-500"
          />
          <PaymentSummaryItem
            count={pending}
            label="En attente"
            color="text-amber-600"
            dot="bg-amber-500"
          />
        </div>

        {/* Corps : tableau des élèves */}
        <div className="overflow-y-auto flex-1">
          {isLoading ? (
            // Skeleton de chargement
            <div className="p-6 space-y-3">
              {[1, 2, 3, 4].map((i) => (
                <div key={i}
                     className="h-12 bg-gray-100 rounded animate-pulse" />
              ))}
            </div>
          ) : !students || students.length === 0 ? (
            // Aucun élève
            <div className="py-12 text-center text-gray-400">
              <span className="text-3xl block mb-2">👤</span>
              <p className="text-sm">Aucun élève inscrit dans ce groupe</p>
            </div>
          ) : (
            <table className="w-full text-sm">
              <thead className="sticky top-0 bg-white border-b border-gray-100">
                <tr>
                  {[
                    "NOM", "NIVEAU", "QUARTIER",
                    "INSCRIT LE", "PAIEMENT",
                    "DERNIER PAIEMENT", "TÉLÉPHONE",
                  ].map((col) => (
                    <th
                      key={col}
                      className="text-left text-[10px] font-bold
                                 tracking-wider text-gray-400 uppercase
                                 px-4 py-3 whitespace-nowrap"
                    >
                      {col}
                    </th>
                  ))}
                </tr>
              </thead>

              <tbody>
                {students.map((student, index) => (
                  <StudentRow
                    key={student.id}
                    student={student}
                    isEven={index % 2 === 0}
                  />
                ))}
              </tbody>
            </table>
          )}
        </div>

        {/* Footer */}
        <div className="px-6 py-4 border-t border-gray-100 flex-shrink-0">
          <button
            type="button"
            onClick={onClose}
            className="w-full py-2.5 rounded-lg border border-gray-300
                       text-gray-700 font-medium text-sm
                       hover:bg-gray-50 transition-colors"
          >
            Fermer
          </button>
        </div>
      </div>
    </div>
  );
};

// ── Ligne d'un élève ──────────────────────────────────────────
const StudentRow: React.FC<{
  student: GroupStudent;
  isEven: boolean;
}> = ({ student, isEven }) => (
  <tr className={`
    border-b border-gray-50 hover:bg-gray-50 transition-colors
    ${isEven ? "bg-white" : "bg-gray-50/30"}
  `}>
    <td className="px-4 py-3 font-medium text-[#1a2744]">
      {student.name}
    </td>
    <td className="px-4 py-3 text-gray-600 text-xs">
      {student.level}
    </td>
    <td className="px-4 py-3 text-gray-600 text-xs">
      {student.district}
    </td>
    <td className="px-4 py-3 text-gray-500 text-xs whitespace-nowrap">
      {student.enrolledSince}
    </td>
    <td className="px-4 py-3">
      <PaymentBadge status={student.paymentStatus} />
    </td>
    <td className="px-4 py-3 text-gray-500 text-xs whitespace-nowrap">
      {student.lastPaymentDate}
    </td>
    <td className="px-4 py-3 text-gray-600 text-xs whitespace-nowrap">
      {student.phoneNumber}
    </td>
  </tr>
);

// ── Badge paiement ────────────────────────────────────────────
const PaymentBadge: React.FC<{ status: PaymentStatus }> = ({ status }) => {
  const config: Record<PaymentStatus, { label: string; className: string }> = {
    UP_TO_DATE: { label: "À JOUR",     className: "bg-green-100 text-green-700" },
    LATE:       { label: "EN RETARD",  className: "bg-red-100 text-red-700" },
    PENDING:    { label: "EN ATTENTE", className: "bg-amber-100 text-amber-700" },
  };
  const { label, className } = config[status];
  return (
    <span className={`
      text-[10px] font-bold px-2 py-0.5 rounded-full ${className}
    `}>
      {label}
    </span>
  );
};

// ── Résumé paiement ───────────────────────────────────────────
const PaymentSummaryItem: React.FC<{
  count: number;
  label: string;
  color: string;
  dot: string;
}> = ({ count, label, color, dot }) => (
  <span className={`flex items-center gap-1.5 text-xs ${color} font-medium`}>
    <span className={`w-2 h-2 rounded-full ${dot}`} />
    {count} {label}
  </span>
);

export default GroupStudentsModal;