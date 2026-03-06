import styles from "./JobOpening.module.css";
import Button from "../../components/Button";
import { daysAgo } from "../../utils/timelineCalculator";
import { Link } from "react-router";
import { useState } from "react";
import { useWhoAmIQuery } from "../../services/userApi";
import { useGetTalentProfileQuery } from "../../services/talentApi";
import { useSelector } from "react-redux";

export default function JobOpening({
  job,
  isApplying,
  hasApplied,
  onApply,
  truncateDescription,
}) {
  const [showModal, setShowModal] = useState(false);
  const [modalMsg, setModalMsg] = useState("");

  const token = useSelector((state) => state.auth.token);
  const isAuthenticated = useSelector((state) => state.auth.isAuthenticated);

  const { data: whoAmI } = useWhoAmIQuery(undefined, { skip: !token });
  const talentId = whoAmI?.talent_id;
  const isTalent = whoAmI?.role === "TALENT" && !!talentId;
  const isEmployer = whoAmI?.role === "EMPLOYER";

  const { data: talentProfile, refetch: refetchTalentProfile } =
    useGetTalentProfileQuery(talentId, {
      skip: !isTalent,
      refetchOnMountOrArgChange: true,
    });
  const talentVerified = talentProfile?.verified === true;

  function handleApplyClick(e) {
    e.preventDefault();
    if (hasApplied) return;

    if (!isAuthenticated) {
      // Let parent / router handle redirect by calling onApply which will
      // eventually hit the auth guard — but show nothing here
      onApply(job.id);
      return;
    }
    if (isEmployer) {
      setModalMsg("employer");
      setShowModal(true);
      return;
    }
    if (!isTalent) {
      onApply(job.id);
      return;
    }
    if (!talentVerified) {
      setModalMsg("unverified");
      setShowModal(true);
      return;
    }
    // onApply triggers applyToJob which invalidates TalentProfile,
    // but we also call refetch directly to guarantee immediate freshness
    onApply(job.id);
    setTimeout(() => refetchTalentProfile?.(), 800);
  }

  return (
    <>
      <Link to={`/jobs/${job.id}`}>
        <div className={styles.jobOpening}>
          <div className={styles.titlePoster}>
            <div className={styles.title}>
              <h5>{job.title}</h5>
            </div>
            <div className={styles.poster}>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M6 22V4a2 2 0 0 1 2-2h8a2 2 0 0 1 2 2v18Z"></path>
                <path d="M6 12H4a2 2 0 0 0-2 2v6a2 2 0 0 0 2 2h2"></path>
                <path d="M18 9h2a2 2 0 0 1 2 2v9a2 2 0 0 1-2 2h-2"></path>
                <path d="M10 6h4"></path>
                <path d="M10 10h4"></path>
                <path d="M10 14h4"></path>
                <path d="M10 18h4"></path>
              </svg>
              <p>{job.company["company_name"]}</p>
            </div>
            <p
              style={
                truncateDescription
                  ? {
                      display: "-webkit-box",
                      WebkitLineClamp: 2,
                      WebkitBoxOrient: "vertical",
                      overflow: "hidden",
                    }
                  : {}
              }
            >
              {job.description}
            </p>
          </div>

          <div className={styles.applyWages}>
            <h5>{`\u20a6${job?.salary_min.toLocaleString()} - \u20a6${job?.salary_max.toLocaleString()}`}</h5>
            <p>{daysAgo(job.created_at)}</p>
            <Button
              variant={hasApplied ? "outlinedButton" : "coloredButton"}
              disabled={hasApplied || isApplying}
              onClick={handleApplyClick}
            >
              {isApplying
                ? "Applying..."
                : hasApplied
                  ? "Applied \u2713"
                  : "Apply Now"}
            </Button>
          </div>
        </div>
      </Link>

      {/* Modal */}
      {showModal && (
        <div
          style={{
            position: "fixed",
            inset: 0,
            background: "rgba(0,0,0,0.5)",
            zIndex: 1000,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            padding: "1rem",
          }}
          onClick={() => setShowModal(false)}
        >
          <div
            style={{
              background: "#fff",
              borderRadius: "1rem",
              padding: "2.5rem 2rem",
              maxWidth: "420px",
              width: "100%",
              textAlign: "center",
              boxShadow: "0 20px 60px rgba(0,0,0,0.2)",
            }}
            onClick={(e) => e.stopPropagation()}
          >
            {modalMsg === "employer" ? (
              <>
                <div style={{ fontSize: "2.5rem", marginBottom: "1rem" }}>
                  🏥
                </div>
                <h3 style={{ margin: "0 0 0.75rem", fontSize: "1.1rem" }}>
                  You're logged in as an Employer
                </h3>
                <p
                  style={{
                    color: "#555",
                    fontSize: "0.9rem",
                    lineHeight: 1.6,
                    margin: "0 0 1.5rem",
                  }}
                >
                  Only healthcare professionals can apply to jobs. Log in with a
                  Talent account to apply.
                </p>
                <div
                  style={{
                    display: "flex",
                    gap: "0.75rem",
                    justifyContent: "center",
                  }}
                >
                  <button
                    onClick={() => setShowModal(false)}
                    style={{
                      padding: "0.6rem 1.25rem",
                      background: "#f3f4f6",
                      border: "none",
                      borderRadius: "0.5rem",
                      fontWeight: 600,
                      cursor: "pointer",
                    }}
                  >
                    Cancel
                  </button>
                  <Link
                    to="/auth"
                    style={{
                      padding: "0.6rem 1.25rem",
                      background: "#0d9269",
                      color: "#fff",
                      borderRadius: "0.5rem",
                      fontWeight: 600,
                      textDecoration: "none",
                    }}
                  >
                    Login as Talent
                  </Link>
                </div>
              </>
            ) : (
              <>
                <div style={{ fontSize: "2.5rem", marginBottom: "1rem" }}>
                  🔒
                </div>
                <h3 style={{ margin: "0 0 0.75rem", fontSize: "1.1rem" }}>
                  Verification required
                </h3>
                <p
                  style={{
                    color: "#555",
                    fontSize: "0.9rem",
                    lineHeight: 1.6,
                    margin: "0 0 1.5rem",
                  }}
                >
                  Only verified healthcare professionals can apply to jobs on
                  StaffMedix. Complete your profile and get verified to start
                  applying.
                </p>
                <div
                  style={{
                    display: "flex",
                    gap: "0.75rem",
                    justifyContent: "center",
                  }}
                >
                  <button
                    onClick={() => setShowModal(false)}
                    style={{
                      padding: "0.6rem 1.25rem",
                      background: "#f3f4f6",
                      border: "none",
                      borderRadius: "0.5rem",
                      fontWeight: 600,
                      cursor: "pointer",
                    }}
                  >
                    Cancel
                  </button>
                  <Link
                    to="/talent-dashboard/settings"
                    style={{
                      padding: "0.6rem 1.25rem",
                      background: "#0d9269",
                      color: "#fff",
                      borderRadius: "0.5rem",
                      fontWeight: 600,
                      textDecoration: "none",
                    }}
                  >
                    Complete Profile
                  </Link>
                </div>
              </>
            )}
          </div>
        </div>
      )}
    </>
  );
}
