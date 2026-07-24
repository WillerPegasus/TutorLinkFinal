// Rôle choisi lors de l'inscription
export type RegisterRole = 'ELEVE_PARENT' | 'REPETITEUR';

// Étape du formulaire multi-étapes
export type RegisterStep =
  'role'        |   // étape 1 : choix du rôle
  'infos'       |   // étape 2 : informations personnelles
  'pedagogique' |   // étape 3 : infos pédagogiques (répétiteur)
  'documents'   |   // étape 4 : pièces justificatives (répétiteur)
  'otp'         |   // étape 4bis : vérification du code reçu par email
  'confirmation';   // étape 5 : confirmation

// Données communes élève et répétiteur
export interface BaseRegisterData {
  firstName: string;
  lastName: string;
  phone: string;            // numéro Mobile Money
  email: string;
  quartier: string;
  password: string;
  confirmPassword: string;
  acceptCGU: boolean;
}

// Données spécifiques élève/parent
export interface StudentRegisterData extends BaseRegisterData {
  role: 'ELEVE_PARENT';
  studentLevel: string;     // niveau scolaire de l'élève
}

// Données spécifiques répétiteur
export interface TutorRegisterData extends BaseRegisterData {
  role: 'REPETITEUR';
  subject: string;          // matière principale
  subjects: string[];       // toutes les matières
  level: string;            // niveau enseigné
  hourlyPrice: number;      // tarif horaire en FCFA
  bio: string;              // présentation
}

// Documents soumis par le répétiteur
export interface TutorDocuments {
  cni: File | null;         // Carte Nationale d'Identité
  diploma: File | null;     // diplôme universitaire
  photo: File | null;       // photo de profil
}

// Aperçu d'un document uploadé
export interface DocumentPreview {
  file: File;
  url: string;              // URL object local pour prévisualisation
  name: string;
}