import { useState, useEffect } from 'react';
import studentService from '../services/studentService';
import {
  StudentStats, UpcomingCourse,
  StudentGroup, SubjectProgress, RecentActivity
} from '../types/student.types';

export const useStudentDashboard = () => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [firstName, setFirstName] = useState<string>('');
  const [stats, setStats] = useState<StudentStats>({
    totalHours: 0,
    activeTutors: 0,
    currentAverage: 0,
    upcomingCourses: 0,
  });
  const [upcomingCourses, setUpcomingCourses] = useState<UpcomingCourse[]>([]);
  const [myGroups, setMyGroups] = useState<StudentGroup[]>([]);
  const [progress, setProgress] = useState<SubjectProgress[]>([]);
  const [recentActivity, setRecentActivity] = useState<RecentActivity[]>([]);

  useEffect(() => {
    let cancelled = false;

    const load = async () => {
      setLoading(true);
      setError(null);
      try {
        const [profile, statsRes, coursesRes, groupsRes, progressRes, activityRes] =
          await Promise.all([
            studentService.getProfile().catch(() => null),
            studentService.getStats().catch(() => null),
            studentService.getUpcomingCourses().catch(() => []),
            studentService.getMyGroups().catch(() => []),
            studentService.getProgress().catch(() => []),
            studentService.getRecentActivity().catch(() => []),
          ]);

        if (cancelled) return;

        if (profile?.firstName) setFirstName(profile.firstName);
        if (statsRes) {
          // ⚠️ Le backend renvoie une forme différente de celle attendue
          // par l'UI actuelle. Mapping temporaire en attendant que le
          // backend expose totalHours/currentAverage, ou que l'UI soit
          // adaptée aux vrais champs (totalBookings, completedCount...).
          setStats({
            totalHours: 0, // pas encore fourni par le backend
            activeTutors: statsRes.tutorsContactedCount ?? 0,
            currentAverage: 0, // pas encore fourni par le backend
            upcomingCourses: statsRes.upcomingCount ?? 0,
          });
        }
        setUpcomingCourses(coursesRes ?? []);
        setMyGroups(groupsRes ?? []);
        setProgress(progressRes ?? []);
        setRecentActivity(activityRes ?? []);
      } catch (err) {
        if (!cancelled) {
          console.error('Erreur chargement dashboard élève:', err);
          setError("Impossible de charger votre tableau de bord.");
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    };

    load();
    return () => { cancelled = true; };
  }, []);

  return {
    loading, error, firstName,
    stats, upcomingCourses, myGroups,
    progress, recentActivity,
  };
};
