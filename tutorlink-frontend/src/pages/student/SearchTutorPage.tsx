import { useSearchTutors } from '../../hooks/useSearchTutors';
import SearchFilterPanel from '../../components/student/search/SearchFilterPanel';
import TutorSearchCard from '../../components/student/search/TutorSearchCard';
import SearchEmptyState from '../../components/student/search/SearchEmptyState';

const SearchTutorPage = () => {
  const {
    filteredTutors, filters, setFilters,
    sort, setSort,
    handleResetFilters,
    handleViewProfile, handleBooking,
  } = useSearchTutors();

  return (
    <div className="flex flex-col gap-6">

      {/* Titre */}
      <div>
        <h2 className="text-xl font-bold text-gray-800">
          🔍 Trouver un répétiteur
        </h2>
        <p className="text-gray-400 text-sm mt-1">
          {filteredTutors.length} répétiteur(s) disponible(s) à Dschang
        </p>
      </div>

      {/* Layout principal — filtres à gauche, résultats à droite */}
      <div className="flex gap-6 items-start">

        {/* Panneau filtres — colonne gauche fixe */}
        <SearchFilterPanel
          filters={filters}
          sort={sort}
          onFilterChange={setFilters}
          onSortChange={setSort}
          onReset={handleResetFilters}
          totalResults={filteredTutors.length}
        />

        {/* Résultats — colonne droite */}
        <div className="flex-1">
          {filteredTutors.length === 0 ? (
            <SearchEmptyState onReset={handleResetFilters} />
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
              {filteredTutors.map(tutor => (
                <TutorSearchCard
                  key={tutor.id}
                  tutor={tutor}
                  onViewProfile={handleViewProfile}
                  onBook={handleBooking}
                />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default SearchTutorPage;