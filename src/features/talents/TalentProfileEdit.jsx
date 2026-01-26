import { useState } from "react";
import { Link } from "react-router";
import styles from "./TalentProfileEdit.module.css";

export default function TalentProfileEdit() {
  const [activeSection, setActiveSection] = useState("basic");

  const [basicInfo, setBasicInfo] = useState({
    fullName: "Dr. Sarah Okonkwo",
    profession: "doctor",
    specialization: "ICU Specialist",
    email: "sarah.okonkwo@email.com",
    phone: "+234 801 234 5678",
    location: "Lagos, Nigeria",
    availability: "available",
  });

  const [professionalInfo, setProfessionalInfo] = useState({
    licenseNumber: "MD-12345-NG",
    experience: "8 years",
    currentPosition: "Senior ICU Nurse",
    summary: "Experienced ICU specialist with 8 years...",
  });

  const [skills, setSkills] = useState([
    "Critical Care",
    "Emergency Medicine",
    "Patient Management",
  ]);

  const [newSkill, setNewSkill] = useState("");

  const handleBasicChange = (e) => {
    setBasicInfo({ ...basicInfo, [e.target.name]: e.target.value });
  };

  const handleProfessionalChange = (e) => {
    setProfessionalInfo({
      ...professionalInfo,
      [e.target.name]: e.target.value,
    });
  };

  const handleAddSkill = () => {
    if (newSkill.trim()) {
      setSkills([...skills, newSkill.trim()]);
      setNewSkill("");
    }
  };

  const handleRemoveSkill = (index) => {
    setSkills(skills.filter((_, i) => i !== index));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Profile updated");
  };

  return (
    <div className={styles.profileEdit}>
      <div className={styles.header}>
        <div>
          <h1>Edit Profile</h1>
          <p>Keep your profile up to date</p>
        </div>
        <Link to="/employee-dashboard" className={styles.backBtn}>
          Back to Dashboard
        </Link>
      </div>

      <div className={styles.mainContent}>
        <aside className={styles.sidebar}>
          <button
            className={activeSection === "basic" ? styles.active : ""}
            onClick={() => setActiveSection("basic")}
          >
            👤 Basic Information
          </button>
          <button
            className={activeSection === "professional" ? styles.active : ""}
            onClick={() => setActiveSection("professional")}
          >
            💼 Professional Details
          </button>
          <button
            className={activeSection === "skills" ? styles.active : ""}
            onClick={() => setActiveSection("skills")}
          >
            🎯 Skills & Certifications
          </button>
          <button
            className={activeSection === "work" ? styles.active : ""}
            onClick={() => setActiveSection("work")}
          >
            📋 Work History
          </button>
          <button
            className={activeSection === "education" ? styles.active : ""}
            onClick={() => setActiveSection("education")}
          >
            🎓 Education
          </button>
          <button
            className={activeSection === "documents" ? styles.active : ""}
            onClick={() => setActiveSection("documents")}
          >
            📄 Documents
          </button>
        </aside>

        <div className={styles.editContent}>
          {activeSection === "basic" && (
            <div className={styles.section}>
              <h2>Basic Information</h2>
              <form onSubmit={handleSubmit}>
                <div className={styles.formGroup}>
                  <label>Profile Photo</label>
                  <div className={styles.photoUpload}>
                    <div className={styles.currentPhoto}>👩‍⚕️</div>
                    <div>
                      <input type="file" accept="image/*" />
                      <p className={styles.hint}>
                        PNG, JPG up to 5MB. Recommended: 300x300px
                      </p>
                    </div>
                  </div>
                </div>

                <div className={styles.formRow}>
                  <div className={styles.formGroup}>
                    <label>Full Name *</label>
                    <input
                      type="text"
                      name="fullName"
                      value={basicInfo.fullName}
                      onChange={handleBasicChange}
                      required
                    />
                  </div>

                  <div className={styles.formGroup}>
                    <label>Profession *</label>
                    <select
                      name="profession"
                      value={basicInfo.profession}
                      onChange={handleBasicChange}
                      required
                    >
                      <option value="doctor">Doctor</option>
                      <option value="nurse">Nurse</option>
                      <option value="pharmacist">Pharmacist</option>
                      <option value="lab-tech">Lab Technician</option>
                    </select>
                  </div>
                </div>

                <div className={styles.formGroup}>
                  <label>Specialization *</label>
                  <input
                    type="text"
                    name="specialization"
                    value={basicInfo.specialization}
                    onChange={handleBasicChange}
                    placeholder="e.g., ICU Specialist, Pediatric Nurse"
                    required
                  />
                </div>

                <div className={styles.formRow}>
                  <div className={styles.formGroup}>
                    <label>Email *</label>
                    <input
                      type="email"
                      name="email"
                      value={basicInfo.email}
                      onChange={handleBasicChange}
                      required
                    />
                  </div>

                  <div className={styles.formGroup}>
                    <label>Phone *</label>
                    <input
                      type="tel"
                      name="phone"
                      value={basicInfo.phone}
                      onChange={handleBasicChange}
                      required
                    />
                  </div>
                </div>

                <div className={styles.formRow}>
                  <div className={styles.formGroup}>
                    <label>Location *</label>
                    <input
                      type="text"
                      name="location"
                      value={basicInfo.location}
                      onChange={handleBasicChange}
                      placeholder="City, State"
                      required
                    />
                  </div>

                  <div className={styles.formGroup}>
                    <label>Availability Status *</label>
                    <select
                      name="availability"
                      value={basicInfo.availability}
                      onChange={handleBasicChange}
                      required
                    >
                      <option value="available">Available Immediately</option>
                      <option value="2weeks">Available in 2 weeks</option>
                      <option value="1month">Available in 1 month</option>
                      <option value="not-looking">Not Looking</option>
                    </select>
                  </div>
                </div>

                <button type="submit" className={styles.saveBtn}>
                  Save Changes
                </button>
              </form>
            </div>
          )}

          {activeSection === "professional" && (
            <div className={styles.section}>
              <h2>Professional Details</h2>
              <form onSubmit={handleSubmit}>
                <div className={styles.formRow}>
                  <div className={styles.formGroup}>
                    <label>License Number *</label>
                    <input
                      type="text"
                      name="licenseNumber"
                      value={professionalInfo.licenseNumber}
                      onChange={handleProfessionalChange}
                      required
                    />
                  </div>

                  <div className={styles.formGroup}>
                    <label>Years of Experience *</label>
                    <input
                      type="text"
                      name="experience"
                      value={professionalInfo.experience}
                      onChange={handleProfessionalChange}
                      placeholder="e.g., 5 years"
                      required
                    />
                  </div>
                </div>

                <div className={styles.formGroup}>
                  <label>Current Position</label>
                  <input
                    type="text"
                    name="currentPosition"
                    value={professionalInfo.currentPosition}
                    onChange={handleProfessionalChange}
                  />
                </div>

                <div className={styles.formGroup}>
                  <label>Professional Summary *</label>
                  <textarea
                    name="summary"
                    value={professionalInfo.summary}
                    onChange={handleProfessionalChange}
                    rows="6"
                    placeholder="Write a brief summary of your professional background..."
                    required
                  ></textarea>
                </div>

                <button type="submit" className={styles.saveBtn}>
                  Save Changes
                </button>
              </form>
            </div>
          )}

          {activeSection === "skills" && (
            <div className={styles.section}>
              <h2>Skills & Certifications</h2>

              <div className={styles.skillsSection}>
                <h3>Skills</h3>
                <div className={styles.skillInput}>
                  <input
                    type="text"
                    value={newSkill}
                    onChange={(e) => setNewSkill(e.target.value)}
                    placeholder="Add a skill..."
                    onKeyPress={(e) => {
                      if (e.key === "Enter") {
                        e.preventDefault();
                        handleAddSkill();
                      }
                    }}
                  />
                  <button
                    type="button"
                    onClick={handleAddSkill}
                    className={styles.addBtn}
                  >
                    Add
                  </button>
                </div>

                <div className={styles.skillTags}>
                  {skills.map((skill, index) => (
                    <div key={index} className={styles.skillTag}>
                      <span>{skill}</span>
                      <button
                        onClick={() => handleRemoveSkill(index)}
                        className={styles.removeBtn}
                      >
                        ✕
                      </button>
                    </div>
                  ))}
                </div>
              </div>

              <div className={styles.certSection}>
                <h3>Certifications</h3>
                <button className={styles.addCertBtn}>
                  + Add Certification
                </button>
              </div>
            </div>
          )}

          {activeSection === "work" && (
            <div className={styles.section}>
              <h2>Work History</h2>
              <button className={styles.addWorkBtn}>
                + Add Work Experience
              </button>
              <p className={styles.emptyState}>
                No work history added yet. Click above to add your experience.
              </p>
            </div>
          )}

          {activeSection === "education" && (
            <div className={styles.section}>
              <h2>Education</h2>
              <button className={styles.addEducationBtn}>
                + Add Education
              </button>
              <p className={styles.emptyState}>
                No education added yet. Click above to add your qualifications.
              </p>
            </div>
          )}

          {activeSection === "documents" && (
            <div className={styles.section}>
              <h2>Documents</h2>
              <div className={styles.uploadSection}>
                <h3>Resume/CV</h3>
                <input type="file" accept=".pdf,.doc,.docx" />
                <p className={styles.hint}>PDF, DOC, DOCX up to 10MB</p>
              </div>

              <div className={styles.uploadSection}>
                <h3>Professional License</h3>
                <input type="file" accept=".pdf,.jpg,.png" />
                <p className={styles.hint}>PDF, JPG, PNG up to 5MB</p>
              </div>

              <div className={styles.uploadSection}>
                <h3>Certifications</h3>
                <input type="file" accept=".pdf,.jpg,.png" multiple />
                <p className={styles.hint}>
                  Multiple files allowed - PDF, JPG, PNG
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
