import { ReportPeriod, ReportFilters } from '../../types/adminReports.types';

interface Props {
  filters: ReportFilters;
  onChange: (f: ReportFilters) => void;
  onExport: () => void;
}

// Boutons de sélection de période
const periods: { label: string; value: ReportPeriod }[] = [
  { label: '7 jours',  value: '7j'  },
  { label: '30 jours', value: '30j' },
  { label: '3 mois',   value: '3m'  },
  { label: '6 mois',   value: '6m'  },
  { label: '1 an',     value: '1an' },
];

const ReportPeriodSelector = ({ filters, onChange, onExport }: Props) => (
  <div className="bg-white rounded-xl shadow-sm p-4
                  flex flex-wrap gap-3 items-center justify-between">

    {/* Boutons période */}
    <div className="flex gap-2 flex-wrap">
      {periods.map(p => (
        <button
          key={p.value}
          onClick={() => onChange({ ...filters, period: p.value })}
          className={`px-4 py-2 rounded-lg text-sm font-medium
                      cursor-pointer transition-colors
                      ${filters.period === p.value
                        ? 'bg-blue-800 text-white'
                        : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                      }`}
        >
          {p.label}
        </button>
      ))}
    </div>

    {/* Filtres + Export */}
    <div className="flex gap-2 flex-wrap items-center">
      {/* Filtre matière */}
      <input
        placeholder="📚 Matière..."
        value={filters.subject}
        onChange={e => onChange({ ...filters, subject: e.target.value })}
        className="border border-gray-200 rounded-lg px-3 py-2
                   text-sm focus:outline-none focus:ring-2 focus:ring-blue-300"
      />

      {/* Filtre quartier */}
      <input
        placeholder="📍 Quartier..."
        value={filters.quartier}
        onChange={e => onChange({ ...filters, quartier: e.target.value })}
        className="border border-gray-200 rounded-lg px-3 py-2
                   text-sm focus:outline-none focus:ring-2 focus:ring-blue-300"
      />

      {/* Bouton export CSV */}
      <button
        onClick={onExport}
        className="bg-yellow-500 hover:bg-yellow-600 text-white
                   font-bold px-4 py-2 rounded-lg text-sm
                   cursor-pointer transition-colors flex items-center gap-2"
      >
        📥 Exporter CSV
      </button>
    </div>
  </div>
);

export default ReportPeriodSelector;