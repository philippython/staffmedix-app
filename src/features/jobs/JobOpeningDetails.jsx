import AppNav from "../../components/AppNav";
import Footer from "../../components/Footer";
import JobSummary from "./JobSummary";
import JobDescription from "./JobDescription";
import JobUnorderedList from "./JobUnorderedList";
import Button from "../../components/Button";
import styles from "./JobOpeningDetails.module.css";
import { Link } from "react-router";
import { useParams, useNavigate } from "react-router";
import {
  useGetJobByIdQuery,
  useApplyToJobMutation,
} from "../../services/jobsApi";
import { useSelector } from "react-redux";

// Splits newline-separated backend text into an array of non-empty strings
function parseLines(text) {
  if (!text) return [];
  return text
    .split("\n")
    .map((l) => l.replace(/^[-•*]\s*/, "").trim())
    .filter(Boolean);
}

export default function JobOpeningDetails() {
  const { jobId } = useParams();
  const navigate = useNavigate();
  const { data: job, isLoading, isError } = useGetJobByIdQuery(jobId);

  // Get auth state
  const isAuthenticated = useSelector((state) => state.auth.isAuthenticated);
  const userRole = useSelector((state) => state.auth.role);

  // Apply to job mutation
  const [applyToJob, { isLoading: isApplying }] = useApplyToJobMutation();

  async function handleApplyNow() {
    // Check if user is authenticated
    if (!isAuthenticated) {
      navigate("/auth");
      return;
    }

    // Check if user is a talent
    if (userRole !== "talent") {
      navigate("/auth");
      return;
    }

    try {
      await applyToJob(job.id).unwrap();
      alert("Application submitted successfully!");
    } catch (error) {
      alert(
        error?.data?.detail ||
          "Failed to submit application. Please try again.",
      );
    }
  }

  return (
    <>
      <AppNav />
      <Link className={styles.backLink} to={"/jobs"}>
        &larr; Back to Job Board
      </Link>
      <div className={styles.jobOpeningDetails}>
        <div className={styles.detailsContainer}>
          <JobSummary job={job} />
          <JobDescription job={job} />
          <JobUnorderedList title={"Responsibilities"}>
            {parseLines(job?.responsibilities).map((line, i) => (
              <li key={i}>{line}</li>
            ))}
          </JobUnorderedList>
          <JobUnorderedList title={"Requirements"}>
            {parseLines(job?.requirements).map((line, i) => (
              <li key={i}>{line}</li>
            ))}
          </JobUnorderedList>
        </div>

        <div className={styles.sideSection}>
          <div className={styles.applyContainer}>
            <Button
              variant={"coloredButton"}
              onClick={handleApplyNow}
              disabled={isApplying}
            >
              {isApplying ? "Applying..." : "Apply Now"}
            </Button>
            <span>Application deadline: {job?.deadline}</span>
            <h3>About the Employer</h3>
            <div className={styles.employer}>
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
                class={styles.tagIcon}
              >
                <path d="M6 22V4a2 2 0 0 1 2-2h8a2 2 0 0 1 2 2v18Z"></path>
                <path d="M6 12H4a2 2 0 0 0-2 2v6a2 2 0 0 0 2 2h2"></path>
                <path d="M18 9h2a2 2 0 0 1 2 2v9a2 2 0 0 1-2 2h-2"></path>
                <path d="M10 6h4"></path>
                <path d="M10 10h4"></path>
                <path d="M10 14h4"></path>
                <path d="M10 18h4"></path>
              </svg>
              <p onClick={() => navigate(`/employers/${job?.company?.id}`)}>
                {job?.company?.company_name}
              </p>
            </div>
            <p>{job?.company?.description}</p>
          </div>
          {parseLines(job?.benefits).length > 0 && (
            <JobUnorderedList title={"Benefits"} className={styles.benefits}>
              {parseLines(job?.benefits).map((line, i) => (
                <li key={i}>{line}</li>
              ))}
            </JobUnorderedList>
          )}
        </div>
      </div>
      <Footer />
    </>
  );
}
