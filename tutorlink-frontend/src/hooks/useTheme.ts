// ============================================================
// FICHIER : src/hooks/useTheme.ts
// RÔLE    : Hook simplifié pour accéder au thème dans
//           n'importe quel composant sans importer le store.
// ============================================================

import { useThemeStore } from "../store/themeStore";

export function useTheme() {
  const { isDark, toggleTheme, setDark } = useThemeStore();

  return {
    isDark,          // true si thème sombre actif
    toggleTheme,     // Bascule clair ↔ sombre
    setDark,         // Force clair (false) ou sombre (true)
  };
}