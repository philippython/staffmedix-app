import { Link } from "react-router";
import styles from "./EmployeeDashboard.module.css";

export default function EmployeeDashboard() {
  const applications = [
    {
      id: 1,
      jobTitle: "Senior ICU Nurse",
      hospital: "Lagos University Teaching Hospital",
      status: "Under Review",
      appliedDate: "Jan 15, 2026",
    },
    {
      id: 2,
      jobTitle: "Pediatric Nurse",
      hospital: "Federal Medical Centre",
      status: "Interview Scheduled",
      appliedDate: "Jan 10, 2026",
    },
    {
      id: 3,
      jobTitle: "Emergency Room Nurse",
      hospital: "National Hospital Abuja",
      status: "Rejected",
      appliedDate: "Jan 5, 2026",
    },
  ];

  const stats = [
    { label: "Applications Submitted", value: "12", icon: "📄" },
    { label: "Interviews Scheduled", value: "3", icon: "📅" },
    { label: "Profile Views", value: "45", icon: "👁️" },
    { label: "Saved Jobs", value: "8", icon: "⭐" },
  ];

  return (
    <div className={styles.dashboard}>
      <div className={styles.dashboardHeader}>
        <div>
          <h1>Welcome back, Dr. Sarah!</h1>
          <p>Here's what's happening with your applications</p>
        </div>
        <Link
          to="/employee-dashboard/profile/edit"
          className={styles.editProfile}
        >
          Edit Profile
        </Link>
      </div>

      <div className={styles.statsGrid}>
        {stats.map((stat, index) => (
          <div key={index} className={styles.statCard}>
            <span className={styles.statIcon}>{stat.icon}</span>
            <div>
              <p className={styles.statValue}>{stat.value}</p>
              <p className={styles.statLabel}>{stat.label}</p>
            </div>
          </div>
        ))}
      </div>

      <div className={styles.mainContent}>
        <section className={styles.applications}>
          <div className={styles.sectionHeader}>
            <h2>Recent Applications</h2>
            <Link to="/employee-dashboard/applications">View All</Link>
          </div>

          <div className={styles.applicationsList}>
            {applications.map((app) => (
              <div key={app.id} className={styles.applicationCard}>
                <div className={styles.applicationInfo}>
                  <h3>{app.jobTitle}</h3>
                  <p className={styles.hospital}>{app.hospital}</p>
                  <p className={styles.appliedDate}>
                    Applied on {app.appliedDate}
                  </p>
                </div>
                <div className={styles.applicationStatus}>
                  <span
                    className={`${styles.statusBadge} ${
                      styles[app.status.replace(" ", "").toLowerCase()]
                    }`}
                  >
                    {app.status}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </section>

        <aside className={styles.sidebar}>
          <div className={styles.profileCompletion}>
            <h3>Profile Completion</h3>
            <div className={styles.progressBar}>
              <div className={styles.progress} style={{ width: "75%" }}></div>
            </div>
            <p className={styles.completionText}>75% Complete</p>
            <Link
              to="/employee-dashboard/profile/edit"
              className={styles.completeProfile}
            >
              Complete Your Profile
            </Link>
          </div>

          <div className={styles.recommendedJobs}>
            <h3>Recommended Jobs</h3>
            <div className={styles.jobCard}>
              <h4>ICU Specialist</h4>
              <p>General Hospital Lagos</p>
              <Link to="/jobs/5">View Details</Link>
            </div>
            <div className={styles.jobCard}>
              <h4>Registered Nurse</h4>
              <p>St. Nicholas Hospital</p>
              <Link to="/jobs/6">View Details</Link>
            </div>
          </div>

          <div className={styles.quickActions}>
            <h3>Quick Actions</h3>
            <Link
              to="/employee-dashboard/interviews"
              className={styles.actionButton}
            >
              Check Interviews
            </Link>
            <Link to="/notifications" className={styles.actionButton}>
              View Notifications
            </Link>
            <Link to="/chat" className={styles.actionButton}>
              Messages
            </Link>
          </div>
        </aside>
      </div>
    </div>
  );
}
