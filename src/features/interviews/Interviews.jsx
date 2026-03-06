import { useState, useMemo } from "react";
import { Link } from "react-router";
import styles from "./Interviews.module.css";
import { useGetAppliedJobsQuery } from "../../services/jobsApi";
import {
  useGetInterviewsQuery,
  useCreateInterviewMutation,
  useUpdateInterviewMutation,
} from "../../services/interviewApi";
import { useWhoAmIQuery } from "../../services/userApi";

const STATUS_OPTIONS = ["UPCOMING", "COMPLETED", "CANCELED"];

const STATUS_LABELS = {
  UPCOMING: "⏳ Upcoming",
  COMPLETED: "✓ Completed",
  CANCELED: "✕ Canceled",
};

const emptyForm = {
  scheduled_at: "",
  duration: "",
  interview_link: "",
  notes: "",
  status: "UPCOMING",
};

function ApplicantSearch({
  eligibleAppliedJobs,
  selectedAppliedJobId,
  onSelect,
}) {
  const [query, setQuery] = useState("");
  const [open, setOpen] = useState(false);

  const selected = eligibleAppliedJobs.find(
    (aj) => aj.id === selectedAppliedJobId,
  );

  const filtered = eligibleAppliedJobs.filter((aj) => {
    const name = aj.talent?.full_name?.toLowerCase() ?? "";
    const title = aj.job?.title?.toLowerCase() ?? "";
    return (
      name.includes(query.toLowerCase()) || title.includes(query.toLowerCase())
    );
  });

  function handleSelect(aj) {
    onSelect(aj.id);
    setQuery("");
    setOpen(false);
  }

  return (
    <div className={styles.applicantSearch}>
      <div className={styles.applicantInput} onClick={() => setOpen(true)}>
        {selected ? (
          <span className={styles.selectedApplicant}>
            {selected.talent?.full_name ?? "Candidate"} —{" "}
            {selected.job?.title ?? "Job"}
            <button
              type="button"
              className={styles.clearApplicant}
              onClick={(e) => {
                e.stopPropagation();
                onSelect("");
                setOpen(false);
              }}
            >
              ✕
            </button>
          </span>
        ) : (
          <input
            type="text"
            value={query}
            onChange={(e) => {
              setQuery(e.target.value);
              setOpen(true);
            }}
            placeholder="Search by name or job title…"
            onFocus={() => setOpen(true)}
          />
        )}
      </div>
      {open && !selected && (
        <div className={styles.applicantDropdown}>
          {filtered.length === 0 ? (
            <p className={styles.noResults}>No matching applicants</p>
          ) : (
            filtered.map((aj) => (
              <div
                key={aj.id}
                className={styles.applicantOption}
                onMouseDown={() => handleSelect(aj)}
              >
                <span className={styles.applicantName}>
                  {aj.talent?.full_name ?? "Candidate"}
                </span>
                <span className={styles.applicantJob}>
                  {aj.job?.title ?? "Job"}
                </span>
              </div>
            ))
          )}
        </div>
      )}
    </div>
  );
}

