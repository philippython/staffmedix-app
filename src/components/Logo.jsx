import styles from "./Logo.module.css";
import logo from "../assets/logo.png";

export default function Logo() {
  return (
    <div className={styles.logo}>
      <img className={styles.appIcon} src={logo} />
      <h2 className={styles.appName}>StaffMedix</h2>
    </div>
  );
}
