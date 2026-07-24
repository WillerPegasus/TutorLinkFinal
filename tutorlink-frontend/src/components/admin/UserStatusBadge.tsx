import { UserStatus } from '../../types/adminUser.types';

interface Props { status: UserStatus; }

// Couleurs associées à chaque statut
const config: Record<UserStatus, { label: string; bg: string; color: string }> = {
  actif:     { label: 'Actif',      bg: '#E8F5E9', color: '#2E7D32' },
  suspendu:  { label: 'Suspendu',   bg: '#FFEBEE', color: '#C62828' },
  a_valider: { label: 'À valider',  bg: '#FFF3E0', color: '#E65100' },
};

const UserStatusBadge = ({ status }: Props) => {
  const { label, bg, color } = config[status];
  return (
    <span style={{
      background: bg, color, padding: '3px 12px',
      borderRadius: 20, fontSize: 11, fontWeight: 'bold',
    }}>
      {label}
    </span>
  );
};

export default UserStatusBadge;