interface Props {
  label: string;       // ex: "Utilisateurs"
  value: string;       // ex: "1 284"
  icon: string;        // emoji ou icône
  accent: string;      // couleur de la barre latérale
  sub?: string;        // texte secondaire optionnel
}

const AdminKpiCard = ({ label, value, icon, accent, sub }: Props) => (
  <div style={{
    background: 'white', borderRadius: 10, padding: '20px 24px',
    borderLeft: `5px solid ${accent}`,
    boxShadow: '0 2px 8px rgba(0,0,0,0.07)',
    display: 'flex', alignItems: 'center', gap: 16, flex: 1,
  }}>
    {/* Icône */}
    <div style={{
      fontSize: 32, width: 52, height: 52, borderRadius: 10,
      background: `${accent}20`, display: 'flex',
      alignItems: 'center', justifyContent: 'center',
    }}>
      {icon}
    </div>

    {/* Texte */}
    <div>
      <div style={{ fontSize: 13, color: '#888', marginBottom: 4 }}>{label}</div>
      <div style={{ fontSize: 26, fontWeight: 'bold', color: '#1565C0' }}>{value}</div>
      {sub && <div style={{ fontSize: 11, color: '#aaa', marginTop: 2 }}>{sub}</div>}
    </div>
  </div>
);

export default AdminKpiCard;