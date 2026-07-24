// ============================================================
// Hook central de la page "Confirmation de réservation"
// Récupère les données depuis location.state (cas normal)
// ou via l'API (cas rafraîchissement de page)
// ============================================================

import { useEffect, useState } from "react";
import { useLocation, useParams, useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { getBookingById } from "../services/bookingConfirmService";
import type {
  BookingConfirmData,
  BookingConfirmTutor,
  BookingConfirmState,
} from "../types/bookingConfirm.types";

// ══════════════════════════════════════════════════════════════
// DONNÉES MOCK — répétiteur de secours si location.state absent
// à remplacer par getBookingById() quand backend prêt
// ══════════════════════════════════════════════════════════════

// ── DONNÉES MOCK ── tutor de secours quand location.state absent
// à remplacer par un appel GET /api/tutors/:id quand backend prêt
const MOCK_FALLBACK_TUTOR: BookingConfirmTutor = {
  id: "t1",
  firstName: "Leonel",
  lastName: "Nguena",
  subject: "Mathématiques",
  level: "Terminale C/D",
  location: "Centre Dschang",
  pricePerHour: 2000,
};

// ══════════════════════════════════════════════════════════════
// INTERFACE DE RETOUR DU HOOK
// ══════════════════════════════════════════════════════════════

interface UseBookingConfirmPageReturn {
  // Données
  booking: BookingConfirmData | null;  // Données de la réservation
  tutor: BookingConfirmTutor | null;   // Données du répétiteur
  bookingId: string;                   // ID extrait de l'URL

  // États
  isLoading: boolean;   // true pendant le chargement API (fallback)
  hasError: boolean;    // true si la réservation est introuvable
  isFromState: boolean; // true si données viennent de location.state

  // Navigation
  goToDashboard: () => void;      // Vers le tableau de bord élève
  goToSearchPage: () => void;     // Vers la recherche répétiteurs
  goToTutorProfile: () => void;   // Vers le profil du répétiteur
}

// ══════════════════════════════════════════════════════════════
// HOOK PRINCIPAL
// ══════════════════════════════════════════════════════════════

export function useBookingConfirmPage(): UseBookingConfirmPageReturn {
  const location  = useLocation();
  const navigate  = useNavigate();
  const { bookingId = "" } = useParams<{ bookingId: string }>();

  // ── Tente de récupérer les données depuis location.state ──
  // C'est le cas normal : navigate() depuis useBooking.ts
  // passe { booking, tutor } dans le state
  const stateData = location.state as BookingConfirmState | null;
  const isFromState = !!(stateData?.booking && stateData?.tutor);

  // ── Fallback API si location.state absent ─────────────────
  // Cas : rafraîchissement de page ou accès direct par URL
  // → remplacer par getBookingById() quand backend prêt
  const {
    data: apiBooking,
    isLoading,
    error,
  } = useQuery({
    queryKey: ["booking-confirm", bookingId],
    queryFn: () => getBookingById(bookingId),
    // N'appelle l'API QUE si location.state est absent
    enabled: !isFromState && !!bookingId,
    staleTime: 10 * 60 * 1000, // Cache 10 min — données statiques
    retry: 1,
  });

  // ── Données finales : state en priorité, puis API ─────────
  const booking: BookingConfirmData | null =
    stateData?.booking ?? apiBooking ?? null;

  // Pour le tutor : state en priorité, sinon mock de secours
  // → en production : appeler GET /api/tutors/:id si state absent
  const tutor: BookingConfirmTutor | null =
    stateData?.tutor ?? (apiBooking ? MOCK_FALLBACK_TUTOR : null);

  // ── Navigation ────────────────────────────────────────────

  /** Redirige vers le tableau de bord selon le rôle */
  const goToDashboard = () => {
    const role = localStorage.getItem("user_role") ??
                 sessionStorage.getItem("user_role");
    if (role === "TUTOR") {
      navigate("/repetiteur/dashboard");
    } else {
      // Élève / Parent → dashboard élève
      navigate("/eleve/dashboard");
    }
  };

  /** Redirige vers la page de recherche des répétiteurs */
  const goToSearchPage = () => {
    navigate("/repetiteurs");
  };

  /** Redirige vers le profil du répétiteur */
  const goToTutorProfile = () => {
    if (tutor?.id) {
      navigate(`/repetiteurs/${tutor.id}`);
    }
  };

  return {
    booking,
    tutor,
    bookingId,
    isLoading: !isFromState && isLoading,
    hasError:  !isFromState && !!error && !apiBooking,
    isFromState,
    goToDashboard,
    goToSearchPage,
    goToTutorProfile,
  };
}