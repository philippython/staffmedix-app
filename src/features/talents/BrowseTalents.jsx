import { useState } from "react";
import { Link } from "react-router";
import styles from "./BrowseTalents.module.css";

export default function BrowseTalents() {
  const [filters, setFilters] = useState({
    profession: "",
    experience: "",
    location: "",
    verified: false,
  });

  const talents = [
    {
      id: 1,
      name: "Dr. Sarah Okonkwo",
      profession: "Medical Doctor",
      specialization: "ICU Specialist",
      experience: "8 years",
      location: "Lagos, Nigeria",
      verified: true,
      availability: "Available",
      image: "👨‍⚕️",
      skills: ["Critical Care", "Emergency Medicine", "Patient Management"],
    },
    {
      id: 2,
      name: "Nurse Chioma Eze",
      profession: "Registered Nurse",
      specialization: "Pediatric Nurse",
      experience: "5 years",
      location: "Abuja, Nigeria",
      verified: true,
      availability: "Available in 2 weeks",
      image: "👩‍⚕️",
      skills: ["Pediatric Care", "Patient Education", "IV Administration"],
    },
    {
      id: 3,
      name: "Dr. James Adebayo",
      profession: "Surgeon",
      specialization: "General Surgery",
      experience: "10 years",
      location: "Lagos, Nigeria",
      verified: true,
      availability: "Available",
      image: "👨‍⚕️",
      skills: ["Surgical Procedures", "Post-Op Care", "Minimally Invasive"],
    },
    {
      id: 4,
      name: "Pharmacist Amina Bello",
      profession: "Pharmacist",
      specialization: "Clinical Pharmacy",
      experience: "6 years",
      location: "Kano, Nigeria",
      verified: false,
      availability: "Available",
      image: "👩‍⚕️",
      skills: ["Drug Therapy", "Patient Counseling", "Medication Review"],
    },
  ];

  const handleFilterChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFilters({
      ...filters,
      [name]: type === "checkbox" ? checked : value,
    });
  };

  return (
    <div className={styles.browseTalents}>
      <div className={styles.header}>
        <h1>Browse Healthcare Talents</h1>
        <p>Find verified healthcare professionals for your organization</p>
      </div>

      <div className={styles.mainContent}>
        <aside className={styles.filterSidebar}>
          <h3>Filter Talents</h3>

          <div className={styles.filterGroup}>
            <label>Profession</label>
            <select
              name="profession"
              value={filters.profession}
              onChange={handleFilterChange}
            >
              <option value="">All Professions</option>
              <option value="doctor">Doctor</option>
              <option value="nurse">Nurse</option>
              <option value="pharmacist">Pharmacist</option>
              <option value="lab-tech">Lab Technician</option>
              <option value="radiographer">Radiographer</option>
            </select>
          </div>

          <div className={styles.filterGroup}>
            <label>Experience</label>
            <select
              name="experience"
              value={filters.experience}
              onChange={handleFilterChange}
            >
              <option value="">All Levels</option>
              <option value="0-2">0-2 years</option>
              <option value="3-5">3-5 years</option>
              <option value="6-10">6-10 years</option>
              <option value="10+">10+ years</option>
            </select>
          </div>

          <div className={styles.filterGroup}>
            <label>Location</label>
            <select
              name="location"
              value={filters.location}
              onChange={handleFilterChange}
            >
              <option value="">All Locations</option>
              <option value="lagos">Lagos</option>
              <option value="abuja">Abuja</option>
              <option value="kano">Kano</option>
              <option value="rivers">Rivers</option>
            </select>
          </div>

          <div className={styles.filterGroup}>
            <label className={styles.checkboxLabel}>
              <input
                type="checkbox"
                name="verified"
                checked={filters.verified}
                onChange={handleFilterChange}
              />
              <span>Verified Only</span>
            </label>
          </div>

          <button className={styles.clearFilters}>Clear Filters</button>
        </aside>

        <div className={styles.talentsList}>
          <div className={styles.resultsHeader}>
            <p>Showing {talents.length} talents</p>
            <select className={styles.sortSelect}>
              <option>Sort by: Relevance</option>
              <option>Experience: High to Low</option>
              <option>Recently Active</option>
            </select>
          </div>

          <div className={styles.talentsGrid}>
            {talents.map((talent) => (
              <div key={talent.id} className={styles.talentCard}>
                <div className={styles.cardHeader}>
                  <div className={styles.talentImage}>{talent.image}</div>
                  <div className={styles.talentBasicInfo}>
                    <h3>{talent.name}</h3>
                    <p className={styles.profession}>{talent.profession}</p>
                    <p className={styles.specialization}>
                      {talent.specialization}
                    </p>
                    {talent.verified && (
                      <span className={styles.verifiedBadge}>✓ Verified</span>
                    )}
                  </div>
                </div>

                <div className={styles.cardBody}>
                  <div className={styles.infoGrid}>
                    <div className={styles.infoItem}>
                      <span className={styles.icon}>💼</span>
                      <span>{talent.experience} experience</span>
                    </div>
                    <div className={styles.infoItem}>
                      <span className={styles.icon}>📍</span>
                      <span>{talent.location}</span>
                    </div>
                    <div className={styles.infoItem}>
                      <span className={styles.icon}>🕒</span>
                      <span>{talent.availability}</span>
                    </div>
                  </div>

                  <div className={styles.skills}>
                    <p className={styles.skillsLabel}>Key Skills:</p>
                    <div className={styles.skillTags}>
                      {talent.skills.map((skill, idx) => (
                        <span key={idx} className={styles.skillTag}>
                          {skill}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>

                <div className={styles.cardActions}>
                  <Link
                    to={`/talent/${talent.id}`}
                    className={styles.viewProfileBtn}
                  >
                    View Profile
                  </Link>
                  <Link to={"/chat"}>
                    <button className={styles.sendMessageBtn}>
                      💬 Send Message
                    </button>
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
