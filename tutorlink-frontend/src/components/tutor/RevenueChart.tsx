import {
  BarChart, Bar, XAxis, YAxis,
  Tooltip, ResponsiveContainer
} from 'recharts';
import { RevenueDataPoint } from '../../types/tutor.types';

interface Props { data: RevenueDataPoint[]; }

// Graphique revenus des 6 derniers mois
const TutorRevenueChart = ({ data }: Props) => (
  <div className="bg-white rounded-xl shadow-sm p-5">
    <h3 className="font-bold text-gray-700 mb-4">
      💰 Revenus des 6 derniers mois
    </h3>
    <ResponsiveContainer width="100%" height={200}>
      <BarChart data={data}>
        <XAxis dataKey="month" tick={{ fontSize: 11 }} />
        <YAxis
          tick={{ fontSize: 10 }}
          tickFormatter={v => `${(v/1000).toFixed(0)}k`}
        />
        <Tooltip
          formatter={(v: number) => [`${v.toLocaleString()} F`, 'Revenus']}
        />
        <Bar
          dataKey="amount"
          name="Revenus"
          fill="#E9A319"
          radius={[4, 4, 0, 0]}
          label={{
            position: 'top',
            fontSize: 10,
            fill: '#666',
            formatter: (v: number) => `${(v/1000).toFixed(0)}k`,
          }}
        />
      </BarChart>
    </ResponsiveContainer>
  </div>
);

export default TutorRevenueChart;