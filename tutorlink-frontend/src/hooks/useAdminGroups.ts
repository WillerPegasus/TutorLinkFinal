import { useState, useEffect, useCallback } from 'react';
import { AdminGroup, AdminGroupFilters, AdminGroupStatus } from '../types/adminGroup.types';
import adminGroupService from '../services/adminGroupeService';
import adminLookupService from '../services/adminLookupService';

// Le backend (GroupStatus) n'a que ACTIVE/FULL/CLOSED/SUSPENDED — pas de
// notion de "en_attente" (un groupe est actif dès sa création).
const STATUS_MAP: Record<string, AdminGroupStatus> = {
  ACTIVE: 'actif',
  FULL: 'complet',
  SUSPENDED: 'suspendu',
  CLOSED: 'suspendu',
};

export const useAdminGroups = () => {
  const [groups, setGroups] = useState<AdminGroup[]>([]);
  const [loading, setLoading] = useState(true);

  const [filters, setFilters] = useState<AdminGroupFilters>({
    search: '', status: 'TOUS', subject: '',
  });

  const [selectedGroup, setSelectedGroup] = useState<AdminGroup | null>(null);

  const loadGroups = useCallback(async () => {
    setLoading(true);
    try {
      const data = await adminGroupService.getGroups({});
      const mapped: AdminGroup[] = await Promise.all(
        data.map(async (g: any) => {
          const tutor = await adminLookupService.resolveTutorInfo(g.tutorId);
          const status = STATUS_MAP[g.status] ?? 'actif';
          return {
            id: String(g.id),
            name: g.name,
            subject: g.subject,
            level: g.level,
            quartier: g.district ?? g.city ?? '',
            tutorName: tutor.name,
            tutorId: String(g.tutorId),
            currentMembers: g.currentCount ?? 0,
            maxMembers: g.maxCapacity ?? 0,
            monthlyPrice: g.monthlyPrice ?? 0,
            // ⚠️ Pas d'historique de revenus cumulés côté backend : on
            // affiche le revenu mensuel récurrent actuel (prix × membres).
            totalRevenue: (g.monthlyPrice ?? 0) * (g.currentCount ?? 0),
            status,
            // Pas de workflow de vérification séparé : un groupe SUSPENDED
            // se réactive via le même bouton (PATCH /groups/:id/verify).
            isVerified: status !== 'suspendu',
            createdAt: g.createdAt ?? '',
            sessionsPerWeek: 0, // ⚠️ non fourni par le backend
          } as AdminGroup;
        })
      );
      setGroups(mapped);
    } catch (err) {
      console.error('Erreur chargement groupes:', err);
      setGroups([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { loadGroups(); }, [loadGroups]);

  const filteredGroups = groups.filter(g => {
    const matchSearch =
      g.name.toLowerCase().includes(filters.search.toLowerCase()) ||
      g.tutorName.toLowerCase().includes(filters.search.toLowerCase()) ||
      g.subject.toLowerCase().includes(filters.search.toLowerCase());
    const matchStatus = filters.status === 'TOUS' || g.status === filters.status;
    const matchSubject = !filters.subject ||
      g.subject.toLowerCase().includes(filters.subject.toLowerCase());
    return matchSearch && matchStatus && matchSubject;
  });

  const handleVerify = async (id: string) => {
    try {
      await adminGroupService.verifyGroup(id);
      setGroups(prev => prev.map(g =>
        g.id === id ? { ...g, isVerified: true, status: 'actif' } : g
      ));
    } catch (err) {
      console.error('Erreur vérification groupe:', err);
    }
  };

  const handleSuspend = async (id: string) => {
    try {
      await adminGroupService.suspendGroup(id, '');
      setGroups(prev => prev.map(g =>
        g.id === id ? { ...g, status: 'suspendu', isVerified: false } : g
      ));
      setSelectedGroup(null);
    } catch (err) {
      console.error('Erreur suspension groupe:', err);
    }
  };

  const handleDelete = async (id: string) => {
    try {
      await adminGroupService.deleteGroup(id);
      setGroups(prev => prev.filter(g => g.id !== id));
      setSelectedGroup(null);
    } catch (err) {
      console.error('Erreur suppression groupe:', err);
    }
  };

  const stats = {
    total: groups.length,
    actifs: groups.filter(g => g.status === 'actif').length,
    enAttente: groups.filter(g => g.status === 'en_attente').length,
    totalEleves: groups.reduce((sum, g) => sum + g.currentMembers, 0),
    totalRevenus: groups.reduce((sum, g) => sum + g.totalRevenue, 0),
  };

  return {
    loading, filteredGroups, filters, setFilters, stats,
    selectedGroup, setSelectedGroup,
    handleVerify, handleSuspend, handleDelete,
  };
};
