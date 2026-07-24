// ============================================================
// Bannière d'erreur affichée en haut du formulaire de connexion
// Réutilisable pour tout message d'erreur lié à l'authentification
// ============================================================

import React from "react";

interface Props {
  message: string | null; // Message à afficher, null = caché
}

const AuthErrorBanner: React.FC<Props> = ({ message }) => {
  if (!message) return null;

  return (
    <div
      className="
        bg-red-50 border border-red-200 rounded-lg
        px-4 py-3 mb-5 flex items-start gap-2
      "
      role="alert"
    >
      <span className="text-red-500 flex-shrink-0">❌</span>
      <p className="text-red-700 text-sm">{message}</p>
    </div>
  );
};

export default AuthErrorBanner;