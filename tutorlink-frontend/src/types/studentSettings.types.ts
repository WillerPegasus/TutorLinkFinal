// Section active dans la page paramètres
export type SettingsSection =
  'profil' | 'securite' | 'notifications' | 'confidentialite';

// Profil de l'élève modifiable
export interface StudentProfile {
  name: string;
  email: string;
  phone: string;
  level: string;          // niveau scolaire
  quartier: string;
  bio: string;            // courte présentation
  avatar?: string;
}

// Préférences de notifications
export interface NotificationPreferences {
  emailReservation: boolean;   // notif email confirmation réservation
  emailMessage: boolean;       // notif email nouveau message
  smsReminder: boolean;        // SMS rappel avant cours
  smsPayment: boolean;         // SMS confirmation paiement
  pushNotifications: boolean;  // notifications navigateur
}

// Données changement de mot de passe
export interface PasswordChangeData {
  currentPassword: string;
  newPassword: string;
  confirmPassword: string;
}

// Paramètres de confidentialité
export interface PrivacySettings {
  showProfileToTutors: boolean;  // profil visible aux répétiteurs
  showInReviews: boolean;        // nom visible dans les avis publics
  allowDataExport: boolean;      // autoriser export de données
}