import { RecentRegistration } from '../../types/admin.types';

interface Props { data: RecentRegistration[]; }

const RecentRegistrationsTable = ({ data }: Props) => (
  <div style={{
    background: 'white', borderRadius: 10, padding: 24,
    boxShadow: '0 2px 8px rgba(0,0,0,0.07)',
  }}>
    <h3 style={{ color: '#1a2744', marginBottom: 16, fontSize: 15 }}>
      👥 Inscriptions récentes
    </h3>
    <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 13 }}>
      <thead>
        <tr style={{ borderBottom: '2px solid #f0f0f0', color: '#888' }}>
          <th style={{ textAlign: 'left', padding: '8px 0' }}>Nom</th>
          <th style={{ textAlign: 'left', padding: '8px 0' }}>Rôle</th>
          <th style={{ textAlign: 'left', padding: '8px 0' }}>Date</th>
          <th style={{ textAlign: 'left', padding: '8px 0' }}>Statut</th>
        </tr>
      </thead>
      <tbody>
        {data.map(r => (
          <tr key={r.id} style={{ borderBottom: '1px solid #f5f5f5' }}>
            <td style={{ padding: '10px 0', fontWeight: 500 }}>{r.name}</td>
            <td style={{ padding: '10px 0', color: r.role === 'REPETITEUR' ? '#1565C0' : '#2196F3' }}>
              {r.role}
            </td>
            <td style={{ padding: '10px 0', color: '#888' }}>{r.date}</td>
            <td style={{ padding: '10px 0' }}>
              <span style={{
                background: r.status === 'actif' ? '#E8F5E9' : '#FFF3E0',
                color: r.status === 'actif' ? '#2E7D32' : '#E65100',
                padding: '2px 10px', borderRadius: 20, fontSize: 11, fontWeight: 'bold',
              }}>
                {r.status === 'actif' ? 'Actif' : 'En attente'}
              </span>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  </div>
);

export default RecentRegistrationsTable;