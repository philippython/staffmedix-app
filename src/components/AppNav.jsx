import { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router";
import { useSelector, useDispatch } from "react-redux";
import styles from "./AppNav.module.css";
import Logo from "./Logo";
import logo from "../assets/Logo.png";
import { logout } from "../store/slices/authSlice";
import { jobsApi } from "../services/jobsApi";
import { userApi } from "../services/userApi";
import { talentApi } from "../services/talentApi";
import { employerApi } from "../services/employerApi";
import { useWhoAmIQuery } from "../services/userApi";

export default function AppNav() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const token = useSelector((state) => state.auth.token);

  const { data: whoAmI } = useWhoAmIQuery(undefined, { skip: !token });

  const dashboardRoute =
    whoAmI?.role === "EMPLOYER"
      ? "/employer-dashboard"
      : whoAmI?.role === "TALENT"
        ? "/employee-dashboard"
        : null;

  const toggleMenu = () => setIsMenuOpen(!isMenuOpen);
  const closeMenu = () => setIsMenuOpen(false);
  const isActive = (path) => location.pathname === path;

  function handleLogout() {
    dispatch(logout());
    dispatch(jobsApi.util.resetApiState());
    dispatch(userApi.util.resetApiState());
    dispatch(talentApi.util.resetApiState());
    dispatch(employerApi.util.resetApiState());
    closeMenu();
    navigate("/");
  }

  return (
    <nav className={styles.appNav}>
      <div className={styles.navContainer}>
        <Link to="/" className={styles.logo} onClick={closeMenu}>
          <Logo logoUrl={logo} />
        </Link>

        <button
          className={styles.hamburger}
          onClick={toggleMenu}
          aria-label="Toggle menu"
        >
          <span className={isMenuOpen ? styles.active : ""}></span>
          <span className={isMenuOpen ? styles.active : ""}></span>
          <span className={isMenuOpen ? styles.active : ""}></span>
        </button>

        <ul className={`${styles.navLinks} ${isMenuOpen ? styles.open : ""}`}>
          <li>
            <Link
              to="/"
              className={isActive("/") ? styles.activeLink : ""}
              onClick={closeMenu}
            >
              Home
            </Link>
          </li>
          <li>
            <Link
              to="/jobs"
              className={isActive("/jobs") ? styles.activeLink : ""}
              onClick={closeMenu}
            >
              Find Jobs
            </Link>
          </li>
          <li>
            <Link
              to="/talents"
              className={isActive("/talents") ? styles.activeLink : ""}
              onClick={closeMenu}
            >
              Talents
            </Link>
          </li>
          <li>
            <Link
              to="/auth/employer-signup"
              className={
                isActive("/auth/employer-signup") ? styles.activeLink : ""
              }
              onClick={closeMenu}
            >
              For Employers
            </Link>
          </li>
          <li>
            <Link
              to="/pricing"
              className={isActive("/pricing") ? styles.activeLink : ""}
              onClick={closeMenu}
            >
              Pricing
            </Link>
          </li>
          <li>
            <Link
              to="/ads"
              className={isActive("/ads") ? styles.activeLink : ""}
              onClick={closeMenu}
            >
              Partner Organizations
            </Link>
          </li>
          <li className={styles.authButtons}>
            {token ? (
              <>
                {dashboardRoute && (
                  <Link
                    to={dashboardRoute}
                    className={styles.dashboardBtn}
                    onClick={closeMenu}
                  >
                    Dashboard
                  </Link>
                )}
                <button className={styles.logoutBtn} onClick={handleLogout}>
                  Logout
                </button>
              </>
            ) : (
              <>
                <Link to="/auth" className={styles.login} onClick={closeMenu}>
                  Login
                </Link>
                <Link
                  to="/auth/employee-signup"
                  className={styles.signup}
                  onClick={closeMenu}
                >
                  Get Started
                </Link>
              </>
            )}
          </li>
        </ul>
      </div>
    </nav>
  );
}
