import { useState } from "react";
import { Link, useNavigate } from "react-router";
import styles from "./JobPostForm.module.css";
import { useCreateJobMutation } from "../../services/jobsApi";
import { useWhoAmIQuery } from "../../services/userApi";

export default function JobPostForm() {
  const navigate = useNavigate();

  // Get current user for company ID
  const { data: user } = useWhoAmIQuery();

  // Create job mutation
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

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const formatBulletText = (text) => {
    if (!text) return "";

    const lines = text
      .split("\n")
      .map((line) => line.trim())
      .filter((line) => line.length > 0);

    return lines.join("\n");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const jobData = {
      title: formData.title,
      description: formData.description,
      location: formData.location,
      salary_min: parseFloat(formData.salary_min),
      salary_max: parseFloat(formData.salary_max),
      openings: parseInt(formData.openings),
      experience: parseInt(formData.experience),
      shift_type: formData.shift_type,
      employment_type: formData.employment_type,
      deadline: formData.deadline,
      requirements: formatBulletText(formData.requirements),
      responsibilities: formatBulletText(formData.responsibilities),
      benefits: formatBulletText(formData.benefits),
      company: user?.company_id,
    };

    try {
      await createJob(jobData).unwrap();
      alert("Job posted successfully!");
      navigate("/employer-dashboard");
    } catch (error) {
      console.error("Failed to create job:", error);
      alert(error?.data?.detail || "Failed to post job. Please try again.");
    }
  };

  return (
    <div className={styles.jobPostPage}>
      <div className={styles.pageHeader}>
        <h1>Post a New Job</h1>
        <p>Attract the best healthcare talent for your organization</p>
      </div>

      <div className={styles.formContainer}>
        <form className={styles.jobPostForm} onSubmit={handleSubmit}>
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
                <option value="LOCUM">Locum</option>
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
            ></textarea>
            <span className={styles.helperText}>
              Be detailed and specific about daily responsibilities
            </span>
          </div>

          <div className={styles.formGroup}>
            <label htmlFor="responsibilities">Key Responsibilities *</label>
            <textarea
              id="responsibilities"
              name="responsibilities"
              value={formData.responsibilities}
              onChange={handleChange}
              rows="6"
              placeholder="Enter each responsibility on a new line:&#10;Monitor patient vital signs&#10;Administer medications as prescribed&#10;Maintain accurate patient records"
              required
            ></textarea>
            <span className={styles.helperText}>
              💡 Enter each responsibility on a new line (press Enter after each
              one)
            </span>
          </div>

          <div className={styles.formGroup}>
            <label htmlFor="requirements">Requirements *</label>
            <textarea
              id="requirements"
              name="requirements"
              value={formData.requirements}
              onChange={handleChange}
              rows="6"
              placeholder="Enter each requirement on a new line:&#10;Bachelor's degree in Nursing&#10;Valid nursing license&#10;5+ years ICU experience"
              required
            ></textarea>
            <span className={styles.helperText}>
              💡 Enter each requirement on a new line (press Enter after each
              one)
            </span>
          </div>

          <div className={styles.formGroup}>
            <label htmlFor="benefits">Benefits & Perks</label>
            <textarea
              id="benefits"
              name="benefits"
              value={formData.benefits}
              onChange={handleChange}
              rows="5"
              placeholder="Enter each benefit on a new line:&#10;Comprehensive health insurance&#10;Pension contributions&#10;Housing allowance"
            ></textarea>
            <span className={styles.helperText}>
              💡 Enter each benefit on a new line (press Enter after each one)
            </span>
          </div>

          <div className={styles.formActions}>
            <Link to="/employer-dashboard" className={styles.cancelButton}>
              Cancel
            </Link>
            <button
              type="submit"
              className={styles.submitButton}
              disabled={isCreating}
            >
              {isCreating ? "Publishing..." : "Publish Job Post"}
            </button>
          </div>
        </form>

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
            <h3>📋 Bullet Points Format</h3>
            <p className={styles.formatInfo}>
              When entering requirements, responsibilities, or benefits:
            </p>
            <ul className={styles.formatList}>
              <li>Type one item per line</li>
              <li>Press Enter to create a new line</li>
              <li>Empty lines will be removed</li>
              <li>They'll display as bullet points</li>
            </ul>
          </div>

          <div className={styles.statsCard}>
            <h3>📊 Your Plan</h3>
            <p className={styles.planInfo}>
              <strong>Professional Plan</strong>
            </p>
            <p className={styles.remainingPosts}>
              Unlimited job posts remaining
            </p>
            <Link to="/pricing" className={styles.upgradeLink}>
              View Plans
            </Link>
          </div>
        </aside>
      </div>
    </div>
  );
}
