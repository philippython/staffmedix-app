import styles from "./Logo.module.css";
import { ReactSVG } from "react-svg";

export default function Logo() {
  return (
    <div className={styles.logo}>
      <img className={styles.appIcon} src="src/assets/logo.png" />{" "}
      <h2 className={styles.appName}>StaffMedix</h2>
    </div>
  );
}
