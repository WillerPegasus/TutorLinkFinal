import { SearchFilters, SortOption } from '../../../types/search.types';

interface Props {
  filters: SearchFilters;
  sort: SortOption;
  onFilterChange: (f: SearchFilters) => void;
  onSortChange: (s: SortOption) => void;
  onReset: () => void;
  totalResults: number;
}

// Sujets disponibles
const SUBJECTS = [
  'Mathématiques', 'Physique-Chimie', 'Anglais',
  'Français', 'SVT', 'Informatique', 'Histoire-Géo',
];

// Niveaux disponibles
const LEVELS = [
  'Primaire', 'CM1-CM2', '6ème-5ème',
  '4ème-3ème', 'Seconde', 'Première',
  'Terminale C/D', 'Terminale D', 'Tous niveaux',
];

// Quartiers de Dschang
const QUARTIERS = [
  'Centre Dschang', 'Quartier Foto',
  'Ngui Dschang', 'Bafoussam Road',
  'Tsinkop', 'Foréké',
];

// Prix maximum par heure
const MAX_PRICES = [1500, 2000, 2500, 3000];

const SearchFilterPanel = ({
  filters, sort,
  onFilterChange, onSortChange,
  onReset, totalResults,
}: Props) => (
  <div className="bg-white rounded-xl shadow-sm p-5
                  flex flex-col gap-4 w-64 flex-shrink-0
                  self-start sticky top-6">

    {/* En-tête + résultats */}
    <div className="flex justify-between items-center">
      <h3 className="font-bold text-gray-700">🔍 Filtres</h3>
      <span className="text-xs text-gray-400">
        {totalResults} résultat(s)
      </span>
    </div>

    {/* Recherche nom / matière */}
    <div>
      <label className="text-xs text-gray-500 font-semibold
                        uppercase mb-1 block">
        Recherche
      </label>
      <input
        placeholder="Nom ou matière..."
        value={filters.search}
        onChange={e => onFilterChange({ ...filters, search: e.target.value })}
        className="w-full border border-gray-200 rounded-lg
                   px-3 py-2 text-sm focus:outline-none
                   focus:ring-2 focus:ring-blue-300"
      />
    </div>

    {/* Filtre matière */}
    <div>
      <label className="text-xs text-gray-500 font-semibold
                        uppercase mb-1 block">
        Matière
      </label>
      <select
        value={filters.subject}
        onChange={e => onFilterChange({ ...filters, subject: e.target.value })}
        className="w-full border border-gray-200 rounded-lg
                   px-3 py-2 text-sm focus:outline-none
                   focus:ring-2 focus:ring-blue-300"
      >
        <option value="">Toutes les matières</option>
        {SUBJECTS.map(s => (
          <option key={s} value={s}>{s}</option>
        ))}
      </select>
    </div>

    {/* Filtre niveau */}
    <div>
      <label className="text-xs text-gray-500 font-semibold
                        uppercase mb-1 block">
        Niveau
      </label>
      <select
        value={filters.level}
        onChange={e => onFilterChange({ ...filters, level: e.target.value })}
        className="w-full border border-gray-200 rounded-lg
                   px-3 py-2 text-sm focus:outline-none
                   focus:ring-2 focus:ring-blue-300"
      >
        <option value="">Tous les niveaux</option>
        {LEVELS.map(l => (
          <option key={l} value={l}>{l}</option>
        ))}
      </select>
    </div>

    {/* Filtre quartier */}
    <div>
      <label className="text-xs text-gray-500 font-semibold
                        uppercase mb-1 block">
        Quartier
      </label>
      <select
        value={filters.quartier}
        onChange={e => onFilterChange({ ...filters, quartier: e.target.value })}
        className="w-full border border-gray-200 rounded-lg
                   px-3 py-2 text-sm focus:outline-none
                   focus:ring-2 focus:ring-blue-300"
      >
        <option value="">Tous les quartiers</option>
        {QUARTIERS.map(q => (
          <option key={q} value={q}>{q}</option>
        ))}
      </select>
    </div>

    {/* Prix maximum */}
    <div>
      <label className="text-xs text-gray-500 font-semibold
                        uppercase mb-1 block">
        Prix max / heure
      </label>
      <select
        value={filters.maxPrice ?? ''}
        onChange={e => onFilterChange({
          ...filters,
          maxPrice: e.target.value ? Number(e.target.value) : null
        })}
        className="w-full border border-gray-200 rounded-lg
                   px-3 py-2 text-sm focus:outline-none
                   focus:ring-2 focus:ring-blue-300"
      >
        <option value="">Tous les prix</option>
        {MAX_PRICES.map(p => (
          <option key={p} value={p}>
            Max {p.toLocaleString()} FCFA/h
          </option>
        ))}
      </select>
    </div>

    {/* Note minimum */}
    <div>
      <label className="text-xs text-gray-500 font-semibold
                        uppercase mb-1 block">
        Note minimum
      </label>
      <div className="flex gap-1">
        {[null, 4, 4.5, 5].map(rating => (
          <button
            key={rating ?? 'all'}
            onClick={() => onFilterChange({ ...filters, minRating: rating })}
            className={`flex-1 py-1.5 rounded-lg text-xs font-medium
                        cursor-pointer transition-colors
                        ${filters.minRating === rating
                          ? 'bg-yellow-400 text-white'
                          : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                        }`}
          >
            {rating === null ? 'Tous' : `${rating}★`}
          </button>
        ))}
      </div>
    </div>

    {/* Profils vérifiés uniquement */}
    <div className="flex items-center gap-2">
      <input
        type="checkbox"
        id="verified"
        checked={filters.verifiedOnly}
        onChange={e => onFilterChange({
          ...filters, verifiedOnly: e.target.checked
        })}
        className="w-4 h-4 accent-blue-800 cursor-pointer"
      />
      <label htmlFor="verified"
        className="text-sm text-gray-600 cursor-pointer">
        ✓ Profils vérifiés uniquement
      </label>
    </div>

    {/* Séparateur */}
    <div className="border-t border-gray-100" />

    {/* Tri */}
    <div>
      <label className="text-xs text-gray-500 font-semibold
                        uppercase mb-1 block">
        Trier par
      </label>
      <select
        value={sort}
        onChange={e => onSortChange(e.target.value as SortOption)}
        className="w-full border border-gray-200 rounded-lg
                   px-3 py-2 text-sm focus:outline-none
                   focus:ring-2 focus:ring-blue-300"
      >
        <option value="rating">Mieux notés</option>
        <option value="price_asc">Prix croissant</option>
        <option value="price_desc">Prix décroissant</option>
        <option value="sessions">Plus expérimentés</option>
      </select>
    </div>

    {/* Bouton réinitialiser */}
    <button
      onClick={onReset}
      className="w-full bg-gray-100 hover:bg-gray-200 text-gray-600
                 font-medium py-2 rounded-lg text-sm
                 cursor-pointer transition-colors"
    >
      ✖ Réinitialiser les filtres
    </button>
  </div>
);

export default SearchFilterPanel;