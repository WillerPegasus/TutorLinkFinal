import { useState, useEffect, useCallback } from 'react';
import { Group, GroupReview, GroupStatus } from '../types/group.types';
import groupeService from '../services/groupeService';
import bookingService from '../services/bookingService';
import { resolvePublicProfile } from '../services/publicProfileCache';
import { useAuthStore } from '../store/authStore';

const STATUS_MAP: Record<string, GroupStatus> = {
  ACTIVE: 'actif', FULL: 'complet', SUSPENDED: 'suspendu', CLOSED: 'suspendu',
};

export const useGroupDetail = (groupId: string) => {
  const [group, setGroup] = useState<Group | null>(null);
  const [reviews, setReviews] = useState<GroupReview[]>([]);
  const [loading, setLoading] = useState(true);
  const [actionError, setActionError] = useState<string | null>(null);

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const [g, groupReviews] = await Promise.all([
        groupeService.getGroupById(groupId),
        groupeService.getGroupReviews(groupId).catch(() => []),
      ]);
      const tutor = await bookingService.getTutorById(g.tutorId).catch(() => null);
      const tutorProfile = tutor
        ? await resolvePublicProfile(tutor.userId).catch(() => null)
        : null;

      setGroup({
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
          totalSessions: 0,
          diploma: '',
        },
        rating: tutor?.rating ?? 0,
        reviewCount: (groupReviews ?? []).length,
        currentMembers: g.currentCount ?? 0,
        maxMembers: g.maxCapacity ?? 0,
        monthlyPrice: g.monthlyPrice ?? 0,
        sessions: [],
        themes: [],
        status: STATUS_MAP[g.status] ?? 'actif',
        isVerified: true,
        createdAt: g.createdAt ?? '',
      });

      setReviews((groupReviews ?? []).map((r: any) => ({
        id: String(r.id),
        author: r.studentName ?? 'Élève',
        role: 'eleve',
        rating: r.rating ?? 0,
        comment: r.comment ?? '',
        date: r.createdAt ?? '',
      })));
    } catch (err) {
      console.error('Erreur chargement détail groupe:', err);
      setGroup(null);
    } finally {
      setLoading(false);
    }
  }, [groupId]);

  useEffect(() => { load(); }, [load]);

  // Coût individuel équivalent, pour la comparaison tarifaire affichée
  const individualCost = 2000 * 16; // 2000 FCFA/h * 16h/mois (référence marché)
  const savings = group ? individualCost - group.monthlyPrice : 0;

  // Rejoindre un groupe — simple inscription, aucun paiement géré ici
  const handleJoin = async () => {
    setActionError(null);
    const studentId = useAuthStore.getState().user?.id;
    if (!studentId) {
      setActionError('Vous devez être connecté pour rejoindre un groupe.');
      return;
    }
    try {
      await groupeService.joinGroup(groupId, studentId);
      await load();
    } catch (err: any) {
      console.error('Erreur inscription groupe:', err);
      setActionError(
        err?.response?.data?.message ?? 'Impossible de rejoindre ce groupe pour le moment.'
      );
    }
  };

  const handleWaitlist = async () => {
    setActionError(null);
    try {
      await groupeService.joinWaitlist(groupId);
      await load();
    } catch (err: any) {
      console.error("Erreur liste d'attente:", err);
      setActionError(
        err?.response?.data?.message ?? "Impossible de vous inscrire en liste d'attente."
      );
    }
  };

  return {
    loading, group, reviews,
    individualCost, savings,
    actionError,
    handleJoin, handleWaitlist,
  };
};
