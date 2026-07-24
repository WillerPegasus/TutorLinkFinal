import { UserFilters } from '../../types/adminUser.types';

interface Props {
  filters: UserFilters;
  onChange: (f: UserFilters) => void;
}

const UserFilterBar = ({ filters, onChange }: Props) => (
  <div style={{
    display: 'flex', gap: 12, flexWrap: 'wrap',
    background: 'white', padding: 16, borderRadius: 10,
    marginBottom: 16, boxShadow: '0 2px 8px rgba(0,0,0,0.07)',
  }}>
    {/* Recherche par nom ou email */}
    <input
      placeholder="🔍 Rechercher nom / email..."
      value={filters.search}
      onChange={e => onChange({ ...filters, search: e.target.value })}
      style={inputStyle}
    />

    {/* Filtre par rôle */}
    <select value={filters.role}
      onChange={e => onChange({ ...filters, role: e.target.value as UserFilters['role'] })}
      style={inputStyle}>
      <option value="TOUS">Tous les rôles</option>
      <option value="ELEVE">Élève</option>
      <option value="PARENT">Parent</option>
      <option value="REPETITEUR">Répétiteur</option>
    </select>

    {/* Filtre par statut */}
    <select value={filters.status}
      onChange={e => onChange({ ...filters, status: e.target.value as UserFilters['status'] })}
      style={inputStyle}>
      <option value="TOUS">Tous les statuts</option>
      <option value="actif">Actif</option>
      <option value="suprimer">Suspendu</option>
    </select>

    {/* Filtre par quartier */}
    <input
      placeholder="📍 Quartier..."
      value={filters.quartier}
      onChange={e => onChange({ ...filters, quartier: e.target.value })}
      style={inputStyle}
    />

    {/* Bouton réinitialiser */}
    <button onClick={() => onChange({ search: '', role: 'TOUS', status: 'TOUS', quartier: '' })}
      style={{
        background: '#f5f5f5', border: '1px solid #ddd', borderRadius: 8,
        padding: '8px 16px', cursor: 'pointer', fontSize: 13,
      }}>
      ✖ Réinitialiser
    </button>
  </div>
);

const inputStyle: React.CSSProperties = {
  padding: '8px 12px', border: '1px solid #ddd',
  borderRadius: 8, fontSize: 13, minWidth: 180,
};

export default UserFilterBar;