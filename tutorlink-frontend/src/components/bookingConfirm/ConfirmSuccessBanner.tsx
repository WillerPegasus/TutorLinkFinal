// ============================================================
// Bannière de succès en haut de la page de confirmation
// Affiche l'animation, le titre "Demande envoyée !" et
// la référence de la réservation
// ============================================================

import React from "react";

interface Props {
  bookingId: string; // Référence de la réservation ex: "R-1287"
}

const ConfirmSuccessBanner: React.FC<Props> = ({ bookingId }) => {
  return (
    <div className="bg-gradient-to-r from-[#1a2744] to-[#243566]
                    px-8 py-10 text-center">

      {/* Icône animée */}
      <div
        className="
          w-20 h-20 bg-green-400 rounded-full
          flex items-center justify-center
          mx-auto mb-5
          animate-bounce
        "
      >
        <span className="text-4xl">✅</span>
      </div>

      {/* Titre */}
      <h1 className="text-2xl font-bold text-white mb-2">
        Demande envoyée !
      </h1>

      {/* Sous-titre */}
      <p className="text-white/70 text-sm">
        Votre demande a bien été transmise au répétiteur
      </p>

      {/* Référence de réservation */}
      <div className="mt-4 inline-flex items-center gap-2
                      bg-white/10 px-4 py-2 rounded-full">
        <span className="text-white/60 text-xs">Référence :</span>
        <span className="text-[#f5a623] font-bold text-sm tracking-wide">
          #{bookingId}
        </span>
      </div>
    </div>
  );
};

export default ConfirmSuccessBanner;