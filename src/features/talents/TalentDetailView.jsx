import { Link, useParams } from "react-router";
import styles from "./TalentDetailView.module.css";

export default function TalentDetailView() {
  const { id } = useParams();

  const talent = {
    id: 1,
    name: "Dr. Sarah Okonkwo",
    profession: "Medical Doctor",
    specialization: "ICU Specialist",
    image: "👩‍⚕️",
    location: "Lagos, Nigeria",
    experience: "8 years",
    verified: true,
    availability: "Available",
    email: "sarah.okonkwo@email.com",
    phone: "+234 801 234 5678",
    summary:
      "Experienced ICU specialist with 8 years of clinical experience in critical care medicine. Proven track record in managing complex cases and leading multidisciplinary teams.",

    skills: [
      "Critical Care",
      "Emergency Medicine",
      "Patient Management",
      "Ventilator Management",
      "Advanced Life Support",
      "Team Leadership",
    ],

    certifications: [
      {
        name: "Advanced Cardiac Life Support (ACLS)",
        issuer: "American Heart Association",
        year: "2024",
      },
      {
        name: "Basic Life Support (BLS)",
        issuer: "American Heart Association",
        year: "2023",
      },
      {
        name: "Critical Care Nursing Certification",
        issuer: "AACN",
        year: "2022",
      },
    ],

    workHistory: [
      {
        position: "Senior ICU Nurse",
        organization: "Lagos University Teaching Hospital",
        period: "2020 - Present",
        description:
          "Managing critical care unit with 20 beds. Supervising team of 15 nurses. Implementing patient care protocols.",
      },
      {
        position: "ICU Nurse",
        organization: "St. Nicholas Hospital",
        period: "2016 - 2020",
        description:
          "Provided direct patient care in intensive care unit. Assisted in emergency procedures. Mentored junior staff.",
      },
    ],

    education: [
      {
        degree: "Bachelor of Nursing Science",
        institution: "University of Lagos",
        year: "2016",
      },
      {
        degree: "Advanced Diploma in Critical Care",
        institution: "West African College of Nursing",
        year: "2018",
      },
    ],
  };

  return (
    <div className={styles.talentDetail}>
      <div className={styles.header}>
        <div className={styles.profileHeader}>
          <div className={styles.profileImage}>{talent.image}</div>
          <div className={styles.profileInfo}>
            <div>
              <h1>{talent.name}</h1>
              <p className={styles.profession}>{talent.profession}</p>
              <p className={styles.specialization}>{talent.specialization}</p>
              <div className={styles.badges}>
                {talent.verified && (
                  <span className={styles.verifiedBadge}>✓ Verified</span>
                )}
                <span className={styles.availableBadge}>
                  {talent.availability}
                </span>
              </div>
            </div>
          </div>
        </div>

        <div className={styles.actions}>
          <Link to="/chat" className={styles.messageBtn}>
            💬 Send Message
          </Link>
          <button className={styles.scheduleBtn}>📅 Schedule Interview</button>
        </div>
      </div>

      <div className={styles.mainContent}>
        <div className={styles.leftColumn}>
          <section className={styles.section}>
            <h2>About</h2>
            <p className={styles.summary}>{talent.summary}</p>
          </section>

          <section className={styles.section}>
            <h2>Work Experience</h2>
            {talent.workHistory.map((job, index) => (
              <div key={index} className={styles.experienceItem}>
                <h3>{job.position}</h3>
                <p className={styles.organization}>{job.organization}</p>
                <p className={styles.period}>{job.period}</p>
                <p className={styles.description}>{job.description}</p>
              </div>
            ))}
          </section>

          <section className={styles.section}>
            <h2>Education</h2>
            {talent.education.map((edu, index) => (
              <div key={index} className={styles.educationItem}>
                <h3>{edu.degree}</h3>
                <p className={styles.institution}>{edu.institution}</p>
                <p className={styles.year}>{edu.year}</p>
              </div>
            ))}
          </section>

          <section className={styles.section}>
            <h2>Certifications</h2>
            {talent.certifications.map((cert, index) => (
              <div key={index} className={styles.certItem}>
                <h3>{cert.name}</h3>
                <p className={styles.issuer}>{cert.issuer}</p>
                <p className={styles.year}>{cert.year}</p>
              </div>
            ))}
          </section>
        </div>

        <aside className={styles.rightColumn}>
          <div className={styles.infoCard}>
            <h3>Contact Information</h3>
            <div className={styles.contactItem}>
              <span className={styles.icon}>📍</span>
              <span>{talent.location}</span>
            </div>
            <div className={styles.contactItem}>
              <span className={styles.icon}>📧</span>
              <span>{talent.email}</span>
            </div>
            <div className={styles.contactItem}>
              <span className={styles.icon}>📞</span>
              <span>{talent.phone}</span>
            </div>
            <div className={styles.contactItem}>
              <span className={styles.icon}>💼</span>
              <span>{talent.experience} experience</span>
            </div>
          </div>

          <div className={styles.infoCard}>
            <h3>Skills</h3>
            <div className={styles.skillTags}>
              {talent.skills.map((skill, index) => (
                <span key={index} className={styles.skillTag}>
                  {skill}
                </span>
              ))}
            </div>
          </div>

          <div className={styles.infoCard}>
            <h3>Quick Actions</h3>
            <button className={styles.actionBtn}>📥 Download Resume</button>
            <button className={styles.actionBtn}>⭐ Add to Shortlist</button>
            <button className={styles.actionBtn}>📤 Share Profile</button>
          </div>
        </aside>
      </div>
    </div>
  );
}
