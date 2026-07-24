import { useState } from 'react';
import { DayAvailability, TimeSlotOption, AvailabilityStats } from '../types/availability.types';

// Tous les créneaux possibles de la journée (toutes les 2h)
export const TIME_SLOTS: TimeSlotOption[] = [
  { id: 's1', startTime: '08h', endTime: '10h', label: '08h – 10h' },
  { id: 's2', startTime: '10h', endTime: '12h', label: '10h – 12h' },
  { id: 's3', startTime: '12h', endTime: '14h', label: '12h – 14h' },
  { id: 's4', startTime: '14h', endTime: '16h', label: '14h – 16h' },
  { id: 's5', startTime: '16h', endTime: '18h', label: '16h – 18h' },
  { id: 's6', startTime: '18h', endTime: '20h', label: '18h – 20h' },
  { id: 's7', startTime: '20h', endTime: '22h', label: '20h – 22h' },
];

export const useAvailability = () => {
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  // ── DISPONIBILITÉS MOCK ──
  const [availability, setAvailability] = useState<DayAvailability[]>([
    {
      day: 'LUN', label: 'Lundi',
      slots: TIME_SLOTS.map(s => ({
        slotId: s.id,
        available: ['s5', 's6'].includes(s.id), // 16h-18h et 18h-20h
      })),
    },
    {
      day: 'MAR', label: 'Mardi',
      slots: TIME_SLOTS.map(s => ({
        slotId: s.id,
        available: ['s4', 's6'].includes(s.id),
      })),
    },
    {
      day: 'MER', label: 'Mercredi',
      slots: TIME_SLOTS.map(s => ({
        slotId: s.id,
        available: ['s4', 's5', 's6'].includes(s.id),
      })),
    },
    {
      day: 'JEU', label: 'Jeudi',
      slots: TIME_SLOTS.map(s => ({
        slotId: s.id,
        available: ['s5'].includes(s.id),
      })),
    },
    {
      day: 'VEN', label: 'Vendredi',
      slots: TIME_SLOTS.map(s => ({
        slotId: s.id,
        available: ['s4', 's5'].includes(s.id),
      })),
    },
    {
      day: 'SAM', label: 'Samedi',
      slots: TIME_SLOTS.map(s => ({
        slotId: s.id,
        available: ['s2', 's3', 's4'].includes(s.id),
      })),
    },
    {
      day: 'DIM', label: 'Dimanche',
      slots: TIME_SLOTS.map(s => ({
        slotId: s.id,
        available: false, // pas disponible le dimanche
      })),
    },
  ]);

  // Basculer un créneau disponible/indisponible
  const toggleSlot = (dayIndex: number, slotId: string) => {
    setAvailability(prev => prev.map((day, i) => {
      if (i !== dayIndex) return day;
      return {
        ...day,
        slots: day.slots.map(s =>
          s.slotId === slotId
            ? { ...s, available: !s.available }
            : s
        ),
      };
    }));
    setSaved(false); // reset indicateur sauvegarde
  };

  // Tout sélectionner pour un jour
  const selectAllDay = (dayIndex: number) => {
    setAvailability(prev => prev.map((day, i) => {
      if (i !== dayIndex) return day;
      return {
        ...day,
        slots: day.slots.map(s => ({ ...s, available: true })),
      };
    }));
    setSaved(false);
  };

  // Tout désélectionner pour un jour
  const clearDay = (dayIndex: number) => {
    setAvailability(prev => prev.map((day, i) => {
      if (i !== dayIndex) return day;
      return {
        ...day,
        slots: day.slots.map(s => ({ ...s, available: false })),
      };
    }));
    setSaved(false);
  };

  // Sauvegarder les disponibilités
  const handleSave = async () => {
    try {
      setSaving(true);
      // → remplacer par availabilityService.saveAvailability(availability)
      await new Promise(res => setTimeout(res, 800)); // simulation
      setSaved(true);
    } finally {
      setSaving(false);
    }
  };

  // Calculer les statistiques
  const totalSlots = availability.reduce((sum, day) =>
    sum + day.slots.filter(s => s.available).length, 0
  );
  const totalHoursPerWeek = totalSlots * 2; // chaque créneau = 2h
  const totalHoursPerMonth = totalHoursPerWeek * 4;
  const maxMonthlyRevenue = totalHoursPerMonth * 2000; // 2000 FCFA/h

  const stats: AvailabilityStats = {
    totalSlotsPerWeek: totalSlots,
    totalHoursPerWeek,
    totalHoursPerMonth,
    maxMonthlyRevenue,
  };

  return {
    availability, stats,
    saving, saved,
    toggleSlot, selectAllDay, clearDay, handleSave,
  };
};