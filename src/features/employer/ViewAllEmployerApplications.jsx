import { useState, useMemo } from "react";
import { Link } from "react-router";
import styles from "./ViewAllEmployerApplications.module.css";
import {
  useGetAppliedJobsQuery,
  useGetJobsQuery,
  useUpdateAppliedJobMutation,
} from "../../services/jobsApi";
import { useWhoAmIQuery } from "../../services/userApi";

const STATUS_LABELS = {
  PENDING: "Pending",
  UNDER_REVIEW: "Under Review",
  SELECTED: "Selected",
  REJECTED: "Rejected",
};

const STATUS_CLASS = {
  PENDING: "pending",
  UNDER_REVIEW: "underreview",
  SELECTED: "selected",
  REJECTED: "rejected",
};

export default function ViewAllEmployerApplications() {
  const { data: user } = useWhoAmIQuery();
  const companyId = user?.company_id;

  const { data: jobsData } = useGetJobsQuery(
    { company: companyId, limit: 100 },
    { skip: !companyId },
  );

  const {
    data: allAppliedData,
    isLoading,
    isError,
  } = useGetAppliedJobsQuery({ limit: 500 }, { skip: !companyId });

  const [updateAppliedJob] = useUpdateAppliedJobMutation();
  const [updatingId, setUpdatingId] = useState(null);

  const [filters, setFilters] = useState({
    job: "all",
    status: "all",
    date: "all",
  });
  const [selectedTalent, setSelectedTalent] = useState(null);

  const jobPosts = jobsData?.results ?? [];
  const employerJobIds = new Set(jobPosts.map((j) => j.id));
  const allApplied = (allAppliedData?.results ?? allAppliedData ?? []).filter(
    (aj) => employerJobIds.has(aj.job?.id),
  );

  // Date filter helper
  const inDateRange = (appliedAt) => {
    if (filters.date === "all") return true;
    const d = new Date(appliedAt);
    const now = new Date();
    if (filters.date === "today") {
      return d.toDateString() === now.toDateString();
    }
    if (filters.date === "week") {
      const weekAgo = new Date(now);
      weekAgo.setDate(now.getDate() - 7);
      return d >= weekAgo;
    }
    if (filters.date === "month") {
      const monthAgo = new Date(now);
      monthAgo.setMonth(now.getMonth() - 1);
      return d >= monthAgo;
    }
    return true;
  };

  const filtered = useMemo(
    () =>
      allApplied.filter((app) => {
        if (filters.job !== "all" && app.job?.id !== filters.job) return false;
        if (filters.status !== "all" && app.status !== filters.status)
          return false;
        if (!inDateRange(app.applied_at)) return false;
        return true;
      }),
    [allApplied, filters],
  );

  const stats = useMemo(
    () => ({
      total: allApplied.length,
      pending: allApplied.filter((a) => a.status === "PENDING").length,
      under_review: allApplied.filter((a) => a.status === "UNDER_REVIEW")
        .length,
      selected: allApplied.filter((a) => a.status === "SELECTED").length,
      rejected: allApplied.filter((a) => a.status === "REJECTED").length,
    }),
    [allApplied],
  );

  async function handleStatusChange(appId, newStatus) {
    setUpdatingId(appId);
    try {
      await updateAppliedJob({
        id: appId,
        data: { status: newStatus },
      }).unwrap();
    } catch {
      alert("Failed to update status.");
    } finally {
      setUpdatingId(null);
    }
  }

  function exportCSV() {
    const rows = [
      ["Candidate", "Job", "Status", "Experience", "Location", "Applied"],
      ...allApplied.map((a) => [
        a.talent?.full_name ?? "",
        a.job?.title ?? "",
        a.status,
        a.talent?.years_of_experience != null
          ? `${a.talent.years_of_experience} yrs`
          : "",
        a.talent?.location ?? "",
        new Date(a.applied_at).toLocaleDateString(),
      ]),
    ];
    const csv = rows.map((r) => r.join(",")).join("\n");
    const blob = new Blob([csv], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "applications.csv";
    a.click();
    URL.revokeObjectURL(url);
  }

  function downloadProfile(talent) {
    const lines = [
      "CANDIDATE PROFILE",
      "=================",
      `Name:           ${talent.full_name ?? "—"}`,
      `Profession:     ${talent.profession ?? "—"}`,
      `Specialization: ${talent.specialization ?? "—"}`,
      `Experience:     ${talent.years_of_experience != null ? `${talent.years_of_experience} years` : "—"}`,
      `Location:       ${talent.location ?? "—"}`,
      `Phone:          ${talent.phone_number ?? "—"}`,
      `License No.:    ${talent.license_number || "—"}`,
      `Verified:       ${talent.verified ? "Yes" : "No"}`,
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

  if (isLoading)
    return <div className={styles.loading}>Loading applications...</div>;
  if (isError)
    return <div className={styles.error}>Failed to load applications.</div>;

  return (
    <div className={styles.page}>
      {/* Header */}
      <div className={styles.header}>
        <div>
          <h1>All Applications</h1>
          <p>Manage applications across all your job postings</p>
        </div>
        <div className={styles.headerActions}>
          <Link to="/employer-dashboard" className={styles.backBtn}>
            ← Dashboard
          </Link>
        </div>
      </div>

      {/* Stats bar */}
      <div className={styles.statsBar}>
        {[
          { label: "Total", value: stats.total, key: "all" },
          { label: "Pending", value: stats.pending, key: "PENDING" },
          {
            label: "Under Review",
            value: stats.under_review,
            key: "UNDER_REVIEW",
          },
          { label: "Selected", value: stats.selected, key: "SELECTED" },
          { label: "Rejected", value: stats.rejected, key: "REJECTED" },
        ].map((s) => (
          <button
            key={s.key}
            className={`${styles.statCard} ${filters.status === s.key ? styles.statCardActive : ""}`}
            onClick={() => setFilters((f) => ({ ...f, status: s.key }))}
          >
            <span className={styles.statValue}>{s.value}</span>
            <span className={styles.statLabel}>{s.label}</span>
          </button>
        ))}
      </div>

      {/* Filters */}
      <div className={styles.filterRow}>
        <select
          value={filters.job}
          onChange={(e) => setFilters((f) => ({ ...f, job: e.target.value }))}
          className={styles.filterSelect}
        >
          <option value="all">All Jobs</option>
          {jobPosts.map((job) => (
            <option key={job.id} value={job.id}>
              {job.title}
            </option>
          ))}
        </select>

        <select
          value={filters.status}
          onChange={(e) =>
            setFilters((f) => ({ ...f, status: e.target.value }))
          }
          className={styles.filterSelect}
        >
          <option value="all">All Statuses</option>
          {Object.entries(STATUS_LABELS).map(([val, label]) => (
            <option key={val} value={val}>
              {label}
            </option>
          ))}
        </select>

        <select
          value={filters.date}
          onChange={(e) => setFilters((f) => ({ ...f, date: e.target.value }))}
          className={styles.filterSelect}
        >
          <option value="all">All Time</option>
          <option value="today">Today</option>
          <option value="week">This Week</option>
          <option value="month">This Month</option>
        </select>

        <span className={styles.resultCount}>
          {filtered.length} result{filtered.length !== 1 ? "s" : ""}
        </span>
      </div>

      {/* List */}
      {filtered.length === 0 ? (
        <div className={styles.empty}>
          <p>No applications match the selected filters.</p>
          <button
            className={styles.clearBtn}
            onClick={() =>
              setFilters({ job: "all", status: "all", date: "all" })
            }
          >
            Clear Filters
          </button>
        </div>
      ) : (
        <div className={styles.list}>
          {filtered.map((app) => (
            <div key={app.id} className={styles.card}>
              <div className={styles.cardLeft}>
                <div className={styles.avatar}>
                  {app.talent?.full_name?.[0]?.toUpperCase() ?? "?"}
                </div>
                <div className={styles.info}>
                  <h3>{app.talent?.full_name ?? "Candidate"}</h3>
                  <p className={styles.jobTitle}>{app.job?.title ?? "—"}</p>
                  <div className={styles.meta}>
                    {app.talent?.profession && (
                      <span>{app.talent.profession}</span>
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
                    <span>
                      Applied{" "}
                      {new Date(app.applied_at).toLocaleDateString("en-GB", {
                        day: "numeric",
                        month: "short",
                        year: "numeric",
                      })}
                    </span>
                  </div>
                </div>
              </div>

              <div className={styles.cardRight}>
                <span
                  className={`${styles.statusBadge} ${styles[STATUS_CLASS[app.status] ?? "pending"]}`}
                >
                  {STATUS_LABELS[app.status] ?? app.status}
                </span>
                <div className={styles.actions}>
                  <button
                    className={styles.profileBtn}
                    onClick={() => setSelectedTalent(app.talent)}
                  >
                    👤 Profile
                  </button>
                  <Link
                    to={`/employer-dashboard/view-applications/${app.job?.id}`}
                    className={styles.jobBtn}
                  >
                    📋 Job
                  </Link>
                  {app.interview && (
                    <Link
                      to="/employer-dashboard/interviews"
                      className={styles.interviewBtn}
                    >
                      🗓 Interview
                    </Link>
                  )}
                  <select
                    className={styles.statusSelect}
                    value={app.status}
                    disabled={updatingId === app.id}
                    onChange={(e) => handleStatusChange(app.id, e.target.value)}
                  >
                    {Object.entries(STATUS_LABELS).map(([val, label]) => (
                      <option key={val} value={val}>
                        {label}
                      </option>
                    ))}
                  </select>
                  {updatingId === app.id && (
                    <span className={styles.saving}>Saving…</span>
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
                {[
                  [
                    "Experience",
                    selectedTalent.years_of_experience != null
                      ? `${selectedTalent.years_of_experience} years`
                      : "—",
                  ],
                  ["Location", selectedTalent.location ?? "—"],
                  ["Phone", selectedTalent.phone_number ?? "—"],
                  ["License No.", selectedTalent.license_number || "—"],
                  [
                    "Verified",
                    selectedTalent.verified ? "✅ Verified" : "⏳ Not verified",
                  ],
                ].map(([label, value]) => (
                  <div key={label} className={styles.profileItem}>
                    <span className={styles.profileLabel}>{label}</span>
                    <span className={styles.profileValue}>{value}</span>
                  </div>
                ))}
              </div>
              {selectedTalent.biography && (
                <div className={styles.bioSection}>
                  <h4>Biography</h4>
                  <p>{selectedTalent.biography}</p>
                </div>
              )}
              <div className={styles.credentialsSection}>
                <h4>Download</h4>
                <div className={styles.downloadButtons}>
                  <button
                    className={styles.downloadBtn}
                    onClick={() => downloadProfile(selectedTalent)}
                  >
                    ⬇️ Profile (TXT)
                  </button>
                  {selectedTalent.resume ? (
                    <a
                      href={selectedTalent.resume}
                      target="_blank"
                      rel="noopener noreferrer"
                      className={styles.downloadBtn}
                      download
                    >
                      📄 Resume
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
