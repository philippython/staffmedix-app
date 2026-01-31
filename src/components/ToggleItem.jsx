import styles from "./ToggleItem.module.css";

export default function ToggleItem({ children, variant, onClick }) {
  const toggleClass = variant === "active" ? styles.active : styles.inactive;
  return (
    <div className={`${styles.toggleItem} ${toggleClass}`} onClick={onClick}>
      {children}
    </div>
  );
}
