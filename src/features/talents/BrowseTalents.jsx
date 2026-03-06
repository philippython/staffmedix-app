import { useState, useMemo } from "react";
import { Link } from "react-router";
import styles from "./BrowseTalents.module.css";
import { useGetTalentsQuery } from "../../services/talentApi";

const NIGERIAN_STATES = [
  "Abia",
  "Adamawa",
  "Akwa Ibom",
  "Anambra",
  "Bauchi",
  "Bayelsa",
  "Benue",
  "Borno",
  "Cross River",
  "Delta",
  "Ebonyi",
  "Edo",
  "Ekiti",
  "Enugu",
  "FCT",
  "Gombe",
  "Imo",
  "Jigawa",
  "Kaduna",
  "Kano",
  "Katsina",
  "Kebbi",
  "Kogi",
  "Kwara",
  "Lagos",
  "Nasarawa",
  "Niger",
  "Ogun",
  "Ondo",
  "Osun",
  "Oyo",
  "Plateau",
  "Rivers",
  "Sokoto",
  "Taraba",
  "Yobe",
  "Zamfara",
];

const PROFESSIONS = [
  "Doctor",
  "Nurse",
  "Pharmacist",
  "X-ray Technician",
  "Physician",
  "Laboratory Technician",
  "Medical Radiographer",
  "Medical Laboratory Scientist",
  "Physician Assistant",
  "Occupational Therapist",
  "Radiographer",
  "Physiotherapist",
  "Dentist",
  "Other",
];

function getInitials(name) {
  if (!name) return "?";
  return name
    .split(" ")
    .map((n) => n[0])
    .slice(0, 2)
    .join("")
    .toUpperCase();
}

function ExperienceBadge({ years }) {
  if (!years && years !== 0) return null;
  const n = Number(years);
  const label = n === 0 ? "Entry level" : n === 1 ? "1 yr" : `${n} yrs`;
  return <span className={styles.expBadge}>{label}</span>;
}

