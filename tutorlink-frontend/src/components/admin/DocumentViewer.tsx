interface Props {
  url: string;
  onClose: () => void;
}

// Visionneuse plein écran pour examiner CNI et diplômes
const DocumentViewer = ({ url, onClose }: Props) => (
  <div
    onClick={onClose}
    className="fixed inset-0 bg-black/80 flex items-center
               justify-center z-50 p-4"
  >
    <div
      onClick={e => e.stopPropagation()}
      className="bg-white rounded-xl overflow-hidden max-w-3xl
                 w-full max-h-[90vh] flex flex-col"
    >
      {/* Barre du haut */}
      <div className="flex justify-between items-center
                      bg-gray-100 px-4 py-3">
        <span className="text-sm font-semibold text-gray-700">
          Visionneuse de document
        </span>
        <button
          onClick={onClose}
          className="text-gray-500 hover:text-red-500
                     text-xl font-bold cursor-pointer"
        >
          ✖
        </button>
      </div>

      {/* Contenu — image ou PDF selon l'extension */}
      <div className="flex-1 overflow-auto p-4">
        {url.endsWith('.pdf') ? (
          <iframe
            src={url}
            className="w-full h-[70vh]"
            title="Document PDF"
          />
        ) : (
          <img
            src={url}
            alt="Document"
            className="w-full object-contain rounded"
          />
        )}
      </div>
    </div>
  </div>
);

export default DocumentViewer;