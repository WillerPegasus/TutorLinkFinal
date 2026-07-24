import { useParams, Link } from 'react-router-dom';
import { useGroupDetail } from '../../hooks/useGroupDetail';
import GroupHeader from '../../components/groups/GroupHeader';
import GroupSchedule from '../../components/groups/GroupSchedule';
import GroupJoinPanel from '../../components/groups/GroupJoinPanel';
import GroupReviews from '../../components/groups/GroupReviews';
import PublicFooter from "../../components/public/layout/PublicFooter";
const GroupDetailPage = () => {
  const { id } = useParams<{ id: string }>();
  const {
    loading, group, reviews, individualCost, savings,
    actionError, handleJoin, handleWaitlist,
  } = useGroupDetail(id!);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center text-gray-400">
        Chargement...
      </div>
    );
  }

  if (!group) {
    return (
      <div className="min-h-screen flex items-center justify-center text-gray-400">
        Groupe introuvable.
      </div>
    );
  }

  return (
    <>
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-5xl mx-auto px-6 py-6">

        {actionError && (
          <div className="bg-red-50 border border-red-200 text-red-600
                          text-sm rounded-lg px-4 py-3 mb-4">
            {actionError}
          </div>
        )}

        {/* Header groupe */}
        <GroupHeader group={group} onJoin={handleJoin} onWaitlist={handleWaitlist} />

        <div className="grid grid-cols-3 gap-6">

          {/* Colonne principale */}
          <div className="col-span-2 flex flex-col gap-5">

            {/* Description */}
            <div className="bg-white rounded-xl shadow-sm p-5">
              <h3 className="font-bold text-gray-700 mb-3">📖 Description du groupe</h3>
              <p className="text-sm text-gray-600 leading-relaxed">{group.description}</p>
            </div>

            {/* Répétiteur admin */}
            <div className="bg-white rounded-xl shadow-sm p-5">
              <h3 className="font-bold text-gray-700 mb-4">
                👨‍🏫 Répétiteur responsable (Administrateur du groupe)
              </h3>
              <div className="flex items-center gap-4">
                <div className="w-14 h-14 rounded-full bg-yellow-400 flex items-center justify-center text-2xl">
                  👨‍🏫
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-gray-800">{group.tutor.name}</span>
                    <span className="bg-[#1a2744] text-white text-xs px-2 py-0.5 rounded">
                      ADMIN DU GROUPE
                    </span>
                  </div>
                  <p className="text-xs text-gray-500 mt-0.5">
                    {group.tutor.diploma} · {group.tutor.totalSessions} cours donnés
                  </p>
                  <p className="text-yellow-500 text-sm font-bold mt-1">
                    ★ {group.tutor.rating} ({group.reviewCount} avis)
                  </p>
                </div>
                <Link
                  to={`/repetiteurs/${group.tutor.id}`}
                  className="border border-gray-300 text-gray-600 text-sm px-4 py-2 rounded-lg hover:bg-gray-50"
                >
                  Voir profil →
                </Link>
              </div>
            </div>

            {/* Thèmes */}
            <div className="bg-white rounded-xl shadow-sm p-5">
              <h3 className="font-bold text-gray-700 mb-3">📚 Matières & thèmes abordés</h3>
              <div className="flex flex-wrap gap-2">
                {group.themes.map(t => (
                  <span key={t} className="bg-gray-100 text-gray-700 text-xs px-3 py-1.5 rounded-full">
                    {t}
                  </span>
                ))}
              </div>
            </div>

            {/* Planning */}
            <GroupSchedule sessions={group.sessions} />

            {/* Avis */}
            <GroupReviews reviews={reviews} count={group.reviewCount} />
          </div>

          {/* Panneau droit */}
          <div className="col-span-1">
            <GroupJoinPanel
              group={group}
              individualCost={individualCost}
              savings={savings}
              onJoin={handleJoin}
              onWaitlist={handleWaitlist}
            />
          </div>
        </div>
      </div>
    </div>
    <PublicFooter/>
    </>
  );
};

export default GroupDetailPage;