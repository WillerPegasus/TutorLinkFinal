import StarRatingInput from './StarRatingInput';

interface Props {
  form: { rating: number; comment: string };
  onChange: (form: { rating: number; comment: string }) => void;
  onSubmit: () => void;
  onCancel: () => void;
  submitLabel?: string;
  isEditing?: boolean;
}

// Formulaire réutilisable pour créer ou modifier un avis
const ReviewForm = ({
  form, onChange, onSubmit, onCancel,
  submitLabel = 'Publier mon avis',
  isEditing = false,
}: Props) => (
  <div className="bg-blue-50 border border-blue-100
                  rounded-xl p-4 flex flex-col gap-3">

    {/* Titre formulaire */}
    <p className="text-sm font-bold text-gray-700">
      {isEditing ? '✏️ Modifier votre avis' : '⭐ Laisser un avis'}
    </p>

    {/* Sélection note */}
    <div>
      <label className="text-xs text-gray-500 font-semibold
                        uppercase mb-2 block">
        Votre note
      </label>
      <StarRatingInput
        value={form.rating}
        onChange={rating => onChange({ ...form, rating })}
        size="md"
      />
    </div>

    {/* Commentaire */}
    <div>
      <label className="text-xs text-gray-500 font-semibold
                        uppercase mb-1 block">
        Votre commentaire
      </label>
      <textarea
        value={form.comment}
        onChange={e => onChange({ ...form, comment: e.target.value })}
        placeholder="Décrivez votre expérience avec ce répétiteur..."
        rows={3}
        className="w-full border border-gray-200 rounded-lg p-3
                   text-sm resize-none focus:outline-none
                   focus:ring-2 focus:ring-blue-300"
      />
      {/* Compteur caractères */}
      <p className="text-xs text-gray-400 text-right mt-0.5">
        {form.comment.length} caractères
      </p>
    </div>

    {/* Boutons */}
    <div className="flex gap-2">
      <button
        onClick={onSubmit}
        disabled={!form.comment.trim()}
        className="flex-1 bg-[#1a2744] hover:bg-blue-900
                   text-white font-bold py-2.5 rounded-lg
                   cursor-pointer transition-colors
                   disabled:opacity-40 disabled:cursor-not-allowed
                   text-sm"
      >
        ✅ {submitLabel}
      </button>
      <button
        onClick={onCancel}
        className="bg-gray-100 hover:bg-gray-200 text-gray-600
                   px-4 py-2.5 rounded-lg cursor-pointer
                   transition-colors text-sm"
      >
        Annuler
      </button>
    </div>
  </div>
);

export default ReviewForm;