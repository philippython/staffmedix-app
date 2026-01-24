import CtaCard from "./CtaCard";
import Button from "../../components/Button";
import styles from "./CTA.module.css";

export default function CTA() {
  return (
    <section className={styles.cta}>
      <h3>Ready to Transform Your Healthcare Hiring?</h3>
      <p>
        Join thousands of healthcare facilities and professionals already using
        StaffMedix
      </p>
      <div className={styles.ctaCards}>
        <CtaCard>
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
            class="lucide lucide-building2 w-7 h-7 text-primary-foreground"
          >
            <path d="M6 22V4a2 2 0 0 1 2-2h8a2 2 0 0 1 2 2v18Z"></path>
            <path d="M6 12H4a2 2 0 0 0-2 2v6a2 2 0 0 0 2 2h2"></path>
            <path d="M18 9h2a2 2 0 0 1 2 2v9a2 2 0 0 1-2 2h-2"></path>
            <path d="M10 6h4"></path>
            <path d="M10 10h4"></path>
            <path d="M10 14h4"></path>
            <path d="M10 18h4"></path>
          </svg>
          <h4>For Employers</h4>
          <p>
            Post jobs and hire from our pool of pre-verified healthcare
            professionals. Reduce hiring risks and save time.
          </p>
          <Button variant={"plainButton"}>
            Start Hiring <bold>&rarr;</bold>
          </Button>
        </CtaCard>
        <CtaCard>
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
            class="lucide lucide-user-plus w-7 h-7 text-primary-foreground"
          >
            <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"></path>
            <circle cx="9" cy="7" r="4"></circle>
            <line x1="19" x2="19" y1="8" y2="14"></line>
            <line x1="22" x2="16" y1="11" y2="11"></line>
          </svg>
          <h4>For Healthcare Workers</h4>
          <p>
            Get your credentials verified and unlock access to top healthcare
            facilities across Nigeria.
          </p>
          <Button variant={"plainButton"}>Create a Profile &rarr;</Button>
        </CtaCard>
      </div>
    </section>
  );
}
