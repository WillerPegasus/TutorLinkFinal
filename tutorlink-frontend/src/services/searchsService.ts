// ============================================================
// Service API pour la page "Recherche" des répétiteurs
// Tous les appels vers le backend Express/Node.js
// ============================================================

import type {
  SearchFilters,
  SearchResult,
} from "../types/searchs.types";

const BASE_URL = import.meta.env.VITE_API_URL ?? "http://localhost:3000/api";

const delay = (ms: number) => new Promise<void>((r) => setTimeout(r, ms));

// ══════════════════════════════════════════════════════════════

/**
 * Recherche des répétiteurs selon les filtres actifs.
 * ⚠️ BACKEND REQUIS — GET /api/tutors
 * Paramètres query : subject, level, district, maxPrice, page
 * Le backend :
 *   1. Filtre les répétiteurs validés (isVerified = true) selon les filtres
 *   2. Trie par note décroissante par défaut
 *   3. Retourne la liste paginée avec le total
 */
export async function searchTutors(
  filters: SearchFilters,
  page = 1
): Promise<SearchResult> {
  // ── PRODUCTION (décommenter lors de l'intégration) ────────
  // const params = new URLSearchParams();
  // if (filters.subject)        params.set("subject",  filters.subject);
  // if (filters.level)          params.set("level",    filters.level);
  // if (filters.district)       params.set("district", filters.district);
  // if (filters.maxPrice > 0)   params.set("maxPrice", String(filters.maxPrice));
  // params.set("page", String(page));
  //
  // const res = await fetch(`${BASE_URL}/tutors?${params.toString()}`);
  // if (!res.ok) throw new Error("Erreur chargement répétiteurs");
  // return res.json();

  // ── MOCK temporaire ───────────────────────────────────────
  await delay(400);
  return { tutors: [], total: 0, page: 1, hasMore: false };
}