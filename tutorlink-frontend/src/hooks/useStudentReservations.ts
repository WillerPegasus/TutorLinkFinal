import { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  StudentReservation,
  StudentReservationFilters
} from '../types/studentReservation.types';
import studentReservationService from '../services/studentReservationService';
import { resolvePublicProfile, resolveMyTutorId } from '../services/publicProfileCache';
import { useAuthStore } from '../store/authStore';

const STATUS_MAP: Record<string, StudentReservation['status']> = {
  PENDING: 'en_attente',
  CONFIRMED: 'confirme',
  COMPLETED: 'termine',
  CANCELLED: 'annule',
};

const formatDate = (dateStr: string) => {
  if (!dateStr) return '';
  return new Date(dateStr).toLocaleDateString('fr-FR', {
    weekday: 'short', day: 'numeric', month: 'long', year: 'numeric',
  });
};

const formatTime = (startTime: string, durationMin: number) => {
  if (!startTime) return '';
  const [h, m] = startTime.split(':').map(Number);
  const startMinutes = h * 60 + (m || 0);
  const endMinutes = startMinutes + (durationMin || 0);
  const fmt = (mins: number) => {
    const hh = String(Math.floor(mins / 60) % 24).padStart(2, '0');
    return `${hh}h`;
  };
  return `${fmt(startMinutes)} – ${fmt(endMinutes)}`;
};

export const useStudentReservations = () => {
  const navigate = useNavigate();
  const user = useAuthStore(s => s.user);

  const [reservations, setReservations] = useState<StudentReservation[]>([]);
  const [loading, setLoading] = useState(true);

  const [filters, setFilters] = useState<StudentReservationFilters>({
    search: '', status: 'TOUS',
  });

  const [selectedReservation, setSelectedReservation] =
    useState<StudentReservation | null>(null);

  const load = useCallback(async () => {
    if (!user) return;
    setLoading(true);
    try {
      const raw = await studentReservationService.getMyReservations(Number(user.id));
      const mapped: StudentReservation[] = await Promise.all(
        raw.map(async (b: any) => {
          const tutorProfile = await resolvePublicProfile(b.tutorId).catch(() => null);
          return {
            id: String(b.id),
            reference: `REQ-${b.id}`,
            tutorId: String(b.tutorId),
            tutorName: tutorProfile?.name ?? `Répétiteur #${b.tutorId}`,
            tutorSubject: b.subject ?? '',
            date: formatDate(b.scheduledDate),
            time: formatTime(b.startTime, b.duration),
            duration: b.duration ? Math.round((b.duration / 60) * 10) / 10 : 0,
            status: STATUS_MAP[b.status] ?? 'en_attente',
            estimatedAmount: b.amount ?? 0,
            message: b.studentNote ?? '',
            quartier: b.location ?? '',
          };
        })
      );
      setReservations(mapped);
    } catch (err) {
      console.error('Erreur chargement réservations élève:', err);
      setReservations([]);
    } finally {
      setLoading(false);
    }
  }, [user]);

  useEffect(() => { load(); }, [load]);

  const filteredReservations = reservations.filter(r => {
    const matchSearch =
      !filters.search ||
      r.tutorName.toLowerCase().includes(filters.search.toLowerCase()) ||
      r.reference.toLowerCase().includes(filters.search.toLowerCase()) ||
      r.tutorSubject.toLowerCase().includes(filters.search.toLowerCase());
    const matchStatus =
      filters.status === 'TOUS' || r.status === filters.status;
    return matchSearch && matchStatus;
  });

  const handleCancel = async (id: string) => {
    try {
      await studentReservationService.cancelReservation(id);
      setReservations(prev => prev.map(r =>
        r.id === id ? { ...r, status: 'annule' } : r
      ));
      setSelectedReservation(null);
    } catch (err) {
      console.error('Erreur annulation réservation:', err);
    }
  };

  const handleContact = () => {
    navigate('/messagerie');
  };

  const stats = {
    total: reservations.length,
    confirmees: reservations.filter(r => r.status === 'confirme').length,
    enAttente: reservations.filter(r => r.status === 'en_attente').length,
    terminees: reservations.filter(r => r.status === 'termine').length,
  };

  return {
    loading, filteredReservations, filters, setFilters, stats,
    selectedReservation, setSelectedReservation,
    handleCancel, handleContact,
  };
};
