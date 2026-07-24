import { useTutorRevenue } from '../../hooks/useTutorRevenue';
import RevenuePeriodSelector from '../../components/tutor/revenue/RevenuePeriodSelector';
import RevenueBarChart from '../../components/tutor/revenue/RevenueBarChart';
import RevenueTransactionsTable from '../../components/tutor/revenue/RevenueTransactionsTable';
import { useState, useEffect } from 'react';
import { getTutorGroups } from '../../services/groupService';

const TutorRevenuePage = () => {
  const {
    period, setPeriod,
    stats, chartData, transactions,
    handleExportCSV,
  } = useTutorRevenue();

  const [activeGroupsCount, setActiveGroupsCount] = useState(0);
  const [totalMembersCount, setTotalMembersCount] = useState(0);

  useEffect(() => {
    getTutorGroups().then(groups => {
      setActiveGroupsCount(groups.filter(g => g.status === 'ACTIVE').length);
      setTotalMembersCount(groups.reduce((sum, g) => sum + g.enrolledCount, 0));
    }).catch(() => {
      setActiveGroupsCount(0);
      setTotalMembersCount(0);
    });
  }, []);

  return (
    <div className="flex flex-col gap-6">

      {/* Titre */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-bold text-gray-800">
            💰 Mes revenus
          </h2>
          <p className="text-gray-400 text-sm mt-1">
            Suivi de vos revenus de groupes de répétition.
          </p>
        </div>
      </div>

      {/* ✅ BANNIÈRE MODÈLE ÉCONOMIQUE */}
      <div className="bg-[#1a2744] rounded-2xl p-5 text-white">
        <h3 className="font-bold text-base mb-3">
          💡 Votre modèle de revenus TutorLink
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {[
            {
              icon: '👤',
              title: 'Cours individuels',
              desc: 'Vos élèves vous paient DIRECTEMENT via MTN MoMo ou Orange Money. Ces revenus ne sont pas tracés ici.',
              badge: 'Hors plateforme',
              badgeColor: 'bg-yellow-400 text-gray-900',
            },
            {
              icon: '👥',
              title: 'Groupes de répétition',
              desc: 'Les cotisations mensuelles de vos groupes sont tracées ici car l\'abonnement groupe passe par la plateforme.',
              badge: 'Via TutorLink',
              badgeColor: 'bg-green-500 text-white',
            },
            {
              icon: '💳',
              title: 'Votre abonnement',
              desc: '3 000 FCFA/mois — Vous gardez 100% de vos revenus cours. Aucune commission prélevée.',
              badge: '0% commission',
              badgeColor: 'bg-blue-500 text-white',
            },
          ].map(item => (
            <div key={item.title} className="bg-blue-800 rounded-xl p-4">
              <div className="flex items-center gap-2 mb-2">
                <span className="text-xl">{item.icon}</span>
                <span className="font-bold text-sm">{item.title}</span>
                <span className={`${item.badgeColor} text-xs font-bold
                                 px-2 py-0.5 rounded-full ml-auto`}>
                  {item.badge}
                </span>
              </div>
              <p className="text-blue-200 text-xs leading-relaxed">
                {item.desc}
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* Sélecteur période */}
      <RevenuePeriodSelector
        period={period}
        onChange={setPeriod}
        onExport={handleExportCSV}
      />

      {/* Cartes stats — uniquement revenus groupes */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          {
            label: 'Revenus groupes',
            value: `${stats.totalGroupe.toLocaleString()} F`,
            sub: 'cotisations membres',
            accent: 'border-yellow-400',
          },
          {
            label: 'Groupes actifs',
            value: String(activeGroupsCount),
            sub: 'avec abonnement',
            accent: 'border-green-500',
          },
          {
            label: 'Total membres',
            value: String(totalMembersCount),
            sub: 'élèves inscrits',
            accent: 'border-blue-500',
          },
          {
            label: 'Mon abonnement',
            value: '3 000 F',
            sub: '/ mois à payer',
            accent: 'border-orange-400',
          },
        ].map(s => (
          <div key={s.label}
            className={`bg-white rounded-xl p-5 shadow-sm border-l-4 ${s.accent}`}>
            <p className="text-2xl font-bold text-gray-800">{s.value}</p>
            <p className="text-xs text-gray-500 uppercase mt-1 font-semibold">
              {s.label}
            </p>
            <p className="text-xs text-gray-300 mt-0.5">{s.sub}</p>
          </div>
        ))}
      </div>

      {/* Note revenus individuels */}
      <div className="bg-gray-50 border border-gray-200
                      rounded-xl px-5 py-4 flex gap-3">
        <span className="text-xl flex-shrink-0">📱</span>
        <div>
          <p className="font-bold text-gray-700 text-sm">
            Revenus cours individuels non tracés ici
          </p>
          <p className="text-gray-500 text-xs mt-1 leading-relaxed">
            Vos cours individuels sont payés directement par vos élèves
            sur votre numéro MTN MoMo ou Orange Money. Pensez à tenir
            votre propre registre de ces paiements.
          </p>
        </div>
      </div>

      {/* Graphique revenus groupes */}
      <RevenueBarChart data={chartData} />

      {/* Tableau — uniquement cotisations groupes */}
      <div>
        <h3 className="font-bold text-gray-700 mb-3">
          📋 Historique cotisations groupes
        </h3>
        <RevenueTransactionsTable transactions={transactions} />
      </div>
    </div>
  );
};

export default TutorRevenuePage;