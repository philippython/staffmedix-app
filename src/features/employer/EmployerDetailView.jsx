import { useParams, useNavigate, Link } from "react-router";
import styles from "./EmployerDetailView.module.css";
import {
  useGetCompanyProfileByIdQuery,
  useGetCompanyServicesQuery,
  useGetCompanyContactsQuery,
  useGetCompanyContactPersonsQuery,
} from "../../services/employerApi";
import { useGetJobsQuery } from "../../services/jobsApi";

function getInitials(name) {
  if (!name) return "?";
  return name
    .split(" ")
    .filter(Boolean)
    .map((w) => w[0])
    .slice(0, 2)
    .join("")
    .toUpperCase();
}
function formatDate(d) {
  if (!d) return "";
  try {
    return new Date(d).toLocaleDateString("en-GB", {
      day: "numeric",
      month: "short",
      year: "numeric",
    });
  } catch {
    return d;
  }
}

export default function OrganisationDetailView() {
  const { id } = useParams();
  const navigate = useNavigate();

  const {
    data: org,
    isLoading: loadingOrg,
    isError,
  } = useGetCompanyProfileByIdQuery(id);
  const { data: svcData } = useGetCompanyServicesQuery({ companyId: id }, { skip: !id });
  const { data: contactData } = useGetCompanyContactsQuery(
    { companyId: id },
    { skip: !id },
  );
  const { data: personData } = useGetCompanyContactPersonsQuery(
    { companyId: id },
    { skip: !id },
  );
  const { data: jobsData, isLoading: loadingJobs } = useGetJobsQuery(
    { company: id, limit: 50 },
    { skip: !id },
  );

  const services = svcData?.results ?? svcData ?? [];
  const contacts = contactData?.results ?? contactData ?? [];
  const persons = personData?.results ?? personData ?? [];
  const jobs = jobsData?.results ?? jobsData ?? [];

  const contact = contacts[0];
  const person = persons[0];
  const name = org?.company_name ?? "Healthcare Organisation";
  const verified = org?.verified === true;

  if (loadingOrg)
    return (
      <div className={styles.statePage}>
        <div className={styles.spinner} />
        <p>Loading organisation…</p>
      </div>
    );
  if (isError || !org)
    return (
      <div className={styles.statePage}>
        <span className={styles.stateIcon}>⚠️</span>
        <p>Organisation not found.</p>
        <button onClick={() => navigate(-1)} className={styles.backBtn}>
          ← Go back
        </button>
      </div>
    );

  return (
    <div className={styles.page}>
      {/* ── Hero ──────────────────────────────────────────────────────────── */}
      <div className={styles.hero}>
        {/* Background texture rings */}
        <div className={styles.heroBg} />

        <div className={styles.heroInner}>
          {/* Back */}
          <button className={styles.backLink} onClick={() => navigate(-1)}>
            ← Back to Organisations
          </button>

          {/* Profile row */}
          <div className={styles.profileRow}>
            {/* Logo */}
            <div className={styles.logoFrame}>
              {org.logo ? (
                <img src={org.logo} alt={name} className={styles.logo} />
              ) : (
                <div className={styles.logoInitials}>{getInitials(name)}</div>
              )}
            </div>

            {/* Identity */}
            <div className={styles.identity}>
              <div className={styles.nameRow}>
                <h1 className={styles.orgName}>{name}</h1>
                <span className={verified ? styles.verBadge : styles.pendBadge}>
                  {verified ? "✓ Verified" : "○ Pending"}
                </span>
              </div>
              {org.organization_type && (
                <p className={styles.orgType}>{org.organization_type}</p>
              )}
              {org.description && (
                <p className={styles.orgTagline}>
                  {org.description.length > 160
                    ? org.description.slice(0, 160) + "…"
                    : org.description}
                </p>
              )}
              <div className={styles.chips}>
                {org.size > 0 && (
                  <span className={styles.chip}>
                    <span>👥</span> {org.size}+ staff
                  </span>
                )}
                {contact?.city && (
                  <span className={styles.chip}>
                    <span>📍</span> {contact.city}
                    {contact.state ? `, ${contact.state}` : ""}
                  </span>
                )}
                {org.registration_number && (
                  <span className={styles.chip}>
                    <span>📋</span> RC {org.registration_number}
                  </span>
                )}
                {org.website && (
                  <a
                    href={org.website}
                    target="_blank"
                    rel="noreferrer"
                    className={`${styles.chip} ${styles.chipLink}`}
                  >
                    <span>🌐</span> Website ↗
                  </a>
                )}
              </div>
            </div>

            {/* Stats bubble */}
            <div className={styles.statBubble}>
              <p className={styles.statNum}>
                {loadingJobs ? "…" : jobs.length}
              </p>
              <p className={styles.statLabel}>Open Positions</p>
              <Link to={`/jobs?company=${id}`} className={styles.statCta}>
                Browse Jobs →
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* ── Body ─────────────────────────────────────────────────────────── */}
      <div className={styles.body}>
        {/* ── Left column ──────────────────────────────────────────────── */}
        <div className={styles.leftCol}>
          {/* About */}
          {org.description && (
            <section className={styles.section}>
              <h2 className={styles.sectionTitle}>About</h2>
              {org.description
                .split(/\n+/)
                .filter(Boolean)
                .map((p, i) => (
                  <p key={i} className={styles.bodyText}>
                    {p}
                  </p>
                ))}
            </section>
          )}

          {/* Services */}
          {services.length > 0 && (
            <section className={styles.section}>
              <h2 className={styles.sectionTitle}>Services Offered</h2>
              <div className={styles.serviceGrid}>
                {services.map((s, i) => (
                  <div key={s.id ?? i} className={styles.serviceChip}>
                    <span className={styles.serviceIcon}>✦</span>
                    {s.name ?? s.service ?? s.title}
                  </div>
                ))}
              </div>
            </section>
          )}

          {/* Jobs */}
          <section className={styles.section}>
            <div className={styles.sectionTitleRow}>
              <h2 className={styles.sectionTitle}>Open Positions</h2>
              {jobs.length > 0 && (
                <span className={styles.countPill}>{jobs.length}</span>
              )}
            </div>

            {loadingJobs ? (
              <div className={styles.miniLoad}>
                <div className={styles.spinner} />
              </div>
            ) : jobs.length === 0 ? (
              <div className={styles.emptyJobs}>
                <span>📋</span>
                <p>No open positions right now.</p>
              </div>
            ) : (
              <div className={styles.jobList}>
                {jobs.map((job) => (
                  <Link
                    key={job.id}
                    to={`/jobs/${job.id}`}
                    className={styles.jobCard}
                  >
                    <div className={styles.jobMain}>
                      <h3 className={styles.jobTitle}>{job.title}</h3>
                      <div className={styles.jobTags}>
                        {job.location && (
                          <span className={styles.jobTag}>
                            <span
                              className={styles.jobTagDot}
                              style={{ background: "#ef4444" }}
                            />
                            {job.location}
                          </span>
                        )}
                        {job.employment_type && (
                          <span className={styles.jobTag}>
                            {job.employment_type.replace("_", " ")}
                          </span>
                        )}
                        {job.salary_range && (
                          <span
                            className={`${styles.jobTag} ${styles.jobTagGreen}`}
                          >
                            💰 {job.salary_range}
                          </span>
                        )}
                      </div>
                      {job.deadline && (
                        <p className={styles.jobDeadline}>
                          Closes {formatDate(job.deadline)}
                        </p>
                      )}
                    </div>
                    <div className={styles.jobArrowWrap}>→</div>
                  </Link>
                ))}
              </div>
            )}
          </section>
        </div>

        {/* ── Right column ─────────────────────────────────────────────── */}
        <aside className={styles.rightCol}>
          {/* Verification */}
          <div
            className={`${styles.card} ${verified ? styles.cardVerified : styles.cardPending}`}
          >
            <div className={styles.verHeader}>
              <div
                className={`${styles.verIconWrap} ${verified ? styles.verIconGreen : styles.verIconGrey}`}
              >
                {verified ? "✓" : "○"}
              </div>
              <div>
                <p className={styles.verTitle}>
                  {verified ? "Verified Organisation" : "Pending Verification"}
                </p>
                <p className={styles.verSub}>
                  {verified
                    ? "Vetted and approved by StaffMedix"
                    : "Credentials are under review"}
                </p>
              </div>
            </div>
          </div>

          {/* Details */}
          <div className={styles.card}>
            <h3 className={styles.cardTitle}>Organisation Details</h3>
            <div className={styles.detailRows}>
              {org.organization_type && (
                <div className={styles.detailRow}>
                  <span className={styles.detailLabel}>Type</span>
                  <span className={styles.detailValue}>
                    {org.organization_type}
                  </span>
                </div>
              )}
              {org.size > 0 && (
                <div className={styles.detailRow}>
                  <span className={styles.detailLabel}>Size</span>
                  <span className={styles.detailValue}>
                    {org.size}+ employees
                  </span>
                </div>
              )}
              {org.registration_number && (
                <div className={styles.detailRow}>
                  <span className={styles.detailLabel}>Reg No.</span>
                  <span className={styles.detailValue}>
                    {org.registration_number}
                  </span>
                </div>
              )}
              {contact?.address && (
                <div className={styles.detailRow}>
                  <span className={styles.detailLabel}>Address</span>
                  <span className={styles.detailValue}>{contact.address}</span>
                </div>
              )}
              {contact?.city && (
                <div className={styles.detailRow}>
                  <span className={styles.detailLabel}>Location</span>
                  <span className={styles.detailValue}>
                    {[contact.city, contact.state].filter(Boolean).join(", ")}
                  </span>
                </div>
              )}
              {contact?.contact_email && (
                <div className={styles.detailRow}>
                  <span className={styles.detailLabel}>Email</span>
                  <a
                    href={`mailto:${contact.contact_email}`}
                    className={styles.detailLink}
                  >
                    {contact.contact_email}
                  </a>
                </div>
              )}
              {contact?.contact_number && (
                <div className={styles.detailRow}>
                  <span className={styles.detailLabel}>Phone</span>
                  <span className={styles.detailValue}>
                    {contact.contact_number}
                  </span>
                </div>
              )}
              {org.website && (
                <div className={styles.detailRow}>
                  <span className={styles.detailLabel}>Website</span>
                  <a
                    href={org.website}
                    target="_blank"
                    rel="noreferrer"
                    className={styles.detailLink}
                  >
                    {org.website.replace(/^https?:\/\//, "")}
                  </a>
                </div>
              )}
            </div>
          </div>

          {/* Contact person */}
          {person && (
            <div className={styles.card}>
              <h3 className={styles.cardTitle}>Contact Person</h3>
              <div className={styles.personRow}>
                <div className={styles.personAvatar}>
                  {getInitials(person.full_name)}
                </div>
                <div>
                  <p className={styles.personName}>{person.full_name}</p>
                  {person.email && (
                    <p className={styles.personSub}>{person.email}</p>
                  )}
                  {person.phone_number && (
                    <p className={styles.personSub}>{person.phone_number}</p>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* Quick apply CTA */}
          <Link to={`/jobs?company=${id}`} className={styles.applyCta}>
            <span className={styles.applyCtaNum}>
              {loadingJobs ? "…" : jobs.length}
            </span>
            <span className={styles.applyCtaLabel}>
              open position{jobs.length !== 1 ? "s" : ""}
            </span>
            <span className={styles.applyCtaArrow}>View All Jobs →</span>
          </Link>
        </aside>
      </div>
    </div>
  );
}