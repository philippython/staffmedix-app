import styles from "./Button.module.css";

export default function Button({ variant, onClick, children }) {
  const buttonClasses = `${styles.button} ${styles[variant]}`;

  return (
    <div onClick={onClick} className={buttonClasses}>
      {children}
    </div>
  );
}
