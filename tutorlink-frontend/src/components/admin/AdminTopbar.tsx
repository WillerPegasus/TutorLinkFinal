import { useAdminAuthStore } from '../../store/adminAuthStore';
import { useNavigate } from 'react-router-dom';

const AdminTopbar = () => {
  const { adminLogout } = useAdminAuthStore();
  const navigate = useNavigate();

  const handleLogout = () => {
    adminLogout();              // vide le store
    navigate('/admin/login');   // redirige vers login
  };

  return (
    <header style={{
      height: 60, background: '#1a2744', color: 'white',
      display: 'flex', alignItems: 'center',
      justifyContent: 'space-between', padding: '0 24px'
    }}>
      <span style={{ fontWeight: 'bold', color: '#E9A319' }}>
        TutorLink — Admin
      </span>
      <button onClick={handleLogout} style={{
        background: '#E9A319', border: 'none', borderRadius: 6,
        padding: '6px 16px', cursor: 'pointer', fontWeight: 'bold'
      }}>
        Déconnexion
      </button>
    </header>
  );
};

export default AdminTopbar;