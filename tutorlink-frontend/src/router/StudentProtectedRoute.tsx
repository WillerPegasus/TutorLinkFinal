import { Outlet } from "react-router-dom"; 
const StudentProtectedRoute = () => {
  return <Outlet />;  // laisse passer tout le monde
};

export default StudentProtectedRoute;