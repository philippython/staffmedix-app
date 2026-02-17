import { useState, useMemo } from "react";
import { Link } from "react-router";
import styles from "./Interviews.module.css";
import { useGetAppliedJobsQuery } from "../../services/jobsApi";
import { useWhoAmIQuery } from "../../services/userApi";

export default function Interviews() {
  const [activeTab, setActiveTab] = useState("upcoming");

  // Get current user to determine role
  const { data: user } = useWhoAmIQuery();
  const userRole = user?.role?.toLowerCase(); // 'talent' or 'employer'

  // Fetch all applied jobs (which contain interview data)
  // Backend filters by current talent automatically via talent_id
  const {
    data: appliedJobsData,
    isLoading,
    error,
  } = useGetAppliedJobsQuery(
    {
      limit: 100,
      talent: user?.talent_id,
    },
    {
      skip: !user?.talent_id,
    },
  );

  // Extract and organize interviews from applied jobs
  const interviews = useMemo(() => {
    if (!appliedJobsData?.results) {
      return { upcoming: [], past: [], cancelled: [] };
    }

    const now = new Date();
    const upcoming = [];
    const past = [];
    const cancelled = [];

    // Filter only applied jobs that have interviews
    const jobsWithInterviews = appliedJobsData.results.filter(
      (appliedJob) => appliedJob.interview !== null,
    );

    jobsWithInterviews.forEach((appliedJob) => {
      const interview = appliedJob.interview;
      const interviewDate = new Date(interview.scheduled_at);

      // Build interview object with all needed data from applied job
      const interviewData = {
        id: interview.id,
        scheduled_at: interview.scheduled_at,
        status: interview.status,
        notes: interview.notes,
        duration: interview.duration,
        interview_link: interview.interview_link,
        created_at: interview.created_at,
        updated_at: interview.updated_at,
        // Add data from applied job
        applied_job_id: appliedJob.id,
        talent_name: appliedJob.talent?.full_name,
        job_title: appliedJob.job?.title,
        company_name: appliedJob.company?.company_name,
        company_logo: appliedJob.company?.logo,
        job_location: appliedJob.job?.location,
        // Keep full objects for reference
        talent: appliedJob.talent,
        job: appliedJob.job,
        company: appliedJob.company,
      };

      if (interview.status === "CANCELLED") {
        cancelled.push(interviewData);
      } else if (interviewDate < now && interview.status === "COMPLETED") {
        past.push(interviewData);
      } else {
        // Upcoming (SCHEDULED, CONFIRMED, UPCOMING)
        upcoming.push(interviewData);
      }
    });

    return { upcoming, past, cancelled };
  }, [appliedJobsData]);

  const currentInterviews = interviews[activeTab];

  // Format date and time from scheduled_at
  const formatDateTime = (scheduledAt) => {
    if (!scheduledAt) return { date: "N/A", time: "N/A" };

    const dateObj = new Date(scheduledAt);

    const date = dateObj.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });

    const hours = dateObj.getHours();
    const minutes = dateObj.getMinutes();
    const ampm = hours >= 12 ? "PM" : "AM";
    const displayHour = hours % 12 || 12;
    const displayMinutes = minutes.toString().padStart(2, "0");
    const time = `${displayHour}:${displayMinutes} ${ampm}`;

    return { date, time };
  };

  // Get status badge text
  const getStatusText = (status) => {
    const statusMap = {
      UPCOMING: "⏳ Upcoming",
      SCHEDULED: "⏳ Scheduled",
      CONFIRMED: "✓ Confirmed",
      COMPLETED: "Completed",
      CANCELLED: "Cancelled",
    };
    return statusMap[status] || status;
  };

  if (isLoading) {
    return (
      <div className={styles.interviewsPage}>
        <div className={styles.loading}>Loading interviews...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className={styles.interviewsPage}>
        <div className={styles.error}>
          Failed to load interviews. Please try again.
        </div>
      </div>
    );
  }

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
                      ? interview.talent_name || "Candidate"
                      : interview.job_title || "Job Title"}
                  </h3>
                  <p className={styles.subtitle}>
                    {userRole === "employer"
                      ? interview.job_title || "Position"
                      : interview.company_name || "Company"}
                  </p>
                </div>
                {activeTab === "upcoming" && (
                  <span
                    className={`${styles.statusBadge} ${
                      styles[interview.status?.toLowerCase()]
                    }`}
                  >
                    {getStatusText(interview.status)}
                  </span>
                )}
              </div>

              <div className={styles.cardBody}>
                <div className={styles.detailsGrid}>
                  <div className={styles.detailItem}>
                    <span className={styles.icon}>📅</span>
                    <div>
                      <span className={styles.label}>Date</span>
                      <span className={styles.value}>
                        {formatDateTime(interview.scheduled_at).date}
                      </span>
                    </div>
                  </div>
                  <div className={styles.detailItem}>
                    <span className={styles.icon}>🕒</span>
                    <div>
                      <span className={styles.label}>Time</span>
                      <span className={styles.value}>
                        {formatDateTime(interview.scheduled_at).time}
                      </span>
                    </div>
                  </div>
                  <div className={styles.detailItem}>
                    <span className={styles.icon}>⏱️</span>
                    <div>
                      <span className={styles.label}>Duration</span>
                      <span className={styles.value}>
                        {interview.duration || "N/A"} mins
                      </span>
                    </div>
                  </div>
                  {interview.job_location && (
                    <div className={styles.detailItem}>
                      <span className={styles.icon}>📍</span>
                      <div>
                        <span className={styles.label}>Location</span>
                        <span className={styles.value}>
                          {interview.job_location}
                        </span>
                      </div>
                    </div>
                  )}
                </div>

                {interview.notes && (
                  <div className={styles.notesSection}>
                    <p className={styles.notesLabel}>
                      <strong>Notes:</strong>
                    </p>
                    <p className={styles.notesText}>{interview.notes}</p>
                  </div>
                )}
              </div>

              <div className={styles.cardActions}>
                {activeTab === "upcoming" && (
                  <>
                    {interview.interview_link && (
                      <a
                        href={interview.interview_link}
                        target="_blank"
                        rel="noopener noreferrer"
                        className={styles.joinBtn}
                      >
                        🎥 Join Interview
                      </a>
                    )}
                    <Link
                      to={`/jobs/${interview.job?.id}`}
                      className={styles.viewJobBtn}
                    >
                      📋 View Job
                    </Link>
                  </>
                )}

                {activeTab === "past" && (
                  <>
                    <Link
                      to={`/jobs/${interview.job?.id}`}
                      className={styles.viewJobBtn}
                    >
                      📋 View Job
                    </Link>
                    <Link to="/chat" className={styles.messageBtn}>
                      💬 Message
                    </Link>
                  </>
                )}
              </div>
            </div>
          ))
        ) : (
          <div className={styles.emptyState}>
            <p>No {activeTab} interviews</p>
            {activeTab === "upcoming" && userRole === "talent" && (
              <Link to="/jobs" className={styles.browseJobsBtn}>
                Browse Jobs
              </Link>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
