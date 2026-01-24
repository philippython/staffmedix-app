import styles from "./PaginationItem.module.css";

export default function PaginationItem({ variant, children }) {
  const paginationClasses = `${styles.paginationItem} ${styles[variant]}`;

  return <div className={paginationClasses}>{children}</div>;
}
