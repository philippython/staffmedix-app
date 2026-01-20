import styles from "./JobUnorderedList.module.css";

export default function JobUnorderedList({ children, title }) {
  return (
    <>
      <div className={styles.jobUnorderedList}>
        <h3>{title}</h3>
        {children}
      </div>
    </>
  );
}
