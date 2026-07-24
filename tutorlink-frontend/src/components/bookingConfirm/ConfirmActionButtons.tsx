// ============================================================
// Boutons d'action en bas de la page de confirmation
// Tableau de bord et Autre répétiteur
// ============================================================

import React from "react";

interface Props {
  onGoToDashboard: () => void;   // Vers le tableau de bord
  onGoToSearch: () => void;      // Vers la liste des répétiteurs
}

const ConfirmActionButtons: React.FC<Props> = ({
  onGoToDashboard,
  onGoToSearch,
}) => {
  return (
    <div className="flex flex-col sm:flex-row gap-3">

      {/* Bouton principal : Tableau de bord */}
      <button
        type="button"
        onClick={onGoToDashboard}
        className="
          flex-1 flex items-center justify-center gap-2
          bg-[#1a2744] hover:bg-[#243566]
          text-white font-bold py-3 px-6 rounded-xl
          transition-colors cursor-pointer
          text-sm shadow-md
        "
      >
        🏠 Tableau de bord
      </button>

      {/* Bouton secondaire : Chercher un autre répétiteur */}
      <button
        type="button"
        onClick={onGoToSearch}
        className="
          flex-1 flex items-center justify-center gap-2
          border-2 border-gray-300 hover:border-[#1a2744]
          text-gray-700 hover:text-[#1a2744]
          font-semibold py-3 px-6 rounded-xl
          transition-colors cursor-pointer
          text-sm
        "
      >
        🔍 Autre répétiteur
      </button>
    </div>
  );
};

export default ConfirmActionButtons;