import { PublicReview } from '../../types/tutorProfile.types';

interface Props {
  reviews: PublicReview[];
  count: number;
}

const Stars = ({ n }: { n: number }) => (
  <span className="text-yellow-400 text-sm">
    {'★'.repeat(n)}{'☆'.repeat(5 - n)}
  </span>
);

// Section des avis publics, visible par tous
const PublicReviewsSection = ({ reviews, count }: Props) => (
  <div className="bg-white rounded-xl shadow-sm p-5">
    <h3 className="font-bold text-gray-700 mb-4">
      ⭐ Avis des élèves & parents ({count})
    </h3>
    <div className="flex flex-col gap-4">
      {reviews.map(r => (
        <div key={r.id}
          className="border-b border-gray-50 pb-4 last:border-0">
          <div className="flex justify-between items-start mb-1">
            <div>
              <span className="font-medium text-gray-800 text-sm">
                {r.author}
              </span>
              <span className="text-xs text-gray-400 ml-2">
                ({r.authorRole === 'parent' ? 'parent' : 'élève'})
              </span>
            </div>
            <span className="text-xs text-gray-400">{r.date}</span>
          </div>
          <Stars n={r.rating} />
          <p className="text-sm text-gray-600 mt-1 leading-relaxed">
            {r.comment}
          </p>
        </div>
      ))}
    </div>
  </div>
);

export default PublicReviewsSection;