import TestimonialCard from "./TestimonialCard";
import styles from "./Testimonials.module.css";

export default function Testimoials() {
  return (
    <section className={styles.testimonials}>
      <div className={styles.headerDiv}>
        <h2>Trusted by Healthcare Leaders</h2>
        <p className={styles.testimonialText}>
          Hear from the employers and professionals who use StaffMedix every day
        </p>
      </div>
      <div className={styles.cardsDiv}>
        <TestimonialCard>
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
            <path d="M16 3a2 2 0 0 0-2 2v6a2 2 0 0 0 2 2 1 1 0 0 1 1 1v1a2 2 0 0 1-2 2 1 1 0 0 0-1 1v2a1 1 0 0 0 1 1 6 6 0 0 0 6-6V5a2 2 0 0 0-2-2z"></path>
            <path d="M5 3a2 2 0 0 0-2 2v6a2 2 0 0 0 2 2 1 1 0 0 1 1 1v1a2 2 0 0 1-2 2 1 1 0 0 0-1 1v2a1 1 0 0 0 1 1 6 6 0 0 0 6-6V5a2 2 0 0 0-2-2z"></path>
          </svg>
          <p className={styles.testimonialText}>
            "StaffMedix has transformed our hiring process. Every nurse and
            doctor we've hired through the platform came with verified
            credentials, saving us weeks of background checks."
          </p>
          <div>
            <div className={styles.testimonialUser}>DEO</div>
            <div className={styles.testimonialDetails}>
              <h4>Dr. Emeka Okonkwo</h4>
              <span>HR Manager</span>
              <p className={styles.testimonialPost}>
                First Consultants Medical Centre
              </p>
            </div>
          </div>
        </TestimonialCard>
        <TestimonialCard>
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
            <path d="M16 3a2 2 0 0 0-2 2v6a2 2 0 0 0 2 2 1 1 0 0 1 1 1v1a2 2 0 0 1-2 2 1 1 0 0 0-1 1v2a1 1 0 0 0 1 1 6 6 0 0 0 6-6V5a2 2 0 0 0-2-2z"></path>
            <path d="M5 3a2 2 0 0 0-2 2v6a2 2 0 0 0 2 2 1 1 0 0 1 1 1v1a2 2 0 0 1-2 2 1 1 0 0 0-1 1v2a1 1 0 0 0 1 1 6 6 0 0 0 6-6V5a2 2 0 0 0-2-2z"></path>
          </svg>
          <p className={styles.testimonialText}>
            "As a healthcare worker, having my credentials verified by
            StaffMedix opened doors to better opportunities. Employers trust my
            profile because they know it's been thoroughly vetted."
          </p>
          <div>
            <div className={styles.testimonialUser}>NA</div>
            <div className={styles.testimonialDetails}>
              <h4>Ngozi Adeleke</h4>
              <span>Registered Nurse</span>
              <p className={styles.testimonialPost}>Verified Professional</p>
            </div>
          </div>
        </TestimonialCard>
        <TestimonialCard>
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
            <path d="M16 3a2 2 0 0 0-2 2v6a2 2 0 0 0 2 2 1 1 0 0 1 1 1v1a2 2 0 0 1-2 2 1 1 0 0 0-1 1v2a1 1 0 0 0 1 1 6 6 0 0 0 6-6V5a2 2 0 0 0-2-2z"></path>
            <path d="M5 3a2 2 0 0 0-2 2v6a2 2 0 0 0 2 2 1 1 0 0 1 1 1v1a2 2 0 0 1-2 2 1 1 0 0 0-1 1v2a1 1 0 0 0 1 1 6 6 0 0 0 6-6V5a2 2 0 0 0-2-2z"></path>
          </svg>
          <p className={styles.testimonialText}>
            "The quality of candidates on StaffMedix is exceptional. We've
            reduced our time-to-hire by 60% and significantly improved our staff
            retention rates."
          </p>
          <div>
            <div className={styles.testimonialUser}>DCN</div>
            <div className={styles.testimonialDetails}>
              <h4>Dr. Chioma Nwankwo</h4>
              <span>Medical Director</span>
              <p className={styles.testimonialPost}>Verified Professional</p>
            </div>
          </div>
        </TestimonialCard>
      </div>
    </section>
  );
}
