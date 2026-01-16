import JobHero from "./JobHero";
import SearchFilter from "./SearchFilter";
import styles from "./Job.module.css";
import JobListing from "./JobListing";

export default function Job() {
  return (
    <main className={styles.job}>
      <JobHero />
      <SearchFilter />
      <JobListing />
    </main>
  );
}
