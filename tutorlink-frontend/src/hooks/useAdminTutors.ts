import { useState, useEffect, useCallback } from 'react';
import { TutorValidationItem, TopRatedTutor } from '../types/tutorValidation.types';
import adminTutorService from '../services/adminTutorService';

export const useAdminTutors = () => {
  const [pendingTutors, setPendingTutors] = useState<TutorValidationItem[]>([]);
  const [topTutors, setTopTutors] = useState<TopRatedTutor[]>([]);
  const [loading, setLoading] = useState(true);
  const [viewedDoc, setViewedDoc] = useState<string | null>(null);

  const loadPending = useCallback(async () => {
    setLoading(true);
    try {
      const profiles = await adminTutorService.getPendingTutors();

      // Pour chaque profil pédagogique, récupérer le nom/email/tel réels
      // depuis user-service (TutorProfile ne stocke que userId).
      const enriched = await Promise.all(
        profiles.map(async (p: any) => {
          let name = `Utilisateur #${p.userId}`;
          let email = '';
          let phone = '';
          try {
            const user = await adminTutorService.getUserProfile(p.userId);
            name = `${user.firstName ?? ''} ${user.lastName ?? ''}`.trim();
            email = user.email ?? '';
            phone = user.phone ?? '';
          } catch {
            // profil utilisateur introuvable — on garde les valeurs par défaut
          }
          return {
            id: String(p.id),
            name,
            email,
            phone,
            subject: p.subjects,
            level: p.levels,
            quartier: p.districts,
            rating: p.rating ?? 0,
            totalSessions: p.totalReviews ?? 0,
            status: 'en_attente' as const,
            submittedAt: '',
            // ⚠️ Pas encore de endpoint backend pour lister les documents
            // soumis par tutorId — section vide en attendant.
            documents: [],
          };
        })
      );

      setPendingTutors(enriched);
    } catch (err) {
      console.error('Erreur chargement répétiteurs en attente:', err);
      setPendingTutors([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadPending();
  }, [loadPending]);

  const handleApprove = async (tutorId: string) => {
    try {
      await adminTutorService.approveTutor(Number(tutorId));
      setPendingTutors(prev => prev.filter(t => t.id !== tutorId));
    } catch (err) {
      console.error('Erreur approbation:', err);
    }
  };

  const handleReject = async (tutorId: string, reason: string) => {
    try {
      await adminTutorService.rejectTutor(Number(tutorId), reason);
      setPendingTutors(prev => prev.filter(t => t.id !== tutorId));
    } catch (err) {
      console.error('Erreur rejet:', err);
    }
  };

  const pendingOnly = pendingTutors.filter(t => t.status === 'en_attente');

  return {
    loading, pendingOnly, topTutors,
    viewedDoc, setViewedDoc,
    handleApprove, handleReject,
  };
};
