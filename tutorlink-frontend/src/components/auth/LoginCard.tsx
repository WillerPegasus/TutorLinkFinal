// ============================================================
// Carte centrale du formulaire de connexion
// Reproduit la maquette : titre, champs, case à cocher,
// lien mot de passe oublié, bouton, lien inscription
// ============================================================

import React from "react";
import { Link } from "react-router-dom";
import PasswordInput from "./PasswordInput";
import AuthErrorBanner from "./AuthErrorBanner";

interface Props {
  identifier: string;
  onIdentifierChange: (value: string) => void;
  password: string;
  onPasswordChange: (value: string) => void;
  rememberMe: boolean;
  onRememberMeChange: (value: boolean) => void;
  showPassword: boolean;
  onToggleShowPassword: () => void;
  onSubmit: () => void;
  isSubmitting: boolean;
  errorMessage: string | null;
  onForgotPasswordClick: () => void;
}

const LoginCard: React.FC<Props> = ({
  identifier,
  onIdentifierChange,
  password,
  onPasswordChange,
  rememberMe,
  onRememberMeChange,
  showPassword,
  onToggleShowPassword,
  onSubmit,
  isSubmitting,
  errorMessage,
  onForgotPasswordClick,
}) => {

  // Soumission via touche Entrée sur n'importe quel champ
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !isSubmitting) {
      e.preventDefault();
      onSubmit();
    }
  };

  return (
    <div
      className="
        bg-white rounded-xl shadow-lg w-full max-w-md
        overflow-hidden border-t-4 border-[#f5a623]
      "
    >
      <div className="px-8 py-9">

        {/* ── Titre ────────────────────────────────────────── */}
        <h1 className="text-2xl font-bold text-[#1a2744] mb-1">
          Bon retour parmi nous
        </h1>
        <p className="text-sm text-gray-500 mb-6">
          Connectez-vous à votre espace TutorLink.
        </p>

        {/* ── Bannière d'erreur ──────────────────────────────── */}
        <AuthErrorBanner message={errorMessage} />

        {/* ── Champ identifiant ──────────────────────────────── */}
        <div className="mb-4">
          <label
            htmlFor="identifier"
            className="block text-sm font-semibold text-gray-700 mb-1.5"
          >
            Adresse email ou téléphone
          </label>
          <input
            id="identifier"
            type="text"
            value={identifier}
            onChange={(e) => onIdentifierChange(e.target.value)}
            onKeyDown={handleKeyDown}
            disabled={isSubmitting}
            placeholder="exemple@email.com ou 6XX XX XX XX"
            className="
              w-full border border-gray-300 rounded-lg
              px-3 py-2.5 text-sm
              focus:outline-none focus:ring-2 focus:ring-[#1a2744]
              focus:border-transparent transition-colors
              disabled:bg-gray-50 disabled:text-gray-400
            "
          />
        </div>

        {/* ── Champ mot de passe ─────────────────────────────── */}
        <div className="mb-4">
          <label
            htmlFor="password"
            className="block text-sm font-semibold text-gray-700 mb-1.5"
          >
            Mot de passe
          </label>
          <div onKeyDown={handleKeyDown}>
            <PasswordInput
              id="password"
              value={password}
              onChange={onPasswordChange}
              show={showPassword}
              onToggleShow={onToggleShowPassword}
              disabled={isSubmitting}
            />
          </div>
        </div>

        {/* ── Se souvenir + Mot de passe oublié ──────────────── */}
        <div className="flex items-center justify-between mb-5">
          <label className="flex items-center gap-2 cursor-pointer select-none">
            <input
              type="checkbox"
              checked={rememberMe}
              onChange={(e) => onRememberMeChange(e.target.checked)}
              disabled={isSubmitting}
              className="
                w-4 h-4 rounded border-gray-300
                text-[#1a2744] focus:ring-[#1a2744]
                cursor-pointer
              "
            />
            <span className="text-sm text-gray-600">
              Se souvenir de moi
            </span>
          </label>

          <button
            type="button"
            onClick={onForgotPasswordClick}
            disabled={isSubmitting}
            className="
              text-sm text-[#1a2744] hover:underline
              cursor-pointer disabled:cursor-not-allowed
              disabled:text-gray-400
            "
          >
            Mot de passe oublié ?
          </button>
        </div>

        {/* ── Bouton Se connecter ─────────────────────────────── */}
        <button
          type="button"
          onClick={onSubmit}
          disabled={isSubmitting}
          className="
            w-full bg-[#1a2744] hover:bg-[#243566]
            text-white font-bold py-3 rounded-lg
            transition-colors cursor-pointer
            disabled:opacity-60 disabled:cursor-not-allowed
            flex items-center justify-center gap-2
          "
        >
          {isSubmitting ? (
            <>
              <svg className="animate-spin w-4 h-4" viewBox="0 0 24 24" fill="none">
                <circle className="opacity-25" cx="12" cy="12" r="10"
                  stroke="currentColor" strokeWidth="4" />
                <path className="opacity-75" fill="currentColor"
                  d="M4 12a8 8 0 018-8v8z" />
              </svg>
              Connexion...
            </>
          ) : (
            "Se connecter"
          )}
        </button>

        {/* ── Lien inscription ─────────────────────────────────── */}
        <p className="text-center text-sm text-gray-500 mt-5">
          Pas encore inscrit ?{" "}
          <Link
            to="/inscription"
            className="text-[#1a2744] font-bold hover:underline"
          >
            Créer un compte
          </Link>
        </p>
      </div>
    </div>
  );
};

export default LoginCard;