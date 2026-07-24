import api from './api';

// Cache mémoire partagé pour éviter de refaire les mêmes appels
// GET /users/:id/public à chaque rendu (utilisé par les hooks tuteur
// pour afficher le nom d'un élève à partir d'un studentId).
const cache = new Map<number, { name: string; city: string; district: string; photo: string }>();

export async function resolvePublicName(userId: number): Promise<string> {
  const info = await resolvePublicProfile(userId);
  return info.name;
}

export async function resolvePublicProfile(userId: number) {
  if (cache.has(userId)) return cache.get(userId)!;
  try {
    const res = await api.get(`/users/${userId}/public`);
    const u = res.data;
    const info = {
      name: `${u.firstName ?? ''} ${u.lastName ?? ''}`.trim() || `Élève #${userId}`,
      city: u.city ?? '',
      district: u.districts ?? '',
      photo: u.profilePicture ?? '',
    };
    cache.set(userId, info);
    return info;
  } catch {
    const fallback = { name: `Élève #${userId}`, city: '', district: '', photo: '' };
    cache.set(userId, fallback);
    return fallback;
  }
}

// Résout le tutorId (tutor-service) à partir du userId du tuteur connecté.
// Mis en cache car il ne change jamais pendant la session.
let myTutorIdCache: number | null = null;
export async function resolveMyTutorId(userId: number): Promise<number | null> {
  if (myTutorIdCache !== null) return myTutorIdCache;
  try {
    const res = await api.get(`/tutors/user/${userId}`);
    myTutorIdCache = res.data?.id ?? null;
    return myTutorIdCache;
  } catch {
    return null;
  }
}

// Résout un tuteur (nom, matière, contact) à partir de son tutorId
// (tutor-service) — combine GET /tutors/:id (subjects, userId) puis
// GET /users/:userId/public (nom). Mis en cache par tutorId.
const tutorCache = new Map<number, { name: string; subject: string; email: string; phone: string }>();
export async function resolveTutor(tutorId: number) {
  if (tutorCache.has(tutorId)) return tutorCache.get(tutorId)!;
  try {
    const tutorRes = await api.get(`/tutors/${tutorId}`);
    const tutor = tutorRes.data;
    const profile = tutor.userId ? await resolvePublicProfile(tutor.userId) : null;
    const info = {
      name: profile?.name ?? `Tuteur #${tutorId}`,
      subject: tutor.subjects ?? '',
      email: '', // /users/:id/public n'expose pas l'email (confidentialité)
      phone: '',
    };
    tutorCache.set(tutorId, info);
    return info;
  } catch {
    const fallback = { name: `Tuteur #${tutorId}`, subject: '', email: '', phone: '' };
    tutorCache.set(tutorId, fallback);
    return fallback;
  }
}
