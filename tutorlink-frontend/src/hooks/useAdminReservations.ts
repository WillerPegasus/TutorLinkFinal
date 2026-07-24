import { useState, useEffect, useCallback } from 'react';
import { AdminReservation, ReservationFilters, CourseStatus } from '../types/adminReservation.types';
import adminReservationService from '../services/adminReservationService';
import adminLookupService from '../services/adminLookupService';

// Le backend (BookingStatus) n'a que PENDING/CONFIRMED/CANCELLED/COMPLETED —
// pas de "en_cours" séparé.
const STATUS_MAP: Record<string, CourseStatus> = {
  PENDING: 'confirmee',
  CONFIRMED: 'confirmee',
  COMPLETED: 'terminee',
  CANCELLED: 'annulee',
};

const formatTimeSlot = (startTime: string, durationMin: number) => {
  if (!startTime) return '';
  const [h, m] = startTime.split(':').map(Number);
  const startMinutes = h * 60 + (m || 0);
  const endMinutes = startMinutes + (durationMin || 0);
  const fmt = (mins: number) => {
    const hh = String(Math.floor(mins / 60) % 24).padStart(2, '0');
    const mm = String(mins % 60).padStart(2, '0');
    return `${hh}h${mm}`;
  };
  return `${fmt(startMinutes)} - ${fmt(endMinutes)}`;
};

export const useAdminReservations = () => {
  const [reservations, setReservations] = useState<AdminReservation[]>([]);
  const [loading, setLoading] = useState(true);

  const [filters, setFilters] = useState<ReservationFilters>({
    search: '', courseStatus: 'TOUS',
    dateFrom: '', dateTo: '',
  });

  const [selectedReservation, setSelectedReservation] =
    useState<AdminReservation | null>(null);

  const loadReservations = useCallback(async () => {
    setLoading(true);
    try {
      const data = await adminReservationService.getReservations({ page: 0, size: 200 });
      const bookings: any[] = data?.content ?? data ?? [];

      const mapped: AdminReservation[] = await Promise.all(
        bookings.map(async (b: any) => {
          const [eleve, repetiteur] = await Promise.all([
            adminLookupService.resolveUserInfo(b.studentId),
            adminLookupService.resolveTutorInfo(b.tutorId),
          ]);
          return {
            id: String(b.id),
            reference: `RES-${b.id}`,
            eleve: { name: eleve.name, email: eleve.email, phone: eleve.phone },
            repetiteur: {
              name: repetiteur.name,
              email: repetiteur.email,
              subject: b.subject ?? repetiteur.subject,
              phone: repetiteur.phone,
            },
            date: b.scheduledDate ?? '',
            timeSlot: formatTimeSlot(b.startTime, b.duration),
            duration: b.duration ? Math.round((b.duration / 60) * 10) / 10 : 0,
            courseStatus: STATUS_MAP[b.status] ?? 'confirmee',
            quartier: b.location ?? '',
            createdAt: b.createdAt ?? '',
            estimatedAmount: b.amount ?? 0,
          } as AdminReservation;
        })
      );
      setReservations(mapped);
    } catch (err) {
      console.error('Erreur chargement réservations:', err);
      setReservations([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { loadReservations(); }, [loadReservations]);

  const filtered = reservations.filter(r => {
    const matchSearch =
      r.eleve.name.toLowerCase().includes(filters.search.toLowerCase()) ||
      r.repetiteur.name.toLowerCase().includes(filters.search.toLowerCase()) ||
      r.reference.toLowerCase().includes(filters.search.toLowerCase());
    const matchCourse =
      filters.courseStatus === 'TOUS' || r.courseStatus === filters.courseStatus;
    const matchDateFrom = !filters.dateFrom || r.date >= filters.dateFrom;
    const matchDateTo = !filters.dateTo || r.date <= filters.dateTo;
    return matchSearch && matchCourse && matchDateFrom && matchDateTo;
  });

  const handleCancel = async (id: string) => {
    try {
      await adminReservationService.cancelReservation(id);
      setReservations(prev => prev.map(r =>
        r.id === id ? { ...r, courseStatus: 'annulee' } : r
      ));
      setSelectedReservation(null);
    } catch (err) {
      console.error('Erreur annulation réservation:', err);
    }
  };

  const stats = {
    total: reservations.length,
    confirmees: reservations.filter(r => r.courseStatus === 'confirmee').length,
    terminees: reservations.filter(r => r.courseStatus === 'terminee').length,
    annulees: reservations.filter(r => r.courseStatus === 'annulee').length,
  };

  return {
    loading, filtered, filters, setFilters, stats,
    selectedReservation, setSelectedReservation,
    handleCancel,
  };
};
