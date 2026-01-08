import styles from "./AppNav.module.css";
import Button from "./Button";
import Logo from "./Logo";

export default function AppNav() {
  return (
    <nav className={styles.nav}>
      <Logo />
      <ul className={styles.navList}>
        <li>Find Jobs</li>
        <li>Organizations</li>
        <li>For Workers</li>
        <li>For Employers</li>
        <li>Pricing</li>
      </ul>
      <Button variant="coloredButton">Login</Button>
    </nav>
  );
}
