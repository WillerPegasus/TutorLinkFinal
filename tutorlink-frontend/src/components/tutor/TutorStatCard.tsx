interface Props {
  value: string | number;
  label: string;
  accent: string;
  sub?: string;
}

// Carte statistique — même logique que StudentStatCard
const TutorStatCard = ({ value, label, accent, sub }: Props) => (
  <div className={`bg-white rounded-xl p-5 shadow-sm
                   border-l-4 ${accent} flex-1`}>
    <p className="text-3xl font-bold text-gray-800">{value}</p>
    <p className="text-xs text-gray-500 uppercase mt-1 font-semibold">
      {label}
    </p>
    {sub && <p className="text-xs text-gray-300 mt-0.5">{sub}</p>}
  </div>
);

export default TutorStatCard;