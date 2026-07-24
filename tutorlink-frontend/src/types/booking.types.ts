export interface TimeSlot {
  id: string;
  day: string;          // LUN, MAR... (affichage)
  dayIndex: number;      // 0=dimanche ... 6=samedi (calcul date réelle)
  startTime: string;     // affichage "16h"
  endTime: string;       // affichage "18h"
  rawStartTime: string;  // "16:00:00" (pour l'API)
  available: boolean;
}

export interface BookingTutor {
  id: string;
  name: string;
  subject: string;
  level: string;
  quartier: string;
  rating: number;
  reviewCount: number;
  hourlyPrice: number;
}

export interface BookingFormData {
  selectedSlot: TimeSlot | null;
  subject: string;
  duration: number; // en heures (UI) — converti en minutes à l'envoi
  studentName: string;
  message: string;
}
