import JobOpening from "./JobOpening.jsx";
import CustomSelect from "../../components/CustomSelect";
import Pagination from "../../components/Pagination";
import styles from "./JobListing.module.css";
import { useGetJobsQuery } from "../../services/jobsApi.js";

export default function JobListing() {
  const { data: jobs, isLoading, isError } = useGetJobsQuery();

  if (isLoading) return <div>Loading...</div>;
  if (isError) return <div>Error loading jobs</div>;

  return (
    <div className={styles.jobListing}>
      <div className={styles.searchFilterCount}>
        <p>
          Showing <strong>{jobs?.length || 0}</strong> jobs
        </p>
        <CustomSelect />
      </div>
      {jobs && jobs.map((job) => <JobOpening key={job.id} job={job} />)}
      <Pagination />
    </div>
  );
}
