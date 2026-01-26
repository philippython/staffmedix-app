import { useState } from "react";
import { Link, useParams } from "react-router";
import styles from "./JobEdit.module.css";

export default function JobEdit() {
  const { id } = useParams();

  const [formData, setFormData] = useState({
    title: "Senior ICU Nurse",
    category: "nursing",
    type: "full-time",
    experience: "senior",
    salaryMin: "350000",
    salaryMax: "450000",
    location: "Lagos, Nigeria",
    description: "We are seeking an experienced ICU Nurse...",
    requirements: "- Minimum 5 years ICU experience\n- Valid nursing license",
    benefits: "- Health insurance\n- Housing allowance\n- Pension",
    deadline: "2026-02-10",
    status: "active",
  });

  const jobStats = {
    views: 1234,
    applications: 45,
    shortlisted: 8,
    interviewed: 3,
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Updated job:", formData);
  };

  const handleStatusChange = (newStatus) => {
    setFormData({ ...formData, status: newStatus });
  };

  return (
    <div className={styles.jobEditView}>
      <div className={styles.header}>
        <div>
          <h1>Edit Job Posting</h1>
          <p>Update your job details and manage applications</p>
        </div>
        <div className={styles.headerActions}>
          <Link
            to="/employer-dashboard/view-applications/1"
            className={styles.viewAppsBtn}
          >
            View Applications ({jobStats.applications})
          </Link>
          <Link to="/employer-dashboard" className={styles.backBtn}>
            Back to Dashboard
          </Link>
        </div>
      </div>

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
          <span className={styles.statValue}>{jobStats.shortlisted}</span>
          <span className={styles.statLabel}>Shortlisted</span>
        </div>
        <div className={styles.statItem}>
          <span className={styles.statValue}>{jobStats.interviewed}</span>
          <span className={styles.statLabel}>Interviewed</span>
        </div>
      </div>

      <div className={styles.mainContent}>
        <form className={styles.editForm} onSubmit={handleSubmit}>
          <div className={styles.statusSection}>
            <h3>Job Status</h3>
            <div className={styles.statusButtons}>
              <button
                type="button"
                className={`${styles.statusBtn} ${
                  formData.status === "active" ? styles.active : ""
                }`}
                onClick={() => handleStatusChange("active")}
              >
                Active
              </button>
              <button
                type="button"
                className={`${styles.statusBtn} ${
                  formData.status === "paused" ? styles.paused : ""
                }`}
                onClick={() => handleStatusChange("paused")}
              >
                Paused
              </button>
              <button
                type="button"
                className={`${styles.statusBtn} ${
                  formData.status === "closed" ? styles.closed : ""
                }`}
                onClick={() => handleStatusChange("closed")}
              >
                Closed
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
              <label>Category *</label>
              <select
                name="category"
                value={formData.category}
                onChange={handleChange}
                required
              >
                <option value="nursing">Nursing</option>
                <option value="medical">Medical Doctors</option>
                <option value="allied">Allied Health</option>
                <option value="pharmacy">Pharmacy</option>
              </select>
            </div>
          </div>

          <div className={styles.formRow}>
            <div className={styles.formGroup}>
              <label>Employment Type *</label>
              <select
                name="type"
                value={formData.type}
                onChange={handleChange}
                required
              >
                <option value="full-time">Full Time</option>
                <option value="part-time">Part Time</option>
                <option value="contract">Contract</option>
                <option value="locum">Locum</option>
              </select>
            </div>

            <div className={styles.formGroup}>
              <label>Experience Level *</label>
              <select
                name="experience"
                value={formData.experience}
                onChange={handleChange}
                required
              >
                <option value="entry">Entry Level</option>
                <option value="mid">Mid Level</option>
                <option value="senior">Senior Level</option>
                <option value="expert">Expert Level</option>
              </select>
            </div>
          </div>

          <div className={styles.sectionTitle}>Compensation & Location</div>

          <div className={styles.formRow}>
            <div className={styles.formGroup}>
              <label>Minimum Salary (₦)</label>
              <input
                type="number"
                name="salaryMin"
                value={formData.salaryMin}
                onChange={handleChange}
              />
            </div>

            <div className={styles.formGroup}>
              <label>Maximum Salary (₦)</label>
              <input
                type="number"
                name="salaryMax"
                value={formData.salaryMax}
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
            ></textarea>
          </div>

          <div className={styles.formGroup}>
            <label>Requirements *</label>
            <textarea
              name="requirements"
              value={formData.requirements}
              onChange={handleChange}
              rows="5"
              required
            ></textarea>
          </div>

          <div className={styles.formGroup}>
            <label>Benefits & Perks</label>
            <textarea
              name="benefits"
              value={formData.benefits}
              onChange={handleChange}
              rows="4"
            ></textarea>
          </div>

          <div className={styles.formActions}>
            <button type="button" className={styles.deleteBtn}>
              Delete Job
            </button>
            <button type="submit" className={styles.saveBtn}>
              Save Changes
            </button>
          </div>
        </form>

        <aside className={styles.sidebar}>
          <div className={styles.quickActions}>
            <h3>Quick Actions</h3>
            <Link to="/view-applications/1" className={styles.actionLink}>
              📋 View Applications
            </Link>
            <button className={styles.actionLink}>📊 View Analytics</button>
            <button className={styles.actionLink}>
              🔔 Manage Notifications
            </button>
            <button className={styles.actionLink}>📤 Share Job</button>
          </div>

          <div className={styles.previewCard}>
            <h3>Preview</h3>
            <p>See how candidates will view this job posting</p>
            <button className={styles.previewBtn}>Preview Job Post</button>
          </div>
        </aside>
      </div>
    </div>
  );
}
