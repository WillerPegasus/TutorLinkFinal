// ============================================================
// Hook central de la page de connexion
// Gère le formulaire, les données mock de test, la validation,
// la soumission et la redirection selon le rôle
// ============================================================

import { useState, useCallback } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useMutation } from "@tanstack/react-query";
import { loginUser, requestPasswordReset } from "../services/authService";
import { useAuthStore } from "../store/authStore";
import type {
  LoginFormData,
  LoginResponse,
  LoginErrorCode,
} from "../types/auth.types";
import { ROLE_REDIRECT_MAP } from "../types/auth.types";

// ── Messages d'erreur lisibles par code ───────────────────────
const ERROR_MESSAGES: Record<LoginErrorCode, string> = {
  INVALID_CREDENTIALS:
    "Email/téléphone ou mot de passe incorrect.",
  ACCOUNT_SUSPENDED:
    "Votre compte a été suspendu. Contactez le support.",
  ACCOUNT_NOT_VERIFIED:
    "Votre dossier répétiteur est en attente de validation par l'administrateur.",
  NETWORK_ERROR:
    "Impossible de se connecter au serveur. Vérifiez votre connexion.",
  UNKNOWN:
    "Une erreur est survenue. Veuillez réessayer.",
};

// ══════════════════════════════════════════════════════════════
// INTERFACE DE RETOUR DU HOOK
// ══════════════════════════════════════════════════════════════

interface UseLoginPageReturn {
  // Formulaire
  identifier: string;
  setIdentifier: (value: string) => void;
  password: string;
  setPassword: (value: string) => void;
  rememberMe: boolean;
  setRememberMe: (value: boolean) => void;

  // Soumission
  handleSubmit: () => void;
  isSubmitting: boolean;
  errorMessage: string | null;

  // Visibilité du mot de passe
  showPassword: boolean;
  toggleShowPassword: () => void;

  // Modal mot de passe oublié
  forgotPasswordOpen: boolean;
  openForgotPassword: () => void;
  closeForgotPassword: () => void;
  handleForgotPasswordSubmit: (identifier: string) => void;
  isSendingResetCode: boolean;
  resetCodeSent: boolean;
}

// ══════════════════════════════════════════════════════════════
// HOOK PRINCIPAL
// ══════════════════════════════════════════════════════════════

export function useLoginPage(): UseLoginPageReturn {
  const navigate = useNavigate();
  const location = useLocation();
  const setAuth = useAuthStore((s) => s.setAuth);

  // ── État du formulaire ────────────────────────────────────
  const [identifier,  setIdentifier]  = useState("");
  const [password,    setPassword]    = useState("");
  const [rememberMe,  setRememberMe]  = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // ── État du modal mot de passe oublié ─────────────────────
  const [forgotPasswordOpen, setForgotPasswordOpen] = useState(false);
  const [resetCodeSent,      setResetCodeSent]       = useState(false);

  // ── Mutation : connexion ──────────────────────────────────
  const loginMutation = useMutation({
    mutationFn: async (data: LoginFormData): Promise<LoginResponse> => {
      return loginUser(data);
    },
    onSuccess: (response) => {
      // Stocke le token et les infos utilisateur (legacy, gardé pour compat)
      const storage = rememberMe ? localStorage : sessionStorage;
      storage.setItem("token", response.token);
      storage.setItem("user_role", response.role);
      storage.setItem("user_first_name", response.firstName);

      if (response.role === "TUTOR") {
        localStorage.setItem("tutor_first_name", response.firstName);
      }

      // Remplit le store global (source de vérité pour toute l'UI)
      setAuth(response.token, {
        id: String(response.userId),
        firstName: response.firstName,
        lastName: response.lastName,
        role: response.role,
        isVerified: response.isVerified,
      });

      // Redirige vers la page d'origine si elle existait (route protégée)
      // sinon vers le dashboard correspondant au rôle
      const redirectTo =
        (location.state as { from?: string })?.from ??
        ROLE_REDIRECT_MAP[response.role];

      navigate(redirectTo, { replace: true });
    },
    onError: (error: Error) => {
      const code = (error.message as LoginErrorCode) || "UNKNOWN";
      setErrorMessage(ERROR_MESSAGES[code] ?? ERROR_MESSAGES.UNKNOWN);
    },
  });

  // ── Mutation : mot de passe oublié ────────────────────────
  const forgotPasswordMutation = useMutation({
    mutationFn: async (id: string) => {
      await new Promise((r) => setTimeout(r, 600));
    },
    onSuccess: () => {
      setResetCodeSent(true);
    },
  });

  // ── Soumet le formulaire de connexion ─────────────────────
  const handleSubmit = useCallback(() => {
    setErrorMessage(null);

    if (!identifier.trim()) {
      setErrorMessage("Veuillez saisir votre email ou téléphone.");
      return;
    }
    if (!password) {
      setErrorMessage("Veuillez saisir votre mot de passe.");
      return;
    }

    loginMutation.mutate({ identifier: identifier.trim(), password, rememberMe });
  }, [identifier, password, rememberMe, loginMutation]);

  // ── Toggle affichage du mot de passe ──────────────────────
  const toggleShowPassword = useCallback(() => {
    setShowPassword((prev) => !prev);
  }, []);

  // ── Actions modal mot de passe oublié ─────────────────────
  const openForgotPassword = useCallback(() => {
    setResetCodeSent(false);
    setForgotPasswordOpen(true);
  }, []);

  const closeForgotPassword = useCallback(() => {
    setForgotPasswordOpen(false);
    setResetCodeSent(false);
  }, []);

  const handleForgotPasswordSubmit = useCallback(
    (id: string) => {
      forgotPasswordMutation.mutate(id);
    },
    [forgotPasswordMutation]
  );

  return {
    identifier,
    setIdentifier,
    password,
    setPassword,
    rememberMe,
    setRememberMe,
    handleSubmit,
    isSubmitting: loginMutation.isPending,
    errorMessage,
    showPassword,
    toggleShowPassword,
    forgotPasswordOpen,
    openForgotPassword,
    closeForgotPassword,
    handleForgotPasswordSubmit,
    isSendingResetCode: forgotPasswordMutation.isPending,
    resetCodeSent,
  };
}
