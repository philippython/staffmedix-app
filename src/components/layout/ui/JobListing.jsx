import JobOpening from "./JobOpening.jsx";
import Pagination from "./Pagination.jsx";
import styles from "./JobListing.module.css";

export default function JobListing() {
  return (
    <div className={styles.jobListing}>
      <JobOpening />
      <Pagination />
    </div>
  );
}
