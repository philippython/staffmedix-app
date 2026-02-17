import { useState } from "react";
import { Link } from "react-router";
import styles from "./Applications.module.css";
import { useGetAppliedJobsQuery } from "../../services/jobsApi";
import { useWhoAmIQuery } from "../../services/userApi";

export default function Applications() {
  const [filter, setFilter] = useState("all");

  // Get current user
  const { data: user } = useWhoAmIQuery();

  // Get applied jobs from API (filtered by current talent)
  const {
    data: appliedJobsData,
    isLoading,
    isError,
  } = useGetAppliedJobsQuery(
    {
      limit: 100,
      talent: user?.talent_id,
    },
    {
      skip: !user?.talent_id,
    },
  );

  const applications = appliedJobsData?.results || [];

  // Format status for display
  const formatStatus = (status) => {
    const statusMap = {
      PENDING: "Pending",
      REVIEWED: "Under Review",
      INTERVIEW_SCHEDULED: "Interview Scheduled",
      SHORTLISTED: "Shortlisted",
      ACCEPTED: "Accepted",
      REJECTED: "Rejected",
      WITHDRAWN: "Withdrawn",
    };
    return statusMap[status] || status;
  };

  // Format date
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  };

  // Format datetime
  const formatDateTime = (dateString) => {
    if (!dateString) return "N/A";
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
      hour: "numeric",
      minute: "2-digit",
      hour12: true,
    });
  };

  // Format salary
  const formatSalary = (min, max) => {
    if (!min && !max) return "Negotiable";
    if (min && max)
      return `₦${min.toLocaleString()} - ₦${max.toLocaleString()}`;
    if (min) return `₦${min.toLocaleString()}`;
    return `₦${max.toLocaleString()}`;
  };

  // Format employment type
  const formatEmploymentType = (type) => {
    const typeMap = {
      FULL_TIME: "Full Time",
      PART_TIME: "Part Time",
      CONTRACT: "Contract",
      TEMPORARY: "Temporary",
      INTERNSHIP: "Internship",
    };
    return typeMap[type] || type;
  };

  const filteredApplications = applications.filter((app) => {
    const displayStatus = formatStatus(app.status);
    if (filter === "active") {
      return [
        "Pending",
        "Under Review",
        "Interview Scheduled",
        "Shortlisted",
      ].includes(displayStatus);
    }
    if (filter === "archived") {
      return ["Rejected", "Withdrawn"].includes(displayStatus);
    }
    return true;
  });

  const getStatusClass = (status) => {
    const displayStatus = formatStatus(status);
    const statusMap = {
      Pending: "pending",
      "Under Review": "underreview",
      "Interview Scheduled": "interview",
      Shortlisted: "shortlisted",
      Rejected: "rejected",
      Withdrawn: "withdrawn",
      Accepted: "accepted",
    };
    return statusMap[displayStatus] || "";
  };

  // Count applications by filter
  const activeCount = applications.filter((a) =>
    ["Pending", "Under Review", "Interview Scheduled", "Shortlisted"].includes(
      formatStatus(a.status),
    ),
  ).length;

  const archivedCount = applications.filter((a) =>
    ["Rejected", "Withdrawn"].includes(formatStatus(a.status)),
  ).length;

  if (isLoading) {
    return (
      <div className={styles.applicationsPage}>
        <div className={styles.header}>
          <div>
            <h1>My Applications</h1>
            <p>Loading your applications...</p>
          </div>
        </div>
      </div>
    );
  }

  if (isError) {
    return (
      <div className={styles.applicationsPage}>
        <div className={styles.header}>
          <div>
            <h1>My Applications</h1>
            <p>Error loading applications. Please try again later.</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={styles.applicationsPage}>
      <div className={styles.header}>
        <div>
          <h1>My Applications</h1>
          <p>Track your job applications and their status</p>
        </div>
        <Link to="/jobs" className={styles.browseButton}>
          Browse Jobs
        </Link>
      </div>

      <div className={styles.filterSection}>
        <div className={styles.filterButtons}>
          <button
            className={filter === "all" ? styles.active : ""}
            onClick={() => setFilter("all")}
          >
            All Applications ({applications.length})
          </button>
          <button
            className={filter === "active" ? styles.active : ""}
            onClick={() => setFilter("active")}
          >
            Active ({activeCount})
          </button>
          <button
            className={filter === "archived" ? styles.active : ""}
            onClick={() => setFilter("archived")}
          >
            Archived ({archivedCount})
          </button>
        </div>
      </div>

      <div className={styles.applicationsList}>
        {filteredApplications.length > 0 ? (
          filteredApplications.map((app) => (
            <div key={app.id} className={styles.applicationCard}>
              <div className={styles.cardHeader}>
                <div>
                  <h3>{app.job?.title || "Job Title"}</h3>
                  <p className={styles.hospital}>
                    {app.company?.company_name || "Company"}
                  </p>
                </div>
                <span
                  className={`${styles.statusBadge} ${
                    styles[getStatusClass(app.status)]
                  }`}
                >
                  {formatStatus(app.status)}
                </span>
              </div>

              <div className={styles.cardBody}>
                <div className={styles.infoGrid}>
                  <div className={styles.infoItem}>
                    <span className={styles.label}>📍 Location:</span>
                    <span className={styles.value}>
                      {app.job?.location || "Location"}
                    </span>
                  </div>
                  <div className={styles.infoItem}>
                    <span className={styles.label}>💰 Salary:</span>
                    <span className={styles.value}>
                      {formatSalary(app.job?.salary_min, app.job?.salary_max)}
                      /month
                    </span>
                  </div>
                  <div className={styles.infoItem}>
                    <span className={styles.label}>⏰ Type:</span>
                    <span className={styles.value}>
                      {formatEmploymentType(app.job?.employment_type)}
                    </span>
                  </div>
                  <div className={styles.infoItem}>
                    <span className={styles.label}>📅 Applied:</span>
                    <span className={styles.value}>
                      {formatDate(app.applied_at)}
                    </span>
                  </div>
                </div>

                {/* Show interview details if interview exists */}
                {app.interview && (
                  <div className={styles.interviewAlert}>
                    <div className={styles.interviewHeader}>
                      <span className={styles.interviewIcon}>📅</span>
                      <span className={styles.interviewTitle}>
                        Interview Scheduled
                      </span>
                    </div>
                    <div className={styles.interviewDetails}>
                      <p>
                        <strong>Date & Time:</strong>{" "}
                        {formatDateTime(app.interview.scheduled_at)}
                      </p>
                      {app.interview.duration > 0 && (
                        <p>
                          <strong>Duration:</strong> {app.interview.duration}{" "}
                          minutes
                        </p>
                      )}
                      {app.interview.notes && (
                        <p>
                          <strong>Notes:</strong> {app.interview.notes}
                        </p>
                      )}
                      {app.interview.interview_link && (
                        <a
                          href={app.interview.interview_link}
                          target="_blank"
                          rel="noopener noreferrer"
                          className={styles.joinInterviewBtn}
                        >
                          🎥 Join Interview
                        </a>
                      )}
                    </div>
                  </div>
                )}
              </div>

              <div className={styles.cardFooter}>
                <Link
                  to={`/jobs/${app.job?.id}`}
                  className={styles.viewDetailsButton}
                >
                  View Job Details
                </Link>
                {app.interview && (
                  <Link
                    to="/employee-dashboard/interviews"
                    className={styles.viewInterviewButton}
                  >
                    View Interview Details
                  </Link>
                )}
                <button className={styles.withdrawButton}>
                  Withdraw Application
                </button>
              </div>
            </div>
          ))
        ) : (
          <div className={styles.emptyState}>
            <p>No applications found</p>
            <Link to="/jobs" className={styles.browseJobsLink}>
              Browse Available Jobs
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}
