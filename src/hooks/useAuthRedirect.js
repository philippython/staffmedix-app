import { useEffect, useMemo } from "react";
import { useSelector } from "react-redux";
import { useNavigate, useLocation } from "react-router";
import { useWhoAmIQuery } from "../services/userApi";

// Add your admin signin path to this list
const AUTH_PATHS = ["/auth", "/auth/admin"];

export function useAuthRedirect() {
  const navigate = useNavigate();
  const location = useLocation();

  const token = useSelector((state) => state.auth.token);

  const { data: user, isLoading, isError } = useWhoAmIQuery(undefined, {
    skip: !token,
  });

  // loginErrorMsg: shown on /auth page when a non-talent/employer tries to log in there
  // Admin users never get an error message regardless of which login page they used
  const loginErrorMsg = useMemo(() => {
    if (!user?.role) return null;
    const role = user.role.toLowerCase();
    // Admin can sign in from any page — never block them
    if (role === "admin") return null;
    // On the main /auth page, only talent and employer are expected
    if (location.pathname === "/auth") {
      if (role !== "talent" && role !== "employer") return `Please log in as ${role}`;
    }
    return null;
  }, [user, location.pathname]);

  useEffect(() => {
    if (!user?.role || loginErrorMsg) return;

    const isOnAuthPage = AUTH_PATHS.some((p) => location.pathname === p);
    if (!isOnAuthPage) return;

    const roleRoutes = {
      talent:   "/employee-dashboard",
      employer: "/employer-dashboard",
      admin:    "/admin-dashboard",
    };

    navigate(roleRoutes[user.role.toLowerCase()] ?? "/auth");
  }, [user, loginErrorMsg, navigate, location.pathname]);

  return { user, isLoading, isError, loginErrorMsg };
}