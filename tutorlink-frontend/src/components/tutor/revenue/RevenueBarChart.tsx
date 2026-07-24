import {
  BarChart, Bar, XAxis, YAxis, Tooltip,
  Legend, ResponsiveContainer
} from 'recharts';
import { RevenueDataPoint } from '../../../types/revenue.types';

interface Props { data: RevenueDataPoint[]; }

// Graphique barres empilées — individuels + groupes
const RevenueBarChart = ({ data }: Props) => (
  <div className="bg-white rounded-xl shadow-sm p-5">
    <h3 className="font-bold text-gray-700 mb-4">
      💰 Évolution du chiffre d'affaires (FCFA)
    </h3>
    <ResponsiveContainer width="100%" height={220}>
      <BarChart data={data}>
        <XAxis dataKey="month" tick={{ fontSize: 11 }} />
        <YAxis
          tick={{ fontSize: 10 }}
          tickFormatter={v => `${(v / 1000).toFixed(0)}k`}
        />
        <Tooltip
          formatter={(v: number) => [`${v.toLocaleString()} F`]}
        />
        <Legend />
        {/* Barres empilées */}
        <Bar
          dataKey="individual"
          name="Cours individuels"
          stackId="a"
          fill="#1a2744"
          radius={[0, 0, 0, 0]}
        />
        <Bar
          dataKey="group"
          name="Groupes"
          stackId="a"
          fill="#E9A319"
          radius={[4, 4, 0, 0]}
          label={{
            position: 'top',
            fontSize: 10,
            fill: '#666',
            formatter: (v: number, entry: any) => {
              const total = entry?.individual + v;
              return `${(total / 1000).toFixed(0)}k`;
            },
          }}
        />
      </BarChart>
    </ResponsiveContainer>
  </div>
);

export default RevenueBarChart;