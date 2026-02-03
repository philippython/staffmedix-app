import Tag from "../../components/Tag";
import styles from "./JobOpening.module.css";
import Button from "../../components/Button";
import { daysAgo } from "../../utils/timelineCalculator";
import { Link } from "react-router";

export default function JobOpening({ job }) {
  return (
    <Link to={`/jobs/${job.id}`}>
      <div className={styles.jobOpening}>
        <div className={styles.titlePoster}>
          <div className={styles.title}>
            <h5>{job.title}</h5>
          </div>
          <div className={styles.poster}>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              stroke-width="2"
              stroke-linecap="round"
              stroke-linejoin="round"
              class="lucide lucide-building2 w-4 h-4 text-muted-foreground"
            >
              <path d="M6 22V4a2 2 0 0 1 2-2h8a2 2 0 0 1 2 2v18Z"></path>
              <path d="M6 12H4a2 2 0 0 0-2 2v6a2 2 0 0 0 2 2h2"></path>
              <path d="M18 9h2a2 2 0 0 1 2 2v9a2 2 0 0 1-2 2h-2"></path>
              <path d="M10 6h4"></path>
              <path d="M10 10h4"></path>
              <path d="M10 14h4"></path>
              <path d="M10 18h4"></path>
            </svg>
            <p>{job.company["company_name"]}</p>
          </div>
          <p>{job.description}</p>
        </div>
        <div className={styles.applyWages}>
          <h5>{`₦${job?.salary_min.toLocaleString()} - ₦${job?.salary_max.toLocaleString()}`}</h5>
          <p>{daysAgo(job.created_at)}</p>
          <Button variant={"coloredButton"}>Apply Now</Button>
        </div>
      </div>
    </Link>
  );
}
