// src/components/layout/RepetiteurLayout.tsx
// Layout commun à toutes les pages du dashboard répétiteur
// Contient la sidebar, la topbar et la zone de contenu principal
//
// BACK-END :
//   GET /api/auth/me  → remplacer MOCK_USER par useAuth() ou un Context
//   POST /api/auth/logout → bouton Déconnexion

import { useState, type ReactNode } from "react";
import ThemeToggle from '../shared/ThemeToggle';

// BACK-END : remplacer par les données de l'utilisateur connecté via Context/API
const MOCK_USER = {
  nom: "M. Leonel Franck",
  role: "Répétiteur · Mathématiques",
  initiales: "KE",
};

interface NavItem {
  key: string;
  label: string;
  icone: string;
  href: string;
}

const NAV_ITEMS: NavItem[] = [
  { key: "tableau-de-bord", label: "Tableau de bord",    icone: "📊", href: "/repetiteur/dashboard" },
  { key: "disponibilites",  label: "Mes disponibilités", icone: "📅", href: "/repetiteur/disponibilites" },
  { key: "demandes",        label: "Demandes reçues",    icone: "📩", href: "/repetiteur/demandes" },
  { key: "groupes",         label: "Mes groupes",        icone: "👥", href: "/repetiteur/groupes" },
  { key: "messagerie",      label: "Messagerie",         icone: "💬", href: "/repetiteur/messagerie" },
  { key: "avis",            label: "Mes avis",           icone: "⭐", href: "/repetiteur/avis" },
  { key: "revenus",         label: "Mes revenus",        icone: "💰", href: "/repetiteur/revenus" },
  { key: "parametres",      label: "Paramètres",         icone: "⚙️",  href: "/repetiteur/parametres" },
];

interface Props {
  children: ReactNode;
  pageActive: string;
}

export default function RepetiteurLayout({ children, pageActive }: Props) {
  // Contrôle ouverture sidebar sur mobile
  const [ouvert, setOuvert] = useState<boolean>(false);

  return (
    <div className="flex min-h-screen bg-gray-100">

      {/* ── Sidebar ──────────────────────────────────── */}
      <aside
        className={`
          fixed top-0 left-0 h-full w-56 bg-[#1a2b4a] flex flex-col z-50
          transition-transform duration-300
          ${ouvert ? "translate-x-0" : "-translate-x-full"}
          lg:translate-x-0 lg:static lg:flex
        `}
      >
        {/* Profil répétiteur */}
        <div className="flex items-center gap-3 px-4 py-5 border-b border-white/10">
          <div className="w-10 h-10 rounded-full bg-[#f5a623] flex items-center justify-center text-[#1a2b4a] font-extrabold text-sm flex-shrink-0">
            {MOCK_USER.initiales}
          </div>
          <div className="min-w-0">
            <p className="text-white text-xs font-bold leading-tight truncate">{MOCK_USER.nom}</p>
            <p className="text-[#f5a623] text-[0.65rem] mt-0.5">{MOCK_USER.role}</p>
          </div>
        </div>

        {/* Liens de navigation */}
        <nav className="flex flex-col py-3 flex-1 overflow-y-auto">
          {NAV_ITEMS.map((item) => (
            <a
              key={item.key}
              href={item.href}
              className={`
                flex items-center gap-2.5 px-4 py-2.5 text-sm font-medium
                border-l-[3px] transition-colors duration-150
                ${pageActive === item.key
                  ? "bg-[#f5a623]/15 text-[#f5a623] border-[#f5a623]"
                  : "text-white/70 border-transparent hover:bg-white/10 hover:text-white"
                }
              `}
            >
              <span className="text-base flex-shrink-0">{item.icone}</span>
              <span>{item.label}</span>
            </a>
          ))}
        </nav>
      </aside>

      {/* Overlay sombre sur mobile quand sidebar ouverte */}
      {ouvert && (
        <div
          className="fixed inset-0 bg-black/40 z-40 lg:hidden"
          onClick={() => setOuvert(false)}
        />
      )}

      {/* ── Zone principale ──────────────────────────── */}
      <div className="flex-1 flex flex-col min-w-0">

        {/* Topbar */}
        <header className="bg-[#1a2b4a] h-14 flex items-center justify-between px-5 sticky top-0 z-30 shadow-md">
          {/* Bouton burger (mobile uniquement) */}
          <ThemeToggle />
          <button
            className="lg:hidden text-white text-xl leading-none"
            onClick={() => setOuvert(!ouvert)}
            aria-label="Ouvrir le menu"
          >
            ☰
          </button>

          {/* Logo TutorLink */}
          <span className="text-lg font-extrabold">
            <span className="text-white">Tutor</span>
            <span className="text-[#f5a623]">Link</span>
          </span>

          {/* Actions topbar */}
          <div className="flex items-center gap-2">
            <a
              href="/repetiteur/messagerie"
              className="text-white border border-white/25 bg-white/10 px-3 py-1.5 rounded-lg text-xs font-semibold hover:bg-white/20 transition-colors"
            >
              💬 Messages
            </a>
            {/* BACK-END : POST /api/auth/logout */}
            <button
              className="bg-[#f5a623] text-[#1a2b4a] px-3 py-1.5 rounded-lg text-xs font-bold hover:bg-yellow-400 transition-colors"
              onClick={() => { /* appel logout */ }}
            >
              Déconnexion
            </button>
          </div>
        </header>

        {/* Contenu de la page */}
        <main className="flex-1">
          {children}
        </main>
      </div>
    </div>
  );
}