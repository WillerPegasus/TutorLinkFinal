import { AdminUserItem } from '../../types/adminUser.types';
import UserStatusBadge from './UserStatusBadge';

interface Props {
  user: AdminUserItem;
  onClose: () => void;
  onDelete: (id: string) => void;
}

const UserDetailsModal = ({ user, onClose, onDelete }: Props) => (
  // Fond semi-transparent
  <div onClick={onClose} style={{
    position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.5)',
    display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 100,
  }}>
    {/* Carte modale — stopPropagation évite la fermeture au clic intérieur */}
    <div onClick={e => e.stopPropagation()} style={{
      background: 'white', borderRadius: 12, padding: 32,
      width: 480, boxShadow: '0 8px 32px rgba(0,0,0,0.2)',
    }}>
      {/* En-tête */}
      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 24 }}>
        <h3 style={{ color: '#1a2744', margin: 0 }}>Fiche utilisateur</h3>
        <button onClick={onClose} style={{ background: 'none', border: 'none', fontSize: 20, cursor: 'pointer' }}>✖</button>
      </div>

      {/* Infos */}
      {[
        ['Nom', user.name],
        ['Email', user.email],
        ['Téléphone', user.phone],
        ['Rôle', user.role],
        ['Quartier', user.quartier],
        ['Inscrit le', user.createdAt],
        ['Dernière connexion', user.lastLogin],
      ].map(([label, value]) => (
        <div key={label} style={{ display: 'flex', justifyContent: 'space-between', padding: '8px 0', borderBottom: '1px solid #f0f0f0' }}>
          <span style={{ color: '#888', fontSize: 13 }}>{label}</span>
          <span style={{ fontWeight: 500, fontSize: 13 }}>{value}</span>
        </div>
      ))}

      {/* Statut */}
      <div style={{ display: 'flex', justifyContent: 'space-between', padding: '12px 0' }}>
        <span style={{ color: '#888', fontSize: 13 }}>Statut</span>
        <UserStatusBadge status={user.status} />
      </div>

      {/* Bouton supprimer */}
      <button onClick={() => {
        if (window.confirm(`Supprimer définitivement ${user.name} ?`)) onDelete(user.id);
      }} style={{
        width: '100%', marginTop: 16, padding: 12,
        background: '#D32F2F', color: 'white', border: 'none',
        borderRadius: 8, fontWeight: 'bold', cursor: 'pointer',
      }}>
        🗑 Supprimer ce compte
      </button>
    </div>
  </div>
);

export default UserDetailsModal;