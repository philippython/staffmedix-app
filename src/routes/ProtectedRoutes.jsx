import { Navigate, Outlet } from "react-router";
import { useAuthRedirect } from "../hooks/useAuthRedirect";

export default function ProtectedRoutes({ group }) {
  const { user } = useAuthRedirect();

  if (!user) return <Navigate to="/auth" replace />;

  if (user.role.toLowerCase() !== group) {
    return <Navigate to="/auth" replace />;
  }

  return <Outlet />;
}
