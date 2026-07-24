import { useNavigate } from 'react-router-dom';
import { useState, useEffect, useCallback } from 'react';
import { TutorPublicProfile } from '../types/tutorProfile.types';
import tutorProfileService from '../services/tutorProfileService';
import { resolvePublicProfile } from '../services/publicProfileCache';

const DAY_MAP: Record<string, string> = {
  LUNDI: 'LUN', MARDI: 'MAR', MERCREDI: 'MER', JEUDI: 'JEU',
  VENDREDI: 'VEN', SAMEDI: 'SAM', DIMANCHE: 'DIM',
};

export const useTutorProfile = (tutorId?: string) => {
  const navigate = useNavigate();
  const [profile, setProfile] = useState<TutorPublicProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [selectedSlot, setSelectedSlot] =
    useState<{ day: string; startTime: string; endTime: string } | null>(null);

  const load = useCallback(async () => {
    if (!tutorId) return;
    setLoading(true);
    try {
      const [t, rawReviews, rawAvailability] = await Promise.all([
        tutorProfileService.getTutorById(tutorId),
        tutorProfileService.getTutorReviews(tutorId).catch(() => []),
        tutorProfileService.getTutorAvailability(tutorId).catch(() => []),
      ]);

      const userProfile = await resolvePublicProfile(t.userId);
      const subjectsList = (t.subjects ?? '').split(',').map((s: string) => s.trim()).filter(Boolean);
      const levelsList = (t.levels ?? '').split(',').map((s: string) => s.trim()).filter(Boolean);

      const reviews = await Promise.all(
        rawReviews.map(async (r: any) => {
          const reviewerProfile = r.studentId ? await resolvePublicProfile(r.studentId) : null;
          return {
            id: String(r.id),
            author: reviewerProfile?.name ?? 'Élève',
            authorRole: 'eleve' as const,
            rating: r.rating,
            comment: r.comment ?? '',
            date: (r.createdAt ?? '').toString().slice(0, 10),
          };
        })
      );

      const availability = (rawAvailability ?? [])
        .filter((a: any) => a.isAvailable)
        .map((a: any) => ({
          day: DAY_MAP[a.dayOfWeek] ?? a.dayOfWeek,
          startTime: (a.startTime ?? '').toString().slice(0, 5) + 'h',
          endTime: (a.endTime ?? '').toString().slice(0, 5) + 'h',
          available: true,
        }));

      setProfile({
        id: String(t.id),
        userId: String(t.userId), // ⚠️ AJOUT — nécessaire pour la messagerie
        name: userProfile.name,
        subject: subjectsList[0] ?? '',
        level: levelsList[0] ?? '',
        quartier: t.districts || t.city || '',
        rating: t.rating ?? 0,
        reviewCount: t.totalReviews ?? 0,
        diploma: '',
        totalSessions: 0,
        hourlyPrice: t.hourlyRate ?? 0,
        isVerified: t.isVerified ?? false,
        bio: t.bio ?? '',
        subjectsTaught: subjectsList.map((s: string) => ({ label: s })),
        verifications: [
          { type: 'identite', label: 'Identité (CNI)', verified: t.isVerified ?? false },
          { type: 'diplome', label: 'Diplôme', verified: t.isVerified ?? false },
        ],
        availability,
        reviews,
      });
    } catch (err) {
      console.error('Erreur chargement profil tuteur:', err);
      setProfile(null);
    } finally {
      setLoading(false);
    }
  }, [tutorId]);

  useEffect(() => { load(); }, [load]);

  const handleSelectSlot = (slot: { day: string; startTime: string; endTime: string }) => {
    setSelectedSlot(slot);
  };

  const handleBookCourse = () => {
    if (profile) navigate(`/reserver/${profile.id}`);
  };

  // Va vers la messagerie avec ce répétiteur pré-sélectionné
  const handleContact = () => {
    if (!profile) return;
    navigate(
      `/messagerie?contact=${profile.userId}` +
      `&name=${encodeURIComponent(profile.name)}` +
      `&role=${encodeURIComponent(profile.subject)}`
    );
  };

  return {
    loading, profile, selectedSlot,
    handleSelectSlot, handleBookCourse, handleContact,
  };
};
