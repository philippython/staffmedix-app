import styles from "./Footer.module.css";
import FooterColumn from "./FooterColumn";
import Logo from "./Logo";
import logo from "../assets/Logo.png";
import { Link } from "react-router";

export default function Footer() {
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
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <rect width="20" height="16" x="2" y="4" rx="2"></rect>
            <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7"></path>
          </svg>
          info@staffmedix.ng
        </p>
        <p>
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
          >
            <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"></path>
          </svg>
          +234 703 344 4515
        </p>
        <p>
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
          <li>
            <Link to="/jobs">Find Jobs</Link>
          </li>
          <li>
            <Link to="/auth/employee-signup">For Workers</Link>
          </li>
          <li>
            <Link to="/ads">Featured Organizations</Link>
          </li>
          <li>
            <Link to="/pricing">Pricing</Link>
          </li>
        </ul>
      </FooterColumn>

      <FooterColumn>
        <h3>Company</h3>
        <ul>
          <li>
            <Link to="/about">About Us</Link>
          </li>
          <li>
            <Link to="/talents">Talents</Link>
          </li>
          <li>
            <Link to="/terms-and-conditions">Terms and Conditions</Link>
          </li>
        </ul>
      </FooterColumn>

      <div className={styles.footerBottom}>
        <p>© 2026 StaffMedix. All rights reserved.</p>
        <p>Trusted by 500+ healthcare facilities across Nigeria</p>
      </div>
    </section>
  );
}
