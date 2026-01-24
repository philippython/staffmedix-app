import styles from "./Input.module.css";

export default function Input({ children, variant }) {
  return <div className={styles.inputDiv} style={variant === "full" ? { width: "100%" } : { width: "55%" }}>{children}</div>;
}
