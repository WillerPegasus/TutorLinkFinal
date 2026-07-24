// ============================================================
// Hook central de la page "Recherche" des répétiteurs
// Gère les filtres, les données mock, le filtrage local
// et la navigation vers le profil / la réservation
// ============================================================

import { useState, useMemo, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import type {
  SearchFilters,
  SearchTutor,
} from "../types/searchs.types";
import { DEFAULT_FILTERS } from "../types/searchs.types";

// ══════════════════════════════════════════════════════════════
// DONNÉES MOCK — à remplacer par searchService.searchTutors()
// quand le backend sera prêt
// ══════════════════════════════════════════════════════════════

// ── DONNÉES MOCK ── à remplacer par searchService.searchTutors()
const MOCK_TUTORS: SearchTutor[] = [
  {
    id: "t1",
    firstName: "Mystelle",
    lastName: "Assonfack",
    subject: "Mathématiques",
    level: "Terminale C/D",
    district: "Centre Dschang",
    bio: "10 ans d'expérience, ancien enseignant au Lycée Classique de Dschang.",
    pricePerHour: 2000,
    rating: 4.9,
    reviewCount: 87,
    isVerified: true,
    formation: "Licence Maths · Université de Dschang",
  },
  {
    id: "t2",
    firstName: "Leo",
    lastName: "Tsafack",
    subject: "Physique-Chimie",
    level: "Lycée",
    district: "Quartier Foto",
    bio: "Doctorante en physique à l'Université de Dschang.",
    pricePerHour: 1800,
    rating: 4.8,
    reviewCount: 64,
    isVerified: true,
    formation: "Master Physique · Université de Dschang",
  },
  {
    id: "t3",
    firstName: "Bertrand",
    lastName: "Nana",
    subject: "Français",
    level: "Collège & Lycée",
    district: "Ngui Dschang",
    bio: "Spécialiste de la dissertation et du commentaire composé.",
    pricePerHour: 1500,
    rating: 4.7,
    reviewCount: 52,
    isVerified: true,
    formation: "Licence Lettres · Université de Dschang",
  },
  {
    id: "t4",
    firstName: "Laressa",
    lastName: "Fotso",
    subject: "Anglais",
    level: "Tous niveaux",
    district: "Centre Dschang",
    bio: "Bilingue, méthode immersive et conversationnelle.",
    pricePerHour: 1700,
    rating: 4.9,
    reviewCount: 73,
    isVerified: true,
    formation: "Licence Anglais · Université de Dschang",
  },
  {
    id: "t5",
    firstName: "Leonel",
    lastName: "Nguena",
    subject: "Informatique",
    level: "Lycée",
    district: "Quartier Foto",
    bio: "Ingénieur logiciel, initiation à la programmation.",
    pricePerHour: 2000,
    rating: 4.8,
    reviewCount: 41,
    isVerified: true,
    formation: "Licence Informatique · IUT Dschang",
  },
  {
    id: "t6",
    firstName: "Dallya",
    lastName: "Tonfack",
    subject: "SVT",
    level: "3ème & Lycée",
    district: "Ngui Dschang",
    bio: "Préparation rigoureuse au BEPC et au BAC D.",
    pricePerHour: 1600,
    rating: 4.6,
    reviewCount: 38,
    isVerified: false,
    formation: "Licence SVT · Université de Dschang",
  },
  {
    id: "t7",
    firstName: "Paul",
    lastName: "Djoumessi",
    subject: "Mathématiques",
    level: "Collège & Lycée",
    district: "Centre Dschang",
    bio: "Approche méthodique et exercices pratiques intensifs.",
    pricePerHour: 1800,
    rating: 4.5,
    reviewCount: 29,
    isVerified: true,
    formation: "Licence Maths · Université de Dschang",
  },
  {
    id: "t8",
    firstName: "Estelle",
    lastName: "Foka",
    subject: "SVT",
    level: "Lycée",
    district: "Tsinkop",
    bio: "Biologiste spécialisée en génétique et écosystèmes.",
    pricePerHour: 1700,
    rating: 4.4,
    reviewCount: 22,
    isVerified: false,
    formation: "Master Biologie · Université de Dschang",
  },
  {
    id: "t9",
    firstName: "Ariel",
    lastName: "Toukam",
    subject: "Anglais",
    level: "Tous niveaux",
    district: "Foréké",
    bio: "Certifié DELF/DALF, conversationnel et grammaire.",
    pricePerHour: 1500,
    rating: 4.6,
    reviewCount: 17,
    isVerified: true,
    formation: "Licence Anglais-Espagnol · Université de Dschang",
  },
];

// ══════════════════════════════════════════════════════════════
// INTERFACE DE RETOUR DU HOOK
// ══════════════════════════════════════════════════════════════

interface UseSearchPageReturn {
  // Données
  tutors: SearchTutor[];       // Répétiteurs après filtrage
  totalCount: number;          // Nombre total (avant filtrage = 132 simulé)
  isLoading: boolean;          // Pendant un appel API
  hasError: boolean;

  // Filtres
  filters: SearchFilters;
  pendingFilters: SearchFilters;  // Filtres en cours de saisie (avant "Filtrer")
  onPendingFilterChange: (
    key: keyof SearchFilters,
    value: string | number
  ) => void;
  onApplyFilters: () => void;    // Applique les filtres en attente
  onResetFilters: () => void;    // Remet tous les filtres à zéro

  // Navigation
  onViewProfile: (tutorId: string) => void;
  onBookTutor: (tutorId: string) => void;
}

// ══════════════════════════════════════════════════════════════
// HOOK PRINCIPAL
// ══════════════════════════════════════════════════════════════

export function useSearchPage(): UseSearchPageReturn {
  const navigate = useNavigate();

  // ── Filtres appliqués (actifs sur la liste) ───────────────
  const [filters, setFilters] = useState<SearchFilters>(DEFAULT_FILTERS);

  // ── Filtres en cours de saisie (pas encore appliqués) ─────
  // Permet de modifier les selects sans re-filtrer immédiatement
  const [pendingFilters, setPendingFilters] = useState<SearchFilters>(DEFAULT_FILTERS);

  // ── Filtre les répétiteurs mock selon les filtres actifs ──
  // → remplacer par searchService.searchTutors(filters) quand backend prêt
  const tutors = useMemo(() => {
    // ── DONNÉES MOCK ── à remplacer par l'appel API
    return MOCK_TUTORS.filter((tutor) => {
      // Filtre matière
      if (filters.subject && tutor.subject !== filters.subject) return false;
      // Filtre niveau (correspondance partielle)
      if (
        filters.level &&
        !tutor.level.toLowerCase().includes(filters.level.toLowerCase()) &&
        tutor.level !== "Tous niveaux"
      ) return false;
      // Filtre quartier
      if (filters.district && tutor.district !== filters.district) return false;
      // Filtre prix max
      if (filters.maxPrice > 0 && tutor.pricePerHour > filters.maxPrice) return false;
      return true;
    });
  }, [filters]);

  // Compte total simulé (en prod viendra du backend)
  const totalCount = tutors.length;

  // ── Met à jour un champ des filtres en attente ────────────
  const onPendingFilterChange = useCallback(
    (key: keyof SearchFilters, value: string | number) => {
      setPendingFilters((prev) => ({ ...prev, [key]: value }));
    },
    []
  );

  // ── Applique les filtres en attente ───────────────────────
  const onApplyFilters = useCallback(() => {
    setFilters({ ...pendingFilters });
  }, [pendingFilters]);

  // ── Remet tout à zéro ────────────────────────────────────
  const onResetFilters = useCallback(() => {
    setFilters(DEFAULT_FILTERS);
    setPendingFilters(DEFAULT_FILTERS);
  }, []);

  // ── Navigation : voir le profil complet du répétiteur ─────
  const onViewProfile = useCallback(
    (tutorId: string) => {
      navigate(`/repetiteurs/${tutorId}`);
    },
    [navigate]
  );

  // ── Navigation : réserver un cours avec ce répétiteur ─────
  const onBookTutor = useCallback(
    (tutorId: string) => {
      // Vérifie si l'utilisateur est connecté
      const token = localStorage.getItem("token") ?? sessionStorage.getItem("token");
      if (!token) {
        // Redirige vers connexion en mémorisant la destination
        navigate("/connexion", {
          state: { from: `/reserver/${tutorId}` },
        });
        return;
      }
      navigate(`/reserver/${tutorId}`);
    },
    [navigate]
  );

  return {
    tutors,
    totalCount,
    isLoading: false, // → remplacer par isLoading de useQuery quand backend prêt
    hasError: false,
    filters,
    pendingFilters,
    onPendingFilterChange,
    onApplyFilters,
    onResetFilters,
    onViewProfile,
    onBookTutor,
  };
}