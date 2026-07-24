import { StudentPayment } from '../../../types/studentPayment.types';
import PaymentStatusBadge from './PaymentStatusBadge';

interface Props {
  payments: StudentPayment[];
  onDownloadReceipt: (id: string) => void;
}

const PaymentsTable = ({ payments, onDownloadReceipt }: Props) => (
  <div className="bg-white rounded-xl shadow-sm overflow-hidden">
    <table className="w-full text-sm">
      <thead>
        <tr className="bg-[#1a2744] text-white text-xs uppercase">
          {['Réf.', 'Description', 'Type', 'Date',
            'Montant', 'Opérateur', 'Statut', 'Reçu'].map(h => (
            <th key={h} className="text-left px-4 py-3 font-semibold">
              {h}
            </th>
          ))}
        </tr>
      </thead>
      <tbody>
        {payments.length === 0 ? (
          <tr>
            <td colSpan={8} className="text-center py-10 text-gray-400">
              Aucune transaction trouvée
            </td>
          </tr>
        ) : payments.map((p, i) => (
          <tr
            key={p.id}
            className={`border-t border-gray-50
              ${i % 2 === 0 ? 'bg-white' : 'bg-gray-50/40'}`}
          >
            {/* Référence */}
            <td className="px-4 py-3 font-mono text-xs text-gray-400">
              {p.reference}
            </td>

            {/* Description */}
            <td className="px-4 py-3">
              <p className="font-medium text-gray-800 text-xs">
                {p.description}
              </p>
              <p className="text-xs text-gray-400">{p.tutorName}</p>
            </td>

            {/* Type */}
            <td className="px-4 py-3">
              <span className={`text-xs font-bold px-2 py-0.5 rounded-full
                ${p.type === 'groupe'
                  ? 'bg-purple-100 text-purple-700'
                  : 'bg-blue-100 text-blue-700'
                }`}>
                {p.type === 'groupe' ? '👥 Groupe' : '👤 Individuel'}
              </span>
            </td>

            {/* Date */}
            <td className="px-4 py-3 text-gray-500 text-xs">
              {p.date}<br />{p.time}
            </td>

            {/* Montant */}
            <td className="px-4 py-3 font-bold text-gray-800">
              {p.amount.toLocaleString()} F
            </td>

            {/* Opérateur */}
            <td className="px-4 py-3">
              <span className="text-xs">
                {p.operator === 'MTN' ? '📱 MTN' : '🟠 Orange'}
              </span>
            </td>

            {/* Statut */}
            <td className="px-4 py-3">
              <PaymentStatusBadge status={p.status} />
            </td>

            {/* Reçu */}
            <td className="px-4 py-3">
              {p.status === 'reussi' && (
                <button
                  onClick={() => onDownloadReceipt(p.id)}
                  className="text-xs text-blue-600 hover:text-blue-800
                             border border-blue-200 px-2 py-1 rounded
                             cursor-pointer hover:bg-blue-50
                             transition-colors"
                >
                  📄 PDF
                </button>
              )}
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  </div>
);

export default PaymentsTable;