import { Link } from "react-router";
import styles from "./EmployerDashboard.module.css";

export default function EmployerDashboard() {
  const stats = [
    { label: "Active Job Posts", value: "8", icon: "💼" },
    { label: "Total Applications", value: "156", icon: "📄" },
    { label: "Shortlisted", value: "23", icon: "⭐" },
    { label: "Interviews Scheduled", value: "12", icon: "📅" },
  ];

  const jobPosts = [
    {
      id: 1,
      title: "Senior ICU Nurse",
      applicants: 45,
      status: "Active",
      postedDate: "Jan 10, 2026",
      deadline: "Feb 10, 2026",
    },
    {
      id: 2,
      title: "Registered Nurse",
      applicants: 38,
      status: "Active",
      postedDate: "Jan 8, 2026",
      deadline: "Feb 8, 2026",
    },
    {
      id: 3,
      title: "Pediatric Nurse",
      applicants: 27,
      status: "Closed",
      postedDate: "Dec 20, 2025",
      deadline: "Jan 20, 2026",
    },
  ];

  const recentApplications = [
    {
      id: 1,
      candidateName: "Dr. Sarah Okonkwo",
      position: "Senior ICU Nurse",
      appliedDate: "2 hours ago",
      experience: "8 years",
      status: "New",
    },
    {
      id: 2,
      candidateName: "Nurse Chioma Eze",
      position: "Registered Nurse",
      appliedDate: "5 hours ago",
      experience: "5 years",
      status: "New",
    },
    {
      id: 3,
      candidateName: "Dr. James Adebayo",
      position: "Senior ICU Nurse",
      appliedDate: "1 day ago",
      experience: "10 years",
      status: "Reviewed",
    },
  ];

  return (
    <div className={styles.dashboard}>
      <div className={styles.dashboardHeader}>
        <div>
          <h1>Welcome back, General Hospital Lagos!</h1>
          <p>Manage your job postings and candidate applications</p>
        </div>
        <Link to="/post-job" className={styles.postJobButton}>
          + Post New Job
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
        <section className={styles.jobPostsSection}>
          <div className={styles.sectionHeader}>
            <h2>Active Job Posts</h2>
            <Link to="/jobs">View All</Link>
          </div>

          <div className={styles.jobPostsList}>
            {jobPosts.map((job) => (
              <div key={job.id} className={styles.jobPostCard}>
                <div className={styles.jobPostHeader}>
                  <h3>{job.title}</h3>
                  <span
                    className={`${styles.statusBadge} ${
                      job.status === "Active" ? styles.active : styles.closed
                    }`}
                  >
                    {job.status}
                  </span>
                </div>
                <div className={styles.jobPostDetails}>
                  <span>👥 {job.applicants} applicants</span>
                  <span>📅 Posted: {job.postedDate}</span>
                  <span>⏰ Deadline: {job.deadline}</span>
                </div>
                <div className={styles.jobPostActions}>
                  <Link to={`/jobs/${job.id}`} className={styles.viewButton}>
                    View Applications
                  </Link>
                  <button className={styles.editButton}>Edit</button>
                  <button className={styles.closeButton}>
                    {job.status === "Active" ? "Close" : "Reopen"}
                  </button>
                </div>
              </div>
            ))}
          </div>
        </section>

        <aside className={styles.sidebar}>
          <div className={styles.recentApplications}>
            <h3>Recent Applications</h3>
            {recentApplications.map((app) => (
              <div key={app.id} className={styles.applicationItem}>
                <div className={styles.applicantInfo}>
                  <h4>{app.candidateName}</h4>
                  <p className={styles.position}>{app.position}</p>
                  <div className={styles.applicantMeta}>
                    <span>{app.experience} experience</span>
                    <span>•</span>
                    <span>{app.appliedDate}</span>
                  </div>
                </div>
                <span
                  className={`${styles.appStatusBadge} ${
                    app.status === "New" ? styles.new : styles.reviewed
                  }`}
                >
                  {app.status}
                </span>
              </div>
            ))}
            <Link to="/applications" className={styles.viewAllApps}>
              View All Applications
            </Link>
          </div>

          <div className={styles.quickActions}>
            <h3>Quick Actions</h3>
            <Link to="/post-job" className={styles.actionButton}>
              📝 Post a Job
            </Link>
            <Link to="/pricing" className={styles.actionButton}>
              💎 Upgrade Plan
            </Link>
            <Link to="/ads" className={styles.actionButton}>
              📢 Advertise Your Organization
            </Link>
            <Link to="/chat" className={styles.actionButton}>
              💬 Messages
            </Link>
          </div>

          <div className={styles.subscriptionInfo}>
            <h3>Subscription Status</h3>
            <div className={styles.planBadge}>Professional Plan</div>
            <p className={styles.planDetails}>
              Unlimited job posts • Advanced analytics
            </p>
            <p className={styles.renewalDate}>Renews on Feb 28, 2026</p>
          </div>
        </aside>
      </div>
    </div>
  );
}
