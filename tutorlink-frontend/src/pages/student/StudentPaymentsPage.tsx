import { useStudentPayments } from '../../hooks/useStudentPayments';

// Badge statut
const statusConfig = {
  reussi:     { label: '✅ Réussi',     className: 'bg-green-100 text-green-700' },
  en_attente: { label: '⏳ En attente', className: 'bg-orange-100 text-orange-700' },
  echoue:     { label: '❌ Échoué',     className: 'bg-red-100 text-red-700' },
};

const StudentPaymentsPage = () => {
  const {
    filteredPayments, filterStatus,
    setFilterStatus, stats,
  } = useStudentPayments();

  return (
    <div className="flex flex-col gap-6">

      {/* Titre */}
      <div>
        <h2 className="text-xl font-bold text-gray-800">
          💰 Mes paiements groupes
        </h2>
        <p className="text-gray-400 text-sm mt-1">
          Historique de vos cotisations mensuelles de groupes.
        </p>
      </div>

      {/* ── BANNIÈRE INFO NOUVEAU MODÈLE ── */}
      <div className="bg-blue-50 border border-blue-200
                      rounded-2xl px-5 py-4 flex gap-3">
        <span className="text-2xl flex-shrink-0">💡</span>
        <div>
          <p className="text-blue-600 text-xs mt-1 leading-relaxed">
            Les cours individuels sont payés <strong>directement
            au répétiteur</strong> via MTN MoMo ou Orange Money,
            sans passer par la plateforme. Cette page affiche
            uniquement vos <strong>cotisations mensuelles de
            groupes de répétition</strong>.
          </p>
        </div>
      </div>

      {/* Cartes statistiques */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          {
            value: `${stats.totalGroupsPayments.toLocaleString()} F`,
            label: 'Cotisations payées',
            color: 'bg-blue-50 text-blue-800',
          },
          {
            value: stats.activeGroups,
            label: 'Groupes actifs',
            color: 'bg-green-50 text-green-800',
          },
          {
            value: stats.nextPaymentDate,
            label: 'Prochain paiement',
            color: 'bg-yellow-50 text-yellow-800',
          },
          {
            value: `${stats.nextPaymentAmount.toLocaleString()} F`,
            label: 'Montant à venir',
            color: 'bg-purple-50 text-purple-800',
          },
        ].map(s => (
          <div key={s.label}
            className={`${s.color} rounded-xl p-4 text-center`}>
            <p className="text-xl font-bold">{s.value}</p>
            <p className="text-xs font-medium mt-1">{s.label}</p>
          </div>
        ))}
      </div>

      {/* Info paiement cours individuels */}
      <div className="bg-gray-50 border border-gray-200
                      rounded-2xl px-5 py-4 flex gap-3">
        <span className="text-xl flex-shrink-0">📱</span>
        <div>
          <p className="font-bold text-gray-700 text-sm">
            Comment payer vos cours individuels ?
          </p>
          <p className="text-gray-500 text-xs mt-1 leading-relaxed">
            Contactez votre répétiteur via la messagerie pour convenir
            du tarif et du moyen de paiement (MTN MoMo ou Orange Money).
            Le paiement se fait directement entre vous, sans intermédiaire.
          </p>
        </div>
      </div>

      {/* Tableau cotisations groupes */}
      <div>
        <div className="flex justify-between items-center mb-3">
          <h3 className="font-bold text-gray-700">
            📋 Historique des cotisations groupes
          </h3>
          {/* Filtres statut */}
          <div className="flex gap-2">
            {[
              { label: 'Tous', value: 'TOUS' },
              { label: 'Réussi', value: 'reussi' },
              { label: 'En attente', value: 'en_attente' },
              { label: 'Échoué', value: 'echoue' },
            ].map(opt => (
              <button
                key={opt.value}
                onClick={() => setFilterStatus(
                  opt.value as typeof filterStatus
                )}
                className={`px-3 py-1.5 rounded-lg text-xs font-medium
                            cursor-pointer transition-colors
                            ${filterStatus === opt.value
                              ? 'bg-[#1a2744] text-white'
                              : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                            }`}
              >
                {opt.label}
              </button>
            ))}
          </div>
        </div>

        {/* Tableau */}
        <div className="bg-white rounded-2xl shadow-sm overflow-hidden">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-[#1a2744] text-white text-xs uppercase">
                {['Réf.', 'Groupe', 'Répétiteur',
                  'Période', 'Montant', 'Date', 'Statut'].map(h => (
                  <th key={h}
                    className="text-left px-4 py-3 font-semibold">
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filteredPayments.length === 0 ? (
                <tr>
                  <td colSpan={7}
                    className="text-center py-10 text-gray-400">
                    Aucune cotisation trouvée
                  </td>
                </tr>
              ) : filteredPayments.map((p, i) => {
                const { label, className } = statusConfig[p.status];
                return (
                  <tr
                    key={p.id}
                    className={`border-t border-gray-50
                      ${i % 2 === 0 ? 'bg-white' : 'bg-gray-50/40'}`}
                  >
                    <td className="px-4 py-3 font-mono text-xs
                                   text-gray-400">
                      {p.reference}
                    </td>
                    <td className="px-4 py-3">
                      <p className="font-medium text-gray-800 text-xs">
                        {p.groupName}
                      </p>
                      <p className="text-xs text-gray-400">{p.subject}</p>
                    </td>
                    <td className="px-4 py-3 text-gray-600 text-xs">
                      {p.tutorName}
                    </td>
                    <td className="px-4 py-3 text-gray-600 text-xs">
                      {p.period}
                    </td>
                    <td className="px-4 py-3 font-bold text-gray-800">
                      {p.amount.toLocaleString()} F
                    </td>
                    <td className="px-4 py-3 text-gray-500 text-xs">
                      {p.date}
                    </td>
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
          </table>
        </div>
      </div>
    </div>
  );
};

export default StudentPaymentsPage;