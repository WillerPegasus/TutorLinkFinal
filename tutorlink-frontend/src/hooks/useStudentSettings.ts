import { useState } from 'react';
import {
  SettingsSection, StudentProfile,
  NotificationPreferences, PasswordChangeData,
  PrivacySettings
} from '../types/studentSettings.types';

export const useStudentSettings = () => {

  // Section active
  const [activeSection, setActiveSection] =
    useState<SettingsSection>('profil');

  // ── PROFIL MOCK ──
  const [profile, setProfile] = useState<StudentProfile>({
    name: 'Junior Nanfack',
    email: 'j.nanfack@gmail.com',
    phone: '677001122',
    level: 'Terminale D',
    quartier: 'Centre Dschang',
    bio: 'Élève en Terminale D, je vise le BAC D avec mention.',
  });

  // ── MOT DE PASSE ──
  const [passwordData, setPasswordData] = useState<PasswordChangeData>({
    currentPassword: '', newPassword: '', confirmPassword: '',
  });
  const [passwordError, setPasswordError] = useState('');
  const [passwordSuccess, setPasswordSuccess] = useState(false);

  // ── NOTIFICATIONS MOCK ──
  const [notifPrefs, setNotifPrefs] = useState<NotificationPreferences>({
    emailReservation: true,
    emailMessage: true,
    smsReminder: true,
    smsPayment: true,
    pushNotifications: false,
  });

  // ── CONFIDENTIALITÉ MOCK ──
  const [privacy, setPrivacy] = useState<PrivacySettings>({
    showProfileToTutors: true,
    showInReviews: true,
    allowDataExport: true,
  });

  // Indicateur sauvegarde
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  // Modal suppression compte
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  // Sauvegarder le profil
  const handleSaveProfile = async () => {
    setSaving(true);
    // → remplacer par studentSettingsService.updateProfile(profile)
    await new Promise(res => setTimeout(res, 800));
    setSaving(false);
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  // Changer le mot de passe
  const handleChangePassword = async () => {
    setPasswordError('');
    setPasswordSuccess(false);

    if (passwordData.newPassword.length < 8) {
      setPasswordError('Le mot de passe doit contenir au moins 8 caractères.');
      return;
    }
    if (passwordData.newPassword !== passwordData.confirmPassword) {
      setPasswordError('Les mots de passe ne correspondent pas.');
      return;
    }

    setSaving(true);
    // → remplacer par studentSettingsService.changePassword(passwordData)
    await new Promise(res => setTimeout(res, 800));
    setSaving(false);
    setPasswordSuccess(true);
    setPasswordData({
      currentPassword: '', newPassword: '', confirmPassword: '',
    });
  };

  // Basculer une préférence de notification
  const toggleNotifPref = (key: keyof NotificationPreferences) => {
    setNotifPrefs(prev => ({ ...prev, [key]: !prev[key] }));
    // → remplacer par studentSettingsService.updateNotificationPrefs(...)
  };

  // Basculer un paramètre de confidentialité
  const togglePrivacy = (key: keyof PrivacySettings) => {
    setPrivacy(prev => ({ ...prev, [key]: !prev[key] }));
    // → remplacer par studentSettingsService.updatePrivacySettings(...)
  };

  // Supprimer le compte (mock)
  const handleDeleteAccount = () => {
    console.log('Suppression du compte');
    // → remplacer par studentSettingsService.deleteAccount()
    setShowDeleteConfirm(false);
  };

  return {
    activeSection, setActiveSection,
    profile, setProfile,
    passwordData, setPasswordData,
    passwordError, passwordSuccess,
    notifPrefs, privacy,
    saving, saved,
    showDeleteConfirm, setShowDeleteConfirm,
    handleSaveProfile, handleChangePassword,
    toggleNotifPref, togglePrivacy,
    handleDeleteAccount,
  };
};