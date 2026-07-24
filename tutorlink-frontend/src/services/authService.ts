// ============================================================
// Service API pour l'authentification
// Appelle le backend via le gateway (api-gateway -> auth-service)
// ============================================================

import type {
  LoginFormData,
  LoginResponse,
  ForgotPasswordPayload,
} from "../types/auth.types";

const BASE_URL = import.meta.env.VITE_API_URL ?? "http://localhost:8080/api";

/**
 * Connecte un utilisateur avec email/téléphone + mot de passe.
 * POST /api/auth/login
 */
export async function loginUser(data: LoginFormData): Promise<LoginResponse> {
  const res = await fetch(`${BASE_URL}/auth/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });

  if (!res.ok) {
    let code = "UNKNOWN";
    try {
      const err = await res.json();
      code = err.code ?? err.message ?? "UNKNOWN";
    } catch {
      code = "NETWORK_ERROR";
    }
    throw new Error(code);
  }

  return res.json();
}

/**
 * Envoie une demande de réinitialisation de mot de passe.
 * POST /api/auth/forgot-password
 */
export async function verifyRegistrationOtp(
  email: string,
  otpCode: string
): Promise<void> {
  const res = await fetch(`${BASE_URL}/auth/verify-otp`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, otpCode }),
  });
  if (!res.ok) {
    let message = "Code incorrect ou expiré.";
    try {
      const err = await res.json();
      message = err.message ?? message;
    } catch {}
    throw new Error(message);
  }
}

export async function requestPasswordReset(
  payload: ForgotPasswordPayload
): Promise<void> {
  const res = await fetch(`${BASE_URL}/auth/forgot-password`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });
  if (!res.ok) throw new Error("Erreur lors de l'envoi du code");
}

/**
 * Rafraîchit le token JWT expiré à l'aide du refreshToken.
 * POST /api/auth/refresh
 */
export async function refreshAuthToken(
  refreshToken: string
): Promise<{ token: string; expiresIn: number }> {
  const res = await fetch(`${BASE_URL}/auth/refresh`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ refreshToken }),
  });
  if (!res.ok) throw new Error("Session expirée");
  return res.json();
}
