import { useState } from "react";
import { Link } from "react-router";
import styles from "./AllJobPostsList.module.css";

export default function AllJobPostsList() {
  const [filter, setFilter] = useState("all");

  const jobPosts = [
    {
      id: 1,
      title: "Senior ICU Nurse",
      status: "active",
      applications: 45,
      views: 1234,
      posted: "Jan 10, 2026",
      deadline: "Feb 10, 2026",
      salary: "₦350,000 - ₦450,000",
      location: "Lagos",
    },
    {
      id: 2,
      title: "Registered Nurse",
      status: "active",
      applications: 38,
      views: 892,
      posted: "Jan 8, 2026",
      deadline: "Feb 8, 2026",
      salary: "₦250,000 - ₦350,000",
      location: "Lagos",
    },
    {
      id: 3,
      title: "Pediatric Nurse",
      status: "paused",
      applications: 27,
      views: 654,
      posted: "Jan 5, 2026",
      deadline: "Feb 5, 2026",
      salary: "₦280,000 - ₦380,000",
      location: "Abuja",
    },
    {
      id: 4,
      title: "Emergency Room Nurse",
      status: "closed",
      applications: 52,
      views: 1567,
      posted: "Dec 20, 2025",
      deadline: "Jan 20, 2026",
      salary: "₦320,000 - ₦420,000",
      location: "Lagos",
    },
  ];

  const filteredJobs = jobPosts.filter((job) => {
    if (filter === "all") return true;
    return job.status === filter;
  });

  const stats = {
    all: jobPosts.length,
    active: jobPosts.filter((j) => j.status === "active").length,
    paused: jobPosts.filter((j) => j.status === "paused").length,
    closed: jobPosts.filter((j) => j.status === "closed").length,
  };

  return (
    <div className={styles.allJobPosts}>
      <div className={styles.header}>
        <div>
          <h1>All Job Posts</h1>
          <p>Manage all your job postings in one place</p>
        </div>
        <Link to="/employer-dashboard/post-job" className={styles.createJobBtn}>
          + Create New Job
        </Link>
      </div>

      <div className={styles.filterSection}>
        <div className={styles.filters}>
          <button
            className={filter === "all" ? styles.active : ""}
            onClick={() => setFilter("all")}
          >
            All Jobs ({stats.all})
          </button>
          <button
            className={filter === "active" ? styles.active : ""}
            onClick={() => setFilter("active")}
          >
            Active ({stats.active})
          </button>
          <button
            className={filter === "paused" ? styles.active : ""}
            onClick={() => setFilter("paused")}
          >
            Paused ({stats.paused})
          </button>
          <button
            className={filter === "closed" ? styles.active : ""}
            onClick={() => setFilter("closed")}
          >
            Closed ({stats.closed})
          </button>
        </div>
        <select className={styles.sortSelect}>
          <option>Sort by: Most Recent</option>
          <option>Most Applications</option>
          <option>Most Views</option>
          <option>Deadline</option>
        </select>
      </div>

      <div className={styles.jobsList}>
        {filteredJobs.map((job) => (
          <div key={job.id} className={styles.jobCard}>
            <div className={styles.cardHeader}>
              <div>
                <h3>{job.title}</h3>
                <div className={styles.jobMeta}>
                  <span>📍 {job.location}</span>
                  <span>•</span>
                  <span>💰 {job.salary}</span>
                </div>
              </div>
              <span className={`${styles.statusBadge} ${styles[job.status]}`}>
                {job.status.charAt(0).toUpperCase() + job.status.slice(1)}
              </span>
            </div>

            <div className={styles.cardBody}>
              <div className={styles.statsGrid}>
                <div className={styles.statItem}>
                  <span className={styles.statValue}>{job.applications}</span>
                  <span className={styles.statLabel}>Applications</span>
                </div>
                <div className={styles.statItem}>
                  <span className={styles.statValue}>{job.views}</span>
                  <span className={styles.statLabel}>Views</span>
                </div>
                <div className={styles.statItem}>
                  <span className={styles.statValue}>{job.posted}</span>
                  <span className={styles.statLabel}>Posted</span>
                </div>
                <div className={styles.statItem}>
                  <span className={styles.statValue}>{job.deadline}</span>
                  <span className={styles.statLabel}>Deadline</span>
                </div>
              </div>
            </div>

            <div className={styles.cardActions}>
              <Link
                to={`/view-applications/${job.id}`}
                className={styles.viewAppsBtn}
              >
                View Applications
              </Link>
              <Link to={`/job-edit/${job.id}`} className={styles.editBtn}>
                Edit Job
              </Link>
              {job.status === "active" && (
                <button className={styles.pauseBtn}>Pause</button>
              )}
              {job.status === "paused" && (
                <button className={styles.resumeBtn}>Resume</button>
              )}
              {job.status === "active" && (
                <button className={styles.closeBtn}>Close</button>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
