// ============================================================
// Types TypeScript pour la page "Confirmation de réservation"
// Données reçues via location.state après soumission réussie
// ============================================================

// ── Statut de la réservation créée ────────────────────────────
export type BookingConfirmStatus =
  | "PENDING"    // En attente de confirmation du répétiteur (statut initial)
  | "CONFIRMED"  // Confirmée par le répétiteur
  | "CANCELLED"; // Annulée

// ── Moyen de paiement utilisé ────────────────────────────────
export type BookingConfirmPayment = "MTN_MOMO" | "ORANGE_MONEY";

// ── Données de la réservation créée ──────────────────────────
// Reçues via navigate(..., { state: { booking, tutor } })
// depuis useBooking.ts après la mutation createBooking()

/**
 * Objet réservation retourné par l'API après création.
 * ⚠️ BACKEND : retourné par POST /api/bookings
 */
export interface BookingConfirmData {
  id: string;              // Référence ex: "R-1287"
  status: BookingConfirmStatus; // Toujours "PENDING" à la création
  tutorId: string;         // ID du répétiteur
  slotId: string;          // ID du créneau réservé
  totalAmount: number;     // Montant total en FCFA
  createdAt: string;       // Date de création ISO 8601
  durationHours?: number;  // Durée en heures (optionnel si dans state)
  paymentMethod?: BookingConfirmPayment; // Moyen de paiement choisi
}

/**
 * Données du répétiteur transmises avec la confirmation.
 * Sous-ensemble de TutorSummary — passé via location.state
 */
export interface BookingConfirmTutor {
  id: string;
  firstName: string;    // Prénom du répétiteur
  lastName: string;     // Nom de famille
  subject: string;      // Matière enseignée
  level: string;        // Niveau enseigné
  location: string;     // Quartier ex: "Centre Dschang"
  pricePerHour: number; // Tarif horaire FCFA
  avatarUrl?: string;   // Photo de profil (optionnel)
}

/**
 * État complet reçu dans location.state
 * après navigate depuis useBooking.ts
 */
export interface BookingConfirmState {
  booking: BookingConfirmData; // Données de la réservation
  tutor: BookingConfirmTutor;  // Données du répétiteur
}

// ── Libellés des moyens de paiement ──────────────────────────
export const PAYMENT_METHOD_LABELS: Record<
  BookingConfirmPayment,
  string
> = {
  MTN_MOMO:     "MTN Mobile Money",
  ORANGE_MONEY: "Orange Money",
};

// ── Libellés des statuts ──────────────────────────────────────
export const STATUS_LABELS: Record<BookingConfirmStatus, string> = {
  PENDING:   "En attente de confirmation",
  CONFIRMED: "Confirmée",
  CANCELLED: "Annulée",
};