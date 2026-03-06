import { Link } from "react-router";
import styles from "./VerificationBanner.module.css";

export default function VerificationBanner({ verification }) {
  const { isVerified, percent, missing } = verification;

  // Fully verified
  if (isVerified) {
    return (
      <div className={`${styles.banner} ${styles.verified}`}>
        <span className={styles.icon}>✅</span>
        <div className={styles.text}>
          <strong>Profile Verified</strong>
          <span>
            Your organisation is verified by StaffMedix. You can post jobs and
            ads.
          </span>
        </div>
      </div>
    );
  }

  // Not verified — show completeness + pending notice
  return (
    <div className={`${styles.banner} ${styles.blocked}`}>
      <span className={styles.icon}>🔒</span>
      <div className={styles.content}>
        <div className={styles.topRow}>
          <div className={styles.text}>
            <strong>Awaiting admin verification</strong>
            <span>
              Your profile is <strong>{percent}%</strong> complete. You cannot
              post jobs or ads until StaffMedix verifies your organisation.
              {percent < 100 &&
                " Complete your profile to speed up the process."}
            </span>
          </div>
          {percent < 100 && (
            <Link
              to="/employer-dashboard/settings"
              className={styles.actionBtnPrimary}
            >
              Complete Profile
            </Link>
          )}
        </div>
        <ProgressBar percent={percent} />
        {missing.length > 0 && percent < 100 && (
          <div className={styles.missingList}>
            <span className={styles.missingTitle}>Still needed:</span>
            <div className={styles.chips}>
              {missing.map((m) => (
                <span key={m} className={styles.chip}>
                  ✗ {m}
                </span>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

function ProgressBar({ percent }) {
  const color =
    percent === 100 ? "#0d9269" : percent >= 50 ? "#f59e0b" : "#e53e3e";

  return (
    <div className={styles.progressWrap}>
      <div className={styles.progressTrack}>
        <div
          className={styles.progressFill}
          style={{ width: `${percent}%`, background: color }}
        />
      </div>
      <div className={styles.progressLabels}>
        <span className={styles.progressPct}>{percent}% complete</span>
        <span className={styles.milestone}>
          100% needed before verification
        </span>
      </div>
    </div>
  );
}
