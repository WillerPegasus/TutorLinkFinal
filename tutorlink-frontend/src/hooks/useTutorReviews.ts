import { useState, useEffect, useCallback } from 'react';
import {
  TutorReview, ReviewStats, ReviewFilters
} from '../types/review.types';
import tutorReviewService from '../services/tutorReviewService';
import { resolvePublicProfile } from '../services/publicProfileCache';

function formatRelativeDate(iso?: string): string {
  if (!iso) return '';
  const d = new Date(iso);
  const now = new Date();
  const diffDays = Math.floor((now.getTime() - d.getTime()) / 86400000);
  if (diffDays <= 0) return "aujourd'hui";
  if (diffDays === 1) return 'il y a 1 jour';
  if (diffDays < 7) return `il y a ${diffDays} jours`;
  if (diffDays < 30) return `il y a ${Math.floor(diffDays / 7)} semaine(s)`;
  return `il y a ${Math.floor(diffDays / 30)} mois`;
}

export const useTutorReviews = () => {
  const [reviews, setReviews] = useState<TutorReview[]>([]);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState<ReviewStats>({
    averageRating: 0, totalReviews: 0,
    distribution: [5, 4, 3, 2, 1].map(stars => ({ stars, count: 0, pct: 0 })),
  });

  const [filters, setFilters] = useState<ReviewFilters>({
    rating: null, subject: '',
  });
  const [replyingTo, setReplyingTo] = useState<string | null>(null);
  const [replyText, setReplyText] = useState('');

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const [rawReviews, rawStats] = await Promise.all([
        tutorReviewService.getMyReviews(),
        tutorReviewService.getMyReviewStats().catch(() => null),
      ]);

      const mapped: TutorReview[] = await Promise.all(
        rawReviews.map(async (r: any) => {
          const profile = r.studentId ? await resolvePublicProfile(r.studentId) : null;
          return {
            id: String(r.id),
            author: profile?.name ?? 'Élève',
            authorRole: 'eleve' as const,
            rating: r.rating,
            comment: r.comment ?? '',
            subject: '', // ⚠️ non exposé par le backend (Review n'a pas de champ subject)
            date: formatRelativeDate(r.createdAt),
            isNew: false,
            reply: r.reply ?? undefined,
          };
        })
      );
      setReviews(mapped);

      if (rawStats) {
        const dist = rawStats.distribution ?? {};
        setStats({
          averageRating: rawStats.average ?? 0,
          totalReviews: rawStats.total ?? mapped.length,
          distribution: [5, 4, 3, 2, 1].map(stars => ({
            stars,
            count: dist[stars] ?? 0,
            pct: rawStats.total ? Math.round(((dist[stars] ?? 0) / rawStats.total) * 100) : 0,
          })),
        });
      }
    } catch (err) {
      console.error('Erreur chargement avis:', err);
      setReviews([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { load(); }, [load]);

  const filteredReviews = reviews.filter(r => {
    const matchRating = filters.rating === null || r.rating === filters.rating;
    const matchSubject = !filters.subject ||
      r.subject.toLowerCase().includes(filters.subject.toLowerCase());
    return matchRating && matchSubject;
  });

  const handleSubmitReply = async (reviewId: string) => {
    if (!replyText.trim()) return;
    try {
      await tutorReviewService.replyToReview(Number(reviewId), replyText.trim());
      setReviews(prev => prev.map(r =>
        r.id === reviewId ? { ...r, reply: replyText.trim() } : r
      ));
      setReplyingTo(null);
      setReplyText('');
    } catch (err) {
      console.error('Erreur envoi réponse avis:', err);
    }
  };

  return {
    loading, filteredReviews, filters, setFilters, stats,
    replyingTo, setReplyingTo,
    replyText, setReplyText,
    handleSubmitReply,
  };
};
