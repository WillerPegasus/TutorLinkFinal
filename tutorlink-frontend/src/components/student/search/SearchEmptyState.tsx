// Affiche un message quand aucun résultat ne correspond aux filtres
const SearchEmptyState = ({ onReset }: { onReset: () => void }) => (
  <div className="bg-white rounded-xl shadow-sm p-16 text-center">
    <p className="text-4xl mb-4">🔍</p>
    <h3 className="font-bold text-gray-700 text-lg mb-2">
      Aucun répétiteur trouvé
    </h3>
    <p className="text-gray-400 text-sm mb-6">
      Aucun répétiteur ne correspond à vos critères de recherche.
      Essayez d'élargir vos filtres.
    </p>
    <button
      onClick={onReset}
      className="bg-[#1a2744] hover:bg-blue-900 text-white
                 font-bold px-6 py-2.5 rounded-xl cursor-pointer
                 transition-colors"
    >
      Réinitialiser les filtres
    </button>
  </div>
);

export default SearchEmptyState;