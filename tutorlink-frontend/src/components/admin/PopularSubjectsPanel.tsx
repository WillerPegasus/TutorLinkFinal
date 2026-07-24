interface Subject { name: string; pct: number; }
interface Props { subjects: Subject[]; }

const COLORS = ['#1a2744', '#E9A319', '#2196F3', '#9C27B0', '#FF5722'];

const PopularSubjectsPanel = ({ subjects }: Props) => (
  <div style={{
    background: 'white', borderRadius: 10, padding: 24,
    boxShadow: '0 2px 8px rgba(0,0,0,0.07)',
  }}>
    <h3 style={{ color: '#1565C0', marginBottom: 20, fontSize: 15 }}>
      📚 Matières populaires
    </h3>
    {subjects.length === 0 && (
      <p style={{ fontSize: 13, color: '#999' }}>Aucune réservation sur la période.</p>
    )}
    {subjects.map((s, i) => (
      <div key={s.name} style={{ marginBottom: 14 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 13, marginBottom: 4 }}>
          <span>{s.name}</span>
          <span style={{ fontWeight: 'bold' }}>{s.pct}%</span>
        </div>
        <div style={{ background: '#f0f0f0', borderRadius: 4, height: 8 }}>
          <div style={{
            width: `${s.pct}%`, background: COLORS[i % COLORS.length],
            height: 8, borderRadius: 4,
            transition: 'width 0.6s ease',
          }} />
        </div>
      </div>
    ))}
  </div>
);

export default PopularSubjectsPanel;
