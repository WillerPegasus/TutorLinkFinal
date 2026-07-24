import {
  BarChart, Bar, XAxis, YAxis, Tooltip,
  Legend, ResponsiveContainer, LineChart, Line,
} from 'recharts';
import { ChartDataPoint } from '../../types/adminReports.types';

interface Props { data: ChartDataPoint[]; }

const RevenueChart = ({ data }: Props) => (
  <div className="bg-white rounded-xl shadow-sm p-5">
    <h3 className="font-bold text-gray-700 mb-4">
      📊 Réservations & Revenus par période
    </h3>

    {/* Graphique barres — réservations et inscriptions */}
    <ResponsiveContainer width="100%" height={200}>
      <BarChart data={data}>
        <XAxis dataKey="label" tick={{ fontSize: 11 }} />
        <YAxis tick={{ fontSize: 11 }} />
        <Tooltip />
        <Legend />
        <Bar
          dataKey="reservations"
          name="Réservations"
          fill="#1565C0"
          radius={[4, 4, 0, 0]}
        />
        <Bar
          dataKey="inscriptions"
          name="Inscriptions"
          fill="#E9A319"
          radius={[4, 4, 0, 0]}
        />
      </BarChart>
    </ResponsiveContainer>

    {/* Graphique ligne — revenus */}
    <h3 className="font-bold text-gray-700 mt-6 mb-4">
      💰 Évolution des revenus (FCFA)
    </h3>
    <ResponsiveContainer width="100%" height={180}>
      <LineChart data={data}>
        <XAxis dataKey="label" tick={{ fontSize: 11 }} />
        <YAxis tick={{ fontSize: 11 }} />
        <Tooltip formatter={(v: number) => `${v.toLocaleString()} F`} />
        <Line
          type="monotone"
          dataKey="revenus"
          name="Revenus"
          stroke="#1A2744"
          strokeWidth={2}
          dot={{ fill: '#E9A319', r: 4 }}
        />
      </LineChart>
    </ResponsiveContainer>
  </div>
);

export default RevenueChart;