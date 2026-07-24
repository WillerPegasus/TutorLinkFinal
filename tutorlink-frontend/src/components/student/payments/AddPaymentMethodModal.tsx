import { useState } from 'react';

interface Props {
  onAdd: (operator: 'MTN' | 'Orange', phoneNumber: string) => void;
  onClose: () => void;
}

// Modal d'ajout d'un nouveau moyen de paiement
const AddPaymentMethodModal = ({ onAdd, onClose }: Props) => {
  const [operator, setOperator] = useState<'MTN' | 'Orange' | null>(null);
  const [phoneNumber, setPhoneNumber] = useState('');

  const handleSubmit = () => {
    if (!operator || phoneNumber.length < 9) return;
    onAdd(operator, phoneNumber);
  };

  return (
    <div
      onClick={onClose}
      className="fixed inset-0 bg-black/50 z-50
                 flex items-center justify-center p-4"
    >
      <div
        onClick={e => e.stopPropagation()}
        className="bg-white rounded-xl w-full max-w-md
                   shadow-2xl overflow-hidden"
      >
        {/* En-tête */}
        <div className="bg-[#1a2744] text-white px-6 py-4
                        flex justify-between items-center">
          <h3 className="font-bold">+ Ajouter un moyen de paiement</h3>
          <button
            onClick={onClose}
            className="text-white hover:text-yellow-400
                       cursor-pointer bg-transparent border-none text-xl"
          >
            ✖
          </button>
        </div>

        {/* Corps */}
        <div className="p-6 flex flex-col gap-4">

          {/* Choix opérateur */}
          <div>
            <label className="text-xs text-gray-500 font-semibold
                              uppercase mb-2 block">
              Opérateur
            </label>
            <div className="grid grid-cols-2 gap-3">
              <button
                onClick={() => setOperator('MTN')}
                className={`flex flex-col items-center gap-2
                           border-2 rounded-xl py-4
                           cursor-pointer transition-all
                           ${operator === 'MTN'
                             ? 'border-yellow-400 bg-yellow-50'
                             : 'border-gray-200 hover:border-yellow-300'
                           }`}
              >
                <span className="text-2xl">📱</span>
                <span className="text-sm font-bold">MTN Mobile Money</span>
              </button>
              <button
                onClick={() => setOperator('Orange')}
                className={`flex flex-col items-center gap-2
                           border-2 rounded-xl py-4
                           cursor-pointer transition-all
                           ${operator === 'Orange'
                             ? 'border-orange-400 bg-orange-50'
                             : 'border-gray-200 hover:border-orange-300'
                           }`}
              >
                <span className="text-2xl">🟠</span>
                <span className="text-sm font-bold">Orange Money</span>
              </button>
            </div>
          </div>

          {/* Numéro de téléphone */}
          <div>
            <label className="text-xs text-gray-500 font-semibold
                              uppercase mb-1 block">
              Numéro de téléphone
            </label>
            <input
              type="tel"
              value={phoneNumber}
              onChange={e => setPhoneNumber(e.target.value)}
              placeholder="6XX XX XX XX"
              maxLength={9}
              className="w-full border border-gray-200 rounded-lg
                         px-3 py-2.5 text-sm focus:outline-none
                         focus:ring-2 focus:ring-blue-300"
            />
          </div>

          {/* Bouton valider */}
          <button
            onClick={handleSubmit}
            disabled={!operator || phoneNumber.length < 9}
            className="w-full bg-[#1a2744] hover:bg-blue-900
                       text-white font-bold py-3 rounded-xl
                       cursor-pointer transition-colors
                       disabled:opacity-40 disabled:cursor-not-allowed"
          >
            ✅ Ajouter ce moyen de paiement
          </button>
        </div>
      </div>
    </div>
  );
};

export default AddPaymentMethodModal;