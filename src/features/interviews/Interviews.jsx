import { useState } from "react";
import { Link } from "react-router";
import styles from "./Interviews.module.css";

export default function Interviews() {
  const [activeTab, setActiveTab] = useState("upcoming");

  // This would come from props or context to determine user role
  const userRole = "employer"; // or "talent"

  const interviews = {
    upcoming: [
      {
        id: 1,
        candidateName: "Dr. Sarah Okonkwo",
        jobTitle: "Senior ICU Nurse",
        organization: "General Hospital Lagos",
        date: "Jan 28, 2026",
        time: "10:00 AM",
        type: "Video Call",
        status: "confirmed",
        meetingLink: "https://meet.example.com/xyz123",
      },
      {
        id: 2,
        candidateName: "Nurse Chioma Eze",
        jobTitle: "Registered Nurse",
        organization: "General Hospital Lagos",
        date: "Jan 30, 2026",
        time: "2:00 PM",
        type: "In-Person",
        status: "pending",
        location: "Hospital Admin Block, Lagos",
      },
    ],
    past: [
      {
        id: 3,
        candidateName: "Dr. James Adebayo",
        jobTitle: "Senior ICU Nurse",
        organization: "General Hospital Lagos",
        date: "Jan 20, 2026",
        time: "11:00 AM",
        type: "Video Call",
        status: "completed",
        outcome: "Hired",
      },
      {
        id: 4,
        candidateName: "Nurse Amina Bello",
        jobTitle: "Pediatric Nurse",
        organization: "General Hospital Lagos",
        date: "Jan 15, 2026",
        time: "3:00 PM",
        type: "Phone Call",
        status: "completed",
        outcome: "Not Selected",
      },
    ],
    cancelled: [
      {
        id: 5,
        candidateName: "Dr. Ibrahim Yusuf",
        jobTitle: "Emergency Nurse",
        organization: "General Hospital Lagos",
        date: "Jan 18, 2026",
        time: "9:00 AM",
        type: "Video Call",
        status: "cancelled",
        reason: "Candidate accepted another offer",
        cancelledBy: "Candidate",
      },
    ],
  };

  const currentInterviews = interviews[activeTab];

  return (
    <div className={styles.interviewsPage}>
      <div className={styles.header}>
        <h1>Interview Schedule</h1>
        <p>Manage your interviews and appointments</p>
      </div>

      <div className={styles.tabs}>
        <button
          className={activeTab === "upcoming" ? styles.activeTab : ""}
          onClick={() => setActiveTab("upcoming")}
        >
          Upcoming ({interviews.upcoming.length})
        </button>
        <button
          className={activeTab === "past" ? styles.activeTab : ""}
          onClick={() => setActiveTab("past")}
        >
          Past ({interviews.past.length})
        </button>
        <button
          className={activeTab === "cancelled" ? styles.activeTab : ""}
          onClick={() => setActiveTab("cancelled")}
        >
          Cancelled ({interviews.cancelled.length})
        </button>
      </div>

      <div className={styles.interviewsList}>
        {currentInterviews.length > 0 ? (
          currentInterviews.map((interview) => (
            <div key={interview.id} className={styles.interviewCard}>
              <div className={styles.cardHeader}>
                <div className={styles.interviewInfo}>
                  <h3>
                    {userRole === "employer"
                      ? interview.candidateName
                      : interview.jobTitle}
                  </h3>
                  <p className={styles.subtitle}>
                    {userRole === "employer"
                      ? interview.jobTitle
                      : interview.organization}
                  </p>
                </div>
                {activeTab === "past" && interview.outcome && (
                  <span
                    className={`${styles.outcomeBadge} ${
                      interview.outcome === "Hired"
                        ? styles.hired
                        : styles.notSelected
                    }`}
                  >
                    {interview.outcome}
                  </span>
                )}
                {activeTab === "upcoming" && (
                  <span
                    className={`${styles.statusBadge} ${
                      styles[interview.status]
                    }`}
                  >
                    {interview.status === "confirmed"
                      ? "✓ Confirmed"
                      : "⏳ Pending"}
                  </span>
                )}
              </div>

              <div className={styles.cardBody}>
                <div className={styles.detailsGrid}>
                  <div className={styles.detailItem}>
                    <span className={styles.icon}>📅</span>
                    <div>
                      <span className={styles.label}>Date</span>
                      <span className={styles.value}>{interview.date}</span>
                    </div>
                  </div>
                  <div className={styles.detailItem}>
                    <span className={styles.icon}>🕒</span>
                    <div>
                      <span className={styles.label}>Time</span>
                      <span className={styles.value}>{interview.time}</span>
                    </div>
                  </div>
                  <div className={styles.detailItem}>
                    <span className={styles.icon}>
                      {interview.type === "Video Call"
                        ? "📹"
                        : interview.type === "In-Person"
                          ? "🏥"
                          : "📞"}
                    </span>
                    <div>
                      <span className={styles.label}>Type</span>
                      <span className={styles.value}>{interview.type}</span>
                    </div>
                  </div>
                  {interview.location && (
                    <div className={styles.detailItem}>
                      <span className={styles.icon}>📍</span>
                      <div>
                        <span className={styles.label}>Location</span>
                        <span className={styles.value}>
                          {interview.location}
                        </span>
                      </div>
                    </div>
                  )}
                </div>

                {activeTab === "cancelled" && interview.reason && (
                  <div className={styles.cancellationInfo}>
                    <p className={styles.cancelReason}>
                      <strong>Reason:</strong> {interview.reason}
                    </p>
                    <p className={styles.cancelledBy}>
                      Cancelled by: {interview.cancelledBy}
                    </p>
                  </div>
                )}
              </div>

              <div className={styles.cardActions}>
                {activeTab === "upcoming" && (
                  <>
                    {interview.meetingLink && (
                      <a
                        href={interview.meetingLink}
                        target="_blank"
                        rel="noopener noreferrer"
                        className={styles.joinBtn}
                      >
                        🎥 Join Meeting
                      </a>
                    )}
                    <button className={styles.rescheduleBtn}>
                      📅 Reschedule
                    </button>
                    <button className={styles.cancelBtn}>✗ Cancel</button>
                    <Link to="/chat" className={styles.messageBtn}>
                      💬 Message
                    </Link>
                  </>
                )}

                {activeTab === "past" && (
                  <>
                    <button className={styles.viewNotesBtn}>
                      📝 View Notes
                    </button>
                    <Link to="/chat" className={styles.messageBtn}>
                      💬 Message
                    </Link>
                  </>
                )}

                {activeTab === "cancelled" && (
                  <button className={styles.rescheduleBtn}>
                    🔄 Reschedule
                  </button>
                )}
              </div>
            </div>
          ))
        ) : (
          <div className={styles.emptyState}>
            <p>No {activeTab} interviews</p>
          </div>
        )}
      </div>
    </div>
  );
}
