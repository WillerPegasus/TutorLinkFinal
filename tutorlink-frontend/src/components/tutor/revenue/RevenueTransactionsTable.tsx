import { RevenueTransaction } from '../../../types/revenue.types';

interface Props { transactions: RevenueTransaction[]; }

// Config badge statut
const statusConfig = {
  recu:        { label: '✅ Reçu',        className: 'bg-green-100 text-green-700' },
  en_attente:  { label: '⏳ En attente',  className: 'bg-orange-100 text-orange-700' },
  rembourse:   { label: '↩️ Remboursé',  className: 'bg-blue-100 text-blue-700' },
};

const RevenueTransactionsTable = ({ transactions }: Props) => (
  <div className="bg-white rounded-xl shadow-sm overflow-hidden">

    {/* En-tête */}
    <div className="px-5 py-4 border-b border-gray-100">
      <h3 className="font-bold text-gray-700">
        📋 Historique des versements
      </h3>
    </div>

    {/* Tableau */}
    <table className="w-full text-sm">
      <thead>
        <tr className="bg-gray-50 text-gray-500 text-xs uppercase">
          {['Réf.', 'Élève / Groupe', 'Type', 'Date',
            'Brut', 'Commission', 'Net reçu', 'Opérateur', 'Statut'].map(h => (
            <th key={h} className="text-left px-4 py-3 font-semibold">
              {h}
            </th>
          ))}
        </tr>
      </thead>
      <tbody>
        {transactions.map((t, i) => {
          const { label, className } = statusConfig[t.status];
          return (
            <tr
              key={t.id}
              className={`border-t border-gray-50
                ${i % 2 === 0 ? 'bg-white' : 'bg-gray-50/40'}`}
            >
              {/* Référence */}
              <td className="px-4 py-3 font-mono text-xs text-gray-400">
                {t.reference}
              </td>

              {/* Élève / Groupe */}
              <td className="px-4 py-3">
                <p className="font-medium text-gray-800 text-xs">
                  {t.studentName}
                </p>
                <p className="text-xs text-gray-400">{t.subject}</p>
              </td>

              {/* Type */}
              <td className="px-4 py-3">
                <span className={`text-xs font-bold px-2 py-0.5 rounded-full
                  ${t.type === 'groupe'
                    ? 'bg-purple-100 text-purple-700'
                    : 'bg-blue-100 text-blue-700'
                  }`}>
                  {t.type === 'groupe' ? '👥 Groupe' : '👤 Individuel'}
                </span>
              </td>

              {/* Date */}
              <td className="px-4 py-3 text-gray-500 text-xs">{t.date}</td>

              {/* Montant brut */}
              <td className="px-4 py-3 text-gray-700 font-medium">
                {t.amount.toLocaleString()} F
              </td>

              {/* Commission */}
              <td className="px-4 py-3 text-red-500 text-xs">
                - {t.commission.toLocaleString()} F
              </td>

              {/* Net reçu */}
              <td className="px-4 py-3 font-bold text-green-700">
                {t.netAmount.toLocaleString()} F
              </td>

              {/* Opérateur */}
              <td className="px-4 py-3">
                <span className={`text-xs font-bold px-2 py-0.5 rounded-full
                  ${t.operator === 'MTN'
                    ? 'bg-yellow-100 text-yellow-700'
                    : 'bg-orange-100 text-orange-700'
                  }`}>
                  {t.operator === 'MTN' ? '📱 MTN' : '🟠 Orange'}
                </span>
              </td>

              {/* Statut */}
              <td className="px-4 py-3">
                <span className={`${className} text-xs font-bold
                                 px-2 py-1 rounded-full`}>
                  {label}
                </span>
              </td>
            </tr>
          );
        })}
      </tbody>

      {/* Total en bas */}
      <tfoot>
        <tr className="bg-gray-50 border-t-2 border-gray-200 font-bold">
          <td colSpan={4} className="px-4 py-3 text-gray-600 text-sm">
            Total ({transactions.length} versements)
          </td>
          <td className="px-4 py-3 text-gray-700">
            {transactions.reduce((s, t) => s + t.amount, 0).toLocaleString()} F
          </td>
          <td className="px-4 py-3 text-red-500">
            - {transactions.reduce((s, t) => s + t.commission, 0).toLocaleString()} F
          </td>
          <td className="px-4 py-3 text-green-700">
            {transactions.reduce((s, t) => s + t.netAmount, 0).toLocaleString()} F
          </td>
          <td colSpan={2} />
        </tr>
      </tfoot>
    </table>
  </div>
);

export default RevenueTransactionsTable;