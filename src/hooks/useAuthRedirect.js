import { useEffect, useMemo } from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router";
import { useWhoAmIQuery } from "../services/userApi";

export function useAuthRedirect() {
  const navigate = useNavigate();

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

    const roleRoutes = {
      talent: "/employee-dashboard",
      employer: "/employer-dashboard",
      admin: "/admin",
    };

    console.log(user.role.toLowerCase());
    navigate(roleRoutes[user.role.toLowerCase()] ?? "/auth");
  }, [user, loginErrorMsg, navigate]);

  return {
    user,
    isLoading,
    isError,
    loginErrorMsg,
  };
}
