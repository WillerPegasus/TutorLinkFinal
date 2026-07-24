import { TutorValidationItem } from '../../types/tutorValidation.types';
import TutorValidationCard from './TutorValidationCard';

interface Props {
  tutors: TutorValidationItem[];
  onApprove: (id: string) => void;
  onReject: (id: string, reason: string) => void;
  onViewDoc: (url: string) => void;
}

// File d'attente des répétiteurs à valider
const TutorValidationQueue = ({ tutors, onApprove, onReject, onViewDoc }: Props) => (
  <div>
    {/* En-tête avec compteur */}
    <div className="flex items-center justify-between mb-4">
      <h3 className="text-base font-bold text-gray-700">
        File d'attente de validation
      </h3>
      <span className="bg-orange-100 text-orange-700 text-xs
                       font-bold px-3 py-1 rounded-full">
        {tutors.length} en attente
      </span>
    </div>

    {/* Liste des cartes ou message vide */}
    {tutors.length === 0 ? (
      <div className="bg-blue-50 border border-green-200
                      rounded-xl p-8 text-center">
        <p className="text-blue-700 font-medium">
          ✅ Aucun répétiteur en attente de validation
        </p>
      </div>
    ) : (
      <div className="grid gap-4">
        {tutors.map(tutor => (
          <TutorValidationCard
            key={tutor.id}
            tutor={tutor}
            onApprove={onApprove}
            onReject={onReject}
            onViewDoc={onViewDoc}
          />
        ))}
      </div>
    )}
  </div>
);

export default TutorValidationQueue;