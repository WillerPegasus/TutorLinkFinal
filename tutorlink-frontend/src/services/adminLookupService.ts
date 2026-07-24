import adminApi from './adminApi';

// ── Cache mémoire (évite de re-fetcher le même utilisateur/tuteur
//    plusieurs fois quand on enrichit une liste de groupes/réservations) ──
const userCache = new Map<number, any>();
const tutorCache = new Map<number, any>();

// GET /users/:id — profil complet (nom, email, tel)
const getUser = async (userId: number) => {
  if (userCache.has(userId)) return userCache.get(userId);
  try {
    const res = await adminApi.get(`/users/${userId}`);
    userCache.set(userId, res.data);
    return res.data;
  } catch {
    return null;
  }
};

// GET /tutors/:id — profil pédagogique (contient userId, subjects, districts)
const getTutorProfile = async (tutorId: number) => {
  if (tutorCache.has(tutorId)) return tutorCache.get(tutorId);
  try {
    const res = await adminApi.get(`/tutors/${tutorId}`);
    tutorCache.set(tutorId, res.data);
    return res.data;
  } catch {
    return null;
  }
};

// Résout un tutorId (id tutor-service) → nom/email/tel/matière réels
// via tutor-service (userId, subjects) puis user-service (nom, email, tel).
const resolveTutorInfo = async (tutorId: number) => {
  const profile = await getTutorProfile(tutorId);
  if (!profile) {
    return { name: `Répétiteur #${tutorId}`, email: '', phone: '', subject: '' };
  }
  const user = await getUser(profile.userId);
  return {
    name: user ? `${user.firstName ?? ''} ${user.lastName ?? ''}`.trim() : `Répétiteur #${tutorId}`,
    email: user?.email ?? '',
    phone: user?.phone ?? '',
    subject: profile.subjects ?? '',
    quartier: profile.districts ?? '',
  };
};

// Résout un userId (élève) → nom/email/tel réels via user-service.
const resolveUserInfo = async (userId: number) => {
  const user = await getUser(userId);
  return {
    name: user ? `${user.firstName ?? ''} ${user.lastName ?? ''}`.trim() : `Utilisateur #${userId}`,
    email: user?.email ?? '',
    phone: user?.phone ?? '',
  };
};

const adminLookupService = { resolveTutorInfo, resolveUserInfo, getTutorProfile, getUser };

export default adminLookupService;
