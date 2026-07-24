import { RevenueStats } from '../../../types/revenue.types';

interface Props { stats: RevenueStats; }

const RevenueStatsCards = ({ stats }: Props) => (
  <div className="grid grid-cols-2 lg:grid-cols-3 gap-4">

    {/* Total brut */}
    <div className="bg-white rounded-xl shadow-sm p-5 border-l-4 border-yellow-400">
      <p className="text-xs text-gray-400 uppercase font-semibold mb-1">
        Revenus bruts
      </p>
      <p className="text-2xl font-bold text-gray-800">
        {stats.totalBrut.toLocaleString()} F
      </p>
      <p className={`text-xs mt-1 font-medium
        ${stats.evolution >= 0 ? 'text-green-500' : 'text-red-500'}`}>
        {stats.evolution >= 0 ? '▲' : '▼'} {Math.abs(stats.evolution)}%
        vs mois dernier
      </p>
    </div>

    {/* Commission TutorLink */}
    <div className="bg-white rounded-xl shadow-sm p-5 border-l-4 border-red-300">
      <p className="text-xs text-gray-400 uppercase font-semibold mb-1">
        Commission TutorLink (10%)
      </p>
      <p className="text-2xl font-bold text-gray-800">
        - {stats.totalCommission.toLocaleString()} F
      </p>
      <p className="text-xs text-gray-400 mt-1">
        Prélevée automatiquement
      </p>
    </div>

    {/* Net reçu */}
    <div className="bg-[#1a2744] rounded-xl shadow-sm p-5">
      <p className="text-xs text-blue-300 uppercase font-semibold mb-1">
        Net reçu sur Mobile Money
      </p>
      <p className="text-2xl font-bold text-yellow-400">
        {stats.totalNet.toLocaleString()} F
      </p>
      <p className="text-xs text-blue-300 mt-1">
        FCFA versés sur votre compte
      </p>
    </div>

    {/* Cours individuels */}
    <div className="bg-white rounded-xl shadow-sm p-5 border-l-4 border-blue-400">
      <p className="text-xs text-gray-400 uppercase font-semibold mb-1">
        Cours individuels
      </p>
      <p className="text-2xl font-bold text-gray-800">
        {stats.totalIndividuel.toLocaleString()} F
      </p>
    </div>

    {/* Groupes */}
    <div className="bg-white rounded-xl shadow-sm p-5 border-l-4 border-purple-400">
      <p className="text-xs text-gray-400 uppercase font-semibold mb-1">
        Groupes de répétition
      </p>
      <p className="text-2xl font-bold text-gray-800">
        {stats.totalGroupe.toLocaleString()} F
      </p>
    </div>

    {/* Part groupes */}
    <div className="bg-white rounded-xl shadow-sm p-5 border-l-4 border-green-400">
      <p className="text-xs text-gray-400 uppercase font-semibold mb-1">
        Part des groupes
      </p>
      <p className="text-2xl font-bold text-gray-800">
        {Math.round((stats.totalGroupe / stats.totalBrut) * 100)}%
      </p>
      <p className="text-xs text-gray-400 mt-1">
        du total des revenus
      </p>
    </div>
  </div>
);

export default RevenueStatsCards;