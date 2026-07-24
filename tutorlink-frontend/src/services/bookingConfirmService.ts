// ============================================================
// Service API pour la page "Confirmation de réservation"
// Permet de récupérer une réservation si l'utilisateur
// rafraîchit la page et que le location.state est perdu
// ============================================================

import type { BookingConfirmData } from "../types/bookingConfirm.types";

const BASE_URL = import.meta.env.VITE_API_URL ?? "http://localhost:3000/api";

const delay = (ms: number) => new Promise<void>((r) => setTimeout(r, ms));

// Headers avec JWT de l'utilisateur connecté
const authHeaders = () => ({
  "Content-Type": "application/json",
  Authorization: `Bearer ${
    localStorage.getItem("token") ??
    sessionStorage.getItem("token") ??
    ""
  }`,
});

// ══════════════════════════════════════════════════════════════

/**
 * Récupère une réservation par son ID.
 * Utilisé uniquement quand location.state est absent
 * (cas du rafraîchissement de page ou accès direct par URL).
 * ⚠️ BACKEND REQUIS — GET /api/bookings/:bookingId
 * Le backend :
 *   1. Vérifie que la réservation appartient à l'utilisateur connecté
 *   2. Retourne les données complètes de la réservation
 */
export async function getBookingById(
  bookingId: string
): Promise<BookingConfirmData> {
  // ── PRODUCTION (décommenter lors de l'intégration) ────────
  // const res = await fetch(`${BASE_URL}/bookings/${bookingId}`, {
  //   headers: authHeaders(),
  // });
  // if (!res.ok) throw new Error("Réservation introuvable");
  // return res.json();

  // ── MOCK temporaire ───────────────────────────────────────
  await delay(400);
  // Retourne des données simulées basées sur l'ID
  return {
    id: bookingId,
    status: "PENDING",
    tutorId: "t1",
    slotId: "s8",
    totalAmount: 4000,
    createdAt: new Date().toISOString(),
    durationHours: 2,
    paymentMethod: "MTN_MOMO",
  };
}