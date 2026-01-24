import AppNav from "../../components/AppNav";
import Footer from "../../components/Footer";
import JobSummary from "./JobSummary";
import JobDescription from "./JobDescription";
import styles from "./JobOpeningDetails.module.css";
import { Link } from "react-router";
import JobUnorderedList from "./JobUnorderedList";
import Button from "../../components/Button";

export default function JobOpeningDetails() {
  return (
    <>
      <AppNav />
      <Link className={styles.backLink} to={"/jobs"}>
        &larr; Back to Job Board
      </Link>
      <div className={styles.jobOpeningDetails}>
        <div className={styles.detailsContainer}>
          <JobSummary />
          <JobDescription />
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
            <Button variant={"coloredButton"}>Apply Now</Button>
            <span>Application deadline: March 15, 2026</span>
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
              <p>Lagos University Teaching Hospital</p>
            </div>
            <p>
              Lagos University Teaching Hospital (LUTH) is a premier healthcare
              institution in Nigeria, renowned for its commitment to excellence
              in patient care, medical education, and research
            </p>
          </div>
          <JobUnorderedList title={"Benefits"}>
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
