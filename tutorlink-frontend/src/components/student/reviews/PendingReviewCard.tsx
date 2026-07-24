import { PendingReview } from '../../../types/studentReview.types';
import ReviewForm from './ReviewForm';

interface Props {
  pending: PendingReview;
  isRating: boolean;
  form: { rating: number; comment: string };
  onStartRating: (id: string) => void;
  onFormChange: (form: { rating: number; comment: string }) => void;
  onSubmit: (id: string) => void;
  onCancel: () => void;
}

// Carte d'un cours terminé en attente d'avis
const PendingReviewCard = ({
  pending: p, isRating,
  form, onStartRating,
  onFormChange, onSubmit, onCancel,
}: Props) => (
  <div className="bg-white rounded-xl shadow-sm border-l-4
                  border-l-yellow-400 p-4">

    {/* Infos cours */}
    <div className="flex justify-between items-start mb-3">
      <div className="flex items-center gap-3">
        {/* Avatar */}
        <div className="w-10 h-10 rounded-full bg-yellow-100
                        flex items-center justify-center
                        text-yellow-700 font-bold text-sm flex-shrink-0">
          {p.tutorName.charAt(0)}
        </div>
        <div>
          <p className="font-bold text-gray-800 text-sm">
            {p.tutorName}
          </p>
          <p className="text-xs text-gray-500">
            {p.tutorSubject}
          </p>
        </div>
      </div>
      {/* Date cours */}
      <div className="text-right">
        <p className="text-xs text-gray-500">{p.courseDate}</p>
        <p className="text-xs text-gray-400">{p.courseTime}</p>
      </div>
    </div>

    {/* Formulaire ou bouton */}
    {isRating ? (
      <ReviewForm
        form={form}
        onChange={onFormChange}
        onSubmit={() => onSubmit(p.id)}
        onCancel={onCancel}
        submitLabel="Publier mon avis"
      />
    ) : (
      <button
        onClick={() => onStartRating(p.id)}
        className="w-full bg-yellow-400 hover:bg-yellow-500
                   text-gray-900 font-bold py-2 rounded-lg
                   cursor-pointer transition-colors text-sm"
      >
        ⭐ Laisser un avis
      </button>
    )}
  </div>
);

export default PendingReviewCard;