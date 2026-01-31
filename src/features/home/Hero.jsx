import Button from "../../components/Button";
import Card from "../../components/Card";
import styles from "./Hero.module.css";
import Tag from "../../components/Tag";

export default function Hero() {
  return (
    <header className={styles.hero}>
      <div className={styles.heroTextContainer}>
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
          100% Credential Verified Platform
        </Tag>
        <h1 className={styles.heroText}>
          Hire Verified Nigerian Healthcare Professionals
          <span className={styles.heroSpan}> With Confidence</span>
        </h1>
        <p>
          StaffMedix ensures every healthcare worker is credentialed and
          verified before appearing on the platform. Safe hiring, guaranteed.
        </p>
        <div className={styles.actionButtons}>
          <Button variant="mediumColoredButton">Hire Talent →</Button>
          <Button variant="mediumPlainButton">Create Worker Profile</Button>
        </div>
      </div>
      <div className={styles.circleDiv}>
        <Card
          variant={"coloredCardSmall"}
          isAbsolute={true}
          positions={{
            right: "-32px",
          }}
        >
          <h3>Quick Match</h3>
          <p>Find the perfect candidate in under 48 hours</p>
        </Card>
        <Card
          variant={"plainCardMedium"}
          isAbsolute={true}
          positions={{
            right: "-5rem",
            top: "11rem",
          }}
        >
          <div className={styles.profileDiv}>
            <svg
              className={styles.svgFilled}
              xmlns="http://www.w3.org/2000/svg"
              width="2.3rem"
              height="2.3rem"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              stroke-width="2"
              stroke-linecap="round"
              stroke-linejoin="round"
            >
              <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"></path>
              <circle cx="9" cy="7" r="4"></circle>
              <path d="M22 21v-2a4 4 0 0 0-3-3.87"></path>
              <path d="M16 3.13a4 4 0 0 1 0 7.75"></path>
            </svg>
            <h3>
              Dr. Adaeze O. <span>Registered Nurse</span>
            </h3>
          </div>
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
            Verified Professional
          </Tag>
        </Card>
        <Card
          variant={"plainCardMedium"}
          isAbsolute={true}
          positions={{
            bottom: "-1rem",
            left: "-4rem",
          }}
        >
          <svg
            className={styles.svgOutlined}
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            stroke-width="2"
            stroke-linecap="round"
            stroke-linejoin="round"
          >
            <path d="M6 22V4a2 2 0 0 1 2-2h8a2 2 0 0 1 2 2v18Z"></path>
            <path d="M6 12H4a2 2 0 0 0-2 2v6a2 2 0 0 0 2 2h2"></path>
            <path d="M18 9h2a2 2 0 0 1 2 2v9a2 2 0 0 1-2 2h-2"></path>
            <path d="M10 6h4"></path>
            <path d="M10 10h4"></path>
            <path d="M10 14h4"></path>
            <path d="M10 18h4"></path>
          </svg>
          <h3>Lagos General Hospital</h3>
          <p>Hiring: ICU Nurses, Pharmacists</p>
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
        </Card>
      </div>
    </header>
  );
}
