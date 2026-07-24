import { TutorDocuments, DocumentPreview } from '../../types/register.types';
import DocumentUploadZone from './DocumentUploadZone';

interface Props {
  documents: TutorDocuments;
  previews: {
    cni: DocumentPreview | null;
    diploma: DocumentPreview | null;
    photo: DocumentPreview | null;
  };
  errors: Record<string, string>;
  onSelect: (type: 'cni' | 'diploma' | 'photo', file: File) => void;
  onRemove: (type: 'cni' | 'diploma' | 'photo') => void;
}

// Étape 4 — Upload des pièces justificatives répétiteur
const TutorDocumentsForm = ({
  previews, errors, onSelect, onRemove
}: Props) => (
  <div className="flex flex-col gap-4">
    <div>
      <h2 className="text-xl font-bold text-gray-800 mb-1">
        Pièces justificatives
      </h2>
      <p className="text-gray-400 text-sm">
        Ces documents seront vérifiés par notre équipe avant
        d'activer votre profil. Ils ne seront jamais partagés publiquement.
      </p>
    </div>

    {/* Info délai validation */}
    <div className="bg-yellow-50 border border-yellow-200
                    rounded-xl px-4 py-3 flex gap-2">
      <span className="text-yellow-500 flex-shrink-0">⏳</span>
      <p className="text-xs text-yellow-700">
        La validation de votre dossier prend généralement
        <strong> 24 à 48 heures</strong>. Vous serez notifié par
        SMS et email une fois votre profil activé.
      </p>
    </div>

    {/* Zones d'upload */}
    <div className="flex flex-col gap-3">

      {/* CNI — obligatoire */}
      <DocumentUploadZone
        type="cni"
        label="Carte Nationale d'Identité (CNI)"
        description="Recto + verso · JPG, PNG ou PDF · Max 5 Mo"
        icon="🪪"
        accept="image/jpeg,image/png,application/pdf"
        preview={previews.cni}
        error={errors.cni}
        onSelect={onSelect}
        onRemove={onRemove}
      />

      {/* Diplôme — obligatoire */}
      <DocumentUploadZone
        type="diploma"
        label="Diplôme universitaire"
        description="Licence, Master ou équivalent · PDF ou image · Max 5 Mo"
        icon="📜"
        accept="image/jpeg,image/png,application/pdf"
        preview={previews.diploma}
        error={errors.diploma}
        onSelect={onSelect}
        onRemove={onRemove}
      />

      {/* Photo de profil — obligatoire */}
      <DocumentUploadZone
        type="photo"
        label="Photo de profil"
        description="Photo récente, fond neutre · JPG ou PNG · Max 2 Mo"
        icon="📷"
        accept="image/jpeg,image/png"
        preview={previews.photo}
        error={errors.photo}
        onSelect={onSelect}
        onRemove={onRemove}
      />
    </div>

    {/* Note confidentialité */}
    <p className="text-xs text-gray-400 text-center">
      🔒 Vos documents sont chiffrés et stockés de façon sécurisée.
      Ils seront supprimés si votre candidature est refusée.
    </p>
  </div>
);

export default TutorDocumentsForm;