import styles from "./About.module.css";
import AppNav from "./AppNav";
import Footer from "./Footer";
import { Link } from "react-router";

const stats = [
  { value: "100+", label: "Healthcare Facilities" },
  { value: "150+", label: "Verified Professionals" },
  { value: "36", label: "States Covered" },
  { value: "98%", label: "Placement Success Rate" },
];

const values = [
  {
    icon: "🔬",
    title: "Verified First",
    desc: "Every professional on StaffMedix is credentialed-checked. Licenses, certifications, and references — verified before they ever apply.",
  },
  {
    icon: "🤝",
    title: "Trust at Every Step",
    desc: "From application to onboarding, we build transparency between healthcare employers and talent so both sides can move with confidence.",
  },
  {
    icon: "🌍",
    title: "Built for Nigeria",
    desc: "We understand the unique dynamics of Nigerian healthcare — from teaching hospitals in Ibadan to private clinics in Abuja and beyond.",
  },
  {
    icon: "⚡",
    title: "Speed Without Compromise",
    desc: "Healthcare can't wait. Our platform cuts hiring timelines from months to days without sacrificing the quality of every match.",
  },
];

const team = [
  { name: "Dr. Wasiu Oladipupo", role: "Co-founder & CEO", bg: "#0d9269" },
  { name: "Odulaja Philip Temitayo", role: "Technical Lead", bg: "#1e7a5e" },
];

export default function About() {
  return (
    <>
      <AppNav />
      <main className={styles.page}>
        {/* ── Hero ── */}
        <section className={styles.hero}>
          <div className={styles.heroInner}>
            <span className={styles.eyebrow}>About StaffMedix</span>
            <h1 className={styles.heroTitle}>
              Nigeria's Healthcare
              <br />
              <em>Talent Infrastructure</em>
            </h1>
            <p className={styles.heroSub}>
              We built the bridge between Nigeria's best healthcare
              professionals and the facilities that need them most — verified,
              fast, and built to last.
            </p>
            <div className={styles.heroCtas}>
              <Link to="/jobs" className={styles.ctaPrimary}>
                Find Jobs
              </Link>
              <Link to="/auth/employer-signup" className={styles.ctaSecondary}>
                Post a Role
              </Link>
            </div>
          </div>
          <div className={styles.heroVisual}>
            <div className={styles.heroOrb} />
            <div className={styles.heroPulse} />
            <div className={styles.heroCard}>
              <span className={styles.heroCardIcon}>🏥</span>
              <div>
                <strong>500+ Facilities</strong>
                <span>trust StaffMedix</span>
              </div>
            </div>
            <div className={styles.heroCard2}>
              <span className={styles.heroCardIcon}>✅</span>
              <div>
                <strong>All verified</strong>
                <span>licensed professionals</span>
              </div>
            </div>
          </div>
        </section>

        {/* ── Stats ── */}
        <section className={styles.statsSection}>
          {stats.map((s) => (
            <div key={s.label} className={styles.statItem}>
              <span className={styles.statValue}>{s.value}</span>
              <span className={styles.statLabel}>{s.label}</span>
            </div>
          ))}
        </section>

        {/* ── Mission ── */}
        <section className={styles.mission}>
          <div className={styles.missionText}>
            <span className={styles.eyebrow}>Our Mission</span>
            <h2>Fix how Nigerian healthcare staffing works</h2>
            <p>
              For too long, hospitals and clinics across Nigeria have relied on
              word-of-mouth, informal networks, and slow recruitment agencies to
              find qualified staff. Meanwhile, skilled nurses, doctors,
              pharmacists and allied health workers struggle to find roles that
              match their credentials and ambitions.
            </p>
            <p>
              StaffMedix changes that. We created a single, trusted platform
              where every professional is verified and every facility is
              accountable — making the right match faster, safer, and more
              transparent than anything that existed before.
            </p>
          </div>
          <div className={styles.missionVisual}>
            <div className={styles.missionCard}>
              <div className={styles.missionIcon}>🎯</div>
              <h3>The Problem We Solved</h3>
              <ul>
                <li>Unverified credentials causing patient safety risks</li>
                <li>Months-long hiring cycles for urgent roles</li>
                <li>No central platform for healthcare talent in Nigeria</li>
                <li>Professionals undervalued due to opacity in hiring</li>
              </ul>
            </div>
          </div>
        </section>

        {/* ── Values ── */}
        <section className={styles.values}>
          <div className={styles.sectionHead}>
            <span className={styles.eyebrow}>What Drives Us</span>
            <h2>Our Core Values</h2>
          </div>
          <div className={styles.valuesGrid}>
            {values.map((v) => (
              <div key={v.title} className={styles.valueCard}>
                <span className={styles.valueIcon}>{v.icon}</span>
                <h3>{v.title}</h3>
                <p>{v.desc}</p>
              </div>
            ))}
          </div>
        </section>

        {/* ── Story ── */}
        <section className={styles.story}>
          <span className={styles.eyebrow}>Our Story</span>
          <h2>How it started</h2>
          <div className={styles.storyBody}>
            <p>
              StaffMedix was founded in 2025 by a team who had experienced the
              Nigerian healthcare staffing crisis from both sides — as
              clinicians who struggled to find stable, well-paying roles, and as
              administrators who spent months trying to fill critical vacancies.
            </p>
            <p>
              We started in Lagos with a simple idea: what if every healthcare
              professional could prove their credentials digitally, and every
              employer could hire with the same confidence as the best private
              hospitals? What started as a local experiment is now a platform
              trusted across all 36 states of Nigeria.
            </p>
            <p>
              Today, StaffMedix powers the staffing operations of teaching
              hospitals, private health systems, diagnostic labs, pharmacies,
              and specialist clinics — and we're just getting started.
            </p>
          </div>
        </section>

        {/* ── Team ── */}
        <section className={styles.team}>
          <div className={styles.sectionHead}>
            <span className={styles.eyebrow}>The People</span>
            <h2>Who's behind StaffMedix</h2>
          </div>
          <div className={styles.teamGrid}>
            {team.map((t) => (
              <div key={t.name} className={styles.teamCard}>
                <div className={styles.teamAvatar} style={{ background: t.bg }}>
                  {t.name
                    .split(" ")
                    .map((n) => n[0])
                    .join("")}
                </div>
                <h3>{t.name}</h3>
                <p>{t.role}</p>
              </div>
            ))}
          </div>
        </section>

        {/* ── CTA ── */}
        <section className={styles.ctaSection}>
          <div className={styles.ctaBox}>
            <h2>Ready to be part of the change?</h2>
            <p>
              Whether you're a healthcare professional or a facility looking to
              hire — StaffMedix was built for you.
            </p>
            <div className={styles.ctaButtons}>
              <Link to="/auth/employee-signup" className={styles.ctaPrimary}>
                Join as a Professional
              </Link>
              <Link to="/auth/employer-signup" className={styles.ctaSecondary}>
                Hire on StaffMedix
              </Link>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
