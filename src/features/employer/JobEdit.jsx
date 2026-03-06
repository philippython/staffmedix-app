import { useState, useEffect } from "react";
import { Link, useParams, useNavigate } from "react-router";
import styles from "./JobEdit.module.css";
import {
  useGetJobByIdQuery,
  useUpdateJobMutation,
  useDeleteJobMutation,
  useGetAppliedJobsQuery,
} from "../../services/jobsApi";
import { useWhoAmIQuery } from "../../services/userApi";
import { useCompanyVerification } from "../../hooks/useCompanyVerification";
import VerificationBanner from "../../components/VerificationBanner";

const EMPLOYMENT_TYPES = ["FULLTIME", "PART_TIME", "CONTRACT", "LOCUM"];
const SHIFT_TYPES = ["DAY_SHIFT", "NIGHT_SHIFT", "ROTATING"];

export default function JobEdit() {
  const { id } = useParams();
  const navigate = useNavigate();

  const { data: user } = useWhoAmIQuery();
  const companyId = user?.company_id;

  const verification = useCompanyVerification();
  const { canPostJobs, isVerified, percent, company } = verification;

  const {
    data: job,
    isLoading,
    isError,
  } = useGetJobByIdQuery(id, { skip: !id });
  const [updateJob, { isLoading: saving }] = useUpdateJobMutation();
  const [deleteJob, { isLoading: deleting }] = useDeleteJobMutation();

  const { data: allAppliedData } = useGetAppliedJobsQuery(
    { limit: 500 },
    { skip: !companyId },
  );

  const [formData, setFormData] = useState(null);
  const [successMsg, setSuccessMsg] = useState("");
  const [errMsg, setErrMsg] = useState("");
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  // Sync form when job data loads
  useEffect(() => {
    if (!job) return;
    setFormData({
      title: job.title ?? "",
      employment_type: job.employment_type ?? "FULLTIME",
      shift_type: job.shift_type ?? "DAY_SHIFT",
      salary_min: job.salary_min ?? "",
      salary_max: job.salary_max ?? "",
      location: job.location ?? "",
      deadline: job.deadline ?? "",
      description: job.description ?? "",
      requirements: job.requirements ?? "",
      benefits: job.benefits ?? "",
      responsibilities: job.responsibilities ?? "",
      openings: job.openings ?? 1,
      experience: job.experience ?? "",
      active: job.active ?? true,
    });
  }, [job]);

  // Real stats from applied jobs
  const allApplied = (allAppliedData?.results ?? allAppliedData ?? []).filter(
    (aj) => aj.job?.id === id,
  );
  const interviewCount = allApplied.filter((aj) => aj.interview).length;

  const jobStats = {
    views: job?.views ?? 0,
    applications: allApplied.length, // count applied jobs with this job id for accuracy
    interviews: interviewCount,
    openings: job?.openings ?? 0,
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  async function handleSubmit(e) {
    e.preventDefault();
    setErrMsg("");
    setSuccessMsg("");
    try {
      await updateJob({ id, data: formData }).unwrap();
      setSuccessMsg("Job updated successfully.");
    } catch (err) {
      setErrMsg(
        err?.data?.detail ||
          JSON.stringify(err?.data) ||
          "Failed to update job.",
      );
    }
  }

  async function handleDelete() {
    try {
      await deleteJob(id).unwrap();
      navigate("/employer-dashboard/all-job-posts");
    } catch (err) {
      setErrMsg(err?.data?.detail || "Failed to delete job.");
      setShowDeleteConfirm(false);
    }
  }

  if (isLoading) return <div className={styles.loading}>Loading job...</div>;
  if (isError) return <div className={styles.error}>Failed to load job.</div>;
  if (!formData) return null;

  if (!canPostJobs) {
    return (
      <div className={styles.jobEditView}>
        <div className={styles.header}>
          <div>
            <h1>Edit Job Posting</h1>
            <p>Update your job details</p>
          </div>
          <Link
            to="/employer-dashboard/all-job-posts"
            className={styles.backBtn}
          >
            Back to Jobs
          </Link>
        </div>
        <VerificationBanner verification={verification} />
        <div className={styles.blockedBox}>
          <span className={styles.blockedIcon}>🔒</span>
          <h2>Verification required</h2>
          <p>
            Only admin-verified organisations can post or edit jobs. Your
            profile is <strong>{percent}%</strong> complete.
            {percent < 100
              ? " Complete your profile to speed up verification."
              : " Your profile is complete — awaiting admin verification."}
          </p>
          <Link to="/employer-dashboard/settings" className={styles.blockedBtn}>
            Complete Profile
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className={styles.jobEditView}>
      <div className={styles.header}>
        <div>
          <h1>Edit Job Posting</h1>
          <p>Update your job details and manage applications</p>
        </div>
        <div className={styles.headerActions}>
          <Link
            to={`/employer-dashboard/view-applications/${id}`}
            className={styles.viewAppsBtn}
          >
            View Applications ({jobStats.applications})
          </Link>
          <Link
            to="/employer-dashboard/all-job-posts"
            className={styles.backBtn}
          >
            Back to Jobs
          </Link>
        </div>
      </div>

      {successMsg && <p className={styles.successMsg}>{successMsg}</p>}
      {errMsg && <p className={styles.errMsg}>{errMsg}</p>}

      <div className={styles.statsBar}>
        <div className={styles.statItem}>
          <span className={styles.statValue}>{jobStats.views}</span>
          <span className={styles.statLabel}>Views</span>
        </div>
        <div className={styles.statItem}>
          <span className={styles.statValue}>{jobStats.applications}</span>
          <span className={styles.statLabel}>Applications</span>
        </div>
        <div className={styles.statItem}>
          <span className={styles.statValue}>{jobStats.interviews}</span>
          <span className={styles.statLabel}>Interviews</span>
        </div>
        <div className={styles.statItem}>
          <span className={styles.statValue}>{jobStats.openings}</span>
          <span className={styles.statLabel}>Openings</span>
        </div>
      </div>

      <div className={styles.mainContent}>
        <form className={styles.editForm} onSubmit={handleSubmit}>
          {/* Status toggle */}
          <div className={styles.statusSection}>
            <h3>Job Status</h3>
            <div className={styles.statusButtons}>
              <button
                type="button"
                className={`${styles.statusBtn} ${formData.active ? styles.active : ""}`}
                onClick={() => setFormData((p) => ({ ...p, active: true }))}
              >
                Active
              </button>
              <button
                type="button"
                className={`${styles.statusBtn} ${!formData.active ? styles.closed : ""}`}
                onClick={() => setFormData((p) => ({ ...p, active: false }))}
              >
                Inactive
              </button>
            </div>
          </div>

          <div className={styles.sectionTitle}>Basic Information</div>

          <div className={styles.formRow}>
            <div className={styles.formGroup}>
              <label>Job Title *</label>
              <input
                type="text"
                name="title"
                value={formData.title}
                onChange={handleChange}
                required
              />
            </div>
            <div className={styles.formGroup}>
              <label>Number of Openings *</label>
              <input
                type="number"
                name="openings"
                value={formData.openings}
                onChange={handleChange}
                min="1"
                required
              />
            </div>
          </div>

          <div className={styles.formRow}>
            <div className={styles.formGroup}>
              <label>Employment Type *</label>
              <select
                name="employment_type"
                value={formData.employment_type}
                onChange={handleChange}
                required
              >
                {EMPLOYMENT_TYPES.map((t) => (
                  <option key={t} value={t}>
                    {t.replace("_", " ")}
                  </option>
                ))}
              </select>
            </div>
            <div className={styles.formGroup}>
              <label>Shift Type *</label>
              <select
                name="shift_type"
                value={formData.shift_type}
                onChange={handleChange}
                required
              >
                {SHIFT_TYPES.map((t) => (
                  <option key={t} value={t}>
                    {t.replace("_", " ")}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className={styles.formRow}>
            <div className={styles.formGroup}>
              <label>Years of Experience *</label>
              <input
                type="number"
                name="experience"
                value={formData.experience}
                onChange={handleChange}
                min="0"
                required
              />
            </div>
          </div>

          <div className={styles.sectionTitle}>Compensation & Location</div>

          <div className={styles.formRow}>
            <div className={styles.formGroup}>
              <label>Minimum Salary (₦)</label>
              <input
                type="number"
                name="salary_min"
                value={formData.salary_min}
                onChange={handleChange}
              />
            </div>
            <div className={styles.formGroup}>
              <label>Maximum Salary (₦)</label>
              <input
                type="number"
                name="salary_max"
                value={formData.salary_max}
                onChange={handleChange}
              />
            </div>
          </div>

          <div className={styles.formRow}>
            <div className={styles.formGroup}>
              <label>Location *</label>
              <input
                type="text"
                name="location"
                value={formData.location}
                onChange={handleChange}
                required
              />
            </div>
            <div className={styles.formGroup}>
              <label>Application Deadline *</label>
              <input
                type="date"
                name="deadline"
                value={formData.deadline}
                onChange={handleChange}
                required
              />
            </div>
          </div>

          <div className={styles.sectionTitle}>Job Details</div>

          <div className={styles.formGroup}>
            <label>Job Description *</label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleChange}
              rows="6"
              required
            />
          </div>

          <div className={styles.formGroup}>
            <label>Requirements *</label>
            <textarea
              name="requirements"
              value={formData.requirements}
              onChange={handleChange}
              rows="5"
              required
            />
          </div>

          <div className={styles.formGroup}>
            <label>Responsibilities *</label>
            <textarea
              name="responsibilities"
              value={formData.responsibilities}
              onChange={handleChange}
              rows="5"
              required
            />
          </div>

          <div className={styles.formGroup}>
            <label>Benefits & Perks</label>
            <textarea
              name="benefits"
              value={formData.benefits}
              onChange={handleChange}
              rows="4"
            />
          </div>

          <div className={styles.formActions}>
            <button
              type="button"
              className={styles.deleteBtn}
              onClick={() => setShowDeleteConfirm(true)}
            >
              Delete Job
            </button>
            <button type="submit" className={styles.saveBtn} disabled={saving}>
              {saving ? "Saving…" : "Save Changes"}
            </button>
          </div>
        </form>

        <aside className={styles.sidebar}>
          <div className={styles.quickActions}>
            <h3>Quick Actions</h3>
            <Link
              to={`/employer-dashboard/view-applications/${id}`}
              className={styles.actionLink}
            >
              📋 View Applications
            </Link>
            <Link
              to="/employer-dashboard/interviews"
              className={styles.actionLink}
            >
              🗓️ Manage Interviews
            </Link>
            <Link
              to={`/jobs/${id}`}
              className={styles.actionLink}
              target="_blank"
            >
              👁️ Preview as Candidate
            </Link>
          </div>

          <div className={styles.jobInfoCard}>
            <h3>Job Info</h3>
            <div className={styles.infoRow}>
              <span>Posted</span>
              <strong>
                {job?.created_at
                  ? new Date(job.created_at).toLocaleDateString("en-GB", {
                      day: "numeric",
                      month: "short",
                      year: "numeric",
                    })
                  : "—"}
              </strong>
            </div>
            <div className={styles.infoRow}>
              <span>Employment</span>
              <strong>{job?.employment_type?.replace("_", " ") ?? "—"}</strong>
            </div>
            <div className={styles.infoRow}>
              <span>Shift</span>
              <strong>{job?.shift_type?.replace("_", " ") ?? "—"}</strong>
            </div>
            <div className={styles.infoRow}>
              <span>Experience</span>
              <strong>
                {job?.experience
                  ? `${job.experience} yr${job.experience !== 1 ? "s" : ""}`
                  : "—"}
              </strong>
            </div>
          </div>
        </aside>
      </div>

      {/* Delete confirmation modal */}
      {showDeleteConfirm && (
        <div
          className={styles.modalOverlay}
          onClick={() => setShowDeleteConfirm(false)}
        >
          <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
            <h3>Delete Job Post?</h3>
            <p>
              This will permanently delete <strong>{job?.title}</strong> and all
              its applications. This cannot be undone.
            </p>
            <div className={styles.modalActions}>
              <button
                className={styles.cancelBtn}
                onClick={() => setShowDeleteConfirm(false)}
              >
                Keep Job
              </button>
              <button
                className={styles.confirmDeleteBtn}
                onClick={handleDelete}
                disabled={deleting}
              >
                {deleting ? "Deleting…" : "Yes, Delete"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