export default function BrowseTalents() {
  const [search, setSearch] = useState("");
  const [profession, setProfession] = useState("");
  const [location, setLocation] = useState("");
  const [expRange, setExpRange] = useState("");
  const [verifiedOnly, setVerifiedOnly] = useState(false);
  const [sort, setSort] = useState("newest");

  const { data, isLoading, isError } = useGetTalentsQuery({ limit: 200 });
  const allTalents = data?.results ?? data ?? [];

  const filtered = useMemo(() => {
    let list = [...allTalents];

    if (search.trim()) {
      const q = search.toLowerCase();
      list = list.filter(
        (t) =>
          t.full_name?.toLowerCase().includes(q) ||
          t.profession?.toLowerCase().includes(q) ||
          t.specialization?.toLowerCase().includes(q) ||
          t.location?.toLowerCase().includes(q),
      );
    }
    if (profession)
      list = list.filter((t) =>
        t.profession?.toLowerCase().includes(profession.toLowerCase()),
      );
    if (location)
      list = list.filter((t) =>
        t.location?.toLowerCase().includes(location.toLowerCase()),
      );
    if (verifiedOnly) list = list.filter((t) => t.verified === true);
    if (expRange) {
      list = list.filter((t) => {
        const y = Number(t.years_of_experience ?? 0);
        if (expRange === "0-2") return y <= 2;
        if (expRange === "3-5") return y >= 3 && y <= 5;
        if (expRange === "6-10") return y >= 6 && y <= 10;
        if (expRange === "10+") return y > 10;
        return true;
      });
    }
    if (sort === "experience")
      list.sort(
        (a, b) => (b.years_of_experience ?? 0) - (a.years_of_experience ?? 0),
      );
    if (sort === "name")
      list.sort((a, b) => (a.full_name ?? "").localeCompare(b.full_name ?? ""));

    return list;
  }, [allTalents, search, profession, location, verifiedOnly, expRange, sort]);

  function clearFilters() {
    setSearch("");
    setProfession("");
    setLocation("");
    setExpRange("");
    setVerifiedOnly(false);
    setSort("newest");
  }

  const activeFilterCount = [
    profession,
    location,
    expRange,
    verifiedOnly ? "v" : "",
  ].filter(Boolean).length;

  return (
    <div className={styles.page}>
      {/* ── Hero ──────────────────────────────────────────────────────────── */}
      <div className={styles.hero}>
        <div className={styles.heroInner}>
          <p className={styles.heroEyebrow}>Healthcare Professionals</p>
          <h1 className={styles.heroTitle}>Find the Right Talent</h1>
          <p className={styles.heroSub}>
            Browse {allTalents.length > 0 ? allTalents.length + "+" : ""}{" "}
            verified healthcare professionals across Nigeria
          </p>
          <div className={styles.searchWrap}>
            <span className={styles.searchIcon}>🔍</span>
            <input
              type="text"
              className={styles.searchInput}
              placeholder="Search by name, profession, specialisation…"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
            {search && (
              <button
                className={styles.clearSearch}
                onClick={() => setSearch("")}
              >
                ✕
              </button>
            )}
          </div>
        </div>
      </div>

      <div className={styles.body}>
        {/* ── Sidebar filters ───────────────────────────────────────────── */}
        <aside className={styles.sidebar}>
          <div className={styles.sidebarHead}>
            <h3>
              Filters{" "}
              {activeFilterCount > 0 && (
                <span className={styles.filterCount}>{activeFilterCount}</span>
              )}
            </h3>
            {activeFilterCount > 0 && (
              <button className={styles.clearBtn} onClick={clearFilters}>
                Clear all
              </button>
            )}
          </div>

          <div className={styles.filterSection}>
            <label className={styles.filterLabel}>Profession</label>
            <select
              className={styles.filterSelect}
              value={profession}
              onChange={(e) => setProfession(e.target.value)}
            >
              <option value="">All Professions</option>
              {PROFESSIONS.map((p) => (
                <option key={p} value={p}>
                  {p}
                </option>
              ))}
            </select>
          </div>

          <div className={styles.filterSection}>
            <label className={styles.filterLabel}>State</label>
            <select
              className={styles.filterSelect}
              value={location}
              onChange={(e) => setLocation(e.target.value)}
            >
              <option value="">All States</option>
              {NIGERIAN_STATES.map((s) => (
                <option key={s} value={s}>
                  {s}
                </option>
              ))}
            </select>
          </div>

          <div className={styles.filterSection}>
            <label className={styles.filterLabel}>Experience</label>
            <select
              className={styles.filterSelect}
              value={expRange}
              onChange={(e) => setExpRange(e.target.value)}
            >
              <option value="">Any Level</option>
              <option value="0-2">0 – 2 years</option>
              <option value="3-5">3 – 5 years</option>
              <option value="6-10">6 – 10 years</option>
              <option value="10+">10+ years</option>
            </select>
          </div>

          <div className={styles.filterSection}>
            <label className={styles.toggleLabel}>
              <div
                className={`${styles.toggle} ${verifiedOnly ? styles.toggleOn : ""}`}
                onClick={() => setVerifiedOnly((v) => !v)}
              >
                <div className={styles.toggleThumb} />
              </div>
              <span>Verified only</span>
            </label>
          </div>

          <div className={styles.verifiedInfo}>
            <span className={styles.verifiedDot} />
            Verified professionals have been background-checked by StaffMedix
          </div>
        </aside>

        {/* ── Results ───────────────────────────────────────────────────── */}
        <main className={styles.results}>
          <div className={styles.resultsBar}>
            <p className={styles.resultCount}>
              {isLoading
                ? "Loading…"
                : `${filtered.length} professional${filtered.length !== 1 ? "s" : ""} found`}
            </p>
            <select
              className={styles.sortSelect}
              value={sort}
              onChange={(e) => setSort(e.target.value)}
            >
              <option value="newest">Sort: Newest</option>
              <option value="experience">Sort: Most Experienced</option>
              <option value="name">Sort: Name A–Z</option>
            </select>
          </div>

          {isLoading ? (
            <div className={styles.stateWrap}>
              <div className={styles.spinner} />
              <p>Finding professionals…</p>
            </div>
          ) : isError ? (
            <div className={styles.stateWrap}>
              <span style={{ fontSize: "2.5rem" }}>⚠️</span>
              <p>Failed to load talents. Please try again.</p>
            </div>
          ) : filtered.length === 0 ? (
            <div className={styles.stateWrap}>
              <span style={{ fontSize: "2.5rem" }}>🔍</span>
              <p>No professionals match your filters.</p>
              <button className={styles.clearBtn2} onClick={clearFilters}>
                Clear filters
              </button>
            </div>
          ) : (
            <div className={styles.grid}>
              {filtered.map((talent) => (
                <TalentCard key={talent.id} talent={talent} />
              ))}
            </div>
          )}
        </main>
      </div>
    </div>
  );
}

