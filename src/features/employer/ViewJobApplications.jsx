import { useState } from "react";
import { useParams, Link } from "react-router";
import styles from "./ViewJobApplications.module.css";
import {
  useGetAppliedJobsQuery,
  useUpdateAppliedJobMutation,
} from "../../services/jobsApi";
import { useGetJobByIdQuery } from "../../services/jobsApi";
import { useWhoAmIQuery } from "../../services/userApi";

const APPLICATION_STATUSES = [
  "PENDING",
  "UNDER_REVIEW",
  "SELECTED",
  "REJECTED",
];

const STATUS_LABELS = {
  PENDING: "Pending",
  UNDER_REVIEW: "Under Review",
  SELECTED: "Selected",
  REJECTED: "Rejected",
};

const STATUS_COLORS = {
  PENDING: "pending",
  UNDER_REVIEW: "reviewed",
  SELECTED: "accepted",
  REJECTED: "rejected",
};

export default function ViewApplications() {
  const { jobId } = useParams();
  const { data: user } = useWhoAmIQuery();
  const companyId = user?.company_id;

  const { data: jobData } = useGetJobByIdQuery(jobId, { skip: !jobId });

  const {
    data: appliedJobsData,
    isLoading,
    isError,
  } = useGetAppliedJobsQuery({ limit: 200 }, { skip: !companyId });

  const [updateAppliedJob, { isLoading: updating }] =
    useUpdateAppliedJobMutation();

  const [selectedTalent, setSelectedTalent] = useState(null); // talent profile modal
  const [updatingId, setUpdatingId] = useState(null);
  const [statusFilter, setStatusFilter] = useState("ALL");

  // Filter to only this job's applications
  const allApplied = appliedJobsData?.results ?? appliedJobsData ?? [];
  const applications = allApplied.filter((aj) => aj.job?.id === jobId);

  const filtered =
    statusFilter === "ALL"
      ? applications
      : applications.filter((a) => a.status === statusFilter);

  async function handleStatusChange(appId, newStatus) {
    setUpdatingId(appId);
    try {
      await updateAppliedJob({
        id: appId,
        data: { status: newStatus },
      }).unwrap();
    } catch (err) {
      alert(err?.data?.detail || "Failed to update status.");
    } finally {
      setUpdatingId(null);
    }
  }

  function formatDate(d) {
    return new Date(d).toLocaleDateString("en-GB", {
      day: "numeric",
      month: "short",
      year: "numeric",
    });
  }

  if (isLoading)
    return <div className={styles.loading}>Loading applications...</div>;
  if (isError)
    return <div className={styles.error}>Failed to load applications.</div>;

  return (
    <div className={styles.page}>
      {/* Header */}
      <div className={styles.header}>
        <div>
          <h1>{jobData?.title ?? "Job"} — Applications</h1>
          <p>
            {applications.length} applicant
            {applications.length !== 1 ? "s" : ""}
            {jobData?.location ? ` • ${jobData.location}` : ""}
            {jobData?.employment_type ? ` • ${jobData.employment_type}` : ""}
          </p>
        </div>
        <Link to="/employer-dashboard/all-job-posts" className={styles.backBtn}>
          ← Back to Jobs
        </Link>
      </div>

      {/* Status filter tabs */}
      <div className={styles.tabs}>
        {["ALL", ...APPLICATION_STATUSES].map((s) => {
          const count =
            s === "ALL"
              ? applications.length
              : applications.filter((a) => a.status === s).length;
          return (
            <button
              key={s}
              className={`${styles.tab} ${statusFilter === s ? styles.activeTab : ""}`}
              onClick={() => setStatusFilter(s)}
            >
              {s === "ALL" ? "All" : STATUS_LABELS[s]} ({count})
            </button>
          );
        })}
      </div>

      {/* Applications list */}
      {filtered.length === 0 ? (
        <div className={styles.empty}>
          <p>
            No applications{" "}
            {statusFilter !== "ALL"
              ? `with status "${STATUS_LABELS[statusFilter]}"`
              : "yet"}
            .
          </p>
        </div>
      ) : (
        <div className={styles.list}>
          {filtered.map((app) => (
            <div key={app.id} className={styles.card}>
              {/* Candidate info */}
              <div className={styles.cardLeft}>
                <div className={styles.avatar}>
                  {app.talent?.full_name?.[0]?.toUpperCase() ?? "?"}
                </div>
                <div className={styles.talentInfo}>
                  <h3>{app.talent?.full_name ?? "Candidate"}</h3>
                  <p>{app.talent?.profession ?? "—"}</p>
                  <p className={styles.meta}>
                    {app.talent?.specialization && (
                      <span>{app.talent.specialization}</span>
                    )}
                    {app.talent?.years_of_experience != null && (
                      <span>
                        {app.talent.years_of_experience} yr
                        {app.talent.years_of_experience !== 1 ? "s" : ""} exp
                      </span>
                    )}
                    {app.talent?.location && (
                      <span>📍 {app.talent.location}</span>
                    )}
                  </p>
                  <p className={styles.appliedDate}>
                    Applied {formatDate(app.applied_at)}
                  </p>
                </div>
              </div>

              {/* Right side: status + actions */}
              <div className={styles.cardRight}>
                <span
                  className={`${styles.statusBadge} ${styles[STATUS_COLORS[app.status] ?? "pending"]}`}
                >
                  {STATUS_LABELS[app.status] ?? app.status}
                </span>

                <div className={styles.actions}>
                  <button
                    className={styles.profileBtn}
                    onClick={() => setSelectedTalent(app.talent)}
                  >
                    👤 View Profile
                  </button>

                  {app.interview && (
                    <Link
                      to="/employer-dashboard/interviews"
                      className={styles.interviewBtn}
                    >
                      🗓 Interview
                    </Link>
                  )}

                  {/* Status updater */}
                  <select
                    className={styles.statusSelect}
                    value={app.status}
                    disabled={updatingId === app.id}
                    onChange={(e) => handleStatusChange(app.id, e.target.value)}
                  >
                    {APPLICATION_STATUSES.map((s) => (
                      <option key={s} value={s}>
                        {STATUS_LABELS[s]}
                      </option>
                    ))}
                  </select>
                  {updatingId === app.id && (
                    <span className={styles.savingText}>Saving…</span>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Talent Profile Modal */}
      {selectedTalent && (
        <div
          className={styles.modalOverlay}
          onClick={() => setSelectedTalent(null)}
        >
          <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
            <div className={styles.modalHeader}>
              <div className={styles.modalAvatar}>
                {selectedTalent.full_name?.[0]?.toUpperCase() ?? "?"}
              </div>
              <div>
                <h2>{selectedTalent.full_name}</h2>
                <p>
                  {selectedTalent.profession}
                  {selectedTalent.specialization
                    ? ` • ${selectedTalent.specialization}`
                    : ""}
                </p>
              </div>
              <button
                className={styles.closeBtn}
                onClick={() => setSelectedTalent(null)}
              >
                ✕
              </button>
            </div>

            <div className={styles.modalBody}>
              <div className={styles.profileGrid}>
                <div className={styles.profileItem}>
                  <span className={styles.profileLabel}>Experience</span>
                  <span className={styles.profileValue}>
                    {selectedTalent.years_of_experience != null
                      ? `${selectedTalent.years_of_experience} year${selectedTalent.years_of_experience !== 1 ? "s" : ""}`
                      : "—"}
                  </span>
                </div>
                <div className={styles.profileItem}>
                  <span className={styles.profileLabel}>Location</span>
                  <span className={styles.profileValue}>
                    {selectedTalent.location ?? "—"}
                  </span>
                </div>
                <div className={styles.profileItem}>
                  <span className={styles.profileLabel}>Phone</span>
                  <span className={styles.profileValue}>
                    {selectedTalent.phone_number ?? "—"}
                  </span>
                </div>
                <div className={styles.profileItem}>
                  <span className={styles.profileLabel}>License No.</span>
                  <span className={styles.profileValue}>
                    {selectedTalent.license_number || "—"}
                  </span>
                </div>
                <div className={styles.profileItem}>
                  <span className={styles.profileLabel}>Verified</span>
                  <span className={styles.profileValue}>
                    {selectedTalent.verified
                      ? "✅ Verified"
                      : "⏳ Not verified"}
                  </span>
                </div>
              </div>

              {selectedTalent.biography && (
                <div className={styles.bioSection}>
                  <h4>Biography</h4>
                  <p>{selectedTalent.biography}</p>
                </div>
              )}

              <div className={styles.credentialsSection}>
                <h4>Credentials & Resume</h4>
                <p className={styles.credentialsNote}>
                  Download this candidate's profile summary or resume.
                </p>
                <div className={styles.downloadButtons}>
                  <button
                    className={styles.downloadBtn}
                    onClick={() => downloadProfile(selectedTalent)}
                  >
                    ⬇️ Download Profile (TXT)
                  </button>
                  {selectedTalent.resume ? (
                    <a
                      href={selectedTalent.resume}
                      target="_blank"
                      rel="noopener noreferrer"
                      className={styles.downloadBtn}
                      download
                    >
                      📄 Download Resume
                    </a>
                  ) : (
                    <span className={styles.noResume}>No resume uploaded</span>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function downloadProfile(talent) {
  const lines = [
    "CANDIDATE PROFILE",
    "=================",
    `Name:             ${talent.full_name ?? "—"}`,
    `Profession:       ${talent.profession ?? "—"}`,
    `Specialization:   ${talent.specialization ?? "—"}`,
    `Experience:       ${talent.years_of_experience != null ? `${talent.years_of_experience} years` : "—"}`,
    `Location:         ${talent.location ?? "—"}`,
    `Phone:            ${talent.phone_number ?? "—"}`,
    `License No.:      ${talent.license_number || "—"}`,
    `Verified:         ${talent.verified ? "Yes" : "No"}`,
    "",
    "BIOGRAPHY",
    "---------",
    talent.biography ?? "No biography provided.",
    "",
    `Downloaded: ${new Date().toLocaleString()}`,
  ];
  const blob = new Blob([lines.join("\n")], { type: "text/plain" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = `${talent.full_name?.replace(/\s+/g, "_") ?? "candidate"}_profile.txt`;
  a.click();
  URL.revokeObjectURL(url);
}
