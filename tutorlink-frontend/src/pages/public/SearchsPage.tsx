// ============================================================
// Page "Recherche" des répétiteurs — espace public
// Routing : /repetiteurs
// Reproduit la maquette Page 2 :
//   Navbar + titre + compteur + barre de filtres + grille
// ============================================================

import React from "react";
import { Link } from "react-router-dom";
import { useSearchPage }   from "../../hooks/useSearchPage";
import SearchFilterBar     from "../../components/search/SearchFilterBar";
import TutorGrid           from "../../components/search/TutorGrid";
import PublicFooter from "../../components/public/layout/PublicFooter";
const SearchPage: React.FC = () => {

  const {
    tutors,
    totalCount,
    isLoading,
    hasError,
    pendingFilters,
    onPendingFilterChange,
    onApplyFilters,
    onResetFilters,
    onViewProfile,
    onBookTutor,
  } = useSearchPage();

  return (
  <>
      <div className="min-h-screen bg-[#eef2f7]">

        
   

      {/* ── Navbar publique ─────────────────────────────────── */}
      <header className="bg-[#1a2744] border-b border-white/10">
        <div className="max-w-6xl mx-auto px-6 py-4
                        flex items-center justify-between">

          {/* Logo */}
          <Link to="/" className="flex items-center gap-2 flex-shrink-0">
            <span className="text-[#f5a623] text-2xl">🎓</span>
            <span className="font-bold text-xl text-white">
              Tutor<span className="text-[#f5a623]">Link</span>
            </span>
          </Link>

          {/* Navigation centrale */}
          <nav className="hidden md:flex items-center gap-8">
            <Link
              to="/"
              className="text-white/80 hover:text-white text-sm transition-colors"
            >
              Accueil
            </Link>
            <Link
              to="/repetiteurs"
              className="text-white font-semibold text-sm border-b-2
                         border-[#f5a623] pb-0.5"
            >
              Répétiteurs
            </Link>
            <Link
              to="/groupes"
              className="text-white/80 hover:text-white text-sm transition-colors"
            >
              Groupes
            </Link>
            <Link
              to="/#comment-ca-marche"
              className="text-white/80 hover:text-white text-sm transition-colors"
            >
              Comment ça marche
            </Link>
          </nav>

          {/* Boutons auth */}
          <div className="flex items-center gap-3 flex-shrink-0">
            <Link
              to="/connexion"
              className="
                text-white/80 hover:text-white text-sm
                font-medium border border-white/30
                px-4 py-2 rounded-lg hover:border-white/60
                transition-colors hidden sm:block
              "
            >
              Connexion
            </Link>
            <Link
              to="/inscription"
              className="
                bg-[#f5a623] text-[#1a2744] font-bold text-sm
                px-5 py-2 rounded-lg hover:bg-[#e09415]
                transition-colors
              "
            >
              S'inscrire
            </Link>
          </div>
        </div>
      </header>

      {/* ── Contenu principal ──────────────────────────────── */}
      <main className="max-w-6xl mx-auto px-6 py-8 space-y-6">

        {/* ── Titre + compteur ───────────────────────────────── */}
        <div>
          <h1 className="text-2xl font-bold text-[#1a2744]">
            Trouvez votre répétiteur idéal
          </h1>
          <p className="text-sm text-gray-500 mt-1">
            {isLoading ? (
              <span className="animate-pulse">Chargement...</span>
            ) : (
              <>
                <span className="font-semibold text-[#1a2744]">
                  {totalCount}
                </span>{" "}
                répétiteur{totalCount > 1 ? "s" : ""} disponible
                {totalCount > 1 ? "s" : ""} à Dschang
              </>
            )}
          </p>
        </div>

        {/* ── Barre de filtres ───────────────────────────────── */}
        <SearchFilterBar
          pendingFilters={pendingFilters}
          onFilterChange={onPendingFilterChange}
          onApply={onApplyFilters}
          onReset={onResetFilters}
          totalCount={totalCount}
        />

        {/* ── Erreur ─────────────────────────────────────────── */}
        {hasError && (
          <div
            className="bg-red-50 border border-red-200 rounded-lg
                       px-4 py-3 text-red-700 text-sm flex items-center gap-2"
          >
            ⚠️ Impossible de charger les répétiteurs. Veuillez rafraîchir.
          </div>
        )}

        {/* ── Grille des répétiteurs ─────────────────────────── */}
        <TutorGrid
          tutors={tutors}
          isLoading={isLoading}
          onViewProfile={onViewProfile}
          onBook={onBookTutor}
          onResetFilters={onResetFilters}
        />

        {/* ── Note en bas de page ────────────────────────────── */}
        {!isLoading && tutors.length > 0 && (
          <p className="text-center text-xs text-gray-400 pb-4">
            Tous les répétiteurs affichés ont été vérifiés par TutorLink
            (CNI, diplômes, références).
          </p>
        )}
      </main>
    </div>
    {/* ✅ Footer ajouté ici */}
      <PublicFooter />
       </>
  );
};

export default SearchPage;