import { useStudentReviews } from '../../hooks/useStudentReviews';
import PendingReviewCard from '../../components/student/reviews/PendingReviewCard';
import StudentReviewCard from '../../components/student/reviews/StudentReviewCard';

const StudentReviewsPage = () => {
  const {
    reviews, pendingReviews, stats,
    editingReviewId, setEditingReviewId,
    ratingPendingId, setRatingPendingId,
    form, setForm,
    handleSubmitReview, handleUpdateReview,
    handleDeleteReview, handleStartEdit,
  } = useStudentReviews();

  return (
    <div className="flex flex-col gap-6">

      {/* Titre */}
      <div>
        <h2 className="text-xl font-bold text-gray-800">
          ⭐ Mes avis
        </h2>
        <p className="text-gray-400 text-sm mt-1">
          Vos retours sur vos répétiteurs aident toute la communauté.
        </p>
      </div>

      {/* Cartes statistiques */}
      <div className="grid grid-cols-3 gap-4">
        {[
          {
            value: stats.totalReviews,
            label: 'Avis publiés',
            color: 'bg-blue-50 text-blue-800',
          },
          {
            value: stats.averageGiven,
            label: 'Note moyenne donnée',
            color: 'bg-yellow-50 text-yellow-800',
            suffix: '/ 5 ★',
          },
          {
            value: stats.pendingCount,
            label: 'En attente d\'avis',
            color: stats.pendingCount > 0
              ? 'bg-orange-50 text-orange-800'
              : 'bg-gray-50 text-gray-600',
          },
        ].map(s => (
          <div key={s.label}
            className={`${s.color} rounded-xl p-4 text-center`}>
            <p className="text-2xl font-bold">
              {s.value}
              {s.suffix && (
                <span className="text-sm ml-1">{s.suffix}</span>
              )}
            </p>
            <p className="text-xs font-medium mt-1">{s.label}</p>
          </div>
        ))}
      </div>

      {/* Cours en attente d'avis */}
      {pendingReviews.length > 0 && (
        <div>
          <div className="flex items-center gap-2 mb-3">
            <h3 className="font-bold text-gray-700">
              ⏳ Cours terminés — en attente d'avis
            </h3>
            <span className="bg-orange-100 text-orange-700 text-xs
                             font-bold px-2 py-0.5 rounded-full">
              {pendingReviews.length}
            </span>
          </div>

          <div className="flex flex-col gap-3">
            {pendingReviews.map(pending => (
              <PendingReviewCard
                key={pending.id}
                pending={pending}
                isRating={ratingPendingId === pending.id}
                form={form}
                onStartRating={id => {
                  setRatingPendingId(id);
                  setForm({ rating: 5, comment: '' });
                }}
                onFormChange={setForm}
                onSubmit={handleSubmitReview}
                onCancel={() => {
                  setRatingPendingId(null);
                  setForm({ rating: 5, comment: '' });
                }}
              />
            ))}
          </div>
        </div>
      )}

      {/* Avis publiés */}
      <div>
        <h3 className="font-bold text-gray-700 mb-3">
          📋 Mes avis publiés ({reviews.length})
        </h3>

        {reviews.length === 0 ? (
          <div className="bg-white rounded-xl shadow-sm p-12 text-center">
            <p className="text-4xl mb-4">⭐</p>
            <h4 className="font-bold text-gray-700 mb-2">
              Vous n'avez pas encore laissé d'avis
            </h4>
            <p className="text-gray-400 text-sm">
              Après chaque cours terminé, vous pourrez noter
              et évaluer votre répétiteur.
            </p>
          </div>
        ) : (
          <div className="flex flex-col gap-4">
            {reviews.map(review => (
              <StudentReviewCard
                key={review.id}
                review={review}
                isEditing={editingReviewId === review.id}
                form={form}
                onEdit={handleStartEdit}
                onFormChange={setForm}
                onUpdate={handleUpdateReview}
                onCancelEdit={() => {
                  setEditingReviewId(null);
                  setForm({ rating: 5, comment: '' });
                }}
                onDelete={handleDeleteReview}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default StudentReviewsPage;