import { useState } from "react";
import { Link, useNavigate } from "react-router";
import styles from "./JobPostForm.module.css";
import { useCreateJobMutation } from "../../services/jobsApi";
import { useWhoAmIQuery } from "../../services/userApi";
import { useCompanyVerification } from "../../hooks/useCompanyVerification";
import VerificationBanner from "../../components/VerificationBanner";
import { usePlanFeatures } from "../../hooks/usePlanFeatures";

export default function JobPostForm() {
  const navigate = useNavigate();
  const { data: user } = useWhoAmIQuery();

  const verification = useCompanyVerification();
  const { canPostJobs, percent, isVerified } = verification;

  const { canPostLocum, isEnterprise, maxJobsPerMonth } = usePlanFeatures();

  const [createJob, { isLoading: isCreating }] = useCreateJobMutation();

  const [formData, setFormData] = useState({
    title: "",
    employment_type: "",
    experience: "",
    salary_min: "",
    salary_max: "",
    openings: "1",
    location: "",
    shift_type: "",
    description: "",
    requirements: "",
    responsibilities: "",
    benefits: "",
    deadline: "",
  });

  const isLocum        = formData.employment_type === "LOCUM";
  const locumBlocked   = isLocum && !canPostLocum;
  const canSubmit      = !isCreating && canPostJobs && !locumBlocked;

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const formatBulletText = (text) => {
    if (!text) return "";
    return text.split("\n").map((l) => l.trim()).filter((l) => l.length > 0).join("\n");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!canSubmit) return;
    const jobData = {
      title:            formData.title,
      description:      formData.description,
      location:         formData.location,
      salary_min:       parseFloat(formData.salary_min),
      salary_max:       parseFloat(formData.salary_max),
      openings:         parseInt(formData.openings),
      experience:       parseInt(formData.experience),
      shift_type:       formData.shift_type,
      employment_type:  formData.employment_type,
      deadline:         formData.deadline,
      requirements:     formatBulletText(formData.requirements),
      responsibilities: formatBulletText(formData.responsibilities),
      benefits:         formatBulletText(formData.benefits),
      company:          user?.company_id,
    };
    try {
      await createJob(jobData).unwrap();
      navigate("/employer-dashboard");
    } catch (error) {
      alert(error?.data?.detail || "Failed to post job. Please try again.");
    }
  };

  // ── Verification blocked ──────────────────────────────────────────────────
  if (!canPostJobs) {
    return (
      <div className={styles.jobPostPage}>
        <div className={styles.pageHeader}>
          <h1>Post a New Job</h1>
          <p>Attract the best healthcare talent for your organization</p>
        </div>
        <VerificationBanner verification={verification} />
        <div className={styles.blockedBox}>
          <span className={styles.blockedIcon}>🔒</span>
          <h2>Verification Required</h2>
          <p>
            Only verified organisations can post jobs. Your profile is{" "}
            <strong>{percent}%</strong> complete.
            {percent < 100
              ? " Complete your profile to speed up the verification process."
              : " Your profile is complete — please wait for admin verification."}
          </p>
          {percent < 100 && (
            <Link to="/employer-dashboard/settings" className={styles.blockedBtn}>
              Complete Your Profile
            </Link>
          )}
          <Link to="/employer-dashboard" className={styles.blockedBack}>
            ← Back to Dashboard
          </Link>
        </div>
      </div>
    );
  }

  // ── Normal form ───────────────────────────────────────────────────────────
  return (
    <div className={styles.jobPostPage}>
      <div className={styles.pageHeader}>
        <h1>Post a New Job</h1>
        <p>Attract the best healthcare talent for your organization</p>
      </div>

      <div className={styles.formContainer}>
        <form className={styles.jobPostForm} onSubmit={handleSubmit}>

          {/* ── Basic Information ───────────────────────────────────────── */}
          <div className={styles.sectionTitle}>Basic Information</div>

          <div className={styles.formRow}>
            <div className={styles.formGroup}>
              <label htmlFor="title">Job Title *</label>
              <input
                type="text"
                id="title"
                name="title"
                value={formData.title}
                onChange={handleChange}
                placeholder="e.g., Senior ICU Nurse"
                required
              />
            </div>
            <div className={styles.formGroup}>
              <label htmlFor="openings">Number of Openings *</label>
              <input
                type="number"
                id="openings"
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
              <label htmlFor="employment_type">Employment Type *</label>
              <select
                id="employment_type"
                name="employment_type"
                value={formData.employment_type}
                onChange={handleChange}
                required
              >
                <option value="">Select type</option>
                <option value="FULLTIME">Full Time</option>
                <option value="PARTTIME">Part Time</option>
                <option value="CONTRACT">Contract</option>
                <option value="TEMPORARY">Temporary</option>
                <option value="INTERNSHIP">Internship</option>
                <option value="LOCUM" disabled={!canPostLocum}>
                  Locum{!canPostLocum ? " 🔒 (Enterprise only)" : ""}
                </option>
              </select>
            </div>
            <div className={styles.formGroup}>
              <label htmlFor="shift_type">Shift Type *</label>
              <select
                id="shift_type"
                name="shift_type"
                value={formData.shift_type}
                onChange={handleChange}
                required
              >
                <option value="">Select shift</option>
                <option value="DAY SHIFT">Day Shift</option>
                <option value="NIGHT SHIFT">Night Shift</option>
                <option value="ROTATION SHIFT">Rotation Shift</option>
                <option value="FLEX SHIFT">Flex Shift</option>
              </select>
            </div>
          </div>

          {/* Locum warning — shown when LOCUM selected but not Enterprise */}
          {locumBlocked && (
            <div className={styles.locumWarning}>
              <span className={styles.locumWarningIcon}>🔒</span>
              <div>
                <strong>Enterprise Plan Required</strong>
                <p>Locum job postings are only available on the Enterprise plan.</p>
                <Link to="/employer-dashboard/settings?tab=billing" className={styles.locumUpgradeLink}>
                  Upgrade to Enterprise →
                </Link>
              </div>
            </div>
          )}

          <div className={styles.formRow}>
            <div className={styles.formGroup}>
              <label htmlFor="experience">Years of Experience Required *</label>
              <input
                type="number"
                id="experience"
                name="experience"
                value={formData.experience}
                onChange={handleChange}
                min="0"
                placeholder="e.g., 5"
                required
              />
            </div>
            <div className={styles.formGroup}>
              <label htmlFor="location">Location *</label>
              <input
                type="text"
                id="location"
                name="location"
                value={formData.location}
                onChange={handleChange}
                placeholder="e.g., Lagos"
                required
              />
            </div>
          </div>

          {/* ── Compensation ────────────────────────────────────────────── */}
          <div className={styles.sectionTitle}>Compensation</div>

          <div className={styles.formRow}>
            <div className={styles.formGroup}>
              <label htmlFor="salary_min">Minimum Salary (₦) *</label>
              <input
                type="number"
                id="salary_min"
                name="salary_min"
                value={formData.salary_min}
                onChange={handleChange}
                placeholder="e.g., 250000"
                min="0"
                step="1000"
                required
              />
            </div>
            <div className={styles.formGroup}>
              <label htmlFor="salary_max">Maximum Salary (₦) *</label>
              <input
                type="number"
                id="salary_max"
                name="salary_max"
                value={formData.salary_max}
                onChange={handleChange}
                placeholder="e.g., 450000"
                min="0"
                step="1000"
                required
              />
            </div>
          </div>

          <div className={styles.formRow}>
            <div className={styles.formGroup}>
              <label htmlFor="deadline">Application Deadline *</label>
              <input
                type="date"
                id="deadline"
                name="deadline"
                value={formData.deadline}
                onChange={handleChange}
                min={new Date().toISOString().split("T")[0]}
                required
              />
            </div>
          </div>

          {/* ── Job Details ─────────────────────────────────────────────── */}
          <div className={styles.sectionTitle}>Job Details</div>

          <div className={styles.formGroup}>
            <label htmlFor="description">Job Description *</label>
            <textarea
              id="description"
              name="description"
              value={formData.description}
              onChange={handleChange}
              rows="6"
              placeholder="Describe the role, responsibilities, and what makes this position unique..."
              required
            />
            <span className={styles.helperText}>Be detailed and specific about daily responsibilities</span>
          </div>

          <div className={styles.formGroup}>
            <label htmlFor="responsibilities">Key Responsibilities *</label>
            <textarea
              id="responsibilities"
              name="responsibilities"
              value={formData.responsibilities}
              onChange={handleChange}
              rows="6"
              placeholder={"Enter each responsibility on a new line:\nMonitor patient vital signs\nAdminister medications as prescribed"}
              required
            />
            <span className={styles.helperText}>💡 One per line</span>
          </div>

          <div className={styles.formGroup}>
            <label htmlFor="requirements">Requirements *</label>
            <textarea
              id="requirements"
              name="requirements"
              value={formData.requirements}
              onChange={handleChange}
              rows="6"
              placeholder={"Enter each requirement on a new line:\nBachelor's degree in Nursing\nValid nursing license"}
              required
            />
            <span className={styles.helperText}>💡 One per line</span>
          </div>

          <div className={styles.formGroup}>
            <label htmlFor="benefits">Benefits & Perks</label>
            <textarea
              id="benefits"
              name="benefits"
              value={formData.benefits}
              onChange={handleChange}
              rows="5"
              placeholder={"Enter each benefit on a new line:\nComprehensive health insurance\nPension contributions"}
            />
            <span className={styles.helperText}>💡 One per line</span>
          </div>

          {/* ── Actions ─────────────────────────────────────────────────── */}
          <div className={styles.formActions}>
            <Link to="/employer-dashboard" className={styles.cancelButton}>
              Cancel
            </Link>
            {!isEnterprise && maxJobsPerMonth !== Infinity && (
              <span className={styles.planLimit}>
                Basic: up to {maxJobsPerMonth} jobs/month
              </span>
            )}
            <button
              type="submit"
              className={`${styles.submitButton} ${!canSubmit ? styles.submitDisabled : ""}`}
              disabled={!canSubmit}
            >
              {isCreating ? "Publishing…" : locumBlocked ? "🔒 Enterprise Required" : "Publish Job Post"}
            </button>
          </div>

        </form>

        {/* ── Sidebar ───────────────────────────────────────────────────── */}
        <aside className={styles.sidebar}>
          <div className={styles.previewCard}>
            <h3>💡 Tips for Better Job Posts</h3>
            <ul>
              <li>Use clear, specific job titles</li>
              <li>Include salary range for transparency</li>
              <li>Highlight unique benefits and perks</li>
              <li>Be specific about requirements</li>
              <li>Mention growth opportunities</li>
              <li>Use inclusive language</li>
              <li>List responsibilities clearly (one per line)</li>
            </ul>
          </div>

          <div className={styles.statsCard}>
            <h3>📊 Profile Status</h3>
            <p className={styles.planInfo}>
              {isVerified ? (
                <span style={{ color: "#0d9269", fontWeight: 700 }}>✅ Verified</span>
              ) : (
                <span style={{ color: "#f59e0b", fontWeight: 700 }}>⏳ Pending Verification</span>
              )}
            </p>
            <p className={styles.remainingPosts}>Profile {percent}% complete</p>
            <Link to="/employer-dashboard/settings" className={styles.upgradeLink}>
              {isVerified ? "View Settings" : "Complete Profile →"}
            </Link>
          </div>

          {/* Plan indicator */}
          <div className={styles.planCard}>
            <h3>📋 Your Plan</h3>
            <div className={`${styles.planBadge} ${isEnterprise ? styles.planEnterprise : styles.planBasic}`}>
              {isEnterprise ? "🏥 Enterprise" : maxJobsPerMonth === Infinity ? "⭐ Professional" : "🆓 Basic"}
            </div>
            {!canPostLocum && (
              <p className={styles.locumNote}>
                🔒 Locum postings require Enterprise plan
              </p>
            )}
            {canPostLocum && (
              <p className={styles.locumAvail}>
                ✓ Locum postings available
              </p>
            )}
            <Link to="/employer-dashboard/settings?tab=billing" className={styles.upgradeLink}>
              {isEnterprise ? "Manage Plan" : "Upgrade Plan →"}
            </Link>
          </div>
        </aside>
      </div>
    </div>
  );
}