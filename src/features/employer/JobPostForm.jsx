import { useState } from "react";
import { Link } from "react-router";
import styles from "./JobPostForm.module.css";

export default function JobPostForm() {
  const [formData, setFormData] = useState({
    title: "",
    category: "",
    type: "",
    experience: "",
    salaryMin: "",
    salaryMax: "",
    location: "",
    description: "",
    requirements: "",
    benefits: "",
    deadline: "",
  });

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Job posted:", formData);
    // Handle form submission
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
              <label htmlFor="category">Category *</label>
              <select
                id="category"
                name="category"
                value={formData.category}
                onChange={handleChange}
                required
              >
                <option value="">Select category</option>
                <option value="nursing">Nursing</option>
                <option value="medical">Medical Doctors</option>
                <option value="allied">Allied Health</option>
                <option value="pharmacy">Pharmacy</option>
                <option value="laboratory">Laboratory</option>
                <option value="administrative">Administrative</option>
              </select>
            </div>
          </div>

          <div className={styles.formRow}>
            <div className={styles.formGroup}>
              <label htmlFor="type">Employment Type *</label>
              <select
                id="type"
                name="type"
                value={formData.type}
                onChange={handleChange}
                required
              >
                <option value="">Select type</option>
                <option value="full-time">Full Time</option>
                <option value="part-time">Part Time</option>
                <option value="contract">Contract</option>
                <option value="locum">Locum</option>
              </select>
            </div>

            <div className={styles.formGroup}>
              <label htmlFor="experience">Experience Level *</label>
              <select
                id="experience"
                name="experience"
                value={formData.experience}
                onChange={handleChange}
                required
              >
                <option value="">Select level</option>
                <option value="entry">Entry Level (0-2 years)</option>
                <option value="mid">Mid Level (3-5 years)</option>
                <option value="senior">Senior Level (6-10 years)</option>
                <option value="expert">Expert Level (10+ years)</option>
              </select>
            </div>
          </div>

          <div className={styles.sectionTitle}>Compensation & Location</div>

          <div className={styles.formRow}>
            <div className={styles.formGroup}>
              <label htmlFor="salaryMin">Minimum Salary (₦) *</label>
              <input
                type="number"
                id="salaryMin"
                name="salaryMin"
                value={formData.salaryMin}
                onChange={handleChange}
                placeholder="e.g., 250000"
                required
              />
            </div>

            <div className={styles.formGroup}>
              <label htmlFor="salaryMax">Maximum Salary (₦) *</label>
              <input
                type="number"
                id="salaryMax"
                name="salaryMax"
                value={formData.salaryMax}
                onChange={handleChange}
                placeholder="e.g., 450000"
                required
              />
            </div>
          </div>

          <div className={styles.formRow}>
            <div className={styles.formGroup}>
              <label htmlFor="location">Location *</label>
              <input
                type="text"
                id="location"
                name="location"
                value={formData.location}
                onChange={handleChange}
                placeholder="e.g., Lagos, Nigeria"
                required
              />
            </div>

            <div className={styles.formGroup}>
              <label htmlFor="deadline">Application Deadline *</label>
              <input
                type="date"
                id="deadline"
                name="deadline"
                value={formData.deadline}
                onChange={handleChange}
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
            <label htmlFor="requirements">Requirements *</label>
            <textarea
              id="requirements"
              name="requirements"
              value={formData.requirements}
              onChange={handleChange}
              rows="5"
              placeholder="List required qualifications, certifications, skills, and experience..."
              required
            ></textarea>
            <span className={styles.helperText}>
              Include licenses, certifications, and technical skills
            </span>
          </div>

          <div className={styles.formGroup}>
            <label htmlFor="benefits">Benefits & Perks</label>
            <textarea
              id="benefits"
              name="benefits"
              value={formData.benefits}
              onChange={handleChange}
              rows="4"
              placeholder="List benefits such as health insurance, pension, housing allowance, etc..."
            ></textarea>
            <span className={styles.helperText}>
              Highlight what makes your offer attractive
            </span>
          </div>

          <div className={styles.formActions}>
            <Link to="/employer-dashboard" className={styles.cancelButton}>
              Cancel
            </Link>
            <button type="submit" className={styles.submitButton}>
              Publish Job Post
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
