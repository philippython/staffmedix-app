import styles from "./Step.module.css";

export default function Step({ children }) {
  return <div className={styles.step}>{children}</div>;
}
