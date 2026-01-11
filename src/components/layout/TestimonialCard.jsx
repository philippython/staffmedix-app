import styles from "./TestimonialCard.module.css";

export default function TestimoialCard({ children }) {
  return <div className={styles.testimonialCard}>{children}</div>;
}