export default function Interviews() {
  const [activeTab, setActiveTab] = useState("upcoming");
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [editingInterview, setEditingInterview] = useState(null); // interview object being edited
  const [selectedAppliedJobId, setSelectedAppliedJobId] = useState("");
  const [form, setForm] = useState(emptyForm);
  const [formErr, setFormErr] = useState("");

  const { data: user } = useWhoAmIQuery();
  const isEmployer = user?.role === "EMPLOYER";
  const companyId = user?.company_id;

  // ── TALENT: applied jobs carry interview data ────────────────────────────
  const {
    data: talentAppliedData,
    isLoading: loadingTalent,
    error: talentError,
  } = useGetAppliedJobsQuery(
    { limit: 100, talent: user?.talent_id },
    { skip: !user?.talent_id || isEmployer },
  );

  // ── EMPLOYER: fetch ALL applied jobs, filter by company on frontend ────────
  const {
    data: allAppliedJobsRaw,
    isLoading: loadingEmployer,
    error: employerError,
    refetch: refetchAppliedJobs,
  } = useGetAppliedJobsQuery(
    { limit: 500 },
    { skip: !companyId || !isEmployer },
  );

  // Filter to only applied jobs belonging to this employer's company
  // company is always a nested object: { id, company_name, ... }
  // we also filter by the company's user field since whoAmI gives us user id
  const employerAppliedWithInterviews = useMemo(() => {
    const all = allAppliedJobsRaw?.results ?? allAppliedJobsRaw ?? [];
    const filtered = all.filter((aj) => {
      // Match by company id (companyId from whoAmI IS the company profile id)
      return aj.company?.id === companyId;
    });
    return { results: filtered };
  }, [allAppliedJobsRaw, companyId]);

  // Same data used for create modal eligible jobs
  const companyAppliedData = employerAppliedWithInterviews;

  const [createInterview, { isLoading: creating }] =
    useCreateInterviewMutation();
  const [updateInterview, { isLoading: updating }] =
    useUpdateInterviewMutation();

  // Applied jobs with NO interview yet — eligible for scheduling
  const eligibleAppliedJobs = useMemo(() => {
    const all = companyAppliedData?.results ?? companyAppliedData ?? [];
    return all.filter((aj) => !aj.interview);
  }, [companyAppliedData]);

  // ── Build interview lists ─────────────────────────────────────────────────
  const interviews = useMemo(() => {
    const upcoming = [],
      past = [],
      cancelled = [];

    if (isEmployer) {
      // Extract only applied jobs that have interviews, already filtered by company
      const allApplied = employerAppliedWithInterviews?.results ?? [];
      allApplied
        .filter((aj) => aj.interview != null)
        .forEach((aj) => {
          const iv = aj.interview;
          const data = {
            id: iv.id,
            scheduled_at: iv.scheduled_at,
            status: iv.status,
            notes: iv.notes,
            duration: iv.duration,
            interview_link: iv.interview_link,
            applied_job_id: aj.id,
            talent_name: aj.talent?.full_name,
            job_title: aj.job?.title,
            company_name: aj.company?.company_name,
            job_location: aj.job?.location,
            job: aj.job,
            talent: aj.talent,
          };
          if (iv.status === "CANCELED") cancelled.push(data);
          else if (iv.status === "COMPLETED") past.push(data);
          else upcoming.push(data);
        });
    } else {
      const all = talentAppliedData?.results ?? [];
      all
        .filter((aj) => aj.interview)
        .forEach((aj) => {
          const iv = aj.interview;
          const data = {
            id: iv.id,
            scheduled_at: iv.scheduled_at,
            status: iv.status,
            notes: iv.notes,
            duration: iv.duration,
            interview_link: iv.interview_link,
            applied_job_id: aj.id,
            talent_name: aj.talent?.full_name,
            job_title: aj.job?.title,
            company_name: aj.company?.company_name,
            job_location: aj.job?.location,
            job: aj.job,
            talent: aj.talent,
            company: aj.company,
          };
          if (iv.status === "CANCELED") cancelled.push(data);
          else if (iv.status === "COMPLETED") past.push(data);
          else upcoming.push(data);
        });
    }

    return { upcoming, past, cancelled };
  }, [isEmployer, employerAppliedWithInterviews, talentAppliedData]);

  const currentInterviews = interviews[activeTab];
  const isLoading = isEmployer ? loadingEmployer : loadingTalent;
  const error = isEmployer ? employerError : talentError;

  // ── Helpers ───────────────────────────────────────────────────────────────
  const formatDateTime = (scheduledAt) => {
    if (!scheduledAt) return { date: "N/A", time: "N/A" };
    const d = new Date(scheduledAt);
    const date = d.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
    const hours = d.getHours();
    const mins = d.getMinutes().toString().padStart(2, "0");
    const ampm = hours >= 12 ? "PM" : "AM";
    const time = `${hours % 12 || 12}:${mins} ${ampm}`;
    return { date, time };
  };

  // ── Create interview ──────────────────────────────────────────────────────
  function openCreate() {
    setForm(emptyForm);
    setSelectedAppliedJobId("");
    setFormErr("");
    setShowCreateModal(true);
  }

  async function handleCreate(e) {
    e.preventDefault();
    setFormErr("");
    if (!selectedAppliedJobId) {
      setFormErr("Please select an applicant.");
      return;
    }
    try {
      await createInterview({
        applied_job: selectedAppliedJobId,
        scheduled_at: form.scheduled_at,
        duration: Number(form.duration),
        interview_link: form.interview_link || null,
        notes: form.notes,
        status: form.status,
      }).unwrap();
      setShowCreateModal(false);
      setForm(emptyForm);
      setSelectedAppliedJobId("");
      refetchAppliedJobs();
    } catch (err) {
      setFormErr(
        err?.data?.detail ||
          JSON.stringify(err?.data) ||
          "Failed to create interview.",
      );
    }
  }

  // ── Edit interview ────────────────────────────────────────────────────────
  function openEdit(interview) {
    setForm({
      scheduled_at: interview.scheduled_at?.slice(0, 16) ?? "",
      duration: interview.duration ?? "",
      interview_link: interview.interview_link ?? "",
      notes: interview.notes ?? "",
      status: interview.status ?? "UPCOMING",
    });
    setFormErr("");
    setEditingInterview(interview);
  }

  async function handleEdit(e) {
    e.preventDefault();
    setFormErr("");
    try {
      await updateInterview({
        interviewId: editingInterview.id,
        data: {
          scheduled_at: form.scheduled_at,
          duration: Number(form.duration),
          interview_link: form.interview_link || null,
          notes: form.notes,
          status: form.status,
        },
      }).unwrap();
      setEditingInterview(null);
      refetchAppliedJobs();
    } catch (err) {
      setFormErr(
        err?.data?.detail ||
          JSON.stringify(err?.data) ||
          "Failed to update interview.",
      );
    }
  }

  const handleFormChange = (e) =>
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));

  if (isLoading)
    return (
      <div className={styles.interviewsPage}>
        <div className={styles.loading}>Loading interviews...</div>
      </div>
    );

  if (error)
    return (
      <div className={styles.interviewsPage}>
        <div className={styles.error}>
          Failed to load interviews. Please try again.
        </div>
      </div>
    );

  return (
    <div className={styles.interviewsPage}>
      <div className={styles.header}>
        <div className={styles.headerText}>
          <h1>Interview Schedule</h1>
          <p>
            {isEmployer
              ? "Schedule and manage candidate interviews"
              : "Manage your interviews and appointments"}
          </p>
        </div>
        {isEmployer && (
          <button className={styles.createBtn} onClick={openCreate}>
            + Schedule Interview
          </button>
        )}
      </div>

      <div className={styles.tabs}>
        {["upcoming", "past", "cancelled"].map((tab) => (
          <button
            key={tab}
            className={activeTab === tab ? styles.activeTab : ""}
            onClick={() => setActiveTab(tab)}
          >
            {tab.charAt(0).toUpperCase() + tab.slice(1)} (
            {interviews[tab].length})
          </button>
        ))}
      </div>

      <div className={styles.interviewsList}>
        {currentInterviews.length > 0 ? (
          currentInterviews.map((interview) => (
            <div key={interview.id} className={styles.interviewCard}>
              <div className={styles.cardHeader}>
                <div className={styles.interviewInfo}>
                  <h3>
                    {isEmployer
                      ? interview.talent_name || "Candidate"
                      : interview.job_title || "Job Title"}
                  </h3>
                  <p className={styles.subtitle}>
                    {isEmployer
                      ? interview.job_title || "Position"
                      : interview.company_name || "Company"}
                  </p>
                </div>
                <span
                  className={`${styles.statusBadge} ${styles[interview.status?.toLowerCase()]}`}
                >
                  {STATUS_LABELS[interview.status] ?? interview.status}
                </span>
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
                {interview.job?.id && (
                  <Link
                    to={`/jobs/${interview.job.id}`}
                    className={styles.viewJobBtn}
                  >
                    📋 View Job
                  </Link>
                )}
                {isEmployer && (
                  <button
                    className={styles.editBtn}
                    onClick={() => openEdit(interview)}
                  >
                    ✏️ Edit
                  </button>
                )}
                {!isEmployer && activeTab === "past" && (
                  <Link
                    to="/employee-dashboard/chat"
                    className={styles.messageBtn}
                  >
                    💬 Message
                  </Link>
                )}
              </div>
            </div>
          ))
        ) : (
          <div className={styles.emptyState}>
            <p>No {activeTab} interviews</p>
            {activeTab === "upcoming" && !isEmployer && (
              <Link to="/jobs" className={styles.browseJobsBtn}>
                Browse Jobs
              </Link>
            )}
            {activeTab === "upcoming" && isEmployer && (
              <button className={styles.createBtn} onClick={openCreate}>
                + Schedule Your First Interview
              </button>
            )}
          </div>
        )}
      </div>

      {/* ── Create Interview Modal ── */}
      {showCreateModal && (
        <div
          className={styles.modalOverlay}
          onClick={() => setShowCreateModal(false)}
        >
          <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
            <h3 className={styles.modalTitle}>Schedule Interview</h3>

            {eligibleAppliedJobs.length === 0 ? (
              <div className={styles.noApplicants}>
                <p>No applicants without an interview yet.</p>
                <p className={styles.noApplicantsHint}>
                  Interviews can only be scheduled for candidates who have
                  applied to your job postings and don't have an interview
                  scheduled yet.
                </p>
                <button
                  className={styles.modalCancel}
                  onClick={() => setShowCreateModal(false)}
                >
                  Close
                </button>
              </div>
            ) : (
              <form onSubmit={handleCreate}>
                {formErr && <p className={styles.formErr}>{formErr}</p>}

                <div className={styles.modalField}>
                  <label>Search Applicant *</label>
                  <ApplicantSearch
                    eligibleAppliedJobs={eligibleAppliedJobs}
                    selectedAppliedJobId={selectedAppliedJobId}
                    onSelect={setSelectedAppliedJobId}
                  />
                </div>

                <div className={styles.modalField}>
                  <label>Date & Time *</label>
                  <input
                    type="datetime-local"
                    name="scheduled_at"
                    value={form.scheduled_at}
                    onChange={handleFormChange}
                    required
                  />
                </div>

                <div className={styles.modalRow}>
                  <div className={styles.modalField}>
                    <label>Duration (mins) *</label>
                    <input
                      type="number"
                      name="duration"
                      value={form.duration}
                      onChange={handleFormChange}
                      placeholder="e.g. 30"
                      min="1"
                      required
                    />
                  </div>
                  <div className={styles.modalField}>
                    <label>Status</label>
                    <select
                      name="status"
                      value={form.status}
                      onChange={handleFormChange}
                    >
                      {STATUS_OPTIONS.map((s) => (
                        <option key={s} value={s}>
                          {s}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                <div className={styles.modalField}>
                  <label>Interview Link</label>
                  <input
                    type="url"
                    name="interview_link"
                    value={form.interview_link}
                    onChange={handleFormChange}
                    placeholder="https://meet.google.com/..."
                  />
                </div>

                <div className={styles.modalField}>
                  <label>Notes *</label>
                  <textarea
                    name="notes"
                    value={form.notes}
                    onChange={handleFormChange}
                    rows="3"
                    placeholder="Interview instructions, what to prepare..."
                    required
                  />
                </div>

                <div className={styles.modalActions}>
                  <button
                    type="button"
                    className={styles.modalCancel}
                    onClick={() => setShowCreateModal(false)}
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className={styles.modalConfirm}
                    disabled={creating}
                  >
                    {creating ? "Scheduling…" : "Schedule Interview"}
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}

      {/* ── Edit Interview Modal ── */}
      {editingInterview && (
        <div
          className={styles.modalOverlay}
          onClick={() => setEditingInterview(null)}
        >
          <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
            <h3 className={styles.modalTitle}>Edit Interview</h3>
            <p className={styles.modalSub}>
              {editingInterview.talent_name} — {editingInterview.job_title}
            </p>

            <form onSubmit={handleEdit}>
              {formErr && <p className={styles.formErr}>{formErr}</p>}

              <div className={styles.modalField}>
                <label>Date & Time *</label>
                <input
                  type="datetime-local"
                  name="scheduled_at"
                  value={form.scheduled_at}
                  onChange={handleFormChange}
                  required
                />
              </div>

              <div className={styles.modalRow}>
                <div className={styles.modalField}>
                  <label>Duration (mins) *</label>
                  <input
                    type="number"
                    name="duration"
                    value={form.duration}
                    onChange={handleFormChange}
                    placeholder="e.g. 30"
                    min="1"
                    required
                  />
                </div>
                <div className={styles.modalField}>
                  <label>Status</label>
                  <select
                    name="status"
                    value={form.status}
                    onChange={handleFormChange}
                  >
                    {STATUS_OPTIONS.map((s) => (
                      <option key={s} value={s}>
                        {s}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div className={styles.modalField}>
                <label>Interview Link</label>
                <input
                  type="url"
                  name="interview_link"
                  value={form.interview_link}
                  onChange={handleFormChange}
                  placeholder="https://meet.google.com/..."
                />
              </div>

              <div className={styles.modalField}>
                <label>Notes *</label>
                <textarea
                  name="notes"
                  value={form.notes}
                  onChange={handleFormChange}
                  rows="3"
                  required
                />
              </div>

              <div className={styles.modalActions}>
                <button
                  type="button"
                  className={styles.modalCancel}
                  onClick={() => setEditingInterview(null)}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className={styles.modalConfirm}
                  disabled={updating}
                >
                  {updating ? "Saving…" : "Save Changes"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
