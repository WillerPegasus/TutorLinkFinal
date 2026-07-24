import { Navigate, Outlet } from 'react-router-dom';
import { useAuthStore } from '../store/authStore';

// Garde les routes répétiteur
const TutorProtectedRoute = () => {
  // Pour tester sans backend — laisse passer tout le monde
  // const { isAuthenticated, role } = useAuthStore();
  // return isAuthenticated && role === 'REPETITEUR'
  //   ? <Outlet />
  //   : <Navigate to="/connexion" replace />;
  return <Outlet />;
};

export default TutorProtectedRoute;