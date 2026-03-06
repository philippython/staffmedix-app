import styles from "./JobDescription.module.css";

function parseParagraphs(text) {
  if (!text) return [];
  return text
    .split(/\n{2,}/)
    .map((p) => p.replace(/\n/g, " ").trim())
    .filter(Boolean);
}

export default function JobDescription({ job }) {
  const paragraphs = parseParagraphs(job?.description);

  if (!paragraphs.length) return null;

  return (
    <div className={styles.jobDescription}>
      <h4>Job Description</h4>
      {paragraphs.map((para, i) => (
        <p key={i}>{para}</p>
      ))}
    </div>
  );
}
