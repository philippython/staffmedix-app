import styles from "./Logo.module.css";

export default function Logo({ logoUrl }) {
  return (
    <div className={styles.logo}>
      <img className={styles.appIcon} src={logoUrl} />
      <h2 className={styles.appName}>StaffMedix</h2>
    </div>
  );
}
