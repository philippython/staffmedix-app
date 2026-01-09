import styles from "./Card.module.css";

export default function Card({ children, variant, isAbsolute, positions }) {
  const cardClasses = `${styles.card} ${styles[variant]} ${
    isAbsolute ? styles["absoluteCard"] : ""
  }`;

  return (
    <div
      className={cardClasses}
      style={
        isAbsolute && {
          left: positions?.left,
          right: positions?.right,
          top: positions?.top,
          bottom: positions?.bottom,
        }
      }
    >
      {children}
    </div>
  );
}
