import { useState } from "react";
import { Link } from "react-router";
import styles from "./Applications.module.css";
import {
  useGetAppliedJobsQuery,
  useDeleteAppliedJobMutation,
} from "../../services/jobsApi";
import { useWhoAmIQuery } from "../../services/userApi";

export default function Applications() {
  const [filter, setFilter] = useState("all");

  const { data: user } = useWhoAmIQuery();

  const {
    data: appliedJobsData,
    isLoading,
    isError,
  } = useGetAppliedJobsQuery(
    { limit: 100, talent: user?.talent_id },
    { skip: !user?.talent_id },
  );

  const [deleteAppliedJob, { isLoading: isWithdrawing }] =
    useDeleteAppliedJobMutation();

  const applications = appliedJobsData?.results || [];

  const handleWithdraw = async (appId, jobTitle) => {
    if (
      !confirm(`Withdraw application for "${jobTitle}"? This cannot be undone.`)
    )
      return;
    try {
      await deleteAppliedJob(appId).unwrap();
      alert("Application withdrawn successfully");
    } catch (error) {
      alert(error?.data?.detail || "Failed to withdraw application");
    }
  };

  const STATUS_LABELS = {
    PENDING: "Pending",
    UNDER_REVIEW: "Under Review",
    SELECTED: "Selected",
    REJECTED: "Rejected",
  };

  const STATUS_CLASS = {
    PENDING: "pending",
    UNDER_REVIEW: "underreview",
    SELECTED: "accepted",
    REJECTED: "rejected",
  };

  const formatDate = (d) =>
    new Date(d).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });

  const formatDateTime = (d) => {
    if (!d) return "N/A";
    return new Date(d).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
      hour: "numeric",
      minute: "2-digit",
      hour12: true,
    });
  };

  const formatSalary = (min, max) => {
    if (!min && !max) return "Negotiable";
    if (min && max)
      return `₦${Number(min).toLocaleString()} – ₦${Number(max).toLocaleString()}`;
    return `₦${Number(min || max).toLocaleString()}`;
  };

  const formatEmploymentType = (type) =>
    ({
      FULLTIME: "Full Time",
      PART_TIME: "Part Time",
      CONTRACT: "Contract",
      LOCUM: "Locum",
    })[type] || type;

  const filteredApplications = applications.filter((app) => {
    if (filter === "active")
      return ["PENDING", "UNDER_REVIEW"].includes(app.status);
    if (filter === "selected") return app.status === "SELECTED";
    if (filter === "rejected") return app.status === "REJECTED";
    return true;
  });

  const activeCount = applications.filter((a) =>
    ["PENDING", "UNDER_REVIEW"].includes(a.status),
  ).length;
  const selectedCount = applications.filter(
    (a) => a.status === "SELECTED",
  ).length;
  const rejectedCount = applications.filter(
    (a) => a.status === "REJECTED",
  ).length;

  if (isLoading)
    return (
      <div className={styles.applicationsPage}>
        <div className={styles.header}>
          <div>
            <h1>My Applications</h1>
            <p>Loading...</p>
          </div>
        </div>
      </div>
    );

  if (isError)
    return (
      <div className={styles.applicationsPage}>
        <div className={styles.header}>
          <div>
            <h1>My Applications</h1>
            <p>Error loading. Please try again.</p>
          </div>
        </div>
      </div>
    );

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
            All ({applications.length})
          </button>
          <button
            className={filter === "active" ? styles.active : ""}
            onClick={() => setFilter("active")}
          >
            Active ({activeCount})
          </button>
          <button
            className={filter === "selected" ? styles.active : ""}
            onClick={() => setFilter("selected")}
          >
            Selected ({selectedCount})
          </button>
          <button
            className={filter === "rejected" ? styles.active : ""}
            onClick={() => setFilter("rejected")}
          >
            Rejected ({rejectedCount})
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
                  className={`${styles.statusBadge} ${styles[STATUS_CLASS[app.status] || "pending"]}`}
                >
                  {STATUS_LABELS[app.status] ?? app.status}
                </span>
              </div>

              <div className={styles.cardBody}>
                <div className={styles.infoGrid}>
                  <div className={styles.infoItem}>
                    <span className={styles.label}>📍 Location</span>
                    <span className={styles.value}>
                      {app.job?.location || "—"}
                    </span>
                  </div>
                  <div className={styles.infoItem}>
                    <span className={styles.label}>💰 Salary</span>
                    <span className={styles.value}>
                      {formatSalary(app.job?.salary_min, app.job?.salary_max)}
                      /mo
                    </span>
                  </div>
                  <div className={styles.infoItem}>
                    <span className={styles.label}>⏰ Type</span>
                    <span className={styles.value}>
                      {formatEmploymentType(app.job?.employment_type)}
                    </span>
                  </div>
                  <div className={styles.infoItem}>
                    <span className={styles.label}>📅 Applied</span>
                    <span className={styles.value}>
                      {formatDate(app.applied_at)}
                    </span>
                  </div>
                </div>

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
                  View Job
                </Link>
                {app.interview && (
                  <Link
                    to="/employee-dashboard/interviews"
                    className={styles.viewInterviewButton}
                  >
                    View Interview
                  </Link>
                )}
                {["PENDING", "UNDER_REVIEW"].includes(app.status) && (
                  <button
                    onClick={() => handleWithdraw(app.id, app.job?.title)}
                    className={styles.withdrawButton}
                    disabled={isWithdrawing}
                  >
                    {isWithdrawing ? "Withdrawing..." : "Withdraw"}
                  </button>
                )}
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
