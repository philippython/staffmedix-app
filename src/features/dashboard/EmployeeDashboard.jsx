import { Link } from "react-router";
import styles from "./EmployeeDashboard.module.css";
import { useGetAppliedJobsQuery } from "../../services/jobsApi";
import { useWhoAmIQuery } from "../../services/userApi";
import { useMemo } from "react";

export default function EmployeeDashboard() {
  // Get current user info
  const { data: user, isLoading: userLoading } = useWhoAmIQuery();

  // Get applied jobs for the current user
  const {
    data: appliedJobsData,
    isLoading: applicationsLoading,
    isError: applicationsError,
  } = useGetAppliedJobsQuery({ limit: 3 });

  // Format status for display
  const formatStatus = (status) => {
    const statusMap = {
      PENDING: "Pending",
      "UNDER REVIEW": "Under Review",
      INTERVIEW_SCHEDULED: "Interview Scheduled",
      SHORTLISTED: "Shortlisted",
      ACCEPTED: "Accepted",
      REJECTED: "Rejected",
      WITHDRAWN: "Withdrawn",
    };
    return statusMap[status] || status;
  };

  // Get status class (matching your original CSS classes)
  const getStatusClass = (status) => {
    const displayStatus = formatStatus(status);
    const statusMap = {
      Pending: "pending",
      "Under Review": "underreview",
      "Interview Scheduled": "interviewscheduled",
      Shortlisted: "shortlisted",
      Rejected: "rejected",
      Withdrawn: "withdrawn",
      Accepted: "accepted",
    };
    return statusMap[displayStatus] || "";
  };

  // Calculate stats from applied jobs data
  const stats = useMemo(() => {
    if (!appliedJobsData?.results) {
      return [
        { label: "Applications Submitted", value: "0", icon: "📄" },
        { label: "Interviews Scheduled", value: "0", icon: "📅" },
        { label: "Profile Views", value: "0", icon: "👁️" },
      ];
    }

    const applications = appliedJobsData.results;
    const totalApplications = appliedJobsData.count || applications.length;
    const interviewsScheduled = applications.filter(
      (app) => app.status === "INTERVIEW_SCHEDULED",
    ).length;

    return [
      {
        label: "Applications Submitted",
        value: totalApplications.toString(),
        icon: "📄",
      },
      {
        label: "Interviews Scheduled",
        value: interviewsScheduled.toString(),
        icon: "📅",
      },
      { label: "Profile Views", value: "0", icon: "👁️" },
    ];
  }, [appliedJobsData]);

  // Format date
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  };

  const applications = appliedJobsData?.results || [];
  const userName = user?.fullname || user?.username || "User";

  return (
    <div className={styles.dashboard}>
      <div className={styles.dashboardHeader}>
        <div>
          <h1>Welcome back, {userName}!</h1>
          <p>Here's what's happening with your applications</p>
        </div>
        <Link
          to={`/employee-dashboard/profile/edit/${user?.talent_id}`}
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
            {applicationsLoading ? (
              <p>Loading applications...</p>
            ) : applicationsError ? (
              <p>Error loading applications. Please try again later.</p>
            ) : applications.length === 0 ? (
              <p>
                No applications yet. <Link to="/jobs">Browse jobs</Link> to get
                started!
              </p>
            ) : (
              applications.map((app) => (
                <div key={app.id} className={styles.applicationCard}>
                  <div className={styles.applicationInfo}>
                    <h3>{app["job"]?.title || "Job Title"}</h3>
                    <p className={styles.hospital}>
                      {app["company"]?.company_name || "Company"}
                    </p>
                    <p className={styles.appliedDate}>
                      Applied on {formatDate(app.applied_at)}
                    </p>
                  </div>
                  <div className={styles.applicationStatus}>
                    <span
                      className={`${styles.statusBadge} ${
                        styles[getStatusClass(app.status)]
                      }`}
                    >
                      {formatStatus(app.status)}
                    </span>
                  </div>
                </div>
              ))
            )}
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
              to={`/employee-dashboard/profile/edit/${user?.talent_id}`}
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
