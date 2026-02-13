import { useEffect, useMemo } from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router";
import { useWhoAmIQuery } from "../services/userApi";
import { useLocation } from "react-router";

export function useAuthRedirect() {
  const navigate = useNavigate();
  const location = useLocation();

  const token = useSelector((state) => state.auth.token);
  const userRole = useSelector((state) => state.auth.role);

  const {
    data: user,
    isLoading,
    isError,
  } = useWhoAmIQuery(undefined, {
    skip: !token,
  });

  const loginErrorMsg = useMemo(() => {
    if (!user?.role) return null;

    const role = user.role.toLowerCase();
    if (role === "admin") return null;
    if (userRole !== role) return `Login as ${role} :)`;
  }, [user, userRole]);

  useEffect(() => {
    if (!user?.role || loginErrorMsg) return;

    // 🚨 ONLY redirect if user is on /auth
    if (location.pathname !== "/auth") return;

    const roleRoutes = {
      talent: "/employee-dashboard",
      employer: "/employer-dashboard",
      admin: "/admin",
    };

    navigate(roleRoutes[user.role.toLowerCase()] ?? "/auth");
  }, [user, loginErrorMsg, navigate, location.pathname]);

  return {
    user,
    isLoading,
    isError,
    loginErrorMsg,
  };
}
