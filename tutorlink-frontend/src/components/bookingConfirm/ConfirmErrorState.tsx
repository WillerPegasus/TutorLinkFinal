// ============================================================
// État d'erreur affiché si la réservation est introuvable
// ou si l'accès est refusé (réservation d'un autre utilisateur)
// ============================================================

import React from "react";

interface Props {
  bookingId: string;       // ID tenté (pour afficher à l'utilisateur)
  onGoHome: () => void;    // Retour à l'accueil
  onGoToSearch: () => void; // Vers la recherche
}

const ConfirmErrorState: React.FC<Props> = ({
  bookingId,
  onGoHome,
  onGoToSearch,
}) => {
  return (
    <div className="min-h-screen bg-[#eef2f7] flex items-center
                    justify-center p-4">
      <div className="bg-white rounded-2xl shadow-lg w-full max-w-md
                      p-8 text-center">

        {/* Icône erreur */}
        <div className="w-16 h-16 bg-red-100 rounded-full
                        flex items-center justify-center
                        mx-auto mb-5">
          <span className="text-3xl">❌</span>
        </div>

        <h2 className="text-xl font-bold text-[#1a2744] mb-2">
          Réservation introuvable
        </h2>

        <p className="text-gray-500 text-sm mb-2">
          La réservation{" "}
          <span className="font-mono text-[#1a2744] font-semibold">
            #{bookingId}
          </span>{" "}
          est introuvable ou vous n'avez pas accès à cette page.
        </p>

        <p className="text-gray-400 text-xs mb-8">
          Si vous venez de réserver, vérifiez votre tableau de bord.
        </p>

        <div className="flex flex-col gap-3">
          <button
            type="button"
            onClick={onGoHome}
            className="
              w-full py-3 rounded-xl bg-[#1a2744] text-white
              font-bold text-sm hover:bg-[#243566]
              transition-colors cursor-pointer
            "
          >
            🏠 Retour à l'accueil
          </button>

          <button
            type="button"
            onClick={onGoToSearch}
            className="
              w-full py-3 rounded-xl border-2 border-gray-200
              text-gray-600 font-semibold text-sm
              hover:border-[#1a2744] hover:text-[#1a2744]
              transition-colors cursor-pointer
            "
          >
            🔍 Chercher un répétiteur
          </button>
        </div>
      </div>
    </div>
  );
};

export default ConfirmErrorState;