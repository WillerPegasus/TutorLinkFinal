import { GroupFilters } from '../../types/group.types';

interface Props {
  filters: GroupFilters;
  onChange: (f: GroupFilters) => void;
}

const subjects = ['Mathématiques', 'Physique-Chimie', 'Anglais', 'Français', 'SVT', 'Informatique'];
const levels = ['Primaire', '3ème', 'Seconde', 'Première', 'Terminale C/D', 'Terminale D'];
const quartiers = ['Centre Dschang', 'Foto', 'Ngui', 'Bafoussam Road', 'Tsinkop', 'Foréké'];
const prices = [5000, 6000, 7000, 8000];

const GroupFilterBar = ({ filters, onChange }: Props) => (
  <div className="bg-white rounded-xl shadow-sm p-5 mb-6">
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">

      {/* Matière */}
      <div>
        <label className="text-xs text-gray-500 font-semibold uppercase mb-1 block">
          Matière
        </label>
        <select
          value={filters.subject}
          onChange={e => onChange({ ...filters, subject: e.target.value })}
          className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-300"
        >
          <option value="">Toutes les matières</option>
          {subjects.map(s => <option key={s} value={s}>{s}</option>)}
        </select>
      </div>

      {/* Niveau */}
      <div>
        <label className="text-xs text-gray-500 font-semibold uppercase mb-1 block">
          Niveau
        </label>
        <select
          value={filters.level}
          onChange={e => onChange({ ...filters, level: e.target.value })}
          className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-300"
        >
          <option value="">Tous</option>
          {levels.map(l => <option key={l} value={l}>{l}</option>)}
        </select>
      </div>

      {/* Quartier */}
      <div>
        <label className="text-xs text-gray-500 font-semibold uppercase mb-1 block">
          Quartier
        </label>
        <select
          value={filters.quartier}
          onChange={e => onChange({ ...filters, quartier: e.target.value })}
          className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-300"
        >
          <option value="">Tous</option>
          {quartiers.map(q => <option key={q} value={q}>{q}</option>)}
        </select>
      </div>

      {/* Prix mensuel */}
      <div>
        <label className="text-xs text-gray-500 font-semibold uppercase mb-1 block">
          Prix mensuel
        </label>
        <select
          value={filters.maxPrice ?? ''}
          onChange={e => onChange({ ...filters, maxPrice: e.target.value ? Number(e.target.value) : null })}
          className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-300"
        >
          <option value="">Tous</option>
          {prices.map(p => <option key={p} value={p}>Max {p.toLocaleString()} F</option>)}
        </select>
      </div>
    </div>
  </div>
);

export default GroupFilterBar;