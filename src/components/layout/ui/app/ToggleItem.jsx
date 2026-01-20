import styles from "./ToggleItem.module.css";

export default function ToggleItem({ children, variant }) {
  const toggleClass = variant === "active" ? styles.active : styles.inactive;
  return (
    <div className={`${styles.toggleItem} ${toggleClass}`}>{children}</div>
  );
}
