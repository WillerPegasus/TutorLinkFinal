import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface AdminAuthStore {
  adminToken: string | null;
  isAdminAuthenticated: boolean;
  setAdminAuth: (token: string) => void;
  adminLogout: () => void;
}

export const useAdminAuthStore = create<AdminAuthStore>()(
  persist(
    (set) => ({
      adminToken: null,
      isAdminAuthenticated: false,
      setAdminAuth: (token) => set({ adminToken: token, isAdminAuthenticated: true }),
      adminLogout: () => set({ adminToken: null, isAdminAuthenticated: false }),
    }),
    { name: 'tutorlink-admin-auth' }
  )
);