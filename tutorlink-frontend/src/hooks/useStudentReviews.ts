import { useState, useEffect, useCallback } from 'react';
import {
  StudentReview, PendingReview, StudentReviewStats
} from '../types/studentReview.types';
import studentReviewService from '../services/studentREviewService';
import { resolveTutor } from '../services/publicProfileCache';
import { useAuthStore } from '../store/authStore';

export const useStudentReviews = () => {
  const { user } = useAuthStore();
  const myId = user ? Number(user.id) : null;

  const [reviews, setReviews] = useState<StudentReview[]>([]);
  const [pendingReviews, setPendingReviews] = useState<PendingReview[]>([]);
  const [loading, setLoading] = useState(true);

  const [editingReviewId, setEditingReviewId] = useState<string | null>(null);
  const [ratingPendingId, setRatingPendingId] = useState<string | null>(null);
  const [form, setForm] = useState({ rating: 5, comment: '' });

  const load = useCallback(async () => {
    if (!myId) return;
    setLoading(true);
    try {
      const [rawReviews, rawPending] = await Promise.all([
        studentReviewService.getMyReviews().catch(() => []),
        studentReviewService.getPendingReviews().catch(() => []),
      ]);

      const reviewsList: any[] = Array.isArray(rawReviews) ? rawReviews : [];
      const mappedReviews: StudentReview[] = await Promise.all(
        reviewsList.map(async (r: any) => {
          const tutor = r.tutorId ? await resolveTutor(r.tutorId) : null;
          return {
            id: String(r.id),
            tutorId: String(r.tutorId ?? ''),
            tutorName: tutor?.name ?? 'Tuteur',
            tutorSubject: tutor?.subject ?? '',
            // ⚠️ Le backend ne renvoie pas la date du cours associé à l'avis
            // (seulement bookingId, sans endpoint pour le résoudre) —
            // on affiche donc la date de publication de l'avis à la place.
            courseDate: (r.createdAt ?? '').toString().slice(0, 10),
            rating: Number(r.rating ?? 0),
            comment: r.comment ?? '',
            status: 'publie',
            createdAt: (r.createdAt ?? '').toString().slice(0, 10),
            // ⚠️ Le DTO backend (ReviewResponse) ne renvoie pas encore la
            // réponse du tuteur, même si l'endpoint pour répondre existe.
            tutorReply: undefined,
          };
        })
      );
      setReviews(mappedReviews);

      const pendingList: any[] = Array.isArray(rawPending) ? rawPending : [];
      const mappedPending: PendingReview[] = await Promise.all(
        pendingList.map(async (b: any) => {
          const tutor = b.tutorId ? await resolveTutor(b.tutorId) : null;
          return {
            id: String(b.id),
            tutorId: String(b.tutorId ?? ''),
            tutorName: tutor?.name ?? 'Tuteur',
            tutorSubject: b.subject ?? tutor?.subject ?? '',
            courseDate: b.scheduledDate ?? '',
            courseTime: b.startTime ? b.startTime.slice(0, 5) : '',
          };
        })
      );
      setPendingReviews(mappedPending);
    } catch (err) {
      console.error('Erreur chargement avis élève:', err);
      setReviews([]);
      setPendingReviews([]);
    } finally {
      setLoading(false);
    }
  }, [myId]);

  useEffect(() => { load(); }, [load]);

  const handleSubmitReview = async (pendingId: string) => {
    if (!form.comment.trim() || !myId) return;
    const pending = pendingReviews.find(p => p.id === pendingId);
    if (!pending) return;

    try {
      const created = await studentReviewService.submitReview({
        tutorId: pending.tutorId,
        studentId: String(myId),
        bookingId: pendingId,
        rating: form.rating,
        comment: form.comment,
      });

      const newReview: StudentReview = {
        id: String(created.id ?? Date.now()),
        tutorId: pending.tutorId,
        tutorName: pending.tutorName,
        tutorSubject: pending.tutorSubject,
        courseDate: pending.courseDate,
        rating: form.rating,
        comment: form.comment,
        status: 'publie',
        createdAt: new Date().toISOString().slice(0, 10),
      };

      setReviews(prev => [newReview, ...prev]);
      setPendingReviews(prev => prev.filter(p => p.id !== pendingId));
      setRatingPendingId(null);
      setForm({ rating: 5, comment: '' });
    } catch (err) {
      console.error('Erreur publication avis:', err);
    }
  };

  const handleUpdateReview = async (reviewId: string) => {
    if (!form.comment.trim()) return;
    try {
      await studentReviewService.updateReview(reviewId, {
        rating: form.rating,
        comment: form.comment,
      });
      setReviews(prev => prev.map(r =>
        r.id === reviewId
          ? { ...r, rating: form.rating, comment: form.comment }
          : r
      ));
      setEditingReviewId(null);
      setForm({ rating: 5, comment: '' });
    } catch (err) {
      console.error('Erreur modification avis:', err);
    }
  };

  const handleDeleteReview = async (reviewId: string) => {
    try {
      await studentReviewService.deleteReview(reviewId);
      setReviews(prev => prev.filter(r => r.id !== reviewId));
    } catch (err) {
      console.error('Erreur suppression avis:', err);
    }
  };

  const handleStartEdit = (review: StudentReview) => {
    setEditingReviewId(review.id);
    setForm({ rating: review.rating, comment: review.comment });
  };

  const stats: StudentReviewStats = {
    totalReviews: reviews.length,
    averageGiven: reviews.length > 0
      ? Math.round(
          reviews.reduce((sum, r) => sum + r.rating, 0)
          / reviews.length * 10
        ) / 10
      : 0,
    pendingCount: pendingReviews.length,
  };

  return {
    loading, reviews, pendingReviews, stats,
    editingReviewId, setEditingReviewId,
    ratingPendingId, setRatingPendingId,
    form, setForm,
    handleSubmitReview, handleUpdateReview,
    handleDeleteReview, handleStartEdit,
    reload: load,
  };
};
