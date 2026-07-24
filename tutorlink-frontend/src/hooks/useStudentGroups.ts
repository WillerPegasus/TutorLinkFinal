import { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  StudentGroupItem, SuggestedGroup
} from '../types/studentGroup.types';
import studentGroupService from '../services/studentGroupService';
import bookingService from '../services/bookingService';
import { resolvePublicProfile } from '../services/publicProfileCache';
import { useAuthStore } from '../store/authStore';

const MEMBER_STATUS_MAP: Record<string, StudentGroupItem['memberStatus']> = {
  ACTIVE: 'actif',
  WAITING: 'en_attente',
  CANCELLED: 'suspendu',
};

export const useStudentGroups = () => {
  const navigate = useNavigate();
  const user = useAuthStore(s => s.user);

  const [myGroups, setMyGroups] = useState<StudentGroupItem[]>([]);
  const [suggestedGroups, setSuggestedGroups] = useState<SuggestedGroup[]>([]);
  const [loading, setLoading] = useState(true);

  const load = useCallback(async () => {
    if (!user) return;
    setLoading(true);
    try {
      const [memberships, suggested] = await Promise.all([
        studentGroupService.getMyMemberships(Number(user.id)),
        studentGroupService.getSuggestedGroups().catch(() => []),
      ]);

      const mappedGroups: StudentGroupItem[] = await Promise.all(
        (memberships ?? [])
          .filter((m: any) => m.status !== 'CANCELLED')
          .map(async (m: any) => {
            const group = await studentGroupService.getGroupById(m.groupId);
            const tutor = await bookingService.getTutorById(group.tutorId).catch(() => null);
            const tutorProfile = tutor ? await resolvePublicProfile(tutor.userId).catch(() => null) : null;
            return {
              id: String(group.id),
              name: group.name,
              subject: group.subject,
              level: group.level,
              quartier: group.district || group.city || '',
              tutorName: tutorProfile?.name ?? `Répétiteur #${group.tutorId}`,
              tutorId: String(group.tutorId),
              currentMembers: group.currentCount ?? 0,
              maxMembers: group.maxCapacity ?? 0,
              monthlyPrice: group.monthlyPrice ?? 0,
              schedules: group.schedules ?? '',
              description: group.description ?? '',
              memberStatus: MEMBER_STATUS_MAP[m.status] ?? 'actif',
              joinedAt: (m.joinedAt ?? '').toString().slice(0, 10),
              rating: tutor?.rating ?? 0,
            };
          })
      );
      setMyGroups(mappedGroups);

      const myGroupIds = new Set(mappedGroups.map(g => g.id));
      const mappedSuggested: SuggestedGroup[] = (suggested ?? [])
        .filter((g: any) => !myGroupIds.has(String(g.id)))
        .map((g: any) => ({
          id: String(g.id),
          name: g.name,
          subject: g.subject,
          tutorName: g.tutorName ?? '',
          monthlyPrice: g.monthlyPrice ?? 0,
          currentMembers: g.currentCount ?? 0,
          maxMembers: g.maxCapacity ?? 0,
          rating: g.rating ?? 0,
        }));
      setSuggestedGroups(mappedSuggested);
    } catch (err) {
      console.error('Erreur chargement groupes élève:', err);
      setMyGroups([]);
      setSuggestedGroups([]);
    } finally {
      setLoading(false);
    }
  }, [user]);

  useEffect(() => { load(); }, [load]);

  const handleLeave = async (groupId: string) => {
    try {
      await studentGroupService.leaveGroup(groupId);
      setMyGroups(prev => prev.filter(g => g.id !== groupId));
    } catch (err) {
      console.error('Erreur pour quitter le groupe:', err);
    }
  };

  const handleViewGroup = (groupId: string) => {
    navigate(`/groupes/${groupId}`);
  };

  const stats = {
    totalGroups: myGroups.length,
    monthlyTotal: myGroups.reduce((sum, g) => sum + g.monthlyPrice, 0),
    totalSessions: myGroups.length,
  };

  return {
    loading, myGroups, suggestedGroups, stats,
    handleLeave, handleViewGroup,
  };
};
