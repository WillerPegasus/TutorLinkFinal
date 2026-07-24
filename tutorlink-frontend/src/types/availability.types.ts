// Jours de la semaine
export type DayOfWeek =
  'LUN' | 'MAR' | 'MER' | 'JEU' | 'VEN' | 'SAM' | 'DIM';

// Un créneau horaire
export interface TimeSlotOption {
  id: string;
  startTime: string;    // ex: '08h'
  endTime: string;      // ex: '10h'
  label: string;        // ex: '08h – 10h'
}

// Disponibilité d'un jour
export interface DayAvailability {
  day: DayOfWeek;
  label: string;        // ex: 'Lundi'
  slots: {
    slotId: string;
    available: boolean;
  }[];
}

// Résumé des stats de disponibilité
export interface AvailabilityStats {
  totalSlotsPerWeek: number;    // total créneaux disponibles
  totalHoursPerWeek: number;    // total heures disponibles
  totalHoursPerMonth: number;   // total heures par mois
  maxMonthlyRevenue: number;    // revenu max possible si tout pris
}