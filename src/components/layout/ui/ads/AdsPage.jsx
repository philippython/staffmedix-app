import { Link } from "react-router";
import styles from "./AdsPage.module.css";

export default function AdsPage() {
  const organizations = [
    {
      id: 1,
      name: "General Hospital Lagos",
      logo: "🏥",
      description:
        "Leading teaching hospital with state-of-the-art facilities and comprehensive healthcare services",
      jobs: 12,
      featured: true,
      location: "Lagos, Nigeria",
      established: "1968",
      employees: "500+",
    },
    {
      id: 2,
      name: "St. Nicholas Hospital",
      logo: "🏥",
      description:
        "Premier private healthcare institution providing world-class medical services",
      jobs: 8,
      featured: true,
      location: "Lagos, Nigeria",
      established: "1985",
      employees: "300+",
    },
    {
      id: 3,
      name: "Federal Medical Centre",
      logo: "🏥",
      description:
        "Federal government healthcare facility serving communities across Nigeria",
      jobs: 15,
      featured: false,
      location: "Abuja, Nigeria",
      established: "1975",
      employees: "450+",
    },
    {
      id: 4,
      name: "National Hospital Abuja",
      logo: "🏥",
      description:
        "National referral hospital providing specialized tertiary healthcare",
      jobs: 10,
      featured: false,
      location: "Abuja, Nigeria",
      established: "1999",
      employees: "600+",
    },
    {
      id: 5,
      name: "Cedarcrest Hospitals",
      logo: "🏥",
      description:
        "Modern healthcare facility with cutting-edge medical technology",
      jobs: 6,
      featured: false,
      location: "Abuja, Nigeria",
      established: "2010",
      employees: "200+",
    },
    {
      id: 6,
      name: "Reddington Hospital",
      logo: "🏥",
      description:
        "Integrated healthcare network delivering excellent patient care",
      jobs: 9,
      featured: false,
      location: "Lagos, Nigeria",
      established: "2001",
      employees: "350+",
    },
  ];

  return (
    <div className={styles.adsPage}>
      <header className={styles.pageHeader}>
        <h1>Featured Healthcare Organizations</h1>
        <p>Discover top employers in Nigerian healthcare</p>
      </header>

      <section className={styles.featuredSection}>
        <h2>🌟 Featured Partners</h2>
        <div className={styles.featuredGrid}>
          {organizations
            .filter((org) => org.featured)
            .map((org) => (
              <div key={org.id} className={styles.featuredCard}>
                <span className={styles.featuredBadge}>Featured</span>
                <div className={styles.orgLogo}>{org.logo}</div>
                <h3>{org.name}</h3>
                <p className={styles.description}>{org.description}</p>
                <div className={styles.orgDetails}>
                  <div className={styles.detailItem}>
                    <span className={styles.icon}>📍</span>
                    <span>{org.location}</span>
                  </div>
                  <div className={styles.detailItem}>
                    <span className={styles.icon}>📅</span>
                    <span>Est. {org.established}</span>
                  </div>
                  <div className={styles.detailItem}>
                    <span className={styles.icon}>👥</span>
                    <span>{org.employees} Staff</span>
                  </div>
                </div>
                <div className={styles.cardFooter}>
                  <span className={styles.jobCount}>
                    {org.jobs} Open Positions
                  </span>
                  <Link to="/jobs" className={styles.viewButton}>
                    View Jobs
                  </Link>
                </div>
              </div>
            ))}
        </div>
      </section>

      <section className={styles.allOrganizations}>
        <h2>All Healthcare Organizations</h2>
        <div className={styles.organizationsGrid}>
          {organizations
            .filter((org) => !org.featured)
            .map((org) => (
              <div key={org.id} className={styles.orgCard}>
                <div className={styles.orgLogo}>{org.logo}</div>
                <div className={styles.orgInfo}>
                  <h3>{org.name}</h3>
                  <p className={styles.description}>{org.description}</p>
                  <div className={styles.orgMeta}>
                    <span>📍 {org.location}</span>
                    <span>•</span>
                    <span>{org.employees} Staff</span>
                  </div>
                </div>
                <div className={styles.orgActions}>
                  <span className={styles.jobCount}>
                    {org.jobs} Open Positions
                  </span>
                  <Link to="/jobs" className={styles.viewButton}>
                    View Jobs
                  </Link>
                </div>
              </div>
            ))}
        </div>
      </section>

      <section className={styles.ctaSection}>
        <h2>Want to Feature Your Organization?</h2>
        <p>Reach thousands of qualified healthcare professionals</p>
        <Link to="/pricing" className={styles.ctaButton}>
          View Advertising Plans
        </Link>
      </section>
    </div>
  );
}
