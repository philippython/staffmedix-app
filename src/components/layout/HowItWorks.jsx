import Step from "./Step";
import styles from "./HowItWorks.module.css";

export default function HowItWorks() {
  return (
    <section className={styles.howItWorks}>
      <div className={styles.headerDiv}>
        <h2>How It Works</h2>
        <p>
          A simple, secure process to connect verified healthcare professionals
          with trusted employers
        </p>
      </div>
      <div className={styles.stepsDiv}>
        <Step>
          <span>01</span>
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
          >
            <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
            <polyline points="17 8 12 3 7 8"></polyline>
            <line x1="12" x2="12" y1="3" y2="15"></line>
          </svg>

          <h4>Upload Credentials</h4>
          <p>
            Healthcare workers submit their licenses, certifications, and
            professional documents through our secure portal.
          </p>
        </Step>
        <Step>
          <span>02</span>
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
          >
            <path d="M20 13c0 5-3.5 7.5-7.66 8.95a1 1 0 0 1-.67-.01C7.5 20.5 4 18 4 13V6a1 1 0 0 1 1-1c2 0 4.5-1.2 6.24-2.72a1.17 1.17 0 0 1 1.52 0C14.51 3.81 17 5 19 5a1 1 0 0 1 1 1z"></path>
            <path d="m9 12 2 2 4-4"></path>
          </svg>
          <h4>StaffMedix Verifies</h4>
          <p>
            Our team validates every credential with issuing councils and
            regulatory bodies across Nigeria.
          </p>
        </Step>
        <Step>
          <span>03</span>
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
          >
            <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"></path>
            <circle cx="9" cy="7" r="4"></circle>
            <polyline points="16 11 18 13 22 9"></polyline>
          </svg>
          <h4>Employers Hire Safely</h4>
          <p>
            Access a pool of pre-verified healthcare professionals, ready to
            join your facility with confidence.
          </p>
        </Step>
      </div>
    </section>
  );
}
