import { useState } from 'react';
import { TutorValidationItem } from '../../types/tutorValidation.types';

interface Props {
  tutor: TutorValidationItem;
  onApprove: (id: string) => void;
  onReject: (id: string, reason: string) => void;
  onViewDoc: (url: string) => void;
}

const TutorValidationCard = ({ tutor, onApprove, onReject, onViewDoc }: Props) => {
  // Affiche/masque le champ motif de rejet
  const [showRejectForm, setShowRejectForm] = useState(false);
  const [rejectReason, setRejectReason] = useState('');

  const handleReject = () => {
    if (!rejectReason.trim()) {
      alert('Le motif de rejet est obligatoire');
      return;
    }
    onReject(tutor.id, rejectReason);
    setShowRejectForm(false);
  };

  return (
    <div className="bg-white rounded-xl shadow-sm border
                    border-gray-100 p-5 flex flex-col gap-4">

      {/* En-tête : photo + infos */}
      <div className="flex items-start gap-4">
        {/* Avatar initiales */}
        <div className="w-14 h-14 rounded-full bg-blue-800
                        flex items-center justify-center
                        text-white font-bold text-lg flex-shrink-0">
          {tutor.name.charAt(0)}
        </div>

        {/* Infos principales */}
        <div className="flex-1">
          <h3 className="font-bold text-gray-800 text-base">
            {tutor.name}
          </h3>
          <p className="text-sm text-gray-500">{tutor.email}</p>
          <div className="flex gap-2 mt-1 flex-wrap">
            <span className="bg-blue-100 text-blue-800 text-xs
                             font-bold px-2 py-0.5 rounded-full">
              {tutor.subject}
            </span>
            <span className="bg-blue-100 text-blue-800 text-xs
                             font-bold px-2 py-0.5 rounded-full">
              {tutor.level}
            </span>
            <span className="bg-gray-100 text-gray-600 text-xs
                             px-2 py-0.5 rounded-full">
              📍 {tutor.quartier}
            </span>
          </div>
        </div>

        {/* Date de soumission */}
        <span className="text-xs text-gray-400">
          Soumis le {tutor.submittedAt}
        </span>
      </div>

      {/* Documents cliquables */}
      <div>
        <p className="text-xs text-gray-500 font-semibold
                      uppercase mb-2">
          Pièces jointes
        </p>
        <div className="flex gap-2 flex-wrap">
          {tutor.documents.map(doc => (
            <button
              key={doc.type}
              onClick={() => onViewDoc(doc.url)}
              className="flex items-center gap-1 bg-gray-50
                         border border-gray-200 rounded-lg
                         px-3 py-1.5 text-xs font-medium
                         text-gray-700 hover:bg-blue-50
                         hover:border-blue-300 transition-colors
                         cursor-pointer"
            >
              {doc.type === 'CNI' ? '🪪' : doc.type === 'diplome' ? '📜' : '📷'}
              {doc.label}
            </button>
          ))}
        </div>
      </div>

      {/* Boutons Approuver / Rejeter */}
      {!showRejectForm ? (
        <div className="flex gap-3">
          <button
            onClick={() => onApprove(tutor.id)}
            className="flex-1 bg-blue-700 hover:bg-blue-800
                       text-white font-bold py-2 rounded-lg
                       transition-colors cursor-pointer"
          >
            ✅ Approuver
          </button>
          <button
            onClick={() => setShowRejectForm(true)}
            className="flex-1 bg-red-600 hover:bg-red-700
                       text-white font-bold py-2 rounded-lg
                       transition-colors cursor-pointer"
          >
            ❌ Rejeter
          </button>
        </div>
      ) : (
        /* Formulaire motif de rejet */
        <div className="flex flex-col gap-2">
          <textarea
            value={rejectReason}
            onChange={e => setRejectReason(e.target.value)}
            placeholder="Motif du rejet (obligatoire)..."
            className="border border-red-300 rounded-lg p-2
                       text-sm resize-none focus:outline-none
                       focus:ring-2 focus:ring-red-300"
            rows={3}
          />
          <div className="flex gap-2">
            <button
              onClick={handleReject}
              className="flex-1 bg-red-600 hover:bg-red-700
                         text-white font-bold py-2 rounded-lg
                         cursor-pointer"
            >
              Confirmer le rejet
            </button>
            <button
              onClick={() => setShowRejectForm(false)}
              className="flex-1 bg-gray-200 hover:bg-gray-300
                         text-gray-700 font-bold py-2 rounded-lg
                         cursor-pointer"
            >
              Annuler
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default TutorValidationCard;