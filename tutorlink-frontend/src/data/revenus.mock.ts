// src/data/revenus.mock.ts
// Données fictives à remplacer par les appels API réels
// BACK-END :
//   GET /api/repetiteur/revenus/stats
//   GET /api/repetiteur/revenus/graphique?periode=6mois
//   GET /api/repetiteur/revenus/historique
//   GET /api/repetiteur/revenus/groupes

import type { StatsRevenus, PointGraphique, Transaction, Groupe } from "../types/revenu.types";

export const MOCK_STATS: StatsRevenus = {
  revenusMois: 94500,
  revenusMoisPrec: 87000,
  coursDonn: 18,
  heuresTotales: 36,
  soldeDisponible: 72000,
  enAttentePaiement: 22500,
};

export const MOCK_GRAPHIQUE: PointGraphique[] = [
  { mois: "Janv", montant: 52000 },
  { mois: "Févr", montant: 68000 },
  { mois: "Mars", montant: 76000 },
  { mois: "Avr",  montant: 87000 },
  { mois: "Mai",  montant: 91000 },
  { mois: "Juin", montant: 94500 },
];

export const MOCK_TRANSACTIONS: Transaction[] = [
  { id: "T-1042", date: "28 juin · 14h", eleve: "Ngono Christelle", matiere: "Mathématiques", duree: "2h",   montant: 4000, moyen: "MTN MoMo",    statut: "paye" },
  { id: "T-1041", date: "27 juin · 09h", eleve: "Talla Junior",     matiere: "Mathématiques", duree: "2h",   montant: 4000, moyen: "Orange Money", statut: "paye" },
  { id: "T-1040", date: "25 juin · 14h", eleve: "Fokou Cédric",     matiere: "Mathématiques", duree: "2h",   montant: 4000, moyen: "MTN MoMo",    statut: "paye" },
  { id: "T-1039", date: "23 juin · 16h", eleve: "Junior Nkoumba",   matiere: "Mathématiques", duree: "2h",   montant: 4000, moyen: "MTN MoMo",    statut: "paye" },
  { id: "T-1038", date: "21 juin · 10h", eleve: "Mbouh Karine",     matiere: "Mathématiques", duree: "1h30", montant: 3000, moyen: "Orange Money", statut: "en_attente" },
  { id: "T-1037", date: "20 juin · 16h", eleve: "Donfack Manuella", matiere: "Mathématiques", duree: "2h",   montant: 4000, moyen: "MTN MoMo",    statut: "paye" },
  { id: "T-1036", date: "18 juin · 14h", eleve: "Ngono Christelle", matiere: "Mathématiques", duree: "1h",   montant: 2000, moyen: "Espèces",     statut: "paye" },
  { id: "T-1035", date: "16 juin · 09h", eleve: "Talla Junior",     matiere: "Mathématiques", duree: "2h",   montant: 4000, moyen: "MTN MoMo",    statut: "annule" },
];

export const MOCK_GROUPES: Groupe[] = [
  { nom: "Maths BAC C/D · Groupe Élite", inscrits: 6, places: 8,  prixMois: 7000, revenusMois: 42000, statut: "actif" },
  { nom: "Soutien Maths · 3ème",         inscrits: 5, places: 10, prixMois: 5000, revenusMois: 25000, statut: "actif" },
];