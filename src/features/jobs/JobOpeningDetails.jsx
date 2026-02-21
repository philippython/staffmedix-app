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
import { useGetTalentApplicationsQuery } from "../../services/talentApi";
import { useWhoAmIQuery } from "../../services/userApi";
import { useSelector } from "react-redux";
import { useState } from "react";

export default function JobOpeningDetails() {
  const { jobId } = useParams();
  const navigate = useNavigate();
  const [appliedOptimistic, setAppliedOptimistic] = useState(false);

  const { data: job, isLoading, isError } = useGetJobByIdQuery(jobId);

  const token = useSelector((state) => state.auth.token);
  const isAuthenticated = useSelector((state) => state.auth.isAuthenticated);
  const userRole = useSelector((state) => state.auth.role);

  const [applyToJob, { isLoading: isApplying }] = useApplyToJobMutation();

  // Get talent_id from whoAmI
  const { data: whoAmI } = useWhoAmIQuery(undefined, { skip: !token });
  const talentId = whoAmI?.talent_id;
  const isTalent = userRole === "talent" && !!talentId;

  // Fetch this talent's applications
  const { data: applications } = useGetTalentApplicationsQuery(talentId, {
    skip: !isTalent,
  });

  // Check if this specific job has been applied to
  const hasApplied =
    appliedOptimistic ||
    !!applications?.some((app) => (app.job?.id ?? app.job) === jobId);

  async function handleApplyNow() {
    if (!isAuthenticated) {
      navigate("/auth");
      return;
    }
    if (userRole !== "talent") {
      navigate("/auth");
      return;
    }

    try {
      setAppliedOptimistic(true);
      await applyToJob(job.id).unwrap();
    } catch (error) {
      setAppliedOptimistic(false);
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
          <JobUnorderedList title={"Responsibilites"}>
            <li>
              Provide direct nursing care to critically ill patients in the ICU
            </li>
            <li>
              Monitor and assess patient conditions, documenting observations
              accurately
            </li>
            <li>
              Operate and maintain life-support equipment including ventilators
              and monitors
            </li>
            <li>
              Collaborate with physicians, respiratory therapists, and other
              healthcare professionals
            </li>
            <li>Mentor and supervise junior nursing staff</li>
            <li>
              Participate in quality improvement initiatives and research
              activities
            </li>
            <li>
              Respond to medical emergencies and participate in resuscitation
              efforts Educate patients' families about care plans and procedures
            </li>
          </JobUnorderedList>
          <JobUnorderedList title={"Qualifications"}>
            <li>Bachelor's degree in Nursing (B.Sc Nursing)</li>
            <li>
              Valid Nursing and Midwifery Council of Nigeria (NMCN) license
            </li>
            <li>Minimum 5 years of ICU/Critical Care nursing experience</li>
            <li>Current BLS and ACLS certifications</li>
            <li>Proficiency in operating ICU equipment and ventilators</li>
            <li>Excellent communication and teamwork skills</li>
            <li>ICU specialty certification is a plus</li>
          </JobUnorderedList>
        </div>

        <div className={styles.sideSection}>
          <div className={styles.applyContainer}>
            <Button
              variant={hasApplied ? "outlinedButton" : "coloredButton"}
              onClick={hasApplied ? undefined : handleApplyNow}
              disabled={hasApplied || isApplying}
            >
              {isApplying
                ? "Applying..."
                : hasApplied
                  ? "Applied ✓"
                  : "Apply Now"}
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
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className={styles.tagIcon}
              >
                <path d="M6 22V4a2 2 0 0 1 2-2h8a2 2 0 0 1 2 2v18Z"></path>
                <path d="M6 12H4a2 2 0 0 0-2 2v6a2 2 0 0 0 2 2h2"></path>
                <path d="M18 9h2a2 2 0 0 1 2 2v9a2 2 0 0 1-2 2h-2"></path>
                <path d="M10 6h4"></path>
                <path d="M10 10h4"></path>
                <path d="M10 14h4"></path>
                <path d="M10 18h4"></path>
              </svg>
              <p>{job?.company["company_name"]}</p>
            </div>
            <p>{job?.company["description"]}</p>
          </div>
          <JobUnorderedList title={"Benefits"} className={styles.benefits}>
            <li>Competitive salary and performance bonuses</li>
            <li>Comprehensive health insurance coverage</li>
            <li>Retirement savings plan with employer matching</li>
            <li>Professional development opportunities and training</li>
            <li>Flexible working hours and remote work options</li>
            <li>Employee assistance programs and wellness initiatives</li>
          </JobUnorderedList>
        </div>
      </div>
      <Footer />
    </>
  );
}
