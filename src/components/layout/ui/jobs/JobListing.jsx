import JobOpening from "./JobOpening.jsx";
import CustomSelect from "../app/CustomSelect.jsx";
import Pagination from "../app/Pagination.jsx";
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
      <Pagination />
    </div>
  );
}
