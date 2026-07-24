import { useState } from 'react';
import { TutorReview } from '../../../types/review.types';
import ReviewStars from './ReviewStars';

interface Props {
  review: TutorReview;
  replyingTo: string | null;
  replyText: string;
  onStartReply: (id: string) => void;
  onCancelReply: () => void;
  onChangeReply: (text: string) => void;
  onSubmitReply: (id: string) => void;
}

const ReviewCard = ({
  review: r,
  replyingTo, replyText,
  onStartReply, onCancelReply,
  onChangeReply, onSubmitReply,
}: Props) => {
  const isReplying = replyingTo === r.id;

  return (
    <div className={`bg-white rounded-xl shadow-sm p-5
                     ${r.isNew ? 'border-l-4 border-l-yellow-400' : ''}`}>

      {/* En-tête avis */}
      <div className="flex justify-between items-start mb-3">
        <div className="flex items-start gap-3">

          {/* Avatar auteur */}
          <div className="w-10 h-10 rounded-full bg-blue-100
                          flex items-center justify-center
                          text-blue-800 font-bold text-sm flex-shrink-0">
            {r.author.charAt(0)}
          </div>

          {/* Infos auteur */}
          <div>
            <div className="flex items-center gap-2">
              <p className="font-bold text-gray-800 text-sm">{r.author}</p>
              {/* Badge rôle */}
              <span className={`text-xs px-2 py-0.5 rounded-full font-medium
                ${r.authorRole === 'parent'
                  ? 'bg-purple-100 text-purple-700'
                  : 'bg-blue-100 text-blue-700'
                }`}>
                {r.authorRole === 'parent' ? 'Parent' : 'Élève'}
              </span>
              {/* Badge nouveau */}
              {r.isNew && (
                <span className="text-xs bg-yellow-100 text-yellow-700
                                 px-2 py-0.5 rounded-full font-bold">
                  NOUVEAU
                </span>
              )}
            </div>

            {/* Si parent, nom de l'élève concerné */}
            {r.authorRole === 'parent' && r.studentName && (
              <p className="text-xs text-gray-400">
                Pour : {r.studentName}
              </p>
            )}

            {/* Étoiles + date */}
            <div className="flex items-center gap-2 mt-1">
              <ReviewStars rating={r.rating} size="sm" />
              <span className="text-xs text-gray-400">{r.date}</span>
            </div>
          </div>
        </div>

        {/* Matière */}
        <span className="text-xs bg-gray-100 text-gray-600
                         px-2 py-1 rounded-full">
          {r.subject}
        </span>
      </div>

      {/* Commentaire */}
      <p className="text-sm text-gray-600 leading-relaxed mb-4">
        "{r.comment}"
      </p>

      {/* Réponse existante */}
      {r.reply && (
        <div className="bg-blue-50 border-l-4 border-l-[#1a2744]
                        rounded-r-lg p-3 mb-3">
          <p className="text-xs font-bold text-blue-800 mb-1">
            👨‍🏫 Votre réponse
          </p>
          <p className="text-sm text-gray-600">{r.reply}</p>
        </div>
      )}

      {/* Formulaire réponse */}
      {isReplying ? (
        <div className="flex flex-col gap-2">
          <textarea
            value={replyText}
            onChange={e => onChangeReply(e.target.value)}
            placeholder="Écrivez votre réponse..."
            rows={3}
            autoFocus
            className="w-full border border-blue-200 rounded-lg p-3
                       text-sm resize-none focus:outline-none
                       focus:ring-2 focus:ring-blue-300"
          />
          <div className="flex gap-2">
            <button
              onClick={() => onSubmitReply(r.id)}
              disabled={!replyText.trim()}
              className="bg-[#1a2744] hover:bg-blue-900 text-white
                         text-sm font-bold px-4 py-2 rounded-lg
                         cursor-pointer disabled:opacity-40
                         disabled:cursor-not-allowed transition-colors"
            >
              ✅ Publier la réponse
            </button>
            <button
              onClick={onCancelReply}
              className="bg-gray-100 hover:bg-gray-200 text-gray-600
                         text-sm px-4 py-2 rounded-lg cursor-pointer
                         transition-colors"
            >
              Annuler
            </button>
          </div>
        </div>
      ) : (
        /* Bouton répondre si pas encore de réponse */
        !r.reply && (
          <button
            onClick={() => onStartReply(r.id)}
            className="text-xs text-blue-600 hover:text-blue-800
                       border border-blue-200 px-3 py-1.5 rounded-lg
                       cursor-pointer hover:bg-blue-50 transition-colors"
          >
            💬 Répondre à cet avis
          </button>
        )
      )}
    </div>
  );
};

export default ReviewCard;