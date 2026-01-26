import { useState } from "react";
import { Link, useParams } from "react-router";
import styles from "./ViewJobApplications.module.css";

export default function ViewJobApplications() {
  const { jobId } = useParams();
  const [filter, setFilter] = useState("all");
  const [selectedApplicant, setSelectedApplicant] = useState(null);

  const jobInfo = {
    title: "Senior ICU Nurse",
    location: "Lagos, Nigeria",
    postedDate: "Jan 10, 2026",
    deadline: "Feb 10, 2026",
  };

  const applications = [
    {
      id: 1,
      name: "Dr. Sarah Okonkwo",
      email: "sarah.okonkwo@email.com",
      phone: "+234 801 234 5678",
      experience: "8 years",
      currentPosition: "ICU Nurse",
      location: "Lagos",
      appliedDate: "2 hours ago",
      status: "new",
      match: 95,
      image: "👩‍⚕️",
      resume: "sarah_okonkwo_resume.pdf",
    },
    {
      id: 2,
      name: "Nurse Chioma Eze",
      email: "chioma.eze@email.com",
      phone: "+234 802 345 6789",
      experience: "5 years",
      currentPosition: "Registered Nurse",
      location: "Lagos",
      appliedDate: "5 hours ago",
      status: "reviewed",
      match: 87,
      image: "👩‍⚕️",
      resume: "chioma_eze_resume.pdf",
    },
    {
      id: 3,
      name: "Dr. James Adebayo",
      email: "james.adebayo@email.com",
      phone: "+234 803 456 7890",
      experience: "10 years",
      currentPosition: "Senior Nurse",
      location: "Ibadan",
      appliedDate: "1 day ago",
      status: "shortlisted",
      match: 92,
      image: "👨‍⚕️",
      resume: "james_adebayo_resume.pdf",
    },
    {
      id: 4,
      name: "Nurse Amina Bello",
      email: "amina.bello@email.com",
      phone: "+234 804 567 8901",
      experience: "6 years",
      currentPosition: "ICU Nurse",
      location: "Abuja",
      appliedDate: "2 days ago",
      status: "rejected",
      match: 78,
      image: "👩‍⚕️",
      resume: "amina_bello_resume.pdf",
    },
  ];

  const filteredApplications = applications.filter((app) => {
    if (filter === "all") return true;
    return app.status === filter;
  });

  const stats = {
    total: applications.length,
    new: applications.filter((a) => a.status === "new").length,
    reviewed: applications.filter((a) => a.status === "reviewed").length,
    shortlisted: applications.filter((a) => a.status === "shortlisted").length,
    rejected: applications.filter((a) => a.status === "rejected").length,
  };

  const handleStatusChange = (appId, newStatus) => {
    console.log(`Changing application ${appId} to ${newStatus}`);
  };

  return (
    <div className={styles.viewApplications}>
      <div className={styles.header}>
        <div>
          <h1>Applications for {jobInfo.title}</h1>
          <p>
            {jobInfo.location} • Posted: {jobInfo.postedDate} • Deadline:{" "}
            {jobInfo.deadline}
          </p>
        </div>
        <div className={styles.headerActions}>
          <Link
            to={`/employer-dashboard/job-edit/${jobId}`}
            className={styles.editJobBtn}
          >
            Edit Job
          </Link>
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
          <button
            className={filter === "all" ? styles.active : ""}
            onClick={() => setFilter("all")}
          >
            All ({stats.total})
          </button>
          <button
            className={filter === "new" ? styles.active : ""}
            onClick={() => setFilter("new")}
          >
            New ({stats.new})
          </button>
          <button
            className={filter === "reviewed" ? styles.active : ""}
            onClick={() => setFilter("reviewed")}
          >
            Reviewed ({stats.reviewed})
          </button>
          <button
            className={filter === "shortlisted" ? styles.active : ""}
            onClick={() => setFilter("shortlisted")}
          >
            Shortlisted ({stats.shortlisted})
          </button>
          <button
            className={filter === "rejected" ? styles.active : ""}
            onClick={() => setFilter("rejected")}
          >
            Rejected ({stats.rejected})
          </button>
        </div>

        <select className={styles.sortSelect}>
          <option>Sort by: Match %</option>
          <option>Most Recent</option>
          <option>Experience</option>
        </select>
      </div>

      <div className={styles.applicationsList}>
        {filteredApplications.map((app) => (
          <div key={app.id} className={styles.applicationCard}>
            <div className={styles.cardHeader}>
              <div className={styles.applicantInfo}>
                <div className={styles.applicantImage}>{app.image}</div>
                <div>
                  <h3>{app.name}</h3>
                  <p className={styles.currentPosition}>
                    {app.currentPosition}
                  </p>
                  <p className={styles.appliedDate}>
                    Applied {app.appliedDate}
                  </p>
                </div>
              </div>
              <div className={styles.matchScore}>
                <div className={styles.matchCircle}>
                  <span>{app.match}%</span>
                </div>
                <span className={styles.matchLabel}>Match</span>
              </div>
            </div>

            <div className={styles.cardBody}>
              <div className={styles.detailsGrid}>
                <div className={styles.detailItem}>
                  <span className={styles.label}>📧 Email:</span>
                  <span className={styles.value}>{app.email}</span>
                </div>
                <div className={styles.detailItem}>
                  <span className={styles.label}>📞 Phone:</span>
                  <span className={styles.value}>{app.phone}</span>
                </div>
                <div className={styles.detailItem}>
                  <span className={styles.label}>💼 Experience:</span>
                  <span className={styles.value}>{app.experience}</span>
                </div>
                <div className={styles.detailItem}>
                  <span className={styles.label}>📍 Location:</span>
                  <span className={styles.value}>{app.location}</span>
                </div>
              </div>

              <div className={styles.statusSection}>
                <span className={`${styles.statusBadge} ${styles[app.status]}`}>
                  {app.status.charAt(0).toUpperCase() + app.status.slice(1)}
                </span>
              </div>
            </div>

            <div className={styles.cardActions}>
              <button
                className={styles.viewProfileBtn}
                onClick={() => setSelectedApplicant(app)}
              >
                View Full Profile
              </button>
              <a
                href={`/resumes/${app.resume}`}
                className={styles.downloadBtn}
                download
              >
                📄 Download Resume
              </a>
              <Link to="/chat" className={styles.messageBtn}>
                💬 Message
              </Link>

              {app.status !== "shortlisted" && app.status !== "rejected" && (
                <button
                  className={styles.shortlistBtn}
                  onClick={() => handleStatusChange(app.id, "shortlisted")}
                >
                  ⭐ Shortlist
                </button>
              )}

              {app.status === "shortlisted" && (
                <Link to="/schedule-interview" className={styles.scheduleBtn}>
                  📅 Schedule Interview
                </Link>
              )}

              {app.status !== "rejected" && (
                <button
                  className={styles.rejectBtn}
                  onClick={() => handleStatusChange(app.id, "rejected")}
                >
                  ✗ Reject
                </button>
              )}
            </div>
          </div>
        ))}
      </div>

      {selectedApplicant && (
        <div
          className={styles.modal}
          onClick={() => setSelectedApplicant(null)}
        >
          <div
            className={styles.modalContent}
            onClick={(e) => e.stopPropagation()}
          >
            <div className={styles.modalHeader}>
              <h3>{selectedApplicant.name}</h3>
              <button
                className={styles.closeModal}
                onClick={() => setSelectedApplicant(null)}
              >
                ✕
              </button>
            </div>
            <div className={styles.modalBody}>
              <p>Full applicant profile details would go here...</p>
              <p>
                This would include their complete work history, certifications,
                references, etc.
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
