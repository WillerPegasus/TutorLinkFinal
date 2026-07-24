// ============================================================
// Types TypeScript pour l'authentification (page Connexion)
// Définit les interfaces de connexion, utilisateur et session
// ============================================================

// ── Rôles possibles d'un utilisateur ──────────────────────────
export type UserRole = "STUDENT" | "PARENT" | "TUTOR" | "ADMIN";

// ── Données saisies dans le formulaire de connexion ──────────
export interface LoginFormData {
  identifier: string;   // Email OU numéro de téléphone saisi par l'utilisateur
  password: string;     // Mot de passe
  rememberMe: boolean;  // Case "Se souvenir de moi"
}

// ── Utilisateur connecté retourné par l'API ───────────────────
export interface AuthUser {
  id: string;             // Identifiant unique de l'utilisateur
  firstName: string;      // Prénom
  lastName: string;       // Nom de famille
  email: string;          // Adresse email
  phone: string;          // Numéro de téléphone
  role: UserRole;         // Rôle déterminant la redirection post-login
  district: string;       // Quartier à Dschang
  avatarUrl?: string;     // Photo de profil (optionnel)
}

// ── Réponse complète de l'API après connexion réussie ────────
export interface LoginResponse {
  token: string;              // JWT à stocker pour les requêtes futures
  userId: number;
  firstName: string;
  lastName: string;
  role: AuthUser['role'];
  isVerified: boolean;
  twoFactorRequired: boolean;
  message: string | null;
}

// ── Payload envoyé pour la demande de réinitialisation ───────
export interface ForgotPasswordPayload {
  identifier: string;     // Email ou téléphone pour recevoir le code
}

// ── Erreur de connexion structurée ────────────────────────────
export interface LoginError {
  code: LoginErrorCode;   // Code technique de l'erreur
  message: string;        // Message affiché à l'utilisateur
}

export type LoginErrorCode =
  | "INVALID_CREDENTIALS"  // Email/téléphone ou mot de passe incorrect
  | "ACCOUNT_SUSPENDED"    // Compte suspendu par l'admin
  | "ACCOUNT_NOT_VERIFIED" // Répétiteur en attente de validation
  | "NETWORK_ERROR"        // Erreur réseau / serveur injoignable
  | "UNKNOWN";             // Erreur non identifiée

// ── Mapping des rôles vers leur route de redirection ──────────
export const ROLE_REDIRECT_MAP: Record<UserRole, string> = {
  STUDENT: "/eleve/dashboard",
  PARENT:  "/eleve/dashboard",
  TUTOR:   "/repetiteur/dashboard",
  ADMIN:   "/admin/dashboard",
};