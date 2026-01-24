import JobOpening from "./JobOpening.jsx";
import CustomSelect from "../../components/CustomSelect";
import Pagination from "../../components/Pagination";
import styles from "./JobListing.module.css";
import { Link } from "react-router";

export default function JobListing() {
  return (
    <div className={styles.jobListing}>
      <div className={styles.searchFilterCount}>
        <p>
          Showing <strong>6</strong> jobs
        </p>
        <CustomSelect />
      </div>
      <Link to={"/jobs/1"}>
        <JobOpening />
      </Link>
      <Pagination />
    </div>
  );
}
