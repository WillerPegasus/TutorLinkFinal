import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  RegisterRole, RegisterStep,
  BaseRegisterData, TutorRegisterData,
  TutorDocuments, DocumentPreview
} from '../types/register.types';
import registerService from '../services/registerService';
import { verifyRegistrationOtp } from '../services/authService';

export const useRegister = () => {
  const navigate = useNavigate();

  // Étape active du formulaire
  const [step, setStep] = useState<RegisterStep>('role');

  // Rôle sélectionné
  const [role, setRole] = useState<RegisterRole | null>(null);

  // Données de base communes
  const [baseData, setBaseData] = useState<BaseRegisterData>({
    firstName: '',
    lastName: '',
    phone: '',
    email: '',
    quartier: '',
    password: '',
    confirmPassword: '',
    acceptCGU: false,
  });

  // Données pédagogiques répétiteur
  const [tutorData, setTutorData] = useState<Omit<TutorRegisterData,
    keyof BaseRegisterData | 'role'>>({
    subject: '',
    subjects: [],
    level: '',
    hourlyPrice: 2000,
    bio: '',
  });

  // Documents répétiteur
  const [documents, setDocuments] = useState<TutorDocuments>({
    cni: null,
    diploma: null,
    photo: null,
  });

  // Aperçus documents
  const [previews, setPreviews] = useState<{
    cni: DocumentPreview | null;
    diploma: DocumentPreview | null;
    photo: DocumentPreview | null;
  }>({ cni: null, diploma: null, photo: null });

  // Erreurs de validation
  const [errors, setErrors] = useState<Record<string, string>>({});

  // Chargement et soumission
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [otpError, setOtpError] = useState<string | null>(null);
  const [otpLoading, setOtpLoading] = useState(false);

  // Sélectionner un document
  const handleDocumentSelect = (
    type: 'cni' | 'diploma' | 'photo',
    file: File
  ) => {
    const url = URL.createObjectURL(file);
    setDocuments(prev => ({ ...prev, [type]: file }));
    setPreviews(prev => ({
      ...prev,
      [type]: { file, url, name: file.name },
    }));
  };

  // Supprimer un document sélectionné
  const handleDocumentRemove = (type: 'cni' | 'diploma' | 'photo') => {
    if (previews[type]) URL.revokeObjectURL(previews[type]!.url);
    setDocuments(prev => ({ ...prev, [type]: null }));
    setPreviews(prev => ({ ...prev, [type]: null }));
  };

  // Valider l'étape infos personnelles
  const validateInfos = (): boolean => {
    const newErrors: Record<string, string> = {};
    if (!baseData.firstName.trim())
      newErrors.firstName = 'Le prénom est requis.';
    if (!baseData.lastName.trim())
      newErrors.lastName = 'Le nom est requis.';
    if (baseData.phone.length < 9)
      newErrors.phone = 'Numéro de téléphone invalide.';
    if (!baseData.email.includes('@'))
      newErrors.email = 'Adresse email invalide.';
    if (!baseData.quartier)
      newErrors.quartier = 'Le quartier est requis.';
    if (baseData.password.length < 8)
      newErrors.password = 'Minimum 8 caractères.';
    if (baseData.password !== baseData.confirmPassword)
      newErrors.confirmPassword = 'Les mots de passe ne correspondent pas.';
    if (!baseData.acceptCGU)
      newErrors.acceptCGU = 'Vous devez accepter les CGU.';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Valider l'étape pédagogique répétiteur
  const validatePedagogique = (): boolean => {
    const newErrors: Record<string, string> = {};
    if (!tutorData.subject)
      newErrors.subject = 'La matière principale est requise.';
    if (!tutorData.level)
      newErrors.level = 'Le niveau est requis.';
    if (!tutorData.bio.trim() || tutorData.bio.length < 50)
      newErrors.bio = 'La présentation doit faire au moins 50 caractères.';
    if (tutorData.hourlyPrice < 1000)
      newErrors.hourlyPrice = 'Le tarif minimum est 1000 FCFA/h.';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Valider les documents répétiteur
  const validateDocuments = (): boolean => {
    const newErrors: Record<string, string> = {};
    if (!documents.cni)
      newErrors.cni = 'La CNI est obligatoire.';
    if (!documents.diploma)
      newErrors.diploma = 'Le diplôme est obligatoire.';
    if (!documents.photo)
      newErrors.photo = 'La photo de profil est obligatoire.';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Passer à l'étape suivante
  const handleNext = () => {
    if (step === 'role') {
      if (!role) return;
      setStep('infos');
    } else if (step === 'infos') {
      if (!validateInfos()) return;
      // Élève → confirmation directe
      if (role === 'ELEVE_PARENT') {
        handleSubmit();
        return;
      }
      setStep('pedagogique');
    } else if (step === 'pedagogique') {
      if (!validatePedagogique()) return;
      setStep('documents');
    } else if (step === 'documents') {
      if (!validateDocuments()) return;
      handleSubmit();
    }
  };

  // Revenir à l'étape précédente
  const handleBack = () => {
    if (step === 'infos') setStep('role');
    else if (step === 'pedagogique') setStep('infos');
    else if (step === 'documents') setStep('pedagogique');
  };

  // Soumettre le formulaire
  const handleSubmit = async () => {
    setLoading(true);
    try {
      if (role === 'ELEVE_PARENT') {
        await registerService.registerStudent({
          ...baseData,
          role: 'STUDENT' as any, // ⚠️ backend n'a pas encore de rôle "parent" distinct côté UI
          studentLevel: '', // ⚠️ à ajouter au formulaire si nécessaire
        });
      } else if (role === 'REPETITEUR') {
        await registerService.registerTutor(
          { ...baseData, ...tutorData, role: 'TUTOR' as any },
          documents
        );
      }
      setStep('otp');
    } catch (err) {
      console.error('Erreur inscription:', err);
      setErrors({ submit: "L'inscription a échoué. Veuillez réessayer." });
    } finally {
      setLoading(false);
    }
  };

  // Vérifie le code OTP reçu par email et finalise l'inscription
  const handleVerifyOtp = async (code: string) => {
    setOtpError(null);
    setOtpLoading(true);
    try {
      await verifyRegistrationOtp(baseData.email, code);
      setSubmitted(true);
      setStep('confirmation');
    } catch (err: any) {
      setOtpError(err.message ?? 'Code incorrect ou expiré.');
    } finally {
      setOtpLoading(false);
    }
  };

  // Numéro de l'étape pour la barre de progression
  const stepNumber = {
    role: 1, infos: 2,
    pedagogique: 3, documents: 4, confirmation: 5,
  }[step];

  const totalSteps = role === 'REPETITEUR' ? 4 : 2;

  return {
    step, role, setRole,
    baseData, setBaseData,
    tutorData, setTutorData,
    documents, previews,
    errors, loading, submitted,
    stepNumber, totalSteps,
    handleDocumentSelect, handleDocumentRemove,
    handleNext, handleBack,
    handleVerifyOtp, otpError, otpLoading,
    navigate,
  };
};