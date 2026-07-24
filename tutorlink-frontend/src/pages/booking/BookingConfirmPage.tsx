// ============================================================
// Page "Confirmation de réservation"
// Affichée après soumission réussie depuis BookingPage.tsx
// Routing : /booking/confirm/:bookingId
//
// Cas 1 (normal) : données reçues via location.state
//   → navigate(`/booking/confirm/${id}`, { state: { booking, tutor } })
//   → affichage immédiat sans appel API
//
// Cas 2 (rafraîchissement) : location.state absent
//   → appel GET /api/bookings/:id pour récupérer les données
//   → affichage du skeleton pendant le chargement
// ============================================================

import React from "react";
import { useNavigate }            from "react-router-dom";
import { useBookingConfirmPage }  from "../../hooks/useBookingConfirmPage";
import PublicFooter               from "../../components/public/layout/PublicFooter";
import ConfirmSuccessBanner       from "../../components/bookingConfirm/ConfirmSuccessBanner";
import ConfirmTutorCard           from "../../components/bookingConfirm/ConfirmTutorCard";
import ConfirmDetailsGrid         from "../../components/bookingConfirm/ConfirmDetailsGrid";
import ConfirmStatusAlert         from "../../components/bookingConfirm/ConfirmStatusAlert";
import ConfirmActionButtons       from "../../components/bookingConfirm/ConfirmActionButtons";
import ConfirmLoadingSkeleton     from "../../components/bookingConfirm/ConfirmLoadingSkeleton";
import ConfirmErrorState          from "../../components/bookingConfirm/ConfirmErrorState";

const BookingConfirmPage: React.FC = () => {
  const navigate = useNavigate();

  const {
    booking,
    tutor,
    bookingId,
    isLoading,
    hasError,
    goToDashboard,
    goToSearchPage,
    goToTutorProfile,
  } = useBookingConfirmPage();

  // ── Cas : chargement API (rafraîchissement de page) ───────
  if (isLoading) {
    return <ConfirmLoadingSkeleton />;
  }

  // ── Cas : erreur ou réservation introuvable ────────────────
  if (hasError || (!booking && !isLoading)) {
    return (
      <ConfirmErrorState
        bookingId={bookingId}
        onGoHome={() => navigate("/")}
        onGoToSearch={goToSearchPage}
      />
    );
  }

  // Sécurité TypeScript : à ce stade booking et tutor sont définis
  if (!booking || !tutor) return null;

  return (
    <>
      <div className="min-h-screen bg-[#eef2f7]">

        {/* ── Navbar minimale ──────────────────────────────── */}
        <header className="bg-[#1a2744] border-b border-white/10">
          <div className="max-w-5xl mx-auto px-6 py-4
                          flex items-center justify-between">

            {/* Logo */}
            <button
              type="button"
              onClick={() => navigate("/")}
              className="flex items-center gap-2 cursor-pointer"
            >
              <span className="text-[#f5a623] text-2xl">🎓</span>
              <span className="font-bold text-xl text-white">
                Tutor<span className="text-[#f5a623]">Link</span>
              </span>
            </button>

            {/* Lien retour profil répétiteur */}
            {tutor && (
              <button
                type="button"
                onClick={goToTutorProfile}
                className="
                  text-white/70 hover:text-white text-sm
                  transition-colors cursor-pointer
                  flex items-center gap-1
                "
              >
                ← Profil répétiteur
              </button>
            )}
          </div>
        </header>

        {/* ── Contenu principal ────────────────────────────── */}
        <main className="max-w-lg mx-auto px-4 py-10">
          <div className="bg-white rounded-2xl shadow-lg overflow-hidden">

            {/* ── Bannière de succès animée ──────────────────── */}
            <ConfirmSuccessBanner bookingId={booking.id} />

            {/* ── Bande référence ───────────────────────────── */}
            <div className="bg-[#f5a623]/10 border-b border-[#f5a623]/20
                            px-8 py-3 flex items-center justify-between">
              <span className="text-xs text-gray-500">
                Réservation créée le{" "}
                {new Date(booking.createdAt).toLocaleDateString("fr-FR")}
              </span>
              <span className="text-xs font-bold text-[#1a2744]">
                Réf. #{booking.id}
              </span>
            </div>

            {/* ── Corps de la confirmation ──────────────────── */}
            <div className="px-6 sm:px-8 py-6 space-y-5">

              {/* Carte répétiteur */}
              <ConfirmTutorCard
                tutor={tutor}
                onViewProfile={goToTutorProfile}
              />

              {/* Grille montant + date */}
              <ConfirmDetailsGrid booking={booking} />

              {/* Alertes statut + paiement */}
              <ConfirmStatusAlert
                tutor={tutor}
                paymentMethod={booking.paymentMethod}
                totalAmount={booking.totalAmount}
              />

              {/* Séparateur */}
              <div className="border-t border-gray-100" />

              {/* Boutons d'action */}
              <ConfirmActionButtons
                onGoToDashboard={goToDashboard}
                onGoToSearch={goToSearchPage}
              />

              {/* Note de contact */}
              <p className="text-center text-xs text-gray-400">
                Une question ?{" "}
                <a
                  href="mailto:contact@tutorlink.cm"
                  className="underline hover:text-gray-600 transition-colors"
                >
                  contact@tutorlink.cm
                </a>
              </p>
            </div>
          </div>
        </main>
      </div>

      {/* Footer commun aux pages publiques */}
      <PublicFooter />
    </>
  );
};

export default BookingConfirmPage;