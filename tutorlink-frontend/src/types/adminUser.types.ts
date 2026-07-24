// Rôles possibles d'un utilisateur
export type UserRole = 'ELEVE' | 'PARENT' | 'REPETITEUR';

// Statuts possibles d'un compte
export type UserStatus = 'actif' | 'suspendu' | 'a_valider';

// Structure complète d'un utilisateur admin
export interface AdminUserItem {
  id: string;
  name: string;
  email: string;
  phone: string;
  role: UserRole;
  status: UserStatus;
  quartier: string;
  createdAt: string;
  lastLogin: string;
}

// Filtres appliqués sur le tableau
export interface UserFilters {
  search: string;
  role: UserRole | 'TOUS';
  status: UserStatus | 'TOUS';
  quartier: string;
}