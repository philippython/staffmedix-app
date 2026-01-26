import { useState } from "react";
import { Link } from "react-router";
import styles from "./ViewAllEmployerApplications.module.css";

export default function ViewAllEmployerApplications() {
  const [filters, setFilters] = useState({
    job: "all",
    status: "all",
    dateRange: "all",
  });

  const applications = [
    {
      id: 1,
      candidateName: "Dr. Sarah Okonkwo",
      jobTitle: "Senior ICU Nurse",
      jobId: 1,
      email: "sarah.okonkwo@email.com",
      phone: "+234 801 234 5678",
      experience: "8 years",
      appliedDate: "Jan 20, 2026",
      status: "new",
      match: 95,
    },
    {
      id: 2,
      candidateName: "Nurse Chioma Eze",
      jobTitle: "Registered Nurse",
      jobId: 2,
      email: "chioma.eze@email.com",
      phone: "+234 802 345 6789",
      experience: "5 years",
      appliedDate: "Jan 19, 2026",
      status: "shortlisted",
      match: 87,
    },
    {
      id: 3,
      candidateName: "Dr. James Adebayo",
      jobTitle: "Senior ICU Nurse",
      jobId: 1,
      email: "james.adebayo@email.com",
      phone: "+234 803 456 7890",
      experience: "10 years",
      appliedDate: "Jan 18, 2026",
      status: "reviewed",
      match: 92,
    },
    {
      id: 4,
      candidateName: "Nurse Amina Bello",
      jobTitle: "Pediatric Nurse",
      jobId: 3,
      email: "amina.bello@email.com",
      phone: "+234 804 567 8901",
      experience: "6 years",
      appliedDate: "Jan 15, 2026",
      status: "rejected",
      match: 78,
    },
  ];

  const jobs = [
    { id: 1, title: "Senior ICU Nurse" },
    { id: 2, title: "Registered Nurse" },
    { id: 3, title: "Pediatric Nurse" },
  ];

  const filteredApplications = applications.filter((app) => {
    if (filters.job !== "all" && app.jobId.toString() !== filters.job)
      return false;
    if (filters.status !== "all" && app.status !== filters.status) return false;
    return true;
  });

  const stats = {
    total: applications.length,
    new: applications.filter((a) => a.status === "new").length,
    reviewed: applications.filter((a) => a.status === "reviewed").length,
    shortlisted: applications.filter((a) => a.status === "shortlisted").length,
    rejected: applications.filter((a) => a.status === "rejected").length,
  };

  const handleExport = () => {
    console.log("Exporting applications...");
  };

  const handleBulkAction = (action) => {
    console.log(`Bulk action: ${action}`);
  };

  return (
    <div className={styles.allApplications}>
      <div className={styles.header}>
        <div>
          <h1>All Applications</h1>
          <p>View and manage applications across all job postings</p>
        </div>
        <div className={styles.headerActions}>
          <button onClick={handleExport} className={styles.exportBtn}>
            📊 Export Data
          </button>
          <Link to="/employer-dashboard" className={styles.backBtn}>
            Back to Dashboard
          </Link>
        </div>
      </div>

      <div className={styles.statsBar}>
        <div className={styles.statCard}>
          <span className={styles.statValue}>{stats.total}</span>
          <span className={styles.statLabel}>Total</span>
        </div>
        <div className={styles.statCard}>
          <span className={styles.statValue}>{stats.new}</span>
          <span className={styles.statLabel}>New</span>
        </div>
        <div className={styles.statCard}>
          <span className={styles.statValue}>{stats.reviewed}</span>
          <span className={styles.statLabel}>Reviewed</span>
        </div>
        <div className={styles.statCard}>
          <span className={styles.statValue}>{stats.shortlisted}</span>
          <span className={styles.statLabel}>Shortlisted</span>
        </div>
        <div className={styles.statCard}>
          <span className={styles.statValue}>{stats.rejected}</span>
          <span className={styles.statLabel}>Rejected</span>
        </div>
      </div>

      <div className={styles.filterSection}>
        <div className={styles.filters}>
          <select
            value={filters.job}
            onChange={(e) => setFilters({ ...filters, job: e.target.value })}
            className={styles.filterSelect}
          >
            <option value="all">All Jobs</option>
            {jobs.map((job) => (
              <option key={job.id} value={job.id}>
                {job.title}
              </option>
            ))}
          </select>

          <select
            value={filters.status}
            onChange={(e) => setFilters({ ...filters, status: e.target.value })}
            className={styles.filterSelect}
          >
            <option value="all">All Status</option>
            <option value="new">New</option>
            <option value="reviewed">Reviewed</option>
            <option value="shortlisted">Shortlisted</option>
            <option value="rejected">Rejected</option>
          </select>

          <select
            value={filters.dateRange}
            onChange={(e) =>
              setFilters({ ...filters, dateRange: e.target.value })
            }
            className={styles.filterSelect}
          >
            <option value="all">All Time</option>
            <option value="today">Today</option>
            <option value="week">This Week</option>
            <option value="month">This Month</option>
          </select>
        </div>

        <div className={styles.bulkActions}>
          <button
            onClick={() => handleBulkAction("shortlist")}
            className={styles.bulkBtn}
          >
            Shortlist Selected
          </button>
          <button
            onClick={() => handleBulkAction("reject")}
            className={styles.bulkBtn}
          >
            Reject Selected
          </button>
        </div>
      </div>

      <div className={styles.applicationsList}>
        {filteredApplications.length > 0 ? (
          filteredApplications.map((app) => (
            <div key={app.id} className={styles.applicationCard}>
              <div className={styles.cardLeft}>
                <input type="checkbox" className={styles.checkbox} />
                <div className={styles.applicantInfo}>
                  <h3>{app.candidateName}</h3>
                  <p className={styles.jobTitle}>{app.jobTitle}</p>
                  <div className={styles.meta}>
                    <span>{app.experience}</span>
                    <span>•</span>
                    <span>{app.appliedDate}</span>
                  </div>
                </div>
              </div>

              <div className={styles.cardCenter}>
                <div className={styles.matchScore}>
                  <span className={styles.matchValue}>{app.match}%</span>
                  <span className={styles.matchLabel}>Match</span>
                </div>
                <span className={`${styles.statusBadge} ${styles[app.status]}`}>
                  {app.status.charAt(0).toUpperCase() + app.status.slice(1)}
                </span>
              </div>

              <div className={styles.cardActions}>
                <Link
                  to={`/talent/${app.id}`}
                  className={styles.viewProfileBtn}
                >
                  View Profile
                </Link>
                <Link
                  to={`/employer-dashboard/view-applications/${app.jobId}`}
                  className={styles.viewJobBtn}
                >
                  View Job Applications
                </Link>
                <Link to="/chat" className={styles.messageBtn}>
                  💬 Message
                </Link>
              </div>
            </div>
          ))
        ) : (
          <div className={styles.emptyState}>
            <p>No applications found with the selected filters</p>
          </div>
        )}
      </div>
    </div>
  );
}
