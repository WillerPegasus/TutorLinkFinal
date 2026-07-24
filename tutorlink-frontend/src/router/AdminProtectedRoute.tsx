import { Navigate, Outlet } from 'react-router-dom';
import { useAdminAuthStore } from '@/store/adminAuthStore';

const AdminProtectedRoute = () => {
  const { isAdminAuthenticated } = useAdminAuthStore();
  return isAdminAuthenticated ? <Outlet /> : <Navigate to="/admin/login" replace />;
};

export default AdminProtectedRoute;