// ============================================================
// FICHIER : tailwind.config.ts
// MODIFICATION : Ajout de darkMode: 'class'
// Le mode sombre est activé par la classe 'dark' sur <html>
// ============================================================

import type { Config } from "tailwindcss";

const config: Config = {
  // ✅ AJOUT : dark mode basé sur la classe CSS
  // Quand <html class="dark"> → toutes les classes dark: s'appliquent
  darkMode: "class",

  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],

  theme: {
    extend: {
      colors: {
        // Palette TutorLink — identique en clair et sombre
        navy:   "#1a2744",
        gold:   "#f5a623",
        "navy-light": "#243566",
      },
      fontFamily: {
        sans: ["Inter", "system-ui", "sans-serif"],
      },
      animation: {
        "fade-in-up": "fadeInUp 0.6s ease-out",
        "fade-in":    "fadeIn 0.5s ease-out",
        "count-up":   "countUp 1s ease-out",
        "pulse-gold": "pulseGold 2s infinite",
      },
      keyframes: {
        fadeInUp: {
          "0%":   { opacity: "0", transform: "translateY(20px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
        fadeIn: {
          "0%":   { opacity: "0" },
          "100%": { opacity: "1" },
        },
        pulseGold: {
          "0%, 100%": { boxShadow: "0 0 0 0 rgba(245, 166, 35, 0.4)" },
          "50%":      { boxShadow: "0 0 0 12px rgba(245, 166, 35, 0)" },
        },
      },
    },
  },

  plugins: [],
};

export default config;