import { useParams, useNavigate, Link } from "react-router";
import styles from "./TalentDetailView.module.css";
import { useGetTalentProfileQuery } from "../../services/talentApi";

function getInitials(name) {
  if (!name) return "?";
  return name.split(" ").filter(Boolean).map((w) => w[0]).slice(0, 2).join("").toUpperCase();
}
function fmtDate(d) {
  if (!d) return "";
  try { return new Date(d).toLocaleDateString("en-GB", { month: "short", year: "numeric" }); }
  catch { return d; }
}

export default function TalentDetailView() {
  const { id } = useParams();
  const navigate = useNavigate();

  const { data: talent,   isLoading: loadingProfile, isError } = useGetTalentProfileQuery(id);
  // Read nested data from TalentsSerializer — avoids sub-queries scoped to logged-in user
  const work   = talent?.work_experience ?? [];
  const edu    = talent?.education       ?? [];
  const skills = talent?.skill           ?? [];
  const creds  = talent?.credentials     ?? [];
  const loadingWork = false;
  const loadingEdu  = false;

  const name     = talent?.full_name ?? "Healthcare Professional";
  const verified = talent?.verified === true;

  if (loadingProfile) return (
    <div className={styles.statePage}><div className={styles.spinner} /><p>Loading profile…</p></div>
  );
  if (isError || !talent) return (
    <div className={styles.statePage}>
      <span style={{ fontSize: "2.5rem" }}>⚠️</span>
      <p>Profile not found.</p>
      <button className={styles.backBtn} onClick={() => navigate(-1)}>← Go back</button>
    </div>
  );

  return (
    <div className={styles.page}>

      {/* ── Hero ──────────────────────────────────────────────────────────── */}
      <div className={styles.hero}>
        <div className={styles.heroBg} />
        <div className={styles.heroInner}>
          <button className={styles.heroBack} onClick={() => navigate(-1)}>← Back to Talents</button>

          <div className={styles.profileRow}>
            {/* Avatar */}
            <div className={styles.avatarWrap}>
              {talent.profile_image
                ? <img src={talent.profile_image} alt={name} className={styles.avatar} />
                : <div className={styles.avatarInitials}>{getInitials(name)}</div>
              }
              <div className={`${styles.verDot} ${verified ? styles.verDotGreen : styles.verDotGrey}`} />
            </div>

            {/* Identity */}
            <div className={styles.identity}>
              <div className={styles.nameRow}>
                <h1 className={styles.name}>{name}</h1>
                <span className={verified ? styles.verBadge : styles.pendBadge}>
                  {verified ? "✓ Verified" : "○ Pending"}
                </span>
              </div>
              <p className={styles.profession}>
                {talent.profession}
                {talent.specialization && <span className={styles.spec}> · {talent.specialization}</span>}
              </p>
              {talent.biography && (
                <p className={styles.tagline}>
                  {talent.biography.length > 180 ? talent.biography.slice(0, 180) + "…" : talent.biography}
                </p>
              )}
              <div className={styles.chips}>
                {talent.years_of_experience != null && (
                  <span className={styles.chip}>💼 {talent.years_of_experience} yr{talent.years_of_experience !== 1 ? "s" : ""} exp</span>
                )}
                {talent.location && <span className={styles.chip}>📍 {talent.location}</span>}
                {talent.license_number && <span className={styles.chip}>🪪 Licensed</span>}
              </div>
            </div>

            {/* Action bubble */}
            <div className={styles.heroBubble}>
              <div className={`${styles.bubbleVerDot} ${verified ? styles.bubbleVerGreen : styles.bubbleVerGrey}`} />
              <p className={styles.bubbleLabel}>{verified ? "Verified Professional" : "Pending Verification"}</p>
              <p className={styles.bubbleDesc}>
                {verified
                  ? "Identity & credentials confirmed by StaffMedix"
                  : "Credentials are under review"}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* ── Body ─────────────────────────────────────────────────────────── */}
      <div className={styles.body}>
        {/* Left */}
        <div className={styles.leftCol}>
          {talent.biography && (
            <section className={styles.section}>
              <h2 className={styles.sectionTitle}>About</h2>
              {talent.biography.split(/\n+/).filter(Boolean).map((p, i) => (
                <p key={i} className={styles.bodyText}>{p}</p>
              ))}
            </section>
          )}

          {/* Work Experience */}
          {(loadingWork || work.length > 0) && (
            <section className={styles.section}>
              <h2 className={styles.sectionTitle}>Work Experience</h2>
              {loadingWork
                ? <div className={styles.miniLoad}><div className={styles.spinner} /></div>
                : (
                  <div className={styles.timeline}>
                    {work.map((job, i) => (
                      <div key={job.id ?? i} className={styles.timelineItem}>
                        <div className={styles.tlDot} />
                        <div className={styles.tlContent}>
                          <h3 className={styles.tlTitle}>{job.job_title ?? job.position ?? job.title}</h3>
                          <p className={styles.tlOrg}>{job.facility ?? job.organization ?? job.company}</p>
                          <p className={styles.tlPeriod}>
                            {fmtDate(job.start_date)} – {job.end_date ? fmtDate(job.end_date) : "Present"}
                          </p>
                          {job.description && <p className={styles.tlDesc}>{job.description}</p>}
                        </div>
                      </div>
                    ))}
                  </div>
                )
              }
            </section>
          )}

          {/* Education */}
          {(loadingEdu || edu.length > 0) && (
            <section className={styles.section}>
              <h2 className={styles.sectionTitle}>Education</h2>
              {loadingEdu
                ? <div className={styles.miniLoad}><div className={styles.spinner} /></div>
                : (
                  <div className={styles.timeline}>
                    {edu.map((e, i) => (
                      <div key={e.id ?? i} className={styles.timelineItem}>
                        <div className={styles.tlDot} />
                        <div className={styles.tlContent}>
                          <h3 className={styles.tlTitle}>{e.degree ?? e.qualification}</h3>
                          <p className={styles.tlOrg}>{e.institution ?? e.school}</p>
                          <p className={styles.tlPeriod}>
                            {e.year ?? fmtDate(e.start_date)}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                )
              }
            </section>
          )}
        </div>

        {/* Right */}
        <aside className={styles.rightCol}>
          {/* Contact / Info */}
          <div className={styles.card}>
            <h3 className={styles.cardTitle}>Details</h3>
            <div className={styles.detailRows}>
              {talent.location && (
                <div className={styles.detailRow}>
                  <span className={styles.detailLabel}>Location</span>
                  <span className={styles.detailValue}>{talent.location}</span>
                </div>
              )}
              {talent.profession && (
                <div className={styles.detailRow}>
                  <span className={styles.detailLabel}>Profession</span>
                  <span className={styles.detailValue}>{talent.profession}</span>
                </div>
              )}
              {talent.specialization && (
                <div className={styles.detailRow}>
                  <span className={styles.detailLabel}>Specialisation</span>
                  <span className={styles.detailValue}>{talent.specialization}</span>
                </div>
              )}
              {talent.years_of_experience != null && (
                <div className={styles.detailRow}>
                  <span className={styles.detailLabel}>Experience</span>
                  <span className={styles.detailValue}>{talent.years_of_experience} years</span>
                </div>
              )}
            </div>
          </div>

          {/* Verification */}
          <div className={`${styles.card} ${verified ? styles.cardGreen : styles.cardGrey}`}>
            <h3 className={styles.cardTitle}>Verification Status</h3>
            <div className={styles.verRow}>
              <div className={`${styles.verIconWrap} ${verified ? styles.verIconGreen : styles.verIconGrey}`}>
                {verified ? "✓" : "○"}
              </div>
              <div>
                <p className={styles.verTitle}>{verified ? "Fully Verified" : "Pending Verification"}</p>
                <p className={styles.verSub}>
                  {verified
                    ? "Vetted and approved by StaffMedix"
                    : "Credentials are under review"}
                </p>
              </div>
            </div>
          </div>

          {/* Skills */}
          {skills.length > 0 && (
            <div className={styles.card}>
              <h3 className={styles.cardTitle}>Skills</h3>
              <div className={styles.skillTags}>
                {skills.map((s, i) => (
                  <span key={s.id ?? i} className={styles.skillTag}>{s.name ?? s.skill}</span>
                ))}
              </div>
            </div>
          )}
        </aside>
      </div>
    </div>
  );
}