import { useRef } from 'react';
import { DocumentPreview } from '../../types/register.types';

interface Props {
  type: 'cni' | 'diploma' | 'photo';
  label: string;
  description: string;
  icon: string;
  accept: string;           // types de fichiers acceptés
  preview: DocumentPreview | null;
  error?: string;
  onSelect: (type: 'cni' | 'diploma' | 'photo', file: File) => void;
  onRemove: (type: 'cni' | 'diploma' | 'photo') => void;
}

// Zone d'upload d'un document avec aperçu
const DocumentUploadZone = ({
  type, label, description, icon, accept,
  preview, error, onSelect, onRemove,
}: Props) => {
  const inputRef = useRef<HTMLInputElement>(null);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) onSelect(type, file);
  };

  return (
    <div className={`border-2 rounded-xl p-4 transition-colors
      ${preview
        ? 'border-green-300 bg-green-50'
        : error
          ? 'border-red-300 bg-red-50'
          : 'border-dashed border-gray-200 hover:border-blue-300 bg-gray-50'
      }`}>

      {preview ? (
        /* Aperçu du document sélectionné */
        <div className="flex items-center gap-3">
          {/* Miniature si image */}
          {preview.file.type.startsWith('image/') ? (
            <img
              src={preview.url}
              alt={label}
              className="w-16 h-16 object-cover rounded-lg flex-shrink-0"
            />
          ) : (
            <div className="w-16 h-16 bg-blue-100 rounded-lg
                            flex items-center justify-center
                            text-3xl flex-shrink-0">
              📄
            </div>
          )}
          <div className="flex-1 min-w-0">
            <p className="text-sm font-bold text-green-700">
              ✅ {label}
            </p>
            <p className="text-xs text-gray-500 truncate">{preview.name}</p>
            <p className="text-xs text-gray-400">
              {(preview.file.size / 1024).toFixed(0)} Ko
            </p>
          </div>
          {/* Supprimer */}
          <button
            onClick={() => onRemove(type)}
            className="text-red-400 hover:text-red-600
                       cursor-pointer transition-colors text-lg"
          >
            ✖
          </button>
        </div>
      ) : (
        /* Zone de dépôt */
        <div
          className="flex flex-col items-center gap-2 py-2 cursor-pointer"
          onClick={() => inputRef.current?.click()}
        >
          <span className="text-3xl">{icon}</span>
          <div className="text-center">
            <p className="text-sm font-bold text-gray-700">{label}</p>
            <p className="text-xs text-gray-400">{description}</p>
          </div>
          <button
            onClick={e => {
              e.stopPropagation();
              inputRef.current?.click();
            }}
            className="bg-[#1a2744] hover:bg-blue-900 text-white
                       text-xs font-bold px-4 py-2 rounded-lg
                       cursor-pointer transition-colors"
          >
            📁 Choisir le fichier
          </button>
        </div>
      )}

      {/* Input file caché */}
      <input
        ref={inputRef}
        type="file"
        accept={accept}
        onChange={handleChange}
        className="hidden"
      />

      {/* Message d'erreur */}
      {error && !preview && (
        <p className="text-red-500 text-xs mt-2 text-center">{error}</p>
      )}
    </div>
  );
};

export default DocumentUploadZone;