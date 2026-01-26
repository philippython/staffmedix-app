import { Link, useParams } from "react-router";
import styles from "./HospitalDetail.module.css";

export default function HospitalDetail() {
  const { id } = useParams();

  const hospital = {
    id: 1,
    name: "General Hospital Lagos",
    type: "Teaching Hospital",
    verified: true,
    logo: "🏥",
    location: "123 Medical Avenue, Lagos, Nigeria",
    phone: "+234 803 456 7890",
    email: "admin@generalhospital.ng",
    website: "https://generalhospital.ng",
    established: "1968",
    beds: "500+",
    staff: "1,200+",
    description:
      "Leading healthcare facility in Lagos providing comprehensive medical services with state-of-the-art equipment and highly qualified medical professionals.",

    services: [
      "Emergency Care",
      "ICU Services",
      "Surgery",
      "Pediatrics",
      "Maternity",
      "Laboratory",
      "Radiology",
      "Pharmacy",
    ],

    activeJobs: [
      {
        id: 1,
        title: "Senior ICU Nurse",
        location: "Lagos",
        type: "Full Time",
        posted: "2 days ago",
      },
      {
        id: 2,
        title: "Registered Nurse",
        location: "Lagos",
        type: "Full Time",
        posted: "5 days ago",
      },
      {
        id: 3,
        title: "Pediatric Nurse",
        location: "Lagos",
        type: "Contract",
        posted: "1 week ago",
      },
    ],

    reviews: [
      {
        id: 1,
        author: "Dr. John Doe",
        role: "Former Employee",
        rating: 4,
        comment:
          "Great place to work. Supportive management and good facilities.",
        date: "2 months ago",
      },
      {
        id: 2,
        author: "Nurse Jane Smith",
        role: "Current Employee",
        rating: 5,
        comment:
          "Excellent work environment. Professional development opportunities available.",
        date: "1 month ago",
      },
    ],
  };

  return (
    <div className={styles.hospitalDetail}>
      <div className={styles.header}>
        <div className={styles.hospitalHeader}>
          <div className={styles.hospitalLogo}>{hospital.logo}</div>
          <div className={styles.hospitalInfo}>
            <h1>{hospital.name}</h1>
            <p className={styles.type}>{hospital.type}</p>
            {hospital.verified && (
              <span className={styles.verifiedBadge}>✓ Verified</span>
            )}
          </div>
        </div>

        <div className={styles.actions}>
          <Link to="/chat" className={styles.contactBtn}>
            💬 Contact Us
          </Link>
          <button className={styles.followBtn}>⭐ Follow</button>
        </div>
      </div>

      <div className={styles.mainContent}>
        <div className={styles.leftColumn}>
          <section className={styles.section}>
            <h2>About Us</h2>
            <p className={styles.description}>{hospital.description}</p>
          </section>

          <section className={styles.section}>
            <h2>Our Services</h2>
            <div className={styles.servicesGrid}>
              {hospital.services.map((service, index) => (
                <div key={index} className={styles.serviceItem}>
                  <span className={styles.checkIcon}>✓</span>
                  {service}
                </div>
              ))}
            </div>
          </section>

          <section className={styles.section}>
            <h2>Open Positions ({hospital.activeJobs.length})</h2>
            {hospital.activeJobs.map((job) => (
              <div key={job.id} className={styles.jobItem}>
                <div>
                  <h3>{job.title}</h3>
                  <div className={styles.jobMeta}>
                    <span>📍 {job.location}</span>
                    <span>•</span>
                    <span>💼 {job.type}</span>
                    <span>•</span>
                    <span>📅 {job.posted}</span>
                  </div>
                </div>
                <Link to={`/jobs/${job.id}`} className={styles.viewJobBtn}>
                  View Job
                </Link>
              </div>
            ))}
          </section>

          <section className={styles.section}>
            <h2>Reviews & Ratings</h2>
            <div className={styles.reviewsList}>
              {hospital.reviews.map((review) => (
                <div key={review.id} className={styles.reviewItem}>
                  <div className={styles.reviewHeader}>
                    <div>
                      <h4>{review.author}</h4>
                      <p className={styles.reviewRole}>{review.role}</p>
                    </div>
                    <div className={styles.rating}>
                      {"⭐".repeat(review.rating)}
                    </div>
                  </div>
                  <p className={styles.reviewComment}>{review.comment}</p>
                  <p className={styles.reviewDate}>{review.date}</p>
                </div>
              ))}
            </div>
          </section>
        </div>

        <aside className={styles.rightColumn}>
          <div className={styles.infoCard}>
            <h3>Contact Information</h3>
            <div className={styles.contactItem}>
              <span className={styles.icon}>📍</span>
              <span>{hospital.location}</span>
            </div>
            <div className={styles.contactItem}>
              <span className={styles.icon}>📞</span>
              <span>{hospital.phone}</span>
            </div>
            <div className={styles.contactItem}>
              <span className={styles.icon}>📧</span>
              <span>{hospital.email}</span>
            </div>
            <div className={styles.contactItem}>
              <span className={styles.icon}>🌐</span>
              <a
                href={hospital.website}
                target="_blank"
                rel="noopener noreferrer"
              >
                Visit Website
              </a>
            </div>
          </div>

          <div className={styles.infoCard}>
            <h3>Quick Facts</h3>
            <div className={styles.factItem}>
              <span className={styles.label}>Established:</span>
              <span className={styles.value}>{hospital.established}</span>
            </div>
            <div className={styles.factItem}>
              <span className={styles.label}>Bed Capacity:</span>
              <span className={styles.value}>{hospital.beds}</span>
            </div>
            <div className={styles.factItem}>
              <span className={styles.label}>Total Staff:</span>
              <span className={styles.value}>{hospital.staff}</span>
            </div>
            <div className={styles.factItem}>
              <span className={styles.label}>Active Jobs:</span>
              <span className={styles.value}>{hospital.activeJobs.length}</span>
            </div>
          </div>

          <div className={styles.infoCard}>
            <h3>Quick Actions</h3>
            <Link to="/jobs" className={styles.actionBtn}>
              View All Jobs
            </Link>
            <button className={styles.actionBtn}>Share Hospital</button>
            <button className={styles.actionBtn}>Report Issue</button>
          </div>
        </aside>
      </div>
    </div>
  );
}
