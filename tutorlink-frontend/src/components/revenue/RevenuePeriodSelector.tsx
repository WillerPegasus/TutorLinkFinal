import { RevenuePeriod } from '../../types/revenue.types';

interface Props {
  period: RevenuePeriod;
  onChange: (p: RevenuePeriod) => void;
  onExport: () => void;
}

const periods: { label: string; value: RevenuePeriod }[] = [
  { label: '7 jours',  value: '7j'  },
  { label: '30 jours', value: '30j' },
  { label: '3 mois',   value: '3m'  },
  { label: '6 mois',   value: '6m'  },
  { label: '1 an',     value: '1an' },
];

const RevenuePeriodSelector = ({ period, onChange, onExport }: Props) => (
  <div className="bg-white rounded-xl shadow-sm p-4
                  flex flex-wrap gap-3 items-center justify-between">

    {/* Boutons période */}
    <div className="flex gap-2 flex-wrap">
      {periods.map(p => (
        <button
          key={p.value}
          onClick={() => onChange(p.value)}
          className={`px-4 py-2 rounded-lg text-sm font-medium
                      cursor-pointer transition-colors
                      ${period === p.value
                        ? 'bg-[#1a2744] text-white'
                        : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                      }`}
        >
          {p.label}
        </button>
      ))}
    </div>

    {/* Bouton export CSV */}
    <button
      onClick={onExport}
      className="bg-yellow-400 hover:bg-yellow-500 text-gray-900
                 font-bold px-4 py-2 rounded-lg text-sm
                 cursor-pointer transition-colors flex items-center gap-2"
    >
      📥 Exporter CSV
    </button>
  </div>
);

export default RevenuePeriodSelector;