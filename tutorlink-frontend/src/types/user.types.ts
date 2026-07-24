import type { UserRole } from './auth.types';

export interface User {
  id: string;
  firstName: string;
  lastName: string;
  role: UserRole;
  isVerified?: boolean;
}
