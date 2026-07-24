import { useAdminUsers } from '../../hooks/useAdminUsers';
import UserFilterBar from '../../components/admin/UserFilterBar';
import UsersTable from '../../components/admin/UsersTable';
import UserDetailsModal from '../../components/admin/UserDetailsModal';

const AdminUsersPage = () => {
  const {
    filteredUsers, filters, setFilters,
    selectedUser, setSelectedUser,
   handleDelete,
  } = useAdminUsers();

  return (
    <div>
      {/* En-tête avec compteur */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
        <h2 style={{ color: '#1565C0', margin: 0 }}>Gestion des utilisateurs</h2>
        <span style={{ background: '#E8F5E9', color: '#1565C0', padding: '6px 16px', borderRadius: 20, fontWeight: 'bold' }}>
          {filteredUsers.length} utilisateur(s)
        </span>
      </div>

      {/* Barre de filtres */}
      <UserFilterBar filters={filters} onChange={setFilters} />

      {/* Tableau */}
      <UsersTable
        users={filteredUsers}
        onDelete={handleDelete}
      />

      {/* Modal détail — affiché uniquement si un user est sélectionné */}
      {selectedUser && (
        <UserDetailsModal
          user={selectedUser}
          onClose={() => setSelectedUser(null)}
          onDelete={handleDelete}
        />
      )}
    </div>
  );
};

export default AdminUsersPage;