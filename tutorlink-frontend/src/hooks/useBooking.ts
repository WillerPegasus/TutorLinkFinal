import { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { BookingTutor, TimeSlot, BookingFormData } from '../types/booking.types';
import bookingService from '../services/bookingService';
import { resolvePublicProfile } from '../services/publicProfileCache';
import { useAuthStore } from '../store/authStore';

const DAY_MAP: Record<string, { code: string; index: number }> = {
  LUNDI:    { code: 'LUN', index: 1 },
  MARDI:    { code: 'MAR', index: 2 },
  MERCREDI: { code: 'MER', index: 3 },
  JEUDI:    { code: 'JEU', index: 4 },
  VENDREDI: { code: 'VEN', index: 5 },
  SAMEDI:   { code: 'SAM', index: 6 },
  DIMANCHE: { code: 'DIM', index: 0 },
};

// Prochaine date (yyyy-MM-dd) correspondant à un jour de semaine donné.
const nextDateForDay = (dayIndex: number): string => {
  const today = new Date();
  const diff = (dayIndex - today.getDay() + 7) % 7;
  const target = new Date(today);
  target.setDate(today.getDate() + diff);
  return target.toISOString().slice(0, 10);
};

export const useBooking = (tutorId?: string) => {
  const navigate = useNavigate();
  const user = useAuthStore(s => s.user);

  const [tutor, setTutor] = useState<BookingTutor | null>(null);
  const [slots, setSlots] = useState<TimeSlot[]>([]);
  const [pageLoading, setPageLoading] = useState(true);

  const [formData, setFormData] = useState<BookingFormData>({
    selectedSlot: null,
    subject: '',
    duration: 2,
    studentName: '',
    message: '',
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const load = useCallback(async () => {
    if (!tutorId) return;
    setPageLoading(true);
    try {
      const [t, rawAvailability] = await Promise.all([
        bookingService.getTutorById(tutorId),
        bookingService.getTutorAvailability(tutorId).catch(() => []),
      ]);
      const userProfile = await resolvePublicProfile(t.userId);
      const subjectsList = (t.subjects ?? '').split(',').map((s: string) => s.trim()).filter(Boolean);
      const levelsList = (t.levels ?? '').split(',').map((s: string) => s.trim()).filter(Boolean);

      setTutor({
        id: String(t.id),
        name: userProfile.name,
        subject: subjectsList[0] ?? '',
        level: levelsList[0] ?? '',
        quartier: t.districts || t.city || '',
        rating: t.rating ?? 0,
        reviewCount: t.totalReviews ?? 0,
        hourlyPrice: t.hourlyRate ?? 0,
      });

      setFormData(prev => ({ ...prev, subject: subjectsList[0] ?? '' }));

      const mappedSlots: TimeSlot[] = (rawAvailability ?? [])
        .filter((a: any) => a.isAvailable)
        .map((a: any) => {
          const dayInfo = DAY_MAP[a.dayOfWeek] ?? { code: a.dayOfWeek, index: 0 };
          const rawStart = (a.startTime ?? '00:00:00').toString().slice(0, 8);
          const rawEnd = (a.endTime ?? '').toString().slice(0, 5);
          return {
            id: String(a.id),
            day: dayInfo.code,
            dayIndex: dayInfo.index,
            startTime: rawStart.slice(0, 5) + 'h',
            endTime: rawEnd + 'h',
            rawStartTime: rawStart,
            available: true,
          };
        });
      setSlots(mappedSlots);
    } catch (err) {
      console.error('Erreur chargement page réservation:', err);
      setTutor(null);
    } finally {
      setPageLoading(false);
    }
  }, [tutorId]);

  useEffect(() => { load(); }, [load]);

  const handleSelectSlot = (slot: TimeSlot) => {
    if (!slot.available) return;
    setFormData(prev => ({ ...prev, selectedSlot: slot }));
    setError('');
  };

  const estimatedAmount = (tutor?.hourlyPrice ?? 0) * formData.duration;

  const handleSubmit = async () => {
    if (!formData.selectedSlot) {
      setError('Sélectionnez un créneau avant de confirmer.');
      return;
    }
    if (!user) {
      setError('Vous devez être connecté pour réserver un cours.');
      return;
    }
    if (!tutor) return;

    try {
      setLoading(true);
      await bookingService.createReservation({
        studentId: Number(user.id),
        tutorId: Number(tutor.id),
        subject: formData.subject,
        level: tutor.level,
        scheduledDate: nextDateForDay(formData.selectedSlot.dayIndex),
        startTime: formData.selectedSlot.rawStartTime,
        duration: Math.round(formData.duration * 60),
        location: tutor.quartier,
        studentNote: formData.message || undefined,
        paymentMethod: 'MTN_MOMO',
      });
      setSubmitted(true);
      setTimeout(() => navigate('/mes-reservations'), 1500);
    } catch (err) {
      console.error('Erreur création réservation:', err);
      setError('Une erreur est survenue. Réessayez.');
    } finally {
      setLoading(false);
    }
  };

  return {
    pageLoading, tutor, slots, formData, setFormData,
    error, loading, submitted, estimatedAmount,
    handleSelectSlot, handleSubmit,
  };
};
