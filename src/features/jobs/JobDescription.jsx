import styles from "./JobDescription.module.css";

export default function JobDescription() {
  return (
    <div className={styles.jobDescription}>
      <h4>Job Description</h4>
      <p>
        We are seeking an experienced and compassionate Senior ICU Nurse to join
        our critical care team at Lagos University Teaching Hospital. The ideal
        candidate will have extensive experience in intensive care nursing and a
        passion for providing exceptional patient care.
      </p>
      <p>
        As a Senior ICU Nurse, you will be responsible for managing critically
        ill patients, coordinating with multidisciplinary teams, and mentoring
        junior nursing staff. This role offers an opportunity to work in one of
        Nigeria's leading teaching hospitals with access to advanced medical
        technology and continuous professional development opportunities.
      </p>
    </div>
  );
}
