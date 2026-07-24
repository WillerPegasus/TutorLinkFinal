interface Props {
  label: string;
  value: string;
  icon: string;
  accent: string;   // classe Tailwind couleur bordure
  sub?: string;
}

// Carte chiffre clé pour les rapports
const ReportKpiCard = ({ label, value, icon, accent, sub }: Props) => (
  <div className={`bg-white rounded-xl p-5 shadow-sm
                   border-l-4 ${accent} flex items-center gap-4`}>
    {/* Icône */}
    <div className="text-3xl w-12 h-12 rounded-xl bg-gray-50
                    flex items-center justify-center flex-shrink-0">
      {icon}
    </div>

    {/* Texte */}
    <div>
      <p className="text-xs text-gray-500 mb-1">{label}</p>
      <p className="text-2xl font-bold bg-blue-50">{value}</p>
      {sub && <p className="text-xs text-gray-400 mt-0.5">{sub}</p>}
    </div>
  </div>
);

export default ReportKpiCard;