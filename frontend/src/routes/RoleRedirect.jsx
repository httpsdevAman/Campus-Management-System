import { Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { ROLE_DASHBOARDS } from "../config/roles";

const RoleRedirect = () => {
  const { isAuthenticated, loading, user } = useAuth();

  if (loading) return null;

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  const dashboard = ROLE_DASHBOARDS[user.role];
  return <Navigate to={dashboard || "/login"} replace />;
};

export default RoleRedirect;
