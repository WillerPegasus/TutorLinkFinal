import { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  SearchTutor, SearchFilters, SortOption
} from '../types/search.types';
import searchTutorService from '../services/searchTutorService';
import { resolvePublicProfile } from '../services/publicProfileCache';

export const useSearchTutors = () => {
  const navigate = useNavigate();
  const [tutors, setTutors] = useState<SearchTutor[]>([]);
  const [loading, setLoading] = useState(true);

  const [filters, setFilters] = useState<SearchFilters>({
    search: '', subject: '', level: '',
    quartier: '', maxPrice: null,
    minRating: null, verifiedOnly: false,
  });
  const [sort, setSort] = useState<SortOption>('rating');

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const raw = await searchTutorService.getAllTutors();
      const mapped: SearchTutor[] = await Promise.all(
        raw.map(async (t: any) => {
          const profile = await resolvePublicProfile(t.userId);
          const subjectsList = (t.subjects ?? '').split(',').map((s: string) => s.trim()).filter(Boolean);
          return {
            id: String(t.id),
            name: profile.name,
            subject: subjectsList[0] ?? '',
            subjects: subjectsList,
            level: t.levels ?? '',
            quartier: t.districts || t.city || '',
            rating: t.rating ?? 0,
            reviewCount: t.totalReviews ?? 0,
            hourlyPrice: t.hourlyRate ?? 0,
            totalSessions: 0, // ⚠️ pas encore exposé par le backend
            bio: t.bio ?? '',
            isVerified: t.isVerified ?? false,
            isAvailable: true, // ⚠️ pas encore exposé par le backend
            diploma: '', // ⚠️ pas encore exposé par le backend
          };
        })
      );
      setTutors(mapped);
    } catch (err) {
      console.error('Erreur chargement répétiteurs:', err);
      setTutors([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { load(); }, [load]);

  const filteredTutors = tutors
    .filter(t => {
      const matchSearch =
        !filters.search ||
        t.name.toLowerCase().includes(filters.search.toLowerCase()) ||
        t.subject.toLowerCase().includes(filters.search.toLowerCase());

      const matchSubject =
        !filters.subject ||
        t.subjects.some(s => s.toLowerCase().includes(filters.subject.toLowerCase()));

      const matchLevel =
        !filters.level ||
        t.level.toLowerCase().includes(filters.level.toLowerCase());

      const matchQuartier =
        !filters.quartier ||
        t.quartier.toLowerCase().includes(filters.quartier.toLowerCase());

      const matchPrice =
        !filters.maxPrice || t.hourlyPrice <= filters.maxPrice;

      const matchRating =
        !filters.minRating || t.rating >= filters.minRating;

      const matchVerified =
        !filters.verifiedOnly || t.isVerified;

      return matchSearch && matchSubject && matchLevel &&
             matchQuartier && matchPrice && matchRating && matchVerified;
    })
    .sort((a, b) => {
      switch (sort) {
        case 'rating':     return b.rating - a.rating;
        case 'price_asc':  return a.hourlyPrice - b.hourlyPrice;
        case 'price_desc': return b.hourlyPrice - a.hourlyPrice;
        case 'sessions':   return b.totalSessions - a.totalSessions;
        default:           return 0;
      }
    });

  const handleResetFilters = () => {
    setFilters({
      search: '', subject: '', level: '',
      quartier: '', maxPrice: null,
      minRating: null, verifiedOnly: false,
    });
  };

  const handleViewProfile = (tutorId: string) => {
    navigate(`/repetiteurs/${tutorId}`);
  };

  const handleBooking = (tutorId: string) => {
    navigate(`/reserver/${tutorId}`);
  };

  return {
    loading, filteredTutors, filters, setFilters,
    sort, setSort,
    handleResetFilters,
    handleViewProfile, handleBooking,
  };
};
