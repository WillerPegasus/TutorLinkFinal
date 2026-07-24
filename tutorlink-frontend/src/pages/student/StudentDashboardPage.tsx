import { useNavigate } from 'react-router-dom';
import { useStudentDashboard } from '../../hooks/useStudentDashboard';
import StudentStatCard from '../../components/student/StudentStatCard';
import UpcomingCoursesTable from '../../components/student/UpcomingCoursesTable';
import MyGroupsTable from '../../components/student/MyGroupsTable';
import SubjectProgressPanel from '../../components/student/SubjectProgressPanel';
import RecentActivityPanel from '../../components/student/RecentActivityPanel';
import ReservationDetailModal from '../../components/student/reservations/ReservationDetailModal';
const StudentDashboardPage = () => {
  const navigate = useNavigate();
  const {
    loading, firstName, stats,
    upcomingCourses, myGroups,
    progress, recentActivity,
  } = useStudentDashboard();

  if (loading) return (
    <div className="flex justify-center items-center h-64">
      <p className="text-gray-400">Chargement de votre espace...</p>
    </div>
  );

  return (
    <div className="flex flex-col gap-6">

      {/* Message de bienvenue */}
      <div>
        <h2 className="text-2xl font-bold text-gray-800">
          Bonjour {firstName || ''} 👋
        </h2>
        <p className="text-gray-400 mt-1">
          Voici un aperçu de votre parcours scolaire ce mois-ci.
        </p>
      </div>

      {/* ── BANNIÈRE INFO MODÈLE DE PAIEMENT ── */}
      <div className="bg-blue-50 border border-blue-200
                      rounded-xl px-4 py-3 flex gap-2 items-start">
        <span className="text-blue-500 flex-shrink-0 mt-0.5">💡</span>
        <p className="text-blue-700 text-xs leading-relaxed">
          <strong>Rappel :</strong> Les cours individuels sont payés
          directement à votre répétiteur via MTN MoMo ou Orange Money.
          Contactez-le via la{' '}
          <button
            onClick={() => navigate('/messagerie')}
            className="underline cursor-pointer font-bold"
          >
            messagerie
          </button>{' '}
          pour convenir du paiement.
        </p>
      </div>

      {/* Cartes statistiques */}
      <div className="flex gap-4 flex-wrap">
        <StudentStatCard
          value={`${stats.totalHours}h`}
          label="Cours suivis"
          accent="border-yellow-400"
        />
        <StudentStatCard
          value={stats.activeTutors}
          label="Répétiteurs actifs"
          accent="border-blue-500"
        />
        <StudentStatCard
          value={stats.currentAverage}
          label="Moyenne actuelle"
          accent="border-blue-800"
        />
        <StudentStatCard
          value={stats.upcomingCourses}
          label="Cours à venir"
          accent="border-red-400"
        />
      </div>

      {/* Prochains cours */}
      <UpcomingCoursesTable courses={upcomingCourses} />

      {/* Mes groupes */}
      <MyGroupsTable groups={myGroups} />

      {/* Progression + Activité récente */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <SubjectProgressPanel progress={progress} />
        <RecentActivityPanel activities={recentActivity} />
      </div>
    </div>
  );
};

export default StudentDashboardPage;