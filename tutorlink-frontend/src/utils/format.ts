// src/utils/format.ts
// Fonctions utilitaires de formatage partagées dans tout le projet

// Formate un nombre en "94 500 F"
export function formatFCFA(montant: number): string {
  return montant.toLocaleString("fr-FR") + " F";
}

// Calcule la progression en % entre deux valeurs
export function calcProgression(actuel: number, precedent: number): string | null {
  if (!precedent) return null;
  const diff = ((actuel - precedent) / precedent) * 100;
  return diff.toFixed(1);
}

// Formate un nombre en "94k" pour les graphiques
export function formatMilliers(n: number): string {
  return n >= 1000 ? (n / 1000).toFixed(0) + "k" : n.toString();
}