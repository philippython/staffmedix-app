import Tag from "../app/Tag";
import styles from "./JobOpening.module.css";
import Button from "../app/Button";

export default function JobOpening() {
  return (
    <div className={styles.jobOpening}>
      <div className={styles.titlePoster}>
        <div className={styles.title}>
          <h5>Senior ICU Nurse</h5>
          <Tag variant={"tag-green"}>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={1.5}
              stroke="currentColor"
              className={styles.tagIcon}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M9 12.75 11.25 15 15 9.75m-3-7.036A11.959 11.959 0 0 1 3.598 6 11.99 11.99 0 0 0 3 9.749c0 5.592 3.824 10.29 9 11.623 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.571-.598-3.751h-.152c-3.196 0-6.1-1.248-8.25-3.285Z"
              />
            </svg>
            Verified Employer
          </Tag>
        </div>
        <div className={styles.poster}>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            stroke-width="2"
            stroke-linecap="round"
            stroke-linejoin="round"
            class="lucide lucide-building2 w-4 h-4 text-muted-foreground"
          >
            <path d="M6 22V4a2 2 0 0 1 2-2h8a2 2 0 0 1 2 2v18Z"></path>
            <path d="M6 12H4a2 2 0 0 0-2 2v6a2 2 0 0 0 2 2h2"></path>
            <path d="M18 9h2a2 2 0 0 1 2 2v9a2 2 0 0 1-2 2h-2"></path>
            <path d="M10 6h4"></path>
            <path d="M10 10h4"></path>
            <path d="M10 14h4"></path>
            <path d="M10 18h4"></path>
          </svg>
          <p>Lagos University Teaching Hospital</p>
        </div>
        <p>
          Seeking an experienced ICU nurse to join our critical care team. Must
          have at least 5 years of ICU experience.
        </p>
      </div>
      <div className={styles.applyWages}>
        <h5>#450,000 - #650,000</h5>
        <p>2 days ago</p>
        <Button variant={"coloredButton"}>Apply Now</Button>
      </div>
    </div>
  );
}
