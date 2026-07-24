import { useGroups } from '../../hooks/useGroups';
import GroupFilterBar from '../../components/groups/GroupFilterBar';
import GroupCard from '../../components/groups/GroupCard';
import PublicFooter from "../../components/public/layout/PublicFooter";

const GroupsPage = () => {
  const { filteredGroups, filters, setFilters } = useGroups();

  return (
    <>
    <div className="min-h-screen bg-gray-50">
      {/* En-tête */}
      <div className="bg-white border-b border-gray-100 px-6 py-8">
        <h1 className="text-2xl font-bold text-gray-900">Groupes de Répétition</h1>
        <p className="text-gray-500 mt-1">
          Rejoignez un groupe encadré par un répétiteur · Apprentissage collaboratif, tarifs réduits
        </p>
        <p className="text-sm font-medium text-gray-700 mt-2">
          <span className="font-bold">{filteredGroups.length} groupes actifs</span> à Dschang · 5 000 à 7 000 FCFA / mois
        </p>
      </div>

      <div className="max-w-6xl mx-auto px-6 py-6">
        {/* Filtres */}
        <GroupFilterBar filters={filters} onChange={setFilters} />

        {/* Grille de groupes */}
        {filteredGroups.length === 0 ? (
          <div className="text-center py-16 text-gray-400">
            Aucun groupe ne correspond à vos critères
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {filteredGroups.map(g => (
              <GroupCard key={g.id} group={g} />
            ))}
          </div>
        )}
      </div>
    </div>
<PublicFooter/>
</>
  );
};

export default GroupsPage;