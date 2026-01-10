import styles from "./Testimonials.module.css";

export default function Testimoials() {
  return (
    <section className={styles.Testimonials}>
      <div className={styles.headerDiv}>
        <h2>Trusted by Healthcare Leaders</h2>
        <p>
          Hear from the employers and professionals who use StaffMedix every day
        </p>
      </div>
      <div className={styles.cardsDiv}></div>
    </section>
  );
}
