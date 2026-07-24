import { BarChart, Bar, XAxis, YAxis, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { MonthlyData } from '../../types/admin.types';

interface Props { data: MonthlyData[]; }

const ReservationsChart = ({ data }: Props) => (
  <div style={{
    background: 'white', borderRadius: 10, padding: 24,
    boxShadow: '0 2px 8px rgba(0,0,0,0.07)',
  }}>
    <h3 style={{ color: '#1a2744', marginBottom: 20, fontSize: 15 }}>
      📊 Activité des 6 derniers mois
    </h3>
    <ResponsiveContainer width="100%" height={220}>
      <BarChart data={data}>
        <XAxis dataKey="month" tick={{ fontSize: 12 }} />
        <YAxis tick={{ fontSize: 12 }} />
        <Tooltip />
        <Legend />
        <Bar dataKey="reservations" name="Réservations" fill="#1a2744" radius={[4,4,0,0]} />
        <Bar dataKey="inscriptions" name="Inscriptions" fill="#E9A319" radius={[4,4,0,0]} />
      </BarChart>
    </ResponsiveContainer>
  </div>
);

export default ReservationsChart;