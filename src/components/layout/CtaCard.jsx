import styles from "./CtaCard.module.css";

export default function CtaCard({ children }) {
  return <div className={styles.ctaCard}>{children}</div>;
}
