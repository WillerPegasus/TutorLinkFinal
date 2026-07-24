// ============================================================
// Champ mot de passe avec bouton afficher/masquer
// Utilisé dans le formulaire de connexion et d'inscription
// ============================================================

import React from "react";

interface Props {
  id: string;                       // ID pour le label
  value: string;                    // Valeur du champ
  onChange: (value: string) => void; // Callback de saisie
  show: boolean;                    // true = mot de passe visible
  onToggleShow: () => void;         // Bascule l'affichage
  disabled: boolean;                // Désactivé pendant la soumission
  placeholder?: string;             // Placeholder personnalisé
}

const PasswordInput: React.FC<Props> = ({
  id,
  value,
  onChange,
  show,
  onToggleShow,
  disabled,
  placeholder = "••••••••",
}) => {
  return (
    <div className="relative">
      <input
        id={id}
        type={show ? "text" : "password"}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        disabled={disabled}
        placeholder={placeholder}
        className="
          w-full border border-gray-300 rounded-lg
          px-3 py-2.5 pr-10 text-sm
          focus:outline-none focus:ring-2 focus:ring-[#1a2744]
          focus:border-transparent transition-colors
          disabled:bg-gray-50 disabled:text-gray-400
        "
      />
      {/* Bouton afficher/masquer */}
      <button
        type="button"
        onClick={onToggleShow}
        disabled={disabled}
        className="
          absolute right-3 top-1/2 -translate-y-1/2
          text-gray-400 hover:text-gray-600 text-sm
          cursor-pointer disabled:cursor-not-allowed
        "
        aria-label={show ? "Masquer le mot de passe" : "Afficher le mot de passe"}
      >
        {show ? "🙈" : "👁"}
      </button>
    </div>
  );
};

export default PasswordInput;