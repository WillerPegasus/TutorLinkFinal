import { SavedPaymentMethod } from '../../../types/studentPayment.types';

interface Props {
  method: SavedPaymentMethod;
  onSetDefault: (id: string) => void;
  onRemove: (id: string) => void;
}

// Carte d'un moyen de paiement enregistré
const PaymentMethodCard = ({ method: m, onSetDefault, onRemove }: Props) => (
  <div className={`bg-white rounded-xl p-4 border-2 flex items-center
                   justify-between transition-colors
                   ${m.isDefault
                     ? 'border-yellow-300 bg-yellow-50'
                     : 'border-gray-100'
                   }`}>

    {/* Infos opérateur */}
    <div className="flex items-center gap-3">
      <span className="text-2xl">
        {m.operator === 'MTN' ? '📱' : '🟠'}
      </span>
      <div>
        <p className="font-bold text-gray-800 text-sm">
          {m.operator === 'MTN' ? 'MTN Mobile Money' : 'Orange Money'}
        </p>
        <p className="text-xs text-gray-500">{m.phoneNumber}</p>
      </div>
      {/* Badge par défaut */}
      {m.isDefault && (
        <span className="bg-yellow-400 text-gray-900 text-xs
                         font-bold px-2 py-0.5 rounded-full">
          Par défaut
        </span>
      )}
    </div>

    {/* Actions */}
    <div className="flex gap-2">
      {!m.isDefault && (
        <button
          onClick={() => onSetDefault(m.id)}
          className="text-xs text-blue-600 hover:text-blue-800
                     border border-blue-200 px-3 py-1.5 rounded-lg
                     cursor-pointer hover:bg-blue-50 transition-colors"
        >
          Définir par défaut
        </button>
      )}
      <button
        onClick={() => onRemove(m.id)}
        className="text-xs text-red-500 hover:text-red-700
                   border border-red-200 px-3 py-1.5 rounded-lg
                   cursor-pointer hover:bg-red-50 transition-colors"
      >
        🗑
      </button>
    </div>
  </div>
);

export default PaymentMethodCard;