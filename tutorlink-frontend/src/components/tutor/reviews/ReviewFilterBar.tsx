import { ReviewFilters } from '../../../types/review.types';

interface Props {
  filters: ReviewFilters;
  onChange: (f: ReviewFilters) => void;
  total: number;
}

const ReviewFilterBar = ({ filters, onChange, total }: Props) => (
  <div className="bg-white rounded-xl shadow-sm p-4
                  flex flex-wrap gap-3 items-center">

    {/* Compteur */}
    <span className="text-sm text-gray-500 font-medium">
      {total} avis
    </span>

    {/* Filtre par étoiles */}
    <div className="flex gap-2">
      <button
        onClick={() => onChange({ ...filters, rating: null })}
        className={`px-3 py-1.5 rounded-lg text-sm font-medium
                    cursor-pointer transition-colors
                    ${filters.rating === null
                      ? 'bg-[#1a2744] text-white'
                      : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                    }`}
      >
        Tous
      </button>
      {[5, 4, 3, 2, 1].map(star => (
        <button
          key={star}
          onClick={() => onChange({ ...filters, rating: star })}
          className={`px-3 py-1.5 rounded-lg text-sm font-medium
                      cursor-pointer transition-colors
                      ${filters.rating === star
                        ? 'bg-yellow-400 text-white'
                        : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                      }`}
        >
          {star} ★
        </button>
      ))}
    </div>

    {/* Filtre matière */}
    <input
      placeholder="📚 Filtrer par matière..."
      value={filters.subject}
      onChange={e => onChange({ ...filters, subject: e.target.value })}
      className="border border-gray-200 rounded-lg px-3 py-2
                 text-sm focus:outline-none focus:ring-2
                 focus:ring-blue-300 w-48"
    />
  </div>
);

export default ReviewFilterBar;