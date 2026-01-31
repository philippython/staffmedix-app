import JobOpening from "./JobOpening.jsx";
import SearchFilter from "./SearchFilter.jsx";
import CustomSelect from "../../components/CustomSelect";
import Pagination from "../../components/Pagination";
import styles from "./JobListing.module.css";
import { useGetJobsQuery } from "../../services/jobsApi.js";
import { useState } from "react";

export default function JobListing() {
  const {
    data: { count, results: jobs } = {},
    isLoading,
    isError,
  } = useGetJobsQuery();
  const [showFilter, setShowFilter] = useState(true);

  return (
    <div className={styles.jobListing}>
      <div className={styles.searchFilterCount}>
        <p>
          Showing <strong>{jobs?.length || 0}</strong> jobs
        </p>
        <CustomSelect />
      </div>

      <button
        className={styles.filter}
        onClick={() => setShowFilter((prev) => !prev)}
      >
        {showFilter ? "Show Filters" : "Hide Filters"}
      </button>

      {!showFilter && <SearchFilter variant={"block"} />}
      {isError ? (
        <div className={styles.error}>
          Error loading jobs, Check your internet connection :(
        </div>
      ) : null}
      {jobs && jobs.map((job) => <JobOpening key={job.id} job={job} />)}
      {isError || isLoading ? null : (
        <Pagination pages={Math.round(count / 10) || 0} />
      )}
    </div>
  );
}
