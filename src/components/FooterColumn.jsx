import styles from "./FooterColumn.module.css";

export default function FooterColumn({ children }) {
  return <div className={styles.footerColumn}>{children}</div>;
}
