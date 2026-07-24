// ============================================================
// Page de connexion publique TutorLink
// Routing : /connexion
// Reproduit la maquette : Navbar publique + carte centrée
// ============================================================

import React from "react";
import { Link } from "react-router-dom";
import { useLoginPage } from "../../hooks/useLoginPage";
import LoginCard from "../../components/auth/LoginCard";
import ForgotPasswordModal from "../../components/auth/ForgotPasswordModal";
import PublicFooter from "../../components/public/layout/PublicFooter";

const LoginPage: React.FC = () => {

  const {
    identifier,
    setIdentifier,
    password,
    setPassword,
    rememberMe,
    setRememberMe,
    handleSubmit,
    isSubmitting,
    errorMessage,
    showPassword,
    toggleShowPassword,
    forgotPasswordOpen,
    openForgotPassword,
    closeForgotPassword,
    handleForgotPasswordSubmit,
    isSendingResetCode,
    resetCodeSent,
  } = useLoginPage();

  return (
    <>
    <div className="min-h-screen bg-[#f5f3ee] flex flex-col">

      {/* ── Navbar publique simplifiée ──────────────────────── */}
      <header className="bg-[#1a2744] border-b border-white/10">
        <div className="max-w-6xl mx-auto px-6 py-4
                        flex items-center justify-between">
          <Link to="/" className="flex items-center gap-2">
            <span className="text-[#f5a623] text-2xl">🎓</span>
            <span className="font-bold text-xl text-white">
              Tutor<span className="text-[#f5a623]">Link</span>
            </span>
          </Link>

          <nav className="hidden md:flex items-center gap-8">
            <Link to="/" className="text-white/80 hover:text-white text-sm transition-colors">
              Accueil
            </Link>
            <Link to="/repetiteurs" className="text-white/80 hover:text-white text-sm transition-colors">
              Répétiteurs
            </Link>
            <Link to="/groupes" className="text-white/80 hover:text-white text-sm transition-colors">
              Groupes
            </Link>
          </nav>

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
      </header>

      {/* ── Zone centrale : formulaire ──────────────────────── */}
      <main className="flex-1 flex items-center justify-center px-4 py-12">
        <LoginCard
          identifier={identifier}
          onIdentifierChange={setIdentifier}
          password={password}
          onPasswordChange={setPassword}
          rememberMe={rememberMe}
          onRememberMeChange={setRememberMe}
          showPassword={showPassword}
          onToggleShowPassword={toggleShowPassword}
          onSubmit={handleSubmit}
          isSubmitting={isSubmitting}
          errorMessage={errorMessage}
          onForgotPasswordClick={openForgotPassword}
        />
      </main>

      {/* ── Modal mot de passe oublié ───────────────────────── */}
      <ForgotPasswordModal
        isOpen={forgotPasswordOpen}
        onClose={closeForgotPassword}
        onSubmit={handleForgotPasswordSubmit}
        isLoading={isSendingResetCode}
        codeSent={resetCodeSent}
      />
    </div>
    <PublicFooter/>
    </>
  );
};

export default LoginPage;