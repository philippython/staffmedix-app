import { useState } from "react";
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
    },
    // Add more applications
  ];

  return (
    <div className={styles.applicationsPage}>
      <div className={styles.header}>
        <h1>My Applications</h1>
        <div className={styles.filterButtons}>
          <button
            className={filter === "all" ? styles.active : ""}
            onClick={() => setFilter("all")}
          >
            All
          </button>
          <button
            className={filter === "active" ? styles.active : ""}
            onClick={() => setFilter("active")}
          >
            Active
          </button>
          <button
            className={filter === "archived" ? styles.active : ""}
            onClick={() => setFilter("archived")}
          >
            Archived
          </button>
        </div>
      </div>

      <div className={styles.applicationsList}>
        {applications.map((app) => (
          <div key={app.id} className={styles.applicationCard}>
            <div className={styles.cardHeader}>
              <h3>{app.jobTitle}</h3>
              <span className={styles.statusBadge}>{app.status}</span>
            </div>
            <p className={styles.hospital}>{app.hospital}</p>
            <div className={styles.cardFooter}>
              <span>Applied: {app.appliedDate}</span>
              <span>Salary: {app.salary}/month</span>
            </div>
            <button className={styles.viewDetails}>View Details</button>
          </div>
        ))}
      </div>
    </div>
  );
}
