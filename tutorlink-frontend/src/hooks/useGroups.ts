import { useState, useEffect, useCallback } from 'react';
import { Group, GroupFilters, GroupStatus } from '../types/group.types';
import groupeService from '../services/groupeService';
import { resolvePublicProfile } from '../services/publicProfileCache';
import bookingService from '../services/bookingService';

const STATUS_MAP: Record<string, GroupStatus> = {
  ACTIVE: 'actif',
  FULL: 'complet',
  SUSPENDED: 'suspendu',
  CLOSED: 'suspendu',
};

export const useGroups = () => {
  const [filters, setFiltersState] = useState<GroupFilters>({
    subject: '', level: '', quartier: '', maxPrice: null,
  });
  const [groups, setGroups] = useState<Group[]>([]);
  const [loading, setLoading] = useState(true);

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const data = await groupeService.getGroups({
        subject: filters.subject || undefined,
        level: filters.level || undefined,
        maxPrice: filters.maxPrice ?? undefined,
      } as any);

      const mapped: Group[] = await Promise.all(
        (data ?? []).map(async (g: any) => {
          const tutor = await bookingService.getTutorById(g.tutorId).catch(() => null);
          const tutorProfile = tutor
            ? await resolvePublicProfile(tutor.userId).catch(() => null)
            : null;
          return {
            id: String(g.id),
            name: g.name,
            subject: g.subject,
            level: g.level,
            quartier: g.district ?? g.city ?? '',
            description: g.description ?? '',
            tutor: {
              id: String(g.tutorId),
              name: tutorProfile?.name ?? `Répétiteur #${g.tutorId}`,
              subject: g.subject,
              rating: tutor?.rating ?? 0,
              totalSessions: 0, // ⚠️ non exposé par le backend
              diploma: '',      // ⚠️ non exposé par cet endpoint
            },
            rating: tutor?.rating ?? 0,
            reviewCount: 0, // ⚠️ non fourni par GroupResponse (voir /groups/:id/reviews sur le détail)
            currentMembers: g.currentCount ?? 0,
            maxMembers: g.maxCapacity ?? 0,
            monthlyPrice: g.monthlyPrice ?? 0,
            sessions: [], // ⚠️ "schedules" backend = texte libre, non structuré
            themes: [],   // ⚠️ non fourni par GroupResponse
            status: STATUS_MAP[g.status] ?? 'actif',
            isVerified: true,
            createdAt: g.createdAt ?? '',
          } as Group;
        })
      );
      setGroups(mapped);
    } catch (err) {
      console.error('Erreur chargement groupes:', err);
      setGroups([]);
    } finally {
      setLoading(false);
    }
  }, [filters.subject, filters.level, filters.maxPrice]);

  useEffect(() => { load(); }, [load]);

  const setFilters = (f: GroupFilters) => setFiltersState(f);

  // Le filtre "quartier" reste local (backend ne le supporte pas)
  const filteredGroups = groups.filter(g =>
    !filters.quartier || g.quartier.toLowerCase().includes(filters.quartier.toLowerCase())
  );

  return { loading, filteredGroups, filters, setFilters };
};
