import api from './api';
import {
  StudentRegisterData,
  TutorRegisterData,
  TutorDocuments
} from '../types/register.types';

// ⚠️ BACKEND REQUIS
const registerService = {

  // POST /auth/register/student — inscription élève/parent
  // → backend crée le compte avec statut "actif"
  // → backend envoie email de bienvenue
  registerStudent: async (data: StudentRegisterData) => {
    // Mapping des noms de champs frontend -> backend (RegisterRequest)
    const payload = {
      firstName: data.firstName,
      lastName: data.lastName,
      email: data.email,
      password: data.password,
      phone: data.phone,
      role: 'STUDENT',
      city: 'Dschang',
      districts: data.quartier,
    };
    const res = await api.post('/auth/register/student', payload);
    return res.data;
  },

  // POST /auth/register/tutor — inscription répétiteur
  // → backend crée le compte avec statut "en_attente"
  // → backend stocke les documents sur S3/Cloudinary
  // → backend notifie l'admin pour validation
  // → backend envoie email de confirmation au répétiteur
  registerTutor: async (
    data: TutorRegisterData,
    _documents: TutorDocuments
  ) => {
    // Mapping des noms de champs frontend -> backend (RegisterRequest)
    const payload = {
      firstName: data.firstName,
      lastName: data.lastName,
      email: data.email,
      password: data.password,
      phone: data.phone,
      role: 'TUTOR',
      subjects: data.subjects?.length ? data.subjects.join(',') : data.subject,
      levels: data.level,
      hourlyRate: data.hourlyPrice,
      bio: data.bio,
      city: 'Dschang',
      districts: data.quartier,
    };
    const res = await api.post('/auth/register/tutor', payload);
    return res.data; // { message, userId }
  },

  // GET /auth/check-phone — vérifie si numéro déjà utilisé
  checkPhoneAvailable: async (phone: string) => {
    const res = await api.get('/auth/check-phone', {
      params: { phone }
    });
    return res.data.available;
  },

  // GET /auth/check-email — vérifie si email déjà utilisé
  checkEmailAvailable: async (email: string) => {
    const res = await api.get('/auth/check-email', {
      params: { email }
    });
    return res.data.available;
  },
};

export default registerService;