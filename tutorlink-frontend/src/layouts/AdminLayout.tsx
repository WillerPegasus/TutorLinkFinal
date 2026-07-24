import { Outlet } from 'react-router-dom';
import AdminSidebar from '@/components/admin/AdminSidebar';
import AdminTopbar from '@/components/admin/AdminTopbar';

const AdminLayout = () => (
  <div style={{ display: 'flex', minHeight: '100vh' }}>
    <AdminSidebar />
    <div style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
      <AdminTopbar />
      <main style={{ flex: 1, padding: 32, background: '#FAFAF7' }}>
        <Outlet />
      </main>
    </div>
  </div>
);

export default AdminLayout;
