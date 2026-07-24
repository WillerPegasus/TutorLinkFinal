// ============================================================
// FICHIER : src/components/ui/ThemeToggle.tsx
// RÔLE    : Bouton de bascule thème sombre / clair
//           Affiche ☀️ en mode sombre et 🌙 en mode clair
//           Avec animation fluide du toggle
// ============================================================

import React from "react";
import { useTheme } from "../../hooks/useTheme";

interface Props {
  /** Variante visuelle selon le fond de la navbar */
  variant?: "light" | "dark";
}

const ThemeToggle: React.FC<Props> = ({ variant = "dark" }) => {
  const { isDark, toggleTheme } = useTheme();

  return (
    <button
      type="button"
      onClick={toggleTheme}
      aria-label={isDark ? "Passer au thème clair" : "Passer au thème sombre"}
      title={isDark ? "Mode clair" : "Mode sombre"}
      className={`
        relative flex items-center gap-2
        px-3 py-1.5 rounded-full
        transition-all duration-300 cursor-pointer
        border
        ${variant === "dark"
          ? isDark
            ? "border-white/30 text-white/80 hover:text-white hover:border-white/60"
            : "border-white/30 text-white/80 hover:text-white hover:border-white/60"
          : isDark
            ? "border-gray-600 text-gray-300 hover:text-white"
            : "border-gray-300 text-gray-600 hover:text-gray-900"
        }
      `}
    >
      {/* Icône animée */}
      <div className="relative w-5 h-5 flex items-center justify-center">
        {/* Soleil — visible en mode sombre */}
        <span
          className={`
            absolute text-base transition-all duration-300
            ${isDark
              ? "opacity-100 rotate-0 scale-100"
              : "opacity-0 rotate-90 scale-0"
            }
          `}
        >
          ☀️
        </span>
        {/* Lune — visible en mode clair */}
        <span
          className={`
            absolute text-base transition-all duration-300
            ${!isDark
              ? "opacity-100 rotate-0 scale-100"
              : "opacity-0 -rotate-90 scale-0"
            }
          `}
        >
          🌙
        </span>
      </div>

      {/* Label texte (caché sur mobile) */}
      <span className="hidden sm:inline text-xs font-medium">
        {isDark ? "Clair" : "Sombre"}
      </span>
    </button>
  );
};

export default ThemeToggle;