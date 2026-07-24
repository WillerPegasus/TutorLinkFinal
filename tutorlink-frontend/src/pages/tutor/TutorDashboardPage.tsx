import { useTutorDashboard } from '../../hooks/useTutorDashboard';
import { useAuthStore } from '../../store/authStore';
import TutorStatCard from '../../components/tutor/TutorStatCard';
import CourseRequestsTable from '../../components/tutor/CourseRequestsTable';
import TutorAvailabilityGrid from '../../components/tutor/TutorAvailabilityGrid';
import ConfirmedCoursesTable from '../../components/tutor/ConfirmedCoursesTable';
import TutorGroupsTable from '../../components/tutor/TutorGroupsTable';
import TutorRevenueChart from '../../components/tutor/RevenueChart';
import TutorActivityPanel from '../../components/tutor/TutorActivityPanel';

const TutorDashboardPage = () => {
  const {
    loading, stats, requests, availability,
    confirmedCourses, myGroups, revenueData, activity,
    groupRevenue, totalGroupStudents,
    handleAcceptRequest, handleRefuseRequest,
  } = useTutorDashboard();
  const { user } = useAuthStore();

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
          Bonjour M. {(user?.lastName ?? '').toUpperCase() || 'Répétiteur'} 👋
        </h2>
        <p className="text-gray-400 mt-1">
          Voici l'activité de votre espace répétiteur ce mois-ci.
        </p>
      </div>

      {/* Cartes statistiques */}
      <div className="flex gap-4 flex-wrap">
        <TutorStatCard
          value={stats.coursesThisMonth}
          label="Cours donnés ce mois"
          accent="border-yellow-400"
        />
        <TutorStatCard
          value={stats.activeStudents}
          label="Élèves actifs"
          accent="border-blue-500"
        />
        <TutorStatCard
          value={`${stats.monthlyRevenue.toLocaleString()} F`}
          label="Revenus du mois"
          accent="border-green-500"
          sub="FCFA"
        />
        <TutorStatCard
          value={stats.pendingRequests}
          label="Demandes en attente"
          accent="border-orange-400"
        />
      </div>

      {/* Demandes de cours en attente */}
      <CourseRequestsTable
        requests={requests}
        onAccept={handleAcceptRequest}
        onRefuse={handleRefuseRequest}
      />

      {/* Disponibilités */}
      <TutorAvailabilityGrid slots={availability} />

      {/* Cours confirmés */}
      <ConfirmedCoursesTable courses={confirmedCourses} />

      {/* Mes groupes */}
      <TutorGroupsTable
        groups={myGroups}
        groupRevenue={groupRevenue}
        totalStudents={totalGroupStudents}
      />

      {/* Revenus + Activité récente */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <TutorRevenueChart data={revenueData} />
        <TutorActivityPanel activities={activity} />
      </div>
    </div>
  );
};

export default TutorDashboardPage;