import { useState, useEffect, useCallback } from 'react';
import { CourseRequestDetail, RequestFilters } from '../types/courseRequest.types';
import api from '../services/api';
import { useAuthStore } from '../store/authStore';
import { resolveMyTutorId, resolvePublicProfile } from '../services/publicProfileCache';

const STATUS_MAP: Record<string, CourseRequestDetail['status']> = {
  PENDING: 'en_attente', CONFIRMED: 'accepte', CANCELLED: 'refuse',
};

function formatDate(dateStr?: string): string {
  if (!dateStr) return '';
  try {
    const d = new Date(dateStr);
    const jours = ['Dim', 'Lun', 'Mar', 'Mer', 'Jeu', 'Ven', 'Sam'];
    const mois = ['janv', 'févr', 'mars', 'avr', 'mai', 'juin', 'juil', 'août', 'sept', 'oct', 'nov', 'déc'];
    return `${jours[d.getDay()]}. ${d.getDate()} ${mois[d.getMonth()]} ${d.getFullYear()}`;
  } catch {
    return dateStr;
  }
}

export const useCourseRequests = () => {
  const { user } = useAuthStore();
  const [requests, setRequests] = useState<CourseRequestDetail[]>([]);
  const [loading, setLoading] = useState(true);

  const [selectedRequest, setSelectedRequest] =
    useState<CourseRequestDetail | null>(null);
  const [filters, setFilters] = useState<RequestFilters>({
    search: '', status: 'TOUS',
  });

  const load = useCallback(async () => {
    if (!user?.id) return;
    setLoading(true);
    try {
      const tutorId = await resolveMyTutorId(Number(user.id));
      if (!tutorId) { setRequests([]); return; }

      const res = await api.get(`/bookings/tutor/${tutorId}`);
      const list: any[] = Array.isArray(res.data) ? res.data : [];

      const mapped: CourseRequestDetail[] = await Promise.all(
        list.map(async (b: any) => {
          const profile = b.studentId ? await resolvePublicProfile(b.studentId) : null;
          return {
            id: String(b.id),
            reference: `REQ-${b.id}`,
            student: {
              id: String(b.studentId ?? ''),
              name: profile?.name ?? 'Élève',
              email: '',
              phone: '',
              level: b.level ?? '',
              quartier: b.location ?? profile?.district ?? profile?.city ?? '',
            },
            subject: b.subject ?? '',
            requestedDate: formatDate(b.scheduledDate),
            requestedTime: b.startTime ? b.startTime.slice(0, 5) + 'h' : '',
            duration: Number(b.duration ?? 0) / 60,
            message: b.studentNote ?? '',
            status: STATUS_MAP[b.status] ?? 'en_attente',
            createdAt: (b.createdAt ?? '').toString().slice(0, 10),
            estimatedAmount: Number(b.amount ?? 0),
          };
        })
      );

      setRequests(mapped);
    } catch (err) {
      console.error('Erreur chargement demandes reçues:', err);
      setRequests([]);
    } finally {
      setLoading(false);
    }
  }, [user?.id]);

  useEffect(() => {
    load();
  }, [load]);

  const filteredRequests = requests.filter(r => {
    const matchSearch =
      r.student.name.toLowerCase().includes(filters.search.toLowerCase()) ||
      r.reference.toLowerCase().includes(filters.search.toLowerCase());
    const matchStatus =
      filters.status === 'TOUS' || r.status === filters.status;
    return matchSearch && matchStatus;
  });

  const handleAccept = async (id: string) => {
    try {
      await api.patch(`/bookings/${id}/accept`);
      setRequests(prev => prev.map(r =>
        r.id === id ? { ...r, status: 'accepte' } : r
      ));
      setSelectedRequest(null);
    } catch (err) {
      console.error('Erreur acceptation demande:', err);
    }
  };

  const handleRefuse = async (id: string) => {
    try {
      await api.patch(`/bookings/${id}/refuse`);
      setRequests(prev => prev.map(r =>
        r.id === id ? { ...r, status: 'refuse' } : r
      ));
      setSelectedRequest(null);
    } catch (err) {
      console.error('Erreur refus demande:', err);
    }
  };

  const stats = {
    enAttente: requests.filter(r => r.status === 'en_attente').length,
    acceptees: requests.filter(r => r.status === 'accepte').length,
    refusees: requests.filter(r => r.status === 'refuse').length,
    estimatedTotal: requests
      .filter(r => r.status === 'accepte')
      .reduce((sum, r) => sum + r.estimatedAmount, 0),
  };

  return {
    filteredRequests, filters, setFilters, stats, loading,
    selectedRequest, setSelectedRequest,
    handleAccept, handleRefuse,
    reload: load,
  };
};
