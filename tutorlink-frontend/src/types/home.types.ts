// Répétiteur vedette affiché sur la page d'accueil
export interface FeaturedTutor {
  id: string;
  name: string;
  subject: string;
  level: string;
  quartier: string;
  rating: number;
  reviewCount: number;
  hourlyPrice: number;
  totalSessions: number;
  isVerified: boolean;
  badge?: string;         // ex: "TOP MOIS", "NOUVEAU"
}

// Groupe vedette affiché sur la page d'accueil
export interface FeaturedGroup {
  id: string;
  name: string;
  subject: string;
  tutorName: string;
  currentMembers: number;
  maxMembers: number;
  monthlyPrice: number;
  rating: number;
  schedule: string;       // ex: "Mar & Sam · 16h-18h"
  isVerified: boolean;
}

// Statistique globale de la plateforme
export interface PlatformStat {
  value: string;          // ex: "500+"
  label: string;          // ex: "Répétiteurs"
  icon: string;           // emoji ou icône
}

// Étape "Comment ça marche"
export interface HowItWorksStep {
  number: number;
  title: string;
  description: string;
  icon: string;
}

// Avantage de la plateforme
export interface PlatformAdvantage {
  icon: string;
  title: string;
  description: string;
  color: string;          // couleur Tailwind du fond
}