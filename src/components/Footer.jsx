import styles from "./Footer.module.css";
import FooterColumn from "./FooterColumn";
import Logo from "./Logo";
import logo from "../assets/logo.png";
import { Link } from "react-router";

export default function CTA() {
  return (
    <section className={styles.footer}>
      <FooterColumn>
        <Link to={"/"}>
          <Logo logoUrl={logo} />
        </Link>
        <p>
          Connecting verified Nigerian healthcare professionals with trusted
          employers.
        </p>
        <p>
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
            class="lucide lucide-mail h-4 w-4"
          >
            <rect width="20" height="16" x="2" y="4" rx="2"></rect>
            <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7"></path>
          </svg>
          hello@staffmedix.com
        </p>
        <p>
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
            class="lucide lucide-phone h-4 w-4"
          >
            <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"></path>
          </svg>
          +234 704 922 8347
        </p>
        <p>
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
            class="lucide lucide-map-pin h-4 w-4"
          >
            <path d="M20 10c0 4.993-5.539 10.193-7.399 11.799a1 1 0 0 1-1.202 0C9.539 20.193 4 14.993 4 10a8 8 0 0 1 16 0"></path>
            <circle cx="12" cy="10" r="3"></circle>
          </svg>
          Lagos, Nigeria
        </p>
      </FooterColumn>
      <FooterColumn>
        <h3>Platform</h3>
        <ul>
          <li>Find Talent</li>
          <li>For Workers</li>
          <li>Pricing</li>
          <li>How It Works</li>
        </ul>
      </FooterColumn>
      <FooterColumn>
        <h3> Company</h3>
        <ul>
          <li>About Us</li>
          <li>Careers</li>
          <li>Contact</li>
        </ul>
      </FooterColumn>
      <div className={styles.footerBottom}>
        <p>© 2026 StaffMedix. All rights reserved.</p>
        <p>Trusted by 500+ healthcare facilities across Nigeria</p>
      </div>
    </section>
  );
}
