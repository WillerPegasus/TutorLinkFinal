// src/types/revenus.ts
// Définition de tous les types utilisés sur la page Mes Revenus

export interface StatsRevenus {
  revenusMois: number;
  revenusMoisPrec: number;
  coursDonn: number;
  heuresTotales: number;
  soldeDisponible: number;
  enAttentePaiement: number;
}

export interface PointGraphique {
  mois: string;
  montant: number;
}

export type StatutTransaction = "paye" | "en_attente" | "annule";

export interface Transaction {
  id: string;
  date: string;
  eleve: string;
  matiere: string;
  duree: string;
  montant: number;
  moyen: string;
  statut: StatutTransaction;
}

export interface Groupe {
  nom: string;
  inscrits: number;
  places: number;
  prixMois: number;
  revenusMois: number;
  statut: "actif" | "inactif";
}

export type FiltreTransaction = "tous" | StatutTransaction;
export type PeriodeGraphique = "3mois" | "6mois" | "12mois";