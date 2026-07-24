import api from './api';
import {
  StudentProfile, NotificationPreferences,
  PasswordChangeData, PrivacySettings
} from '../types/studentSettings.types';

// ⚠️ BACKEND REQUIS
const studentSettingsService = {

  // GET /student/profile — récupère le profil actuel
  getProfile: async () => {
    const res = await api.get('/student/profile');
    return res.data;
  },

  // PUT /student/profile — met à jour le profil
  updateProfile: async (profile: StudentProfile) => {
    const res = await api.put('/student/profile', profile);
    return res.data;
  },

  // POST /student/profile/avatar — upload photo de profil
  uploadAvatar: async (file: File) => {
    const formData = new FormData();
    formData.append('avatar', file);
    const res = await api.post('/student/profile/avatar', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
    return res.data;
  },

  // PUT /student/password — change le mot de passe
  // → backend vérifie l'ancien mot de passe avant de changer
  changePassword: async (data: PasswordChangeData) => {
    const res = await api.put('/student/password', data);
    return res.data;
  },

  // GET /student/notifications — préférences actuelles
  getNotificationPrefs: async () => {
    const res = await api.get('/student/notifications');
    return res.data;
  },

  // PUT /student/notifications — met à jour les préférences
  updateNotificationPrefs: async (
    prefs: NotificationPreferences
  ) => {
    const res = await api.put('/student/notifications', prefs);
    return res.data;
  },

  // GET /student/privacy — paramètres de confidentialité
  getPrivacySettings: async () => {
    const res = await api.get('/student/privacy');
    return res.data;
  },

  // PUT /student/privacy — met à jour la confidentialité
  updatePrivacySettings: async (settings: PrivacySettings) => {
    const res = await api.put('/student/privacy', settings);
    return res.data;
  },

  // DELETE /student/account — supprime le compte définitivement
  // → backend anonymise les données selon RGPD
  deleteAccount: async () => {
    await api.delete('/student/account');
  },
};

export default studentSettingsService;