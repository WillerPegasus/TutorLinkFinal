import { useState } from 'react';
import { SubscriptionOperator } from '../../../types/subscription.types';

interface Props {
  onPay: (operator: SubscriptionOperator, phoneNumber?: string) => void;
  onClose: () => void;
  loading: boolean;
  success: boolean;
  monthlyPrice: number;
  error?: string | null;
}

// Modal paiement abonnement via Mobile Money
const SubscriptionPaymentModal = ({
  onPay, onClose, loading, success, monthlyPrice, error
}: Props) => {
  const [phoneNumber, setPhoneNumber] = useState('');

  return (
    <div
      onClick={!loading ? onClose : undefined}
      className="fixed inset-0 bg-black/50 z-50
                 flex items-center justify-center p-4"
    >
      <div
        onClick={e => e.stopPropagation()}
        className="bg-white rounded-2xl w-full max-w-md
                   shadow-2xl overflow-hidden"
      >
        {/* En-tête */}
        <div className="bg-[#1a2744] text-white px-6 py-4">
          <h3 className="font-bold text-lg">💳 Payer mon abonnement</h3>
          <p className="text-blue-300 text-sm">
            TutorLink — Abonnement mensuel répétiteur
          </p>
        </div>

        <div className="p-6">

          {/* Succès */}
          {success ? (
            <div className="text-center py-4">
              <div className="text-5xl mb-3">✅</div>
              <h4 className="font-bold text-green-700 text-lg">
                Paiement réussi !
              </h4>
              <p className="text-gray-500 text-sm mt-1">
                Votre abonnement est actif pour 30 jours.
                Vous pouvez continuer à recevoir des élèves.
              </p>
            </div>
          ) : (
            <>
              {/* Montant */}
              <div className="bg-yellow-50 rounded-xl p-4 text-center mb-5">
                <p className="text-xs text-yellow-600 uppercase font-semibold mb-1">
                  Montant à payer
                </p>
                <p className="text-3xl font-bold text-yellow-700">
                  {monthlyPrice.toLocaleString()} FCFA
                </p>
                <p className="text-xs text-yellow-500 mt-1">
                  Abonnement mensuel TutorLink
                </p>
              </div>

              {/* Erreur */}
              {error && (
                <div className="bg-red-50 border border-red-200 rounded-xl px-4 py-3 mb-4">
                  <p className="text-xs text-red-700">{error}</p>
                </div>
              )}

              {/* Numéro de téléphone (requis pour MTN MoMo) */}
              <div className="mb-4">
                <label className="text-xs font-semibold text-gray-500 uppercase">
                  Numéro Mobile Money (MTN)
                </label>
                <input
                  type="tel"
                  value={phoneNumber}
                  onChange={e => setPhoneNumber(e.target.value)}
                  placeholder="6XXXXXXXX"
                  disabled={loading}
                  className="w-full mt-1 border border-gray-200 rounded-xl
                             px-4 py-2.5 text-sm focus:outline-none
                             focus:ring-2 focus:ring-blue-200"
                />
              </div>

              {/* Boutons opérateurs */}
              <div className="flex flex-col gap-3">
                <button
                  disabled={loading || !phoneNumber.trim()}
                  onClick={() => onPay('MTN', phoneNumber.trim())}
                  className="w-full bg-yellow-400 hover:bg-yellow-500
                             disabled:opacity-50 disabled:cursor-not-allowed
                             text-[#1a2744] font-bold py-3 rounded-xl
                             cursor-pointer transition-colors"
                >
                  {loading ? 'Paiement en cours...' : '📱 Payer avec MTN MoMo'}
                </button>

                <button
                  disabled={loading}
                  onClick={() => onPay('Orange')}
                  className="w-full bg-orange-400 hover:bg-orange-500
                             disabled:opacity-50 disabled:cursor-not-allowed
                             text-white font-bold py-3 rounded-xl
                             cursor-pointer transition-colors"
                >
                  {loading ? 'Redirection...' : '🟠 Payer avec Orange Money'}
                </button>

                <p className="text-xs text-gray-400 text-center mt-1">
                  Orange Money vous redirigera vers une page de paiement sécurisée.
                </p>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default SubscriptionPaymentModal;
