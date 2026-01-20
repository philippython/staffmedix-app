import { Link } from "react-router";
import styles from "./AppNav.module.css";
import Button from "./Button";
import Logo from "./Logo";

export default function AppNav() {
  return (
    <nav className={styles.nav}>
      <Link to={"/"}>
        <Logo />
      </Link>
      <ul className={styles.navList}>
        <Link to={"/jobs"}>
          <li>Find Jobs</li>
        </Link>
        <li>Organizations</li>
        <li>For Workers</li>
        <li>For Employers</li>
        <li>Pricing</li>
      </ul>
      <div>
        <Button variant="borderlessButton">
          <Link to="/auth">Login</Link>
        </Button>
        <Button variant="coloredButton">
          <Link to="/auth">Get started</Link>
        </Button>
      </div>
    </nav>
  );
}
