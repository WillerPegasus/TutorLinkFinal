import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  FeaturedTutor, FeaturedGroup,
  PlatformStat, HowItWorksStep, PlatformAdvantage
} from '../types/home.types';

export const useHome = () => {
  const navigate = useNavigate();

  // ── RÉPÉTITEURS VEDETTES MOCK ──
  const [featuredTutors] = useState<FeaturedTutor[]>([
    {
      id: 't1',
      name: 'M. NGUIMGO LEONEL',
      subject: 'Mathématiques',
      level: 'Terminale C/D',
      quartier: 'Centre Dschang',
      rating: 4.9,
      reviewCount: 87,
      hourlyPrice: 2000,
      totalSessions: 312,
      isVerified: true,
      badge: 'TOP MOIS',
    },
    {
      id: 't2',
      name: 'Mme NANMO AUDRELLE',
      subject: 'Physique-Chimie',
      level: 'Lycée',
      quartier: 'Quartier Foto',
      rating: 4.8,
      reviewCount: 64,
      hourlyPrice: 1800,
      totalSessions: 248,
      isVerified: true,
    },
    {
      id: 't3',
      name: 'Mlle ASSONFACK Mystelle',
      subject: 'Anglais',
      level: 'Tous niveaux',
      quartier: 'Centre Dschang',
      rating: 4.9,
      reviewCount: 73,
      hourlyPrice: 1700,
      totalSessions: 289,
      isVerified: true,
      badge: 'NOUVEAU',
    },
  ]);

  // ── GROUPES VEDETTES MOCK ──
  const [featuredGroups] = useState<FeaturedGroup[]>([
    {
      id: 'g1',
      name: 'Maths BAC C/D · Groupe Élite',
      subject: 'Mathématiques',
      tutorName: 'M. Kamga Eric',
      currentMembers: 6,
      maxMembers: 8,
      monthlyPrice: 7000,
      rating: 4.9,
      schedule: 'Mar & Sam · 16h-18h',
      isVerified: true,
    },
    {
      id: 'g2',
      name: 'Physique-Chimie · Première',
      subject: 'Physique-Chimie',
      tutorName: 'Mme Tchana Sylvie',
      currentMembers: 4,
      maxMembers: 6,
      monthlyPrice: 6000,
      rating: 4.8,
      schedule: 'Mer & Ven · 17h-19h',
      isVerified: true,
    },
    {
      id: 'g3',
      name: 'English Club · Conversation',
      subject: 'Anglais',
      tutorName: 'Mlle Fotso Aline',
      currentMembers: 7,
      maxMembers: 10,
      monthlyPrice: 5000,
      rating: 4.9,
      schedule: 'Sam · 09h-12h',
      isVerified: true,
    },
  ]);

  // ── STATISTIQUES PLATEFORME ──
  const stats: PlatformStat[] = [
    { value: '500+', label: 'Répétiteurs', icon: '🎓' },
    { value: '300+', label: 'Élèves accompagnés', icon: '👨‍🎓' },
    { value: '98%', label: 'Satisfaction', icon: '⭐' },
    { value: '42+', label: 'Groupes actifs', icon: '👥' },
  ];

  // ── COMMENT ÇA MARCHE ──
  const steps: HowItWorksStep[] = [
    {
      number: 1,
      title: 'Recherchez',
      description: 'Parcourez les profils de répétiteurs vérifiés par matière, niveau et quartier (Foto, Ngui, Centre...).',
      icon: '🔍',
    },
    {
      number: 2,
      title: 'Réservez',
      description: 'Choisissez le créneau qui vous convient et réservez en quelques clics. Paiement sécurisé via MTN Mobile Money ou Orange Money.',
      icon: '📅',
    },
    {
      number: 3,
      title: 'Progressez',
      description: 'Suivez les progrès de votre enfant, échangez avec le répétiteur, et célébrez les succès aux examens BEPC et BAC.',
      icon: '📈',
    },
  ];

  // ── AVANTAGES ──
  const advantages: PlatformAdvantage[] = [
    {
      icon: '🛡️',
      title: 'Profils vérifiés',
      description: 'Tous nos répétiteurs sont validés (CNI, diplômes, références).',
      color: 'bg-blue-50',
    },
    {
      icon: '📍',
      title: 'Proche de chez vous',
      description: 'Cours à domicile dans tous les quartiers de Dschang.',
      color: 'bg-yellow-50',
    },
    {
      icon: '💰',
      title: 'Tarifs justes',
      description: 'De 1 500 à 3 000 FCFA/h. Groupes dès 5 000 FCFA/mois.',
      color: 'bg-green-50',
    },
    {
      icon: '⭐',
      title: 'Avis transparents',
      description: 'Notations et témoignages réels de parents et élèves.',
      color: 'bg-purple-50',
    },
  ];

  return {
    featuredTutors, featuredGroups,
    stats, steps, advantages,
    navigate,
  };
};