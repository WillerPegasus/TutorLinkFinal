 import { NavLink } from 'react-router-dom';

const links = [
  {
    group: 'Pilotage',
    items: [
      { label: 'Vue d\'ensemble',  path: '/admin/dashboard' },
      { label: 'Rapports & stats', path: '/admin/reports' },

      { label: 'Abonnements',      path: '/admin/subscriptions' },
    ]
  },
  {
    group: 'Gestion',
    items: [
      { label: 'Utilisateurs',  path: '/admin/users' },
      { label: 'Répétiteurs',   path: '/admin/tutors' },
      { label: 'Réservations',  path: '/admin/reservations' },
      { label: 'Groupes',       path: '/admin/groups' },
    ]
  },
];

const AdminSidebar = () => (
  <aside style={{
    width: 240, background: '#1a2744', color: 'white',
    minHeight: '100vh', padding: '24px 0',
  }}>

    {/* Logo */}
    <div style={{ padding: '0 20px 24px', borderBottom: '1px solid #2d5a45' }}>
      <span style={{ color: '#E9A319', fontWeight: 'bold', fontSize: 18 }}>
        🎓 TutorLink
      </span>
      <div style={{ fontSize: 11, color: '#aaa', marginTop: 4 }}>
        Espace Admin
      </div>
    </div>

    {/* Menu */}
    {links.map(group => (
      <div key={group.group} style={{ marginTop: 24 }}>
        <div style={{
          fontSize: 11, color: '#888', padding: '0 20px 8px',
          textTransform: 'uppercase', letterSpacing: 1,
        }}>
          {group.group}
        </div>
        {group.items.map(item => (
          <NavLink
            key={item.path}
            to={item.path}
            style={({ isActive }) => ({
              display: 'block', padding: '10px 20px',
              fontSize: 14, cursor: 'pointer',
              textDecoration: 'none',
              color: isActive ? '#E9A319' : 'white',
              background: isActive ? 'rgba(233,163,25,0.1)' : 'transparent',
              borderLeft: isActive ? '3px solid #E9A319' : '3px solid transparent',
            })}
          >
            {item.label}
          </NavLink>
        ))}
      </div>
    ))}
  </aside>
);

export default AdminSidebar;