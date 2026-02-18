import { Link } from "react-router";
import styles from "./EmployerDashboard.module.css";
import { useGetJobsQuery } from "../../services/jobsApi";
import { useWhoAmIQuery } from "../../services/userApi";
import { useGetCompanyProfileByIdQuery } from "../../services/employerApi";

export default function EmployerDashboard() {
  const { data: user } = useWhoAmIQuery();
  const { data: company } = useGetCompanyProfileByIdQuery(user?.company_id, {
    skip: !user?.company_id,
  });
  const { data: jobsData, isLoading } = useGetJobsQuery(
    { company: user?.company_id, limit: 100 },
    { skip: !user?.company_id },
  );

  const jobPosts = jobsData?.results ?? [];

  const stats = [
    {
      label: "Total Job Posts",
      value: jobPosts.length.toString(),
      icon: "💼",
    },
    {
      label: "Total Applications",
      value: jobPosts
        .reduce((sum, j) => sum + (j.applications_count ?? 0), 0)
        .toString(),
      icon: "📄",
    },
    { label: "Shortlisted", value: "0", icon: "⭐" },
    { label: "Interviews Scheduled", value: "0", icon: "📅" },
  ];

  return (
    <div className={styles.dashboard}>
      <div className={styles.dashboardHeader}>
        <div>
          <h1>Welcome back, {company?.company_name ?? "Employer"}!</h1>
          <p>Manage your job postings and candidate applications</p>
        </div>
        <div className={styles.headerActionButtons}>
          <Link
            to="/employer-dashboard/settings"
            className={styles.settingsButton}
          >
            ⚙️ Settings
          </Link>
          <Link
            to="/employer-dashboard/post-job"
            className={styles.postJobButton}
          >
            + Post New Job
          </Link>
        </div>
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
            <h2>Job Posts</h2>
            <Link to="/employer-dashboard/all-job-posts">View All</Link>
          </div>

          <div className={styles.jobPostsList}>
            {isLoading ? (
              <p>Loading...</p>
            ) : jobPosts.length === 0 ? (
              <p>No job posts yet.</p>
            ) : (
              jobPosts.slice(0, 3).map((job) => (
                <div key={job.id} className={styles.jobPostCard}>
                  <div className={styles.jobPostHeader}>
                    <h3>{job.title}</h3>
                  </div>
                  <div className={styles.jobPostDetails}>
                    <span>👥 {job.applications_count ?? 0} applicants</span>
                    <span>
                      📅 Posted:{" "}
                      {new Date(job.created_at).toLocaleDateString("en-GB", {
                        day: "numeric",
                        month: "short",
                        year: "numeric",
                      })}
                    </span>
                    <span>
                      ⏰ Deadline:{" "}
                      {new Date(job.deadline).toLocaleDateString("en-GB", {
                        day: "numeric",
                        month: "short",
                        year: "numeric",
                      })}
                    </span>
                  </div>
                  <div className={styles.jobPostActions}>
                    <Link
                      to={`/employer-dashboard/view-applications/${job.id}`}
                      className={styles.viewButton}
                    >
                      View Applications
                    </Link>
                    <Link to={`/employer-dashboard/job-edit/${job.id}`}>
                      <button className={styles.editButton}>Edit</button>
                    </Link>
                  </div>
                </div>
              ))
            )}
          </div>
        </section>

        <aside className={styles.sidebar}>
          <div className={styles.recentApplications}>
            <h3>Recent Applications</h3>
            <p>No recent applications.</p>
            <Link
              to="/employer-dashboard/applications"
              className={styles.viewAllApps}
            >
              View All Applications
            </Link>
          </div>

          <div className={styles.quickActions}>
            <h3>Quick Actions</h3>
            <Link
              to="/employer-dashboard/interviews"
              className={styles.actionButton}
            >
              📝 Check Interviews
            </Link>
            <Link
              to="/employer-dashboard/settings"
              className={styles.actionButton}
            >
              💎 Upgrade Plan
            </Link>
            <Link
              to="/employer-dashboard/ads-manager"
              className={styles.actionButton}
            >
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
