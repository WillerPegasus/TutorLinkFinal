// ============================================================
// FICHIER : src/main.tsx
// MODIFICATION : Initialisation du thème AVANT le rendu React
//               pour éviter le "flash" de thème incorrect
// ============================================================

import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import "./index.css";

// ✅ AJOUT : Initialise le thème depuis localStorage
// AVANT que React ne rende quoi que ce soit
// → évite le flash blanc en mode sombre au rechargement
(function initTheme() {
  try {
    const stored = localStorage.getItem("tutorlink-theme");
    if (stored) {
      const { state } = JSON.parse(stored);
      if (state?.isDark) {
        document.documentElement.classList.add("dark");
      }
    }
  } catch {
    // Ignore les erreurs de parsing
  }
})();

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
  

