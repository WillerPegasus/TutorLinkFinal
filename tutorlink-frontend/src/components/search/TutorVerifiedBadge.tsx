// ============================================================
// Badge "Vérifié" affiché sur les cartes des répétiteurs validés
// Indique que le CNI et le diplôme ont été vérifiés par l'admin
// ============================================================

import React from "react";

interface Props {
  isVerified: boolean; // true = badge affiché, false = rien
}

const TutorVerifiedBadge: React.FC<Props> = ({ isVerified }) => {
  if (!isVerified) return null;

  return (
    <span
      className="
        inline-flex items-center gap-1
        text-[10px] font-bold
        bg-green-100 text-green-700
        px-2 py-0.5 rounded-full
        flex-shrink-0
      "
    >
      ✓ Vérifié
    </span>
  );
};

export default TutorVerifiedBadge;