import { useTutorReviews } from '../../hooks/useTutorReviews';
import ReviewStatsPanel from '../../components/tutor/reviews/ReviewStatsPanel';
import ReviewFilterBar from '../../components/tutor/reviews/ReviewFilterBar';
import ReviewCard from '../../components/tutor/reviews/ReviewCard';

const TutorReviewsPage = () => {
  const {
    filteredReviews, filters, setFilters, stats,
    replyingTo, setReplyingTo,
    replyText, setReplyText,
    handleSubmitReply,
  } = useTutorReviews();

  return (
    <div className="flex flex-col gap-6">

      {/* Titre */}
      <div>
        <h2 className="text-xl font-bold text-gray-800">
          ⭐ Mes avis
        </h2>
        <p className="text-gray-400 text-sm mt-1">
          Les retours de vos élèves et parents.
        </p>
      </div>

      {/* Panneau statistiques */}
      <ReviewStatsPanel stats={stats} />

      {/* Filtres */}
      <ReviewFilterBar
        filters={filters}
        onChange={setFilters}
        total={filteredReviews.length}
      />

      {/* Liste des avis */}
      {filteredReviews.length === 0 ? (
        <div className="bg-white rounded-xl shadow-sm p-12 text-center">
          <p className="text-gray-300 text-lg">
            Aucun avis pour ces critères
          </p>
        </div>
      ) : (
        <div className="flex flex-col gap-4">
          {filteredReviews.map(review => (
            <ReviewCard
              key={review.id}
              review={review}
              replyingTo={replyingTo}
              replyText={replyText}
              onStartReply={id => {
                setReplyingTo(id);
                setReplyText('');
              }}
              onCancelReply={() => {
                setReplyingTo(null);
                setReplyText('');
              }}
              onChangeReply={setReplyText}
              onSubmitReply={handleSubmitReply}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default TutorReviewsPage;