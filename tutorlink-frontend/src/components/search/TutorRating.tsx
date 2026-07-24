// ============================================================
// Affichage de la note et du nombre d'avis d'un répétiteur
// Utilisé dans la carte de recherche et le profil
// ============================================================

import React from "react";

interface Props {
  rating: number;       // Note moyenne ex: 4.9
  reviewCount: number;  // Nombre d'avis ex: 87
}

const TutorRating: React.FC<Props> = ({ rating, reviewCount }) => {
  return (
    <span className="flex items-center gap-1 text-sm font-bold text-[#f5a623]">
      ★ {rating}
      <span className="font-normal text-gray-400 text-xs">
        ({reviewCount})
      </span>
    </span>
  );
};

export default TutorRating;