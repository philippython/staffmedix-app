import JobHero from "./JobHero";
import SearchFilter from "./SearchFilter";
import JobListing from "./JobListing";
import styles from "./Job.module.css";

export default function Job() {
  return (
    <main className={styles.job}>
      <JobHero />
      <SearchFilter />
      <JobListing />
    </main>
  );
}
