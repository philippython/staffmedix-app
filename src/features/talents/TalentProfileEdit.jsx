import { useState, useEffect, useMemo } from "react";
import { Link, useParams } from "react-router";
import styles from "./TalentProfileEdit.module.css";
import {
  useGetMyProfileQuery,
  useUpdateTalentProfileMutation,
  useAddSkillMutation,
  useDeleteSkillMutation,
  useAddWorkExperienceMutation,
  useUpdateWorkExperienceMutation,
  useDeleteWorkExperienceMutation,
  useAddEducationMutation,
  useUpdateEducationMutation,
  useDeleteEducationMutation,
  useUploadCredentialMutation,
  useDeleteCredentialMutation,
  useUploadProfileImageMutation,
} from "../../services/talentApi";

export default function TalentProfileEdit() {
  const { talentId } = useParams();
  const [activeSection, setActiveSection] = useState("basic");

  // Fetch complete profile with nested data
  const {
    data: profile,
    isLoading: profileLoading,
    error: profileError,
  } = useGetMyProfileQuery(talentId);

  // Extract nested data from profile
  const skills = profile?.skill || [];
  const workExperience = profile?.work_experience || [];
  const education = profile?.education || [];
  const credentials = profile?.credentials || [];

  // Calculate profile completeness
  const profileCompleteness = useMemo(() => {
    if (!profile) return { percentage: 0, missing: [] };

    const checks = [
      {
        name: "Profile Photo",
        completed: !!profile.img?.image,
        weight: 15,
      },
      {
        name: "Full Name",
        completed: !!profile.full_name?.trim(),
        weight: 10,
      },
      {
        name: "Profession",
        completed: !!profile.profession,
        weight: 10,
      },
      {
        name: "Specialization",
        completed: !!profile.specialization?.trim(),
        weight: 10,
      },
      {
        name: "Phone Number",
        completed: !!profile.phone_number?.trim(),
        weight: 5,
      },
      {
        name: "Location",
        completed: !!profile.location?.trim(),
        weight: 5,
      },
      {
        name: "Biography",
        completed: !!profile.biography?.trim() && profile.biography.length > 50,
        weight: 10,
      },
      {
        name: "Years of Experience",
        completed:
          profile.years_of_experience !== null &&
          profile.years_of_experience >= 0,
        weight: 5,
      },
      {
        name: "At least 3 Skills",
        completed: skills.length >= 3,
        weight: 10,
      },
      {
        name: "At least 1 Work Experience",
        completed: workExperience.length >= 1,
        weight: 10,
      },
      {
        name: "At least 1 Education",
        completed: education.length >= 1,
        weight: 5,
      },
      {
        name: "Resume/CV Uploaded",
        completed: credentials.some((c) => c.type === "RESUME"),
        weight: 5,
      },
      {
        name: "Professional License",
        completed: credentials.some((c) => c.type === "LICENSE"),
        weight: 5,
      },
      {
        name: "At least 1 Certification",
        completed: credentials.some((c) => c.type === "CERTIFICATE"),
        weight: 5,
      },
    ];

    const totalWeight = checks.reduce((sum, check) => sum + check.weight, 0);
    const completedWeight = checks
      .filter((check) => check.completed)
      .reduce((sum, check) => sum + check.weight, 0);

    const percentage = Math.round((completedWeight / totalWeight) * 100);
    const missing = checks.filter((check) => !check.completed);

    return { percentage, missing, checks };
  }, [profile, skills, workExperience, education, credentials]);

  // Mutations
  const [updateProfile, { isLoading: updating }] =
    useUpdateTalentProfileMutation();
  const [addSkill] = useAddSkillMutation();
  const [deleteSkill] = useDeleteSkillMutation();
  const [addWork] = useAddWorkExperienceMutation();
  const [updateWork] = useUpdateWorkExperienceMutation();
  const [deleteWork] = useDeleteWorkExperienceMutation();
  const [addEdu] = useAddEducationMutation();
  const [updateEdu] = useUpdateEducationMutation();
  const [deleteEdu] = useDeleteEducationMutation();
  const [uploadCredential] = useUploadCredentialMutation();
  const [deleteCredentialMutation] = useDeleteCredentialMutation();
  const [uploadImage] = useUploadProfileImageMutation();

  // Form states
  const [basicInfo, setBasicInfo] = useState({
    full_name: "",
    profession: "",
    specialization: "",
    phone_number: "",
    location: "",
    biography: "",
    license_number: "",
    years_of_experience: "",
  });

  const [newSkill, setNewSkill] = useState("");

  // Load profile data into form
  useEffect(() => {
    if (profile) {
      setBasicInfo({
        full_name: profile.full_name || "",
        profession: profile.profession || "",
        specialization: profile.specialization || "",
        phone_number: profile.phone_number || "",
        location: profile.location || "",
        biography: profile.biography || "",
        license_number: profile.license_number || "",
        years_of_experience: profile.years_of_experience || "",
      });
    }
  }, [profile]);

  const handleBasicChange = (e) => {
    setBasicInfo({ ...basicInfo, [e.target.name]: e.target.value });
  };

  const handleBasicSubmit = async (e) => {
    e.preventDefault();
    try {
      await updateProfile({ talentId, data: basicInfo }).unwrap();
      alert("Profile updated successfully!");
    } catch (error) {
      console.error("Failed to update profile:", error);
      alert(
        error?.data?.detail || "Failed to update profile. Please try again.",
      );
    }
  };

  const handleAddSkill = async () => {
    if (newSkill.trim()) {
      try {
        await addSkill({
          talentId,
          data: { name: newSkill.trim() },
        }).unwrap();
        setNewSkill("");
      } catch (error) {
        console.error("Failed to add skill:", error);
        alert(error?.data?.detail || "Failed to add skill.");
      }
    }
  };

  const handleRemoveSkill = async (skillId) => {
    try {
      await deleteSkill({
        talentId,
        skillId,
      }).unwrap();
    } catch (error) {
      console.error("Failed to delete skill:", error);
      alert(error?.data?.detail || "Failed to delete skill.");
    }
  };

  const handleFileUpload = async (e, type) => {
    const file = e.target.files[0];
    if (!file) return;

    const formData = new FormData();
    formData.append("file", file);
    formData.append("type", type);

    try {
      await uploadCredential({
        talentId,
        data: formData,
      }).unwrap();
      alert("File uploaded successfully!");
      e.target.value = "";
    } catch (error) {
      console.error("Failed to upload file:", error);
      alert(error?.data?.detail || "Failed to upload file.");
    }
  };

  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const formData = new FormData();
    formData.append("image", file);

    try {
      await uploadImage({ talentId, formData }).unwrap();
      alert("Profile image uploaded successfully!");
      e.target.value = "";
    } catch (error) {
      console.error("Failed to upload image:", error);
      alert(error?.data?.detail || "Failed to upload image.");
    }
  };

  if (profileLoading) {
    return <div className={styles.loading}>Loading profile...</div>;
  }

  if (profileError) {
    return (
      <div className={styles.error}>
        Failed to load profile. Please try again.
      </div>
    );
  }

  if (!talentId) {
    return (
      <div className={styles.error}>
        Unable to load profile. Please try again.
      </div>
    );
  }

  return (
    <div className={styles.profileEdit}>
      <div className={styles.header}>
        <div>
          <div className={styles.titleRow}>
            <h1>Edit Profile</h1>
            {profile?.verified ? (
              <span className={styles.verifiedBadge}>✓ Verified</span>
            ) : (
              <span className={styles.unverifiedBadge}>ⓘ Unverified</span>
            )}
          </div>
          <p>Keep your profile up to date</p>
        </div>
        <Link to="/employee-dashboard" className={styles.backBtn}>
          Back to Dashboard
        </Link>
      </div>

      {/* Profile Completeness Card */}
      <div className={styles.completenessCard}>
        <div className={styles.completenessHeader}>
          <div>
            <h3>Profile Completeness</h3>
            <p className={styles.completenessText}>
              {profileCompleteness.percentage === 100
                ? "🎉 Your profile is complete!"
                : `Complete your profile to stand out to employers`}
            </p>
          </div>
          <div className={styles.completenessPercentage}>
            {profileCompleteness.percentage}%
          </div>
        </div>

        <div className={styles.progressBarContainer}>
          <div
            className={styles.progressBar}
            style={{
              width: `${profileCompleteness.percentage}%`,
              backgroundColor:
                profileCompleteness.percentage === 100
                  ? "#10b981"
                  : profileCompleteness.percentage >= 75
                    ? "#059669"
                    : profileCompleteness.percentage >= 50
                      ? "#f59e0b"
                      : "#ef4444",
            }}
          ></div>
        </div>

        {profileCompleteness.missing.length > 0 && (
          <div className={styles.missingItems}>
            <p className={styles.missingTitle}>Missing items:</p>
            <div className={styles.missingList}>
              {profileCompleteness.missing.map((item, index) => (
                <span key={index} className={styles.missingItem}>
                  • {item.name}
                </span>
              ))}
            </div>
          </div>
        )}
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
            className={activeSection === "skills" ? styles.active : ""}
            onClick={() => setActiveSection("skills")}
          >
            🎯 Skills ({skills.length})
          </button>
          <button
            className={activeSection === "work" ? styles.active : ""}
            onClick={() => setActiveSection("work")}
          >
            📋 Work History ({workExperience.length})
          </button>
          <button
            className={activeSection === "education" ? styles.active : ""}
            onClick={() => setActiveSection("education")}
          >
            🎓 Education ({education.length})
          </button>
          <button
            className={activeSection === "documents" ? styles.active : ""}
            onClick={() => setActiveSection("documents")}
          >
            📄 Documents ({credentials.length})
          </button>
        </aside>

        <div className={styles.editContent}>
          {activeSection === "basic" && (
            <div className={styles.section}>
              <h2>Basic Information</h2>
              <form onSubmit={handleBasicSubmit}>
                <div className={styles.formGroup}>
                  <label>Profile Photo</label>
                  <div className={styles.photoUpload}>
                    <div className={styles.currentPhoto}>
                      {profile?.images ? (
                        <img src={profile.images[0]} alt="Profile" />
                      ) : (
                        "👩‍⚕️"
                      )}
                    </div>
                    <div>
                      <input
                        type="file"
                        accept="image/*"
                        onChange={handleImageUpload}
                      />
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
                      name="full_name"
                      value={basicInfo.full_name}
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
                      <option value="">Select profession</option>
                      <option value="doctor">Doctor</option>
                      <option value="nurse">Nurse</option>
                      <option value="pharmacist">Pharmacist</option>
                      <option value="lab-tech">Lab Technician</option>
                      <option value="lab-scientist">
                        Medical Lab Scientist
                      </option>
                      <option value="radiographer">Radiographer</option>
                      <option value="physiotherapist">Physiotherapist</option>
                      <option value="dentist">Dentist</option>
                      <option value="other">Other</option>
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
                    <label>Phone *</label>
                    <input
                      type="tel"
                      name="phone_number"
                      value={basicInfo.phone_number}
                      onChange={handleBasicChange}
                      required
                    />
                  </div>

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
                </div>

                <div className={styles.formRow}>
                  <div className={styles.formGroup}>
                    <label>License Number</label>
                    <input
                      type="text"
                      name="license_number"
                      value={basicInfo.license_number}
                      onChange={handleBasicChange}
                    />
                  </div>

                  <div className={styles.formGroup}>
                    <label>Years of Experience *</label>
                    <input
                      type="number"
                      name="years_of_experience"
                      value={basicInfo.years_of_experience}
                      onChange={handleBasicChange}
                      min="0"
                      required
                    />
                  </div>
                </div>

                <div className={styles.formGroup}>
                  <label>Professional Summary *</label>
                  <textarea
                    name="biography"
                    value={basicInfo.biography}
                    onChange={handleBasicChange}
                    rows="6"
                    placeholder="Write a brief summary of your professional background (at least 50 characters)..."
                  ></textarea>
                  <p className={styles.hint}>
                    {basicInfo.biography.length}/50 characters minimum
                  </p>
                </div>

                <button
                  type="submit"
                  className={styles.saveBtn}
                  disabled={updating}
                >
                  {updating ? "Saving..." : "Save Changes"}
                </button>
              </form>
            </div>
          )}

          {activeSection === "skills" && (
            <div className={styles.section}>
              <h2>Skills</h2>

              <div className={styles.skillsSection}>
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
                    disabled={!newSkill.trim()}
                  >
                    Add
                  </button>
                </div>

                <div className={styles.skillTags}>
                  {skills.length === 0 ? (
                    <p className={styles.emptyState}>
                      No skills added yet. Add at least 3 skills to improve your
                      profile!
                    </p>
                  ) : (
                    skills.map((skill) => (
                      <div key={skill.id} className={styles.skillTag}>
                        <span>{skill.name}</span>
                        <button
                          onClick={() => handleRemoveSkill(skill.id)}
                          className={styles.removeBtn}
                          title="Remove skill"
                        >
                          ✕
                        </button>
                      </div>
                    ))
                  )}
                </div>
              </div>
            </div>
          )}

          {activeSection === "work" && (
            <div className={styles.section}>
              <h2>Work History</h2>
              <WorkExperienceSection
                talentId={talentId}
                experiences={workExperience}
                onAdd={addWork}
                onUpdate={updateWork}
                onDelete={deleteWork}
              />
            </div>
          )}

          {activeSection === "education" && (
            <div className={styles.section}>
              <h2>Education</h2>
              <EducationSection
                talentId={talentId}
                education={education}
                onAdd={addEdu}
                onUpdate={updateEdu}
                onDelete={deleteEdu}
              />
            </div>
          )}

          {activeSection === "documents" && (
            <div className={styles.section}>
              <h2>Documents</h2>
              <div className={styles.uploadSection}>
                <h3>📄 Resume/CV</h3>
                <input
                  type="file"
                  accept=".pdf,.doc,.docx"
                  onChange={(e) => handleFileUpload(e, "RESUME")}
                />
                <p className={styles.hint}>PDF, DOC, DOCX up to 10MB</p>
              </div>

              <div className={styles.uploadSection}>
                <h3>📜 Professional License</h3>
                <input
                  type="file"
                  accept=".pdf,.jpg,.png"
                  onChange={(e) => handleFileUpload(e, "LICENSE")}
                />
                <p className={styles.hint}>PDF, JPG, PNG up to 5MB</p>
              </div>

              <div className={styles.uploadSection}>
                <h3>🏆 Certifications</h3>
                <input
                  type="file"
                  accept=".pdf,.jpg,.png"
                  onChange={(e) => handleFileUpload(e, "CERTIFICATE")}
                />
                <p className={styles.hint}>PDF, JPG, PNG</p>
              </div>

              <div className={styles.documentslist}>
                <h3>Uploaded Documents</h3>
                {credentials.length === 0 ? (
                  <p className={styles.emptyState}>
                    No documents uploaded yet. Upload your resume, license, and
                    certifications!
                  </p>
                ) : (
                  credentials.map((doc) => (
                    <div key={doc.id} className={styles.docItem}>
                      <span>
                        {doc.type} -{" "}
                        {new Date(doc.upload_date).toLocaleDateString()}
                      </span>
                      <button
                        onClick={() =>
                          deleteCredentialMutation({
                            talentId,
                            credentialId: doc.id,
                          })
                        }
                        className={styles.deleteBtn}
                      >
                        Delete
                      </button>
                    </div>
                  ))
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

// Work Experience Component
function WorkExperienceSection({
  talentId,
  experiences,
  onAdd,
  onUpdate,
  onDelete,
}) {
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [formData, setFormData] = useState({
    job_title: "",
    facility: "",
    start_date: "",
    end_date: "",
    description: "",
  });

  const resetForm = () => {
    setFormData({
      job_title: "",
      facility: "",
      start_date: "",
      end_date: "",
      description: "",
    });
    setEditingId(null);
    setShowForm(false);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const payload = {
      ...formData,
      end_date: formData.end_date ? formData.end_date : null,
    };

    try {
      if (editingId) {
        await onUpdate({
          talentId,
          workId: editingId,
          data: payload,
        }).unwrap();
      } else {
        await onAdd({
          talentId,
          data: payload,
        }).unwrap();
      }
      resetForm();
    } catch (error) {
      console.error("Error:", error);
      alert(error?.data?.detail || "Failed to save work experience.");
    }
  };

  const handleEdit = (exp) => {
    setFormData({
      job_title: exp.job_title || "",
      facility: exp.facility || "",
      start_date: exp.start_date || "",
      end_date: exp.end_date || "",
      description: exp.description || "",
    });
    setEditingId(exp.id);
    setShowForm(true);
  };

  const handleDelete = async (id) => {
    if (!confirm("Are you sure you want to delete this work experience?")) {
      return;
    }

    try {
      await onDelete({ talentId, workId: id }).unwrap();
    } catch (error) {
      console.error("Delete error:", error);
      alert(error?.data?.detail || "Failed to delete work experience.");
    }
  };

  return (
    <div>
      <button
        onClick={() => {
          setShowForm(!showForm);
          if (showForm) {
            resetForm();
          }
        }}
        className={styles.addWorkBtn}
      >
        {showForm ? "Cancel" : "+ Add Work Experience"}
      </button>

      {showForm && (
        <form onSubmit={handleSubmit} className={styles.workForm}>
          <div className={styles.formGroup}>
            <label>Job Title *</label>
            <input
              type="text"
              name="job_title"
              value={formData.job_title}
              onChange={(e) =>
                setFormData({ ...formData, job_title: e.target.value })
              }
              placeholder="e.g., Senior ICU Nurse"
              required
            />
          </div>

          <div className={styles.formGroup}>
            <label>Facility/Hospital *</label>
            <input
              type="text"
              name="facility"
              value={formData.facility}
              onChange={(e) =>
                setFormData({ ...formData, facility: e.target.value })
              }
              placeholder="e.g., Lagos General Hospital"
              required
            />
          </div>

          <div className={styles.formRow}>
            <div className={styles.formGroup}>
              <label>Start Date *</label>
              <input
                type="date"
                name="start_date"
                value={formData.start_date}
                onChange={(e) =>
                  setFormData({ ...formData, start_date: e.target.value })
                }
                required
              />
            </div>

            <div className={styles.formGroup}>
              <label>End Date (Leave blank if current)</label>
              <input
                type="date"
                name="end_date"
                value={formData.end_date}
                onChange={(e) =>
                  setFormData({ ...formData, end_date: e.target.value })
                }
              />
            </div>
          </div>

          <div className={styles.formGroup}>
            <label>Description *</label>
            <textarea
              name="description"
              value={formData.description}
              onChange={(e) =>
                setFormData({ ...formData, description: e.target.value })
              }
              rows="4"
              placeholder="Describe your responsibilities and achievements..."
              required
            />
          </div>

          <button type="submit" className={styles.saveBtn}>
            {editingId ? "Update" : "Add"} Experience
          </button>
        </form>
      )}

      <div className={styles.experienceList}>
        {experiences.length === 0 ? (
          <p className={styles.emptyState}>
            No work history added yet. Add at least 1 work experience!
          </p>
        ) : (
          experiences.map((exp) => (
            <div key={exp.id} className={styles.experienceItem}>
              <h4>{exp.job_title}</h4>
              <p className={styles.facility}>{exp.facility}</p>
              <p className={styles.dates}>
                {new Date(exp.start_date).toLocaleDateString()} -{" "}
                {exp.end_date
                  ? new Date(exp.end_date).toLocaleDateString()
                  : "Present"}
              </p>
              <p className={styles.description}>{exp.description}</p>
              <div className={styles.actions}>
                <button
                  onClick={() => handleEdit(exp)}
                  className={styles.editBtn}
                >
                  Edit
                </button>
                <button
                  onClick={() => handleDelete(exp.id)}
                  className={styles.deleteBtn}
                >
                  Delete
                </button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}

// Education Component
function EducationSection({ talentId, education, onAdd, onUpdate, onDelete }) {
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [formData, setFormData] = useState({
    degree: "",
    institution: "",
    year: "",
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingId) {
        await onUpdate({
          talentId,
          educationId: editingId,
          data: formData,
        }).unwrap();
      } else {
        await onAdd({
          talentId,
          data: formData,
        }).unwrap();
      }
      setShowForm(false);
      setEditingId(null);
      setFormData({ degree: "", institution: "", year: "" });
    } catch (error) {
      console.error("Error:", error);
      alert(error?.data?.detail || "Failed to save education.");
    }
  };

  const handleEdit = (edu) => {
    setFormData({
      degree: edu.degree,
      institution: edu.institution,
      year: edu.year,
    });
    setEditingId(edu.id);
    setShowForm(true);
  };

  const handleDelete = async (id) => {
    if (confirm("Are you sure you want to delete this education?")) {
      try {
        await onDelete({
          talentId,
          educationId: id,
        }).unwrap();
      } catch (error) {
        console.error("Error:", error);
        alert(error?.data?.detail || "Failed to delete education.");
      }
    }
  };

  return (
    <div>
      <button
        onClick={() => {
          setShowForm(!showForm);
          if (showForm) {
            setEditingId(null);
            setFormData({ degree: "", institution: "", year: "" });
          }
        }}
        className={styles.addEducationBtn}
      >
        {showForm ? "Cancel" : "+ Add Education"}
      </button>

      {showForm && (
        <form onSubmit={handleSubmit} className={styles.eduForm}>
          <div className={styles.formGroup}>
            <label>Degree *</label>
            <input
              type="text"
              value={formData.degree}
              onChange={(e) =>
                setFormData({ ...formData, degree: e.target.value })
              }
              placeholder="e.g., Bachelor of Science in Nursing"
              required
            />
          </div>
          <div className={styles.formGroup}>
            <label>Institution *</label>
            <input
              type="text"
              value={formData.institution}
              onChange={(e) =>
                setFormData({ ...formData, institution: e.target.value })
              }
              placeholder="e.g., University of Lagos"
              required
            />
          </div>
          <div className={styles.formGroup}>
            <label>Graduation Year *</label>
            <input
              type="number"
              value={formData.year}
              onChange={(e) =>
                setFormData({ ...formData, year: e.target.value })
              }
              min="1950"
              max={new Date().getFullYear()}
              required
            />
          </div>
          <button type="submit" className={styles.saveBtn}>
            {editingId ? "Update" : "Add"} Education
          </button>
        </form>
      )}

      <div className={styles.educationList}>
        {education.length === 0 ? (
          <p className={styles.emptyState}>
            No education added yet. Add at least 1 educational qualification!
          </p>
        ) : (
          education.map((edu) => (
            <div key={edu.id} className={styles.educationItem}>
              <h4>{edu.degree}</h4>
              <p className={styles.institution}>{edu.institution}</p>
              <p className={styles.year}>Graduated: {edu.year}</p>
              <div className={styles.actions}>
                <button
                  onClick={() => handleEdit(edu)}
                  className={styles.editBtn}
                >
                  Edit
                </button>
                <button
                  onClick={() => handleDelete(edu.id)}
                  className={styles.deleteBtn}
                >
                  Delete
                </button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
