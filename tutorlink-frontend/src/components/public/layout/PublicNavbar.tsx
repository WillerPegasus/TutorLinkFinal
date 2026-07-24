// ============================================================
// FICHIER : src/components/public/layout/PublicNavbar.tsx
// MODIFICATION : Ajout du bouton ThemeToggle dans la navbar
//               Support du thème sombre sur toute la navbar
// ============================================================

import React, { useState } from "react";
import { Link, NavLink } from "react-router-dom";
import ThemeToggle from "../../ui/ThemeToggle";

const NAV_LINKS = [
  { label: "Accueil",           to: "/"                  },
  { label: "Répétiteurs",       to: "/repetiteurs"       },
  { label: "Groupes",           to: "/groupes"           },
  { label: "Tarifs",            to: "/tarifs"            },
  { label: "Comment ça marche", to: "/comment-ca-marche" },
];

const PublicNavbar: React.FC = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const closeMobileMenu = () => setMobileMenuOpen(false);

  return (
    <header className="
      bg-[#1a2744] dark:bg-[#0f172a]
      border-b border-white/10
      sticky top-0 z-40
      transition-colors duration-300
    ">
      <div className="max-w-7xl mx-auto px-6 py-4">
        <div className="flex items-center justify-between gap-4">

          {/* Logo */}
          <Link to="/" className="flex items-center gap-2 flex-shrink-0"
                onClick={closeMobileMenu}>
            <span className="text-[#f5a623] text-2xl">🎓</span>
            <span className="font-bold text-xl text-white">
              Tutor<span className="text-[#f5a623]">Link</span>
            </span>
          </Link>

          {/* Navigation desktop */}
          <nav className="hidden lg:flex items-center gap-1">
            {NAV_LINKS.map(({ label, to }) => (
              <NavLink
                key={to}
                to={to}
                end={to === "/"}
                className={({ isActive }) => `
                  px-3 py-2 rounded-lg text-sm font-medium transition-colors
                  ${isActive
                    ? "text-white bg-white/10 border-b-2 border-[#f5a623]"
                    : "text-white/70 hover:text-white hover:bg-white/5"
                  }
                `}
              >
                {label}
              </NavLink>
            ))}
          </nav>

          {/* Actions droite */}
          <div className="flex items-center gap-2 flex-shrink-0">

            {/* ✅ AJOUT : Toggle thème */}
            <ThemeToggle variant="dark" />

            <Link
              to="/connexion"
              className="
                hidden sm:block
                text-white/80 hover:text-white text-sm font-medium
                border border-white/30 px-4 py-2 rounded-lg
                hover:border-white/60 transition-colors
              "
            >
              Connexion
            </Link>

            <Link
              to="/inscription"
              className="
                bg-[#f5a623] text-[#1a2744] font-bold text-sm
                px-5 py-2 rounded-lg hover:bg-[#e09415]
                transition-colors shadow-md
              "
            >
              S'inscrire
            </Link>

            {/* Hamburger mobile */}
            <button
              type="button"
              onClick={() => setMobileMenuOpen((p) => !p)}
              className="lg:hidden text-white/80 hover:text-white
                         p-2 rounded-lg transition-colors cursor-pointer"
              aria-label="Menu"
            >
              <div className="space-y-1.5">
                {[0, 1, 2].map((i) => (
                  <span
                    key={i}
                    className={`
                      block w-6 h-0.5 bg-current transition-all duration-200
                      ${i === 0 && mobileMenuOpen ? "rotate-45 translate-y-2" : ""}
                      ${i === 1 && mobileMenuOpen ? "opacity-0" : ""}
                      ${i === 2 && mobileMenuOpen ? "-rotate-45 -translate-y-2" : ""}
                    `}
                  />
                ))}
              </div>
            </button>
          </div>
        </div>

        {/* Menu mobile */}
        {mobileMenuOpen && (
          <div className="lg:hidden border-t border-white/10 pt-4 mt-4 space-y-1
                          animate-fade-in">
            {NAV_LINKS.map(({ label, to }) => (
              <NavLink
                key={to}
                to={to}
                end={to === "/"}
                onClick={closeMobileMenu}
                className={({ isActive }) => `
                  block px-3 py-2.5 rounded-lg text-sm font-medium transition-colors
                  ${isActive
                    ? "bg-white/10 text-white"
                    : "text-white/70 hover:text-white hover:bg-white/5"
                  }
                `}
              >
                {label}
              </NavLink>
            ))}
            <div className="pt-3 flex flex-col gap-2 border-t border-white/10 mt-2">
              <Link
                to="/connexion"
                onClick={closeMobileMenu}
                className="w-full text-center py-2.5 rounded-lg border
                           border-white/30 text-white/80 text-sm font-medium
                           hover:bg-white/5 transition-colors"
              >
                Connexion
              </Link>
              <Link
                to="/inscription"
                onClick={closeMobileMenu}
                className="w-full text-center py-2.5 rounded-lg bg-[#f5a623]
                           text-[#1a2744] font-bold text-sm hover:bg-[#e09415]
                           transition-colors"
              >
                S'inscrire gratuitement
              </Link>
            </div>
          </div>
        )}
      </div>
    </header>
  );
};

export default PublicNavbar;