import { NavLink, useNavigate } from 'react-router-dom';
import { useAuthStore } from '@/store/authStore';

// Menu de navigation de l'espace élève
const links = [
  { label: '📊 Tableau de bord',   path: '/eleve/dashboard' },
  { label: '🔍 Trouver un répétiteur', path: '/eleve/repetiteurs' },
  { label: '📅 Mes réservations',  path: '/mes-reservations' },
  { label: '👥 Mes groupes',       path: '/mes-groupes' },
  { label: '💬 Messagerie',        path: '/messagerie' },
  { label: '⭐ Mes avis',          path: '/mes-avis' },
  { label: '⚙️ Paramètres',        path: '/parametres' },
];

const StudentSidebar = () => {
  const navigate = useNavigate();
  const user = useAuthStore((s) => s.user);
  const logout = useAuthStore((s) => s.logout);

  const handleLogout = () => {
    logout();
    navigate('/connexion', { replace: true });
  };

  return (
    <aside className="w-56 bg-[#1a2744] min-h-screen flex flex-col flex-shrink-0">

      {/* Profil élève */}
      <div className="p-5 border-b border-blue-800">
        <div className="w-12 h-12 rounded-full bg-yellow-400
                        flex items-center justify-center text-xl mb-3">
          👤
        </div>
        <p className="text-white font-bold text-sm">
          {user ? `${user.firstName} ${user.lastName}` : 'Chargement…'}
        </p>
        <p className="text-blue-300 text-xs">Élève</p>
      </div>

      {/* Navigation */}
      <nav className="flex-1 py-4">
        {links.map(link => (
          <NavLink
            key={link.path}
            to={link.path}
            style={({ isActive }) => ({
              display: 'block',
              padding: '10px 20px',
              fontSize: 13,
              textDecoration: 'none',
              color: isActive ? '#E9A319' : 'white',
              background: isActive ? 'rgba(233,163,25,0.1)' : 'transparent',
              borderLeft: isActive ? '3px solid #E9A319' : '3px solid transparent',
            })}
          >
            {link.label}
          </NavLink>
        ))}
      </nav>

      {/* Bouton du bas */}
      <div className="p-4 border-t border-blue-800">
        <button
          onClick={handleLogout}
          className="w-full bg-yellow-400 hover:bg-yellow-500
                     text-gray-900 text-xs font-bold py-2 rounded-lg
                     cursor-pointer transition-colors"
        >
          Déconnexion
        </button>
      </div>
    </aside>
  );
};

export default StudentSidebar;
