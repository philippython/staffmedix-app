import { useState } from "react";
import { Link, useLocation } from "react-router";
import styles from "./AppNav.module.css";

export default function AppNav() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const location = useLocation();

  const toggleMenu = () => setIsMenuOpen(!isMenuOpen);
  const closeMenu = () => setIsMenuOpen(false);

  const isActive = (path) => location.pathname === path;

  return (
    <nav className={styles.appNav}>
      <div className={styles.navContainer}>
        <Link to="/" className={styles.logo} onClick={closeMenu}>
          <h2>StaffMedix</h2>
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
              to="/employer-dashboard"
              className={
                isActive("/employer-dashboard") ? styles.activeLink : ""
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
            <Link
              to="/auth/employee-signup"
              className={styles.signup}
              onClick={closeMenu}
            >
              Sign Up
            </Link>
            <Link to="/auth" className={styles.login} onClick={closeMenu}>
              Login
            </Link>
          </li>
        </ul>
      </div>
    </nav>
  );
}
