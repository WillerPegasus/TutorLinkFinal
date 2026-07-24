import { useState, useEffect, useCallback } from 'react';
import {
  TutorStats, CourseRequest, AvailabilitySlot,
  ConfirmedCourse, TutorGroup, RevenueDataPoint, TutorActivity
} from '../types/tutor.types';
import tutorDashboardService from '../services/tutorDashboardService';
import { resolvePublicName } from '../services/publicProfileCache';

const DAY_MAP: Record<string, string> = {
  MONDAY: 'LUN', TUESDAY: 'MAR', WEDNESDAY: 'MER', THURSDAY: 'JEU',
  FRIDAY: 'VEN', SATURDAY: 'SAM', SUNDAY: 'DIM',
};

const REQUEST_STATUS_MAP: Record<string, CourseRequest['status']> = {
  PENDING: 'en_attente', CONFIRMED: 'accepte', CANCELLED: 'refuse',
};

type ConfirmedCourseStatus = 'confirme' | 'en_attente' | 'termine';
const COURSE_STATUS_MAP: Record<string, ConfirmedCourseStatus> = {
  CONFIRMED: 'confirme', PENDING: 'en_attente', COMPLETED: 'termine',
};

function formatDate(dateStr?: string, timeStr?: string): string {
  if (!dateStr) return '';
  try {
    const d = new Date(dateStr);
    const jours = ['Dim', 'Lun', 'Mar', 'Mer', 'Jeu', 'Ven', 'Sam'];
    const mois = ['janv', 'févr', 'mars', 'avr', 'mai', 'juin', 'juil', 'août', 'sept', 'oct', 'nov', 'déc'];
    const label = `${jours[d.getDay()]}. ${d.getDate()} ${mois[d.getMonth()]}.`;
    return timeStr ? `${label} · ${timeStr.slice(0, 5).replace(':', 'h')}` : label;
  } catch {
    return dateStr;
  }
}

