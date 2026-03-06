import AppNav from "./AppNav";
import Footer from "./Footer";
import styles from "./Terms.module.css";

const sections = [
  {
    title: "1. Acceptance of Terms",
    content: `By accessing or using StaffMedix ("the Platform"), you agree to be bound by these Terms and Conditions. If you do not agree to these terms, please do not use our platform. These terms apply to all users including healthcare professionals (Talent) and healthcare facilities (Employers).`,
  },
  {
    title: "2. Eligibility",
    content: `You must be at least 18 years of age to use this platform. Healthcare professionals must hold valid, current licenses or certifications as required by Nigerian law and the relevant regulatory bodies (MDCN, NMCN, PCN, etc.). Employers must be legally registered healthcare facilities operating within Nigeria.`,
  },
  {
    title: "3. User Accounts",
    content: `You are responsible for maintaining the confidentiality of your account credentials and for all activities that occur under your account. You agree to provide accurate, current, and complete information during registration and to update such information to keep it accurate. StaffMedix reserves the right to suspend or terminate accounts that contain false or misleading information.`,
  },
  {
    title: "4. Verification of Credentials",
    content: `StaffMedix conducts a thorough verification process for healthcare professionals listed on the platform, including reasonable checks of submitted credentials, licenses, and supporting documentation. While we take verification seriously and implement structured screening procedures, we do not guarantee the absolute accuracy, completeness, or ongoing validity of any credential information provided. Employers remain responsible for conducting their own independent due diligence and background checks before making hiring decisions. StaffMedix shall not be liable for any loss or damage arising from reliance on credential information or hiring outcomes.`,
  },
  {
    title: "5. Prohibited Conduct",
    content: `Users must not: (a) submit false, misleading, or fraudulent information; (b) impersonate any person or entity; (c) use the platform for any unlawful purpose; (d) attempt to gain unauthorized access to any part of the platform; (e) harass, abuse, or harm other users; (f) scrape, crawl, or use automated means to access platform content; (g) post job listings that are discriminatory, deceptive, or illegal under Nigerian law.`,
  },
  {
    title: "6. Job Listings and Applications",
    content: `Employers are solely responsible for the accuracy and legality of their job listings. StaffMedix reserves the right to remove any listing that violates these terms or applicable law. Healthcare professionals who submit applications represent that all information provided is truthful and accurate. Submitting false information may result in permanent account termination.`,
  },
  {
    title: "7. Subscriptions and Payments",
    content: `Certain features of StaffMedix are available on a paid subscription basis. All fees are stated in Nigerian Naira (₦) and are non-refundable unless otherwise required by law. Subscriptions automatically renew at the end of each billing period unless cancelled before the renewal date. StaffMedix reserves the right to modify pricing with 30 days' notice to subscribers.`,
  },
  {
    title: "8. Intellectual Property",
    content: `All content on the StaffMedix platform, including but not limited to text, graphics, logos, icons, and software, is the property of StaffMedix or its content suppliers and is protected by applicable intellectual property laws. You may not reproduce, distribute, or create derivative works without explicit written permission from StaffMedix.`,
  },
  {
    title: "9. Privacy and Data",
    content: `Your use of the platform is also governed by our Privacy Policy. By using StaffMedix, you consent to the collection and use of your personal data as described therein. We take data protection seriously and comply with the Nigeria Data Protection Regulation (NDPR). You retain ownership of your personal data and may request deletion at any time, subject to our legal obligations to retain certain records.`,
  },
  {
    title: "10. Limitation of Liability",
    content: `To the fullest extent permitted by law, StaffMedix shall not be liable for any indirect, incidental, special, consequential, or punitive damages, including lost profits, lost revenue, loss of data, or loss of goodwill, arising out of or related to your use of the platform. Our total aggregate liability shall not exceed the amount paid by you to StaffMedix in the 12 months preceding the claim.`,
  },
  {
    title: "11. Indemnification",
    content: `You agree to indemnify, defend, and hold harmless StaffMedix and its officers, directors, employees, and agents from any claims, liabilities, damages, losses, and expenses, including reasonable legal fees, arising out of or in any way connected with your access to or use of the platform, your violation of these Terms, or your violation of any rights of another party.`,
  },
  {
    title: "12. Termination",
    content: `StaffMedix may terminate or suspend your access to the platform immediately, without prior notice, if you breach any of these Terms. Upon termination, your right to use the platform ceases immediately. Provisions that by their nature should survive termination shall survive, including ownership provisions, warranty disclaimers, indemnity, and limitations of liability.`,
  },
  {
    title: "13. Governing Law",
    content: `These Terms shall be governed by and construed in accordance with the laws of the Federal Republic of Nigeria. Any disputes arising from these Terms or your use of the platform shall be subject to the exclusive jurisdiction of the courts of Lagos State, Nigeria.`,
  },
  {
    title: "14. Changes to Terms",
    content: `StaffMedix reserves the right to modify these Terms at any time. We will notify registered users of material changes via email or a prominent notice on the platform at least 14 days before the changes take effect. Your continued use of the platform after changes take effect constitutes your acceptance of the revised Terms.`,
  },
  {
    title: "15. Contact Us",
    content: `If you have any questions about these Terms and Conditions, please contact us at: hello@staffmedix.com or call +234 704 922 8347. Our offices are located in Lagos, Nigeria.`,
  },
];

export default function Terms() {
  return (
    <>
      <AppNav />
      <main className={styles.page}>
        <div className={styles.hero}>
          <span className={styles.eyebrow}>Legal</span>
          <h1>Terms & Conditions</h1>
          <p>Last updated: February 25, 2026</p>
        </div>

        <div className={styles.layout}>
          {/* Sidebar TOC */}
          <aside className={styles.sidebar}>
            <p className={styles.tocTitle}>Contents</p>
            <nav className={styles.toc}>
              {sections.map((s) => (
                <a
                  key={s.title}
                  href={`#${s.title.replace(/\s+/g, "-").toLowerCase()}`}
                  className={styles.tocLink}
                >
                  {s.title}
                </a>
              ))}
            </nav>
          </aside>

          {/* Content */}
          <div className={styles.content}>
            <div className={styles.intro}>
              <p>
                Welcome to StaffMedix. These Terms and Conditions govern your
                use of our platform, which connects verified Nigerian healthcare
                professionals with trusted healthcare employers. Please read
                these terms carefully before using our services.
              </p>
            </div>

            {sections.map((s) => (
              <section
                key={s.title}
                id={s.title.replace(/\s+/g, "-").toLowerCase()}
                className={styles.section}
              >
                <h2>{s.title}</h2>
                <p>{s.content}</p>
              </section>
            ))}

            <div className={styles.footer}>
              <p>
                By using StaffMedix, you acknowledge that you have read,
                understood, and agree to be bound by these Terms and Conditions.
              </p>
              <p>
                For questions, contact us at{" "}
                <a href="mailto:hello@staffmedix.com">hello@staffmedix.com</a>
              </p>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
