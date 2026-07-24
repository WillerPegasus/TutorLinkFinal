import { SubscriptionPayment } from '../../../types/subscription.types';

interface Props { payments: SubscriptionPayment[]; }

const statusConfig = {
  reussi:     { label: '✅ Réussi',     className: 'bg-green-100 text-green-700' },
  echoue:     { label: '❌ Échoué',     className: 'bg-red-100 text-red-700' },
  en_attente: { label: '⏳ En attente', className: 'bg-orange-100 text-orange-700' },
};

// Tableau historique des paiements d'abonnement
const SubscriptionHistoryTable = ({ payments }: Props) => (
  <div className="bg-white rounded-2xl shadow-sm overflow-hidden">
    <div className="px-5 py-4 border-b border-gray-100">
      <h3 className="font-bold text-gray-700">
        📋 Historique des paiements
      </h3>
    </div>

    {payments.length === 0 ? (
      <div className="p-8 text-center text-gray-400">
        <p>Aucun paiement enregistré</p>
      </div>
    ) : (
      <table className="w-full text-sm">
        <thead>
          <tr className="bg-gray-50 text-gray-500 text-xs uppercase">
            {['Référence', 'Période', 'Montant',
              'Opérateur', 'Date', 'Statut'].map(h => (
              <th key={h} className="text-left px-5 py-3 font-semibold">
                {h}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {payments.map((p, i) => {
            const { label, className } = statusConfig[p.status];
            return (
              <tr
                key={p.id}
                className={`border-t border-gray-50
                  ${i % 2 === 0 ? 'bg-white' : 'bg-gray-50/40'}`}
              >
                <td className="px-5 py-3 font-mono text-xs text-gray-400">
                  {p.reference}
                </td>
                <td className="px-5 py-3 font-medium text-gray-700">
                  {p.period}
                </td>
                <td className="px-5 py-3 font-bold text-gray-800">
                  {p.amount.toLocaleString()} FCFA
                </td>
                <td className="px-5 py-3">
                  <span className="text-xs">
                    {p.operator === 'MTN' ? '📱 MTN' : '🟠 Orange'}
                  </span>
                </td>
                <td className="px-5 py-3 text-gray-500 text-xs">
                  {p.date}
                </td>
                <td className="px-5 py-3">
                  <span className={`${className} text-xs font-bold
                                   px-2 py-1 rounded-full`}>
                    {label}
                  </span>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    )}
  </div>
);

export default SubscriptionHistoryTable;