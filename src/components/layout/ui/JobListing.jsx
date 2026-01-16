import JobOpening from "./JobOpening.jsx";
import CustomSelect from "./CustomSelect";
// import Pagination from "./Pagination.jsx";
import styles from "./JobListing.module.css";

export default function JobListing() {
  return (
    <div className={styles.jobListing}>
      <div className={styles.searchFilterCount}>
        <p>
          Showing <strong>6</strong> jobs
        </p>
        <CustomSelect />
      </div>
      <JobOpening />
    </div>
  );
}
