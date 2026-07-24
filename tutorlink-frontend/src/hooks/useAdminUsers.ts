import { useState, useEffect, useCallback } from 'react';
import { AdminUserItem, UserFilters, UserRole, UserStatus } from '../types/adminUser.types';
import adminUserService from '../services/adminUserService';

const STATUS_MAP: Record<string, UserStatus> = {
  ACTIVE: 'actif',
  SUSPENDED: 'suspendu',
  PENDING: 'a_valider',
};

// Le backend utilise STUDENT/PARENT/TUTOR/ADMIN, le frontend ELEVE/PARENT/REPETITEUR
const ROLE_MAP: Record<string, UserRole | null> = {
  STUDENT: 'ELEVE',
  PARENT: 'PARENT',
  TUTOR: 'REPETITEUR',
  ADMIN: null, // les admins ne sont pas affichés dans cette liste
};

export const useAdminUsers = () => {
  const [users, setUsers] = useState<AdminUserItem[]>([]);
  const [loading, setLoading] = useState(true);

  const [filters, setFilters] = useState<UserFilters>({
    search: '', role: 'TOUS', status: 'TOUS', quartier: '',
  });

  const [selectedUser, setSelectedUser] = useState<AdminUserItem | null>(null);

  const loadUsers = useCallback(async () => {
    setLoading(true);
    try {
      const data = await adminUserService.getAllUsers();
      const mapped: AdminUserItem[] = data
        .map((u: any) => {
          const role = ROLE_MAP[u.role];
          if (!role) return null; // on masque les comptes ADMIN
          return {
            id: String(u.id),
            name: `${u.firstName ?? ''} ${u.lastName ?? ''}`.trim(),
            email: u.email ?? '',
            phone: u.phone ?? '',
            role,
            status: STATUS_MAP[u.status] ?? 'actif',
            quartier: u.districts ?? u.city ?? '',
            createdAt: u.createdAt ?? '',
            lastLogin: '', // pas encore fourni par le backend
          };
        })
        .filter(Boolean);
      setUsers(mapped);
    } catch (err) {
      console.error('Erreur chargement utilisateurs:', err);
      setUsers([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadUsers();
  }, [loadUsers]);

  const filteredUsers = users.filter(u => {
    const matchSearch = u.name.toLowerCase().includes(filters.search.toLowerCase())
      || u.email.toLowerCase().includes(filters.search.toLowerCase());
    const matchRole = filters.role === 'TOUS' || u.role === filters.role;
    const matchStatus = filters.status === 'TOUS' || u.status === filters.status;
    const matchQuartier = !filters.quartier || u.quartier.toLowerCase().includes(filters.quartier.toLowerCase());
    return matchSearch && matchRole && matchStatus && matchQuartier;
  });

  // Supprime définitivement un utilisateur (vrai appel backend)
  const handleDelete = async (userId: string) => {
    try {
      await adminUserService.deleteUser(Number(userId));
      setUsers(prev => prev.filter(u => u.id !== userId));
      setSelectedUser(null);
    } catch (err) {
      console.error('Erreur suppression utilisateur:', err);
    }
  };

  return {
    loading, filteredUsers, filters, setFilters,
    selectedUser, setSelectedUser,
    handleDelete,
  };
};