function TalentCard({ talent }) {
  const verified = talent.verified === true;
  const name = talent.full_name ?? "Healthcare Professional";
  const initials = getInitials(name);

  return (
    <div className={`${styles.card} ${verified ? styles.cardVerified : ""}`}>
      {/* Verified ribbon */}
      {verified && <div className={styles.verifiedRibbon}>✓ Verified</div>}

      <div className={styles.cardTop}>
        {/* Avatar */}
        <div className={styles.avatarWrap}>
          {talent.profile_image ? (
            <img
              src={talent.profile_image}
              alt={name}
              className={styles.avatar}
            />
          ) : (
            <div className={styles.avatarInitials}>{initials}</div>
          )}
          <div
            className={`${styles.statusDot} ${verified ? styles.statusGreen : styles.statusGrey}`}
          />
        </div>

        {/* Name + role */}
        <div className={styles.cardIdentity}>
          <h3 className={styles.cardName}>{name}</h3>
          <p className={styles.cardProfession}>
            {talent.profession ?? "Healthcare Professional"}
          </p>
          {talent.specialization && (
            <p className={styles.cardSpecialization}>{talent.specialization}</p>
          )}
        </div>
      </div>

      {/* Verification status bar */}
      <div
        className={`${styles.verificationBar} ${verified ? styles.verificationBarVerified : styles.verificationBarPending}`}
      >
        {verified ? (
          <>
            <span>✓</span> Identity & credentials verified
          </>
        ) : (
          <>
            <span>○</span> Verification pending
          </>
        )}
      </div>

      {/* Details */}
      <div className={styles.cardMeta}>
        {talent.years_of_experience != null && (
          <div className={styles.metaItem}>
            <span className={styles.metaIcon}>💼</span>
            <span>
              {talent.years_of_experience} yr
              {talent.years_of_experience !== 1 ? "s" : ""} experience
            </span>
          </div>
        )}
        {talent.location && (
          <div className={styles.metaItem}>
            <span className={styles.metaIcon}>📍</span>
            <span>{talent.location}</span>
          </div>
        )}
        {talent.license_number && (
          <div className={styles.metaItem}>
            <span className={styles.metaIcon}>🪪</span>
            <span>Licensed professional</span>
          </div>
        )}
      </div>

      {/* Bio excerpt */}
      {talent.biography && (
        <p className={styles.cardBio}>
          {talent.biography.length > 120
            ? talent.biography.slice(0, 120) + "…"
            : talent.biography}
        </p>
      )}

      {/* Actions */}
      <div className={styles.cardActions}>
        <Link to={`/talent/${talent.id}`} className={styles.viewBtn}>
          View Profile
        </Link>
        <Link to="/auth" className={styles.msgBtn}>
          💬 Message
        </Link>
      </div>
    </div>
  );
}
