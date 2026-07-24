import { AdminUserItem } from '../../types/adminUser.types';
import UserActionsMenu from './UserActionsMenu';

interface Props {
  users: AdminUserItem[];
  onDelete: (id: string) => void;
}

const roleColor: Record<string, string> = {
  ELEVE: '#2196F3', PARENT: '#9C27B0', REPETITEUR: '#E9A319',
};

const UsersTable = ({ users, onDelete }: Props) => (
  <div style={{
    background: 'white', borderRadius: 10,
    boxShadow: '0 2px 8px rgba(0,0,0,0.07)', overflow: 'hidden',
  }}>
    <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 13 }}>
      <thead>
        <tr style={{ background: '#1a2744', color: 'white' }}>
          {['Nom', 'Email', 'Téléphone', 'Rôle', 'Quartier', 'Actions'].map(h => (
            <th key={h} style={{ padding: '12px 16px', textAlign: 'left', fontWeight: 600 }}>{h}</th>
          ))}
        </tr>
      </thead>
      <tbody>
        {users.length === 0 ? (
          <tr>
            <td colSpan={6} style={{ textAlign: 'center', padding: 32, color: '#aaa' }}>
              Aucun utilisateur trouvé
            </td>
          </tr>
        ) : (
          users.map((u, i) => (
            <tr key={u.id} style={{ background: i % 2 === 0 ? '#fafafa' : 'white', borderBottom: '1px solid #f0f0f0' }}>
              <td style={{ padding: '12px 16px', fontWeight: 500 }}>{u.name}</td>
              <td style={{ padding: '12px 16px', color: '#555' }}>{u.email}</td>
              <td style={{ padding: '12px 16px', color: '#555' }}>{u.phone}</td>
              <td style={{ padding: '12px 16px' }}>
                <span style={{ color: roleColor[u.role], fontWeight: 'bold', fontSize: 11 }}>{u.role}</span>
              </td>
              <td style={{ padding: '12px 16px', color: '#555' }}>{u.quartier}</td>
              <td style={{ padding: '12px 16px' }}>
                <UserActionsMenu user={u} onDelete={onDelete} />
              </td>
            </tr>
          ))
        )}
      </tbody>
    </table>
  </div>
);

export default UsersTable;
