import styles from "./Button.module.css";

export default function Button({ variant, children }) {
  const buttonClasses = `${styles.button} ${styles[variant]}`;

  return <div className={buttonClasses}>{children}</div>;
}
