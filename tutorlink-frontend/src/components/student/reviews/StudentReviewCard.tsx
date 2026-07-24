import { StudentReview } from '../../../types/studentReview.types';
import ReviewForm from './ReviewForm';

interface Props {
  review: StudentReview;
  isEditing: boolean;
  form: { rating: number; comment: string };
  onEdit: (review: StudentReview) => void;
  onFormChange: (form: { rating: number; comment: string }) => void;
  onUpdate: (id: string) => void;
  onCancelEdit: () => void;
  onDelete: (id: string) => void;
}

// Étoiles statiques pour affichage
const Stars = ({ rating }: { rating: number }) => (
  <span className="flex gap-0.5">
    {[1, 2, 3, 4, 5].map(s => (
      <span key={s}
        className={s <= rating ? 'text-yellow-400' : 'text-gray-200'}>
        ★
      </span>
    ))}
  </span>
);

// Badge statut publication
const statusConfig = {
  publie:     { label: '✅ Publié',     className: 'bg-green-100 text-green-700' },
  en_attente: { label: '⏳ En attente', className: 'bg-orange-100 text-orange-700' },
  refuse:     { label: '❌ Refusé',     className: 'bg-red-100 text-red-700' },
};

// Carte d'un avis publié par l'élève
const StudentReviewCard = ({
  review: r, isEditing,
  form, onEdit, onFormChange,
  onUpdate, onCancelEdit, onDelete,
}: Props) => {
  const { label, className } = statusConfig[r.status];

  return (
    <div className="bg-white rounded-xl shadow-sm p-5">

      {/* En-tête */}
      <div className="flex justify-between items-start mb-3">
        <div className="flex items-center gap-3">
          {/* Avatar répétiteur */}
          <div className="w-10 h-10 rounded-full bg-[#1a2744]
                          flex items-center justify-center
                          text-white font-bold text-sm flex-shrink-0">
            {r.tutorName.charAt(0)}
          </div>
          <div>
            <p className="font-bold text-gray-800 text-sm">
              {r.tutorName}
            </p>
            <p className="text-xs text-gray-500">
              {r.tutorSubject} · Cours du {r.courseDate}
            </p>
          </div>
        </div>

        {/* Statut + date */}
        <div className="flex flex-col items-end gap-1">
          <span className={`${className} text-xs font-bold
                           px-2 py-0.5 rounded-full`}>
            {label}
          </span>
          <span className="text-xs text-gray-400">{r.createdAt}</span>
        </div>
      </div>

      {/* Formulaire modification ou affichage */}
      {isEditing ? (
        <ReviewForm
          form={form}
          onChange={onFormChange}
          onSubmit={() => onUpdate(r.id)}
          onCancel={onCancelEdit}
          submitLabel="Enregistrer les modifications"
          isEditing
        />
      ) : (
        <>
          {/* Note + commentaire */}
          <div className="mb-3">
            <Stars rating={r.rating} />
            <p className="text-sm text-gray-600 mt-2 leading-relaxed">
              "{r.comment}"
            </p>
          </div>

          {/* Réponse du répétiteur */}
          {r.tutorReply && (
            <div className="bg-blue-50 border-l-4 border-l-[#1a2744]
                            rounded-r-lg p-3 mb-3">
              <p className="text-xs font-bold text-blue-800 mb-1">
                👨‍🏫 Réponse de {r.tutorName}
              </p>
              <p className="text-sm text-gray-600 italic">
                {r.tutorReply}
              </p>
            </div>
          )}

          {/* Boutons modifier / supprimer */}
          <div className="flex gap-2">
            <button
              onClick={() => onEdit(r)}
              className="border border-gray-200 text-gray-600
                         text-xs px-3 py-1.5 rounded-lg
                         hover:bg-gray-50 cursor-pointer
                         transition-colors"
            >
              ✏️ Modifier
            </button>
            <button
              onClick={() => {
                if (window.confirm(
                  'Supprimer cet avis définitivement ?'
                )) onDelete(r.id);
              }}
              className="border border-red-200 text-red-500
                         text-xs px-3 py-1.5 rounded-lg
                         hover:bg-red-50 cursor-pointer
                         transition-colors"
            >
              🗑 Supprimer
            </button>
          </div>
        </>
      )}
    </div>
  );
};

export default StudentReviewCard;