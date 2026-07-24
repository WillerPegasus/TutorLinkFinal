import { ReviewStats } from '../../../types/review.types';
import ReviewStars from './ReviewStars';

interface Props { stats: ReviewStats; }

// Panneau statistiques — note globale + distribution
const ReviewStatsPanel = ({ stats }: Props) => (
  <div className="bg-white rounded-xl shadow-sm p-6">
    <h3 className="font-bold text-gray-700 mb-5">
      ⭐ Résumé de vos avis
    </h3>

    <div className="flex gap-8 items-start">

      {/* Note globale */}
      <div className="text-center flex-shrink-0">
        <p className="text-6xl font-bold text-gray-800">
          {stats.averageRating}
        </p>
        <ReviewStars rating={Math.round(stats.averageRating)} size="lg" />
        <p className="text-xs text-gray-400 mt-2">
          {stats.totalReviews} avis au total
        </p>
      </div>

      {/* Séparateur */}
      <div className="w-px bg-gray-100 self-stretch" />

      {/* Distribution par étoiles */}
      <div className="flex-1 flex flex-col gap-2">
        {stats.distribution.map(d => (
          <div key={d.stars} className="flex items-center gap-3">
            {/* Étoiles */}
            <span className="text-xs text-gray-500 w-12 flex-shrink-0">
              {d.stars} ★
            </span>

            {/* Barre progression */}
            <div className="flex-1 bg-gray-100 rounded-full h-2">
              <div
                className="bg-yellow-400 h-2 rounded-full transition-all"
                style={{ width: `${d.pct}%` }}
              />
            </div>

            {/* Nombre */}
            <span className="text-xs text-gray-400 w-16 text-right">
              {d.count} ({d.pct}%)
            </span>
          </div>
        ))}
      </div>
    </div>
  </div>
);

export default ReviewStatsPanel;