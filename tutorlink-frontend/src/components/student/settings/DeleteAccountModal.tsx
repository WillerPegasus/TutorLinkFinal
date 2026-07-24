interface Props {
  onConfirm: () => void;
  onCancel: () => void;
}

// Modal de confirmation suppression définitive
const DeleteAccountModal = ({ onConfirm, onCancel }: Props) => (
  <div
    onClick={onCancel}
    className="fixed inset-0 bg-black/50 z-50
               flex items-center justify-center p-4"
  >
    <div
      onClick={e => e.stopPropagation()}
      className="bg-white rounded-xl w-full max-w-md
                 shadow-2xl p-6 text-center"
    >
      <p className="text-4xl mb-4">⚠️</p>
      <h3 className="font-bold text-gray-800 text-lg mb-2">
        Supprimer définitivement votre compte ?
      </h3>
      <p className="text-sm text-gray-500 mb-6">
        Cette action est irréversible. Toutes vos réservations,
        groupes, avis et historiques de paiement seront supprimés.
      </p>
      <div className="flex gap-3">
        <button
          onClick={onCancel}
          className="flex-1 border border-gray-200 text-gray-600
                     py-2.5 rounded-xl hover:bg-gray-50
                     cursor-pointer transition-colors"
        >
          Annuler
        </button>
        <button
          onClick={onConfirm}
          className="flex-1 bg-red-600 hover:bg-red-700 text-white
                     font-bold py-2.5 rounded-xl
                     cursor-pointer transition-colors"
        >
          Oui, supprimer
        </button>
      </div>
    </div>
  </div>
);

export default DeleteAccountModal;