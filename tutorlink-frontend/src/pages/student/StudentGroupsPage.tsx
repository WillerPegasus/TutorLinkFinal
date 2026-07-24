import { useNavigate } from 'react-router-dom';
import { useStudentGroups } from '../../hooks/useStudentGroups';
import MyGroupCard from '../../components/student/groups/MyGroupCard';
import SuggestedGroupCard from '../../components/student/groups/SuggestedGroupCard';

const StudentGroupsPage = () => {
  const navigate = useNavigate();
  const {
    loading, myGroups, suggestedGroups, stats,
    handleLeave, handleViewGroup,
  } = useStudentGroups();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center text-gray-400">
        Chargement...
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-6">

      <div className="flex justify-between items-start">
        <div>
          <h2 className="text-xl font-bold text-gray-800">
            👥 Mes groupes de répétition
          </h2>
          <p className="text-gray-400 text-sm mt-1">
            Gérez vos inscriptions aux groupes de répétition.
          </p>
        </div>
        <button
          onClick={() => navigate('/groupes')}
          className="bg-[#1a2744] hover:bg-blue-900 text-white
                     font-bold px-4 py-2.5 rounded-xl text-sm
                     cursor-pointer transition-colors"
        >
          + Rejoindre un groupe
        </button>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
        {[
          {
            value: stats.totalGroups,
            label: 'Groupes actifs',
            color: 'bg-blue-50 text-blue-800',
          },
          {
            value: `${stats.monthlyTotal.toLocaleString()} F`,
            label: 'Total / mois',
            color: 'bg-yellow-50 text-yellow-800',
          },
          {
            value: `${stats.totalSessions}`,
            label: 'Groupes',
            color: 'bg-green-50 text-green-800',
          },
        ].map(s => (
          <div key={s.label}
            className={`${s.color} rounded-xl p-4 text-center`}>
            <p className="text-2xl font-bold">{s.value}</p>
            <p className="text-xs font-medium mt-1">{s.label}</p>
          </div>
        ))}
      </div>

      {myGroups.length === 0 ? (
        <div className="bg-white rounded-xl shadow-sm p-12 text-center">
          <p className="text-4xl mb-4">👥</p>
          <h3 className="font-bold text-gray-700 text-lg mb-2">
            Vous n'êtes inscrit dans aucun groupe
          </h3>
          <p className="text-gray-400 text-sm mb-6">
            Rejoignez un groupe pour bénéficier de tarifs réduits
            et d'une émulation collective.
          </p>
          <button
            onClick={() => navigate('/groupes')}
            className="bg-[#1a2744] hover:bg-blue-900 text-white
                       font-bold px-6 py-2.5 rounded-xl
                       cursor-pointer transition-colors"
          >
            Découvrir les groupes
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          {myGroups.map(group => (
            <MyGroupCard
              key={group.id}
              group={group}
              onViewGroup={handleViewGroup}
              onLeave={handleLeave}
            />
          ))}
        </div>
      )}

      {suggestedGroups.length > 0 && (
        <div>
          <h3 className="font-bold text-gray-700 mb-3">
            💡 Groupes suggérés pour vous
          </h3>
          <div className="flex flex-col gap-3">
            {suggestedGroups.map(group => (
              <SuggestedGroupCard
                key={group.id}
                group={group}
                onJoin={handleViewGroup}
              />
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default StudentGroupsPage;
