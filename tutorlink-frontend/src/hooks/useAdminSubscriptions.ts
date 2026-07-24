import { useState, useEffect, useCallback } from 'react';
import {
  AdminTutorSubscription, AdminGroupSubscription,
  SubscriptionGlobalStats, AdminSubscriptionFilters, AdminSubscriptionStatus
} from '../types/adminSubscription.types';
import adminSubscriptionService from '../services/adminSubscriptionService';
import adminGroupService from '../services/adminGroupeService';
import adminLookupService from '../services/adminLookupService';

const TUTOR_STATUS_MAP: Record<string, AdminSubscriptionStatus> = {
  ACTIVE: 'active',
  SUSPENDED: 'suspended',
  EXPIRED: 'expired',
};

const GROUP_STATUS_MAP: Record<string, AdminSubscriptionStatus> = {
  ACTIVE: 'active',
  FULL: 'active',
  SUSPENDED: 'suspended',
  CLOSED: 'expired',
};

const daysUntil = (dateStr?: string) => {
  if (!dateStr) return 0;
  const diff = new Date(dateStr).getTime() - Date.now();
  return Math.max(0, Math.ceil(diff / (1000 * 60 * 60 * 24)));
};

export const useAdminSubscriptions = () => {
  const [activeTab, setActiveTab] = useState<'tutors' | 'groups'>('tutors');
  const [loading, setLoading] = useState(true);

  const [filters, setFilters] = useState<AdminSubscriptionFilters>({
    search: '', status: 'TOUS', type: 'TOUS',
  });

  const [tutorSubscriptions, setTutorSubscriptions] = useState<AdminTutorSubscription[]>([]);
  const [groupSubscriptions, setGroupSubscriptions] = useState<AdminGroupSubscription[]>([]);

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const [tutorSubs, groupOverview, groupsList] = await Promise.all([
        adminSubscriptionService.getTutorSubscriptions(),
        adminSubscriptionService.getGroupSubscriptions(),
        adminGroupService.getGroups({}),
      ]);

      const groupSubjectById = new Map<number, string>(
        (groupsList ?? []).map((g: any) => [g.id, g.subject])
      );

      const mappedTutors: AdminTutorSubscription[] = await Promise.all(
        (tutorSubs ?? []).map(async (s: any) => {
          const tutor = await adminLookupService.resolveTutorInfo(s.tutorId);
          return {
            id: String(s.id),
            tutorId: String(s.tutorId),
            tutorName: tutor.name,
            tutorEmail: tutor.email,
            tutorPhone: tutor.phone,
            subject: tutor.subject,
            quartier: tutor.quartier ?? '',
            status: TUTOR_STATUS_MAP[s.status] ?? 'expired',
            trialStartDate: '',
            trialEndDate: '',
            currentPeriodEnd: s.expiryDate ?? '',
            daysRemaining: daysUntil(s.expiryDate),
            isTrialPeriod: false,
            monthlyPrice: 3000,
            totalPaid: 0,
            paymentsCount: 0,
            autoRenew: !!s.autoRenew,
            lastPaymentDate: '',
            joinedAt: '',
          } as AdminTutorSubscription;
        })
      );

      const mappedGroups: AdminGroupSubscription[] = await Promise.all(
        (groupOverview ?? []).map(async (g: any) => {
          const tutor = await adminLookupService.resolveTutorInfo(g.tutorId);
          return {
            id: `gs-${g.groupId}`,
            groupId: String(g.groupId),
            groupName: g.groupName,
            tutorName: tutor.name,
            tutorId: String(g.tutorId),
            subject: groupSubjectById.get(g.groupId) ?? '',
            currentMembers: g.activeMembers ?? 0,
            maxMembers: g.maxCapacity ?? 0,
            status: GROUP_STATUS_MAP[g.status] ?? 'expired',
            trialStartDate: '',
            trialEndDate: '',
            currentPeriodEnd: '',
            daysRemaining: 0,
            isTrialPeriod: false,
            monthlyPrice: g.monthlyPrice ?? 0,
            totalPaid: 0,
            paymentsCount: 0,
            lastPaymentDate: '',
          } as AdminGroupSubscription;
        })
      );

      setTutorSubscriptions(mappedTutors);
      setGroupSubscriptions(mappedGroups);
    } catch (err) {
      console.error('Erreur chargement abonnements:', err);
      setTutorSubscriptions([]);
      setGroupSubscriptions([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { load(); }, [load]);

  const filteredTutors = tutorSubscriptions.filter(t => {
    const matchSearch =
      !filters.search ||
      t.tutorName.toLowerCase().includes(filters.search.toLowerCase()) ||
      t.tutorEmail.toLowerCase().includes(filters.search.toLowerCase());
    const matchStatus = filters.status === 'TOUS' || t.status === filters.status;
    return matchSearch && matchStatus;
  });

  const filteredGroups = groupSubscriptions.filter(g => {
    const matchSearch =
      !filters.search ||
      g.groupName.toLowerCase().includes(filters.search.toLowerCase()) ||
      g.tutorName.toLowerCase().includes(filters.search.toLowerCase());
    const matchStatus = filters.status === 'TOUS' || g.status === filters.status;
    return matchSearch && matchStatus;
  });

  const stats: SubscriptionGlobalStats = {
    totalTutors: tutorSubscriptions.length,
    tutorsTrial: 0,
    tutorsActive: tutorSubscriptions.filter(t => t.status === 'active').length,
    tutorsSuspended: tutorSubscriptions.filter(t => t.status === 'suspended').length,
    tutorsRevenue: tutorSubscriptions.filter(t => t.status === 'active').length * 3000,

    totalGroups: groupSubscriptions.length,
    groupsTrial: 0,
    groupsActive: groupSubscriptions.filter(g => g.status === 'active').length,
    groupsSuspended: groupSubscriptions.filter(g => g.status === 'suspended').length,
    groupsRevenue: groupSubscriptions
      .filter(g => g.status === 'active')
      .reduce((sum, g) => sum + g.monthlyPrice, 0),

    totalMonthlyRevenue: 0,
    totalAnnualRevenue: 0,
  };
  stats.totalMonthlyRevenue = stats.tutorsRevenue + stats.groupsRevenue;
  stats.totalAnnualRevenue = stats.totalMonthlyRevenue * 12;

  const handleActivateTutor = async (tutorId: string) => {
    try {
      await adminSubscriptionService.activateTutorSubscription(tutorId);
      setTutorSubscriptions(prev => prev.map(t =>
        t.tutorId === tutorId ? { ...t, status: 'active' } : t
      ));
    } catch (err) {
      console.error('Erreur activation abonnement répétiteur:', err);
    }
  };

  const handleSuspendTutor = async (tutorId: string) => {
    try {
      await adminSubscriptionService.suspendTutorSubscription(tutorId);
      setTutorSubscriptions(prev => prev.map(t =>
        t.tutorId === tutorId ? { ...t, status: 'suspended' } : t
      ));
    } catch (err) {
      console.error('Erreur suspension abonnement répétiteur:', err);
    }
  };

  const handleActivateGroup = async (groupId: string) => {
    try {
      await adminSubscriptionService.activateGroupSubscription(groupId);
      setGroupSubscriptions(prev => prev.map(g =>
        g.groupId === groupId ? { ...g, status: 'active' } : g
      ));
    } catch (err) {
      console.error('Erreur activation abonnement groupe:', err);
    }
  };

  const handleSuspendGroup = async (groupId: string) => {
    try {
      await adminSubscriptionService.suspendGroupSubscription(groupId);
      setGroupSubscriptions(prev => prev.map(g =>
        g.groupId === groupId ? { ...g, status: 'suspended' } : g
      ));
    } catch (err) {
      console.error('Erreur suspension abonnement groupe:', err);
    }
  };

  const handleExportCSV = async () => {
    try {
      const blob = await adminSubscriptionService.exportCSV();
      const url = URL.createObjectURL(new Blob([blob], { type: 'text/csv' }));
      const a = document.createElement('a');
      a.href = url;
      a.download = 'abonnements-tutorlink.csv';
      a.click();
      URL.revokeObjectURL(url);
    } catch (err) {
      console.error('Erreur export CSV abonnements:', err);
    }
  };

  return {
    loading,
    activeTab, setActiveTab,
    filters, setFilters,
    stats,
    filteredTutors, filteredGroups,
    handleActivateTutor, handleSuspendTutor,
    handleActivateGroup, handleSuspendGroup,
    handleExportCSV,
  };
};
