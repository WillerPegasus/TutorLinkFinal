// ============================================================
// FICHIER : src/services/groupService.ts
// RÔLE    : Couche d'accès réelle à l'API backend (tutor-service)
//           pour la gestion des groupes côté répétiteur.
// ============================================================

import api from './api';
import { resolveMyTutorId, resolvePublicProfile } from './publicProfileCache';
import { useAuthStore } from '../store/authStore';
import type {
  TutorGroupDetail,
  GroupStudent,
  GroupFormData,
} from "../types/tutorGroup.tytes";

function getConnectedUserId(): number | null {
  const user = useAuthStore.getState().user;
  return user ? Number(user.id) : null;
}

function mapGroupResponse(g: any): TutorGroupDetail {
  return {
    id: String(g.id),
    name: g.name,
    subject: g.subject,
    level: g.level,
    description: g.description ?? '',
    location: g.district || g.city || '',
    schedule: g.schedules ?? '',
    // ⚠️ Le backend stocke un seul champ texte "schedules" (pas de
    // découpage jours/heure séparé) — reconstruction impossible ici,
    // le formulaire d'édition devra les resaisir.
    scheduleDays: [],
    scheduleTime: '',
    enrolledCount: g.currentCount ?? 0,
    maxCapacity: g.maxCapacity ?? 0,
    pricePerMonth: g.monthlyPrice ?? 0,
    revenuePerMonth: (g.monthlyPrice ?? 0) * (g.currentCount ?? 0),
    isVerified: false, // ⚠️ pas encore exposé par le backend
    rating: 0,          // ⚠️ pas encore exposé par le backend
    reviewCount: 0,      // ⚠️ pas encore exposé par le backend
    status: g.status ?? 'ACTIVE',
    createdAt: g.createdAt ?? new Date().toISOString(),
    themes: [], // ⚠️ pas encore exposé par le backend
  };
}

/**
 * Récupère tous les groupes du répétiteur connecté.
 */
export async function getTutorGroups(): Promise<TutorGroupDetail[]> {
  const userId = getConnectedUserId();
  if (!userId) return [];
  const tutorId = await resolveMyTutorId(userId);
  if (!tutorId) return [];

  const res = await api.get(`/groups/tutor/${tutorId}`);
  const list: any[] = Array.isArray(res.data) ? res.data : [];
  return list.map(mapGroupResponse);
}

/**
 * Récupère les élèves inscrits dans un groupe.
 */
export async function getGroupStudents(
  groupId: string
): Promise<GroupStudent[]> {
  const res = await api.get(`/groups/${groupId}/members`);
  const list: any[] = Array.isArray(res.data) ? res.data : [];

  return Promise.all(
    list.map(async (m: any) => {
      const profile = await resolvePublicProfile(m.studentId);
      return {
        id: String(m.id),
        name: profile.name,
        level: '', // ⚠️ pas exposé par GroupMembershipResponse
        district: profile.district || profile.city || '',
        enrolledSince: (m.joinedAt ?? '').toString().slice(0, 10),
        paymentStatus: m.upToDate ? 'UP_TO_DATE' : 'LATE',
        lastPaymentDate: m.lastPaymentDate ?? '—',
        phoneNumber: '', // ⚠️ non exposé par l'endpoint public (vie privée)
      };
    })
  );
}

/**
 * Crée un nouveau groupe de répétition.
 */
export async function createGroup(
  data: GroupFormData
): Promise<TutorGroupDetail> {
  const userId = getConnectedUserId();
  if (!userId) throw new Error('Non connecté');
  const tutorId = await resolveMyTutorId(userId);
  if (!tutorId) throw new Error('Profil tuteur introuvable');

  const payload = {
    name: data.name,
    subject: data.subject,
    level: data.level,
    city: 'Dschang',
    district: data.location,
    maxCapacity: data.maxCapacity,
    monthlyPrice: data.pricePerMonth,
    description: data.description,
    schedules: data.scheduleDays.join(' & ') + ' · ' + data.scheduleTime,
  };

  const res = await api.post(`/groups?tutorId=${tutorId}`, payload);
  return mapGroupResponse(res.data);
}

/**
 * Modifie un groupe existant.
 */
export async function updateGroup(
  groupId: string,
  data: GroupFormData
): Promise<TutorGroupDetail> {
  const payload = {
    name: data.name,
    subject: data.subject,
    level: data.level,
    city: 'Dschang',
    district: data.location,
    maxCapacity: data.maxCapacity,
    monthlyPrice: data.pricePerMonth,
    description: data.description,
    schedules: data.scheduleDays.join(' & ') + ' · ' + data.scheduleTime,
  };

  const res = await api.put(`/groups/${groupId}`, payload);
  return mapGroupResponse(res.data);
}

/**
 * Supprime un groupe de répétition.
 */
export async function deleteGroup(groupId: string): Promise<void> {
  await api.delete(`/groups/${groupId}`);
}
