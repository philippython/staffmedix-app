import styles from "./PaginationItem.module.css";

export default function PaginationItem({
  variant,
  disabled,
  onClick,
  children,
}) {
  const paginationClasses = `${styles.paginationItem} ${styles[variant]}`;
  return (
    <div
      style={{ pointerEvents: disabled ? "none" : "auto" }}
      onClick={onClick}
      className={paginationClasses}
    >
      {children}
    </div>
  );
}
