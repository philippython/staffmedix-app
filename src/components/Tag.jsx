import styles from "./Tag.module.css";

export default function Tag({ children, variant }) {
  const tagClasses = `${styles.tagIcon} ${styles[variant]}`;

  return <div className={tagClasses}>{children}</div>;
}
