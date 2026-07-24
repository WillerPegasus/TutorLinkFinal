import { ModerationAlert } from '../../types/admin.types';

interface Props { alerts: ModerationAlert[]; }

const typeIcon: Record<string, string> = {
  validation: '✅', signalement: '🚨', litige: '⚠️',
};

const ModerationAlerts = ({ alerts }: Props) => (
  <div style={{
    background: 'white', borderRadius: 10, padding: 24,
    boxShadow: '0 2px 8px rgba(0,0,0,0.07)',
  }}>
    <h3 style={{ color: '#1a2744', marginBottom: 16, fontSize: 15 }}>
      🔔 Alertes de modération
    </h3>
    {alerts.map(a => (
      <div key={a.id} style={{
        display: 'flex', alignItems: 'flex-start', gap: 12,
        padding: '10px 0', borderBottom: '1px solid #f0f0f0',
      }}>
        <span style={{ fontSize: 20 }}>{typeIcon[a.type]}</span>
        <div style={{ flex: 1 }}>
          <div style={{ fontSize: 13, color: '#333' }}>{a.message}</div>
          <div style={{ fontSize: 11, color: '#aaa', marginTop: 2 }}>{a.date}</div>
        </div>
        {/* Badge urgent */}
        {a.urgent && (
          <span style={{
            background: '#FFE5E5', color: '#D32F2F', fontSize: 10,
            padding: '2px 8px', borderRadius: 20, fontWeight: 'bold',
          }}>
            URGENT
          </span>
        )}
      </div>
    ))}
  </div>
);

export default ModerationAlerts;