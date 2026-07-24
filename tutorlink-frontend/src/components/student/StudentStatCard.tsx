interface Props {
  value: string | number;
  label: string;
  accent: string;   // couleur bordure gauche ex: 'border-yellow-400'
}

// Carte statistique rapide — même logique que AdminKpiCard
const StudentStatCard = ({ value, label, accent }: Props) => (
  <div className={`bg-white rounded-xl p-5 shadow-sm
                   border-l-4 ${accent} flex-1`}>
    <p className="text-3xl font-bold text-gray-800">{value}</p>
    <p className="text-xs text-gray-400 uppercase mt-1 font-semibold">
      {label}
    </p>
  </div>
);

export default StudentStatCard;