import JobHero from "./JobHero";
import SearchFilter from "./SearchFilter";
import styles from "./Job.module.css";

export default function Job() {
  return (
    <main className={styles.job}>
      <JobHero />
      <SearchFilter />
    </main>
  );
}
