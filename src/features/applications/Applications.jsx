import { useState } from "react";
import { Link } from "react-router";
import styles from "./Applications.module.css";

export default function Applications() {
  const [filter, setFilter] = useState("all");

  const applications = [
    {
      id: 1,
      jobTitle: "Senior ICU Nurse",
      hospital: "General Hospital Lagos",
      status: "Under Review",
      appliedDate: "Jan 15, 2026",
      salary: "₦450,000",
      location: "Lagos, Nigeria",
      type: "Full Time",
    },
    {
      id: 2,
      jobTitle: "Pediatric Nurse",
      hospital: "Federal Medical Centre",
      status: "Interview Scheduled",
      appliedDate: "Jan 10, 2026",
      salary: "₦380,000",
      location: "Abuja, Nigeria",
      type: "Full Time",
      interviewDate: "Jan 25, 2026",
    },
    {
      id: 3,
      jobTitle: "Emergency Room Nurse",
      hospital: "National Hospital Abuja",
      status: "Rejected",
      appliedDate: "Jan 5, 2026",
      salary: "₦420,000",
      location: "Abuja, Nigeria",
      type: "Full Time",
    },
    {
      id: 4,
      jobTitle: "Registered Nurse",
      hospital: "St. Nicholas Hospital",
      status: "Shortlisted",
      appliedDate: "Jan 3, 2026",
      salary: "₦400,000",
      location: "Lagos, Nigeria",
      type: "Full Time",
    },
    {
      id: 5,
      jobTitle: "ICU Nurse",
      hospital: "Reddington Hospital",
      status: "Under Review",
      appliedDate: "Dec 28, 2025",
      salary: "₦430,000",
      location: "Lagos, Nigeria",
      type: "Contract",
    },
  ];

  const filteredApplications = applications.filter((app) => {
    if (filter === "active") {
      return ["Under Review", "Interview Scheduled", "Shortlisted"].includes(
        app.status,
      );
    }
    if (filter === "archived") {
      return ["Rejected", "Withdrawn"].includes(app.status);
    }
    return true;
  });

  const getStatusClass = (status) => {
    const statusMap = {
      "Under Review": "underreview",
      "Interview Scheduled": "interview",
      Shortlisted: "shortlisted",
      Rejected: "rejected",
      Withdrawn: "withdrawn",
    };
    return statusMap[status] || "";
  };

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
            Active (
            {
              applications.filter((a) =>
                ["Under Review", "Interview Scheduled", "Shortlisted"].includes(
                  a.status,
                ),
              ).length
            }
            )
          </button>
          <button
            className={filter === "archived" ? styles.active : ""}
            onClick={() => setFilter("archived")}
          >
            Archived (
            {
              applications.filter((a) =>
                ["Rejected", "Withdrawn"].includes(a.status),
              ).length
            }
            )
          </button>
        </div>
      </div>

      <div className={styles.applicationsList}>
        {filteredApplications.length > 0 ? (
          filteredApplications.map((app) => (
            <div key={app.id} className={styles.applicationCard}>
              <div className={styles.cardHeader}>
                <div>
                  <h3>{app.jobTitle}</h3>
                  <p className={styles.hospital}>{app.hospital}</p>
                </div>
                <span
                  className={`${styles.statusBadge} ${
                    styles[getStatusClass(app.status)]
                  }`}
                >
                  {app.status}
                </span>
              </div>

              <div className={styles.cardBody}>
                <div className={styles.infoGrid}>
                  <div className={styles.infoItem}>
                    <span className={styles.label}>📍 Location:</span>
                    <span className={styles.value}>{app.location}</span>
                  </div>
                  <div className={styles.infoItem}>
                    <span className={styles.label}>💰 Salary:</span>
                    <span className={styles.value}>{app.salary}/month</span>
                  </div>
                  <div className={styles.infoItem}>
                    <span className={styles.label}>⏰ Type:</span>
                    <span className={styles.value}>{app.type}</span>
                  </div>
                  <div className={styles.infoItem}>
                    <span className={styles.label}>📅 Applied:</span>
                    <span className={styles.value}>{app.appliedDate}</span>
                  </div>
                </div>

                {app.interviewDate && (
                  <div className={styles.interviewAlert}>
                    📅 Interview scheduled for {app.interviewDate}
                  </div>
                )}
              </div>

              <div className={styles.cardFooter}>
                <Link
                  to={`/jobs/${app.id}`}
                  className={styles.viewDetailsButton}
                >
                  View Job Details
                </Link>
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