export const useTutorDashboard = () => {
  const [loading, setLoading] = useState(true);

  const [stats, setStats] = useState<TutorStats>({
    coursesThisMonth: 0, activeStudents: 0, monthlyRevenue: 0, pendingRequests: 0,
  });
  const [requests, setRequests] = useState<CourseRequest[]>([]);
  const [availability, setAvailability] = useState<AvailabilitySlot[]>([]);
  const [confirmedCourses, setConfirmedCourses] = useState<ConfirmedCourse[]>([]);
  const [myGroups, setMyGroups] = useState<TutorGroup[]>([]);
  const [revenueData, setRevenueData] = useState<RevenueDataPoint[]>([]);
  const [activity, setActivity] = useState<TutorActivity[]>([]);

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const [
        revenueStats, requestsRaw, confirmedRaw,
        availabilityRaw, groupsRaw, revenueChartRaw, activityRaw,
      ] = await Promise.all([
        tutorDashboardService.getStats().catch(() => null),
        tutorDashboardService.getRequests().catch(() => []),
        tutorDashboardService.getConfirmedCourses().catch(() => []),
        tutorDashboardService.getAvailability().catch(() => []),
        tutorDashboardService.getMyGroups().catch(() => []),
        tutorDashboardService.getRevenueChart().catch(() => []),
        tutorDashboardService.getActivity().catch(() => []),
      ]);

      const revenue = (revenueStats as any)?.revenue ?? {};
      const pendingCount = (revenueStats as any)?.pendingRequestsCount ?? 0;
      const confirmedList: any[] = Array.isArray(confirmedRaw) ? confirmedRaw : [];
      const uniqueStudents = new Set(confirmedList.map(c => c.studentId)).size;
      setStats({
        coursesThisMonth: Number(revenue.completedCount ?? 0),
        activeStudents: uniqueStudents,
        monthlyRevenue: Number(revenue.totalNet ?? 0),
        pendingRequests: Number(pendingCount),
      });

      const requestsList: any[] = Array.isArray(requestsRaw) ? requestsRaw : [];
      const mappedRequests: CourseRequest[] = await Promise.all(
        requestsList.map(async (b: any) => ({
          id: String(b.id),
          studentName: b.studentId ? await resolvePublicName(b.studentId) : 'Élève',
          subject: b.subject ?? '',
          requestedDate: formatDate(b.scheduledDate, b.startTime),
          duration: Number(b.duration ?? 0) / 60,
          message: b.studentNote ?? '',
          status: REQUEST_STATUS_MAP[b.status] ?? 'en_attente',
        }))
      );
      setRequests(mappedRequests);

      const mappedConfirmed: ConfirmedCourse[] = await Promise.all(
        confirmedList.map(async (b: any) => ({
          id: String(b.id),
          date: formatDate(b.scheduledDate),
          time: b.startTime ? b.startTime.slice(0, 5).replace(':', 'h') : '',
          studentName: b.studentId ? await resolvePublicName(b.studentId) : 'Élève',
          subject: b.subject ?? '',
          status: COURSE_STATUS_MAP[b.status] ?? 'confirme',
        }))
      );
      setConfirmedCourses(mappedConfirmed);

      const availList: any[] = Array.isArray(availabilityRaw) ? availabilityRaw : [];
      setAvailability(
        availList.map((a: any) => ({
          day: DAY_MAP[a.dayOfWeek] ?? a.dayOfWeek ?? '',
          startTime: (a.startTime ?? '').slice(0, 5).replace(':', 'h'),
          endTime: (a.endTime ?? '').slice(0, 5).replace(':', 'h'),
          available: a.isAvailable !== false,
        }))
      );

      const groupsList: any[] = Array.isArray(groupsRaw) ? groupsRaw : [];
      setMyGroups(
        groupsList.map((g: any) => {
          const current = Number(g.currentCount ?? 0);
          const price = Number(g.monthlyPrice ?? 0);
          return {
            id: String(g.id),
            name: g.name ?? '',
            subject: g.subject ?? '',
            currentMembers: current,
            maxMembers: Number(g.maxCapacity ?? 0),
            schedule: g.schedules ?? '',
            monthlyPrice: price,
            monthlyRevenue: current * price,
          };
        })
      );

      const chartList: any[] = Array.isArray(revenueChartRaw) ? revenueChartRaw : [];
      const moisLabels: Record<string, string> = {
        '01': 'Janv', '02': 'Févr', '03': 'Mars', '04': 'Avr', '05': 'Mai', '06': 'Juin',
        '07': 'Juil', '08': 'Août', '09': 'Sept', '10': 'Oct', '11': 'Nov', '12': 'Déc',
      };
      setRevenueData(
        chartList.map((p: any) => {
          const monthKey = String(p.month ?? '').split('-')[1] ?? '';
          return { month: moisLabels[monthKey] ?? p.month, amount: Number(p.revenue ?? 0) };
        })
      );

      const activityList: any[] = Array.isArray(activityRaw) ? activityRaw : [];
      setActivity(
        activityList.map((a: any) => ({
          id: String(a.id),
          icon: a.icon ?? '🔔',
          message: a.message ?? '',
          time: a.time ?? '',
          isNew: Boolean(a.isNew),
        }))
      );
    } catch (err) {
      console.error('Erreur chargement dashboard tuteur:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  const handleAcceptRequest = async (requestId: string) => {
    try {
      await tutorDashboardService.acceptRequest(requestId);
      setRequests(prev => prev.map(r =>
        r.id === requestId ? { ...r, status: 'accepte' } : r
      ));
    } catch (err) {
      console.error('Erreur acceptation demande:', err);
    }
  };

  const handleRefuseRequest = async (requestId: string) => {
    try {
      await tutorDashboardService.refuseRequest(requestId);
      setRequests(prev => prev.map(r =>
        r.id === requestId ? { ...r, status: 'refuse' } : r
      ));
    } catch (err) {
      console.error('Erreur refus demande:', err);
    }
  };

  const groupRevenue = myGroups.reduce((sum, g) => sum + g.monthlyRevenue, 0);
  const totalGroupStudents = myGroups.reduce((sum, g) => sum + g.currentMembers, 0);

  return {
    loading, stats, requests, availability,
    confirmedCourses, myGroups, revenueData, activity,
    groupRevenue, totalGroupStudents,
    handleAcceptRequest, handleRefuseRequest,
    reload: load,
  };
};
