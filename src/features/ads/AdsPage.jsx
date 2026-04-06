import { useState, useEffect, useRef } from "react";
import { Link } from "react-router";
import styles from "./AdsPage.module.css";
import { useGetAdsQuery, useGetAdImagesQuery } from "../../services/adsApi";
import {
  useGetCompanyProfilesQuery,
} from "../../services/employerApi";
import {
  useGetSubscriptionsQuery,
  useGetPlansQuery,
} from "../../services/subscriptionApi";

const ADS_PER_PAGE = 6;
const ORGS_PER_PAGE = 12;

// ── Ad carousel (images) for a single ad ─────────────────────────────────────
function AdCarousel({ ad }) {
  const { data: imagesData } = useGetAdImagesQuery({ ad: ad.id });
  const images = imagesData?.results ?? imagesData ?? [];
  const [idx, setIdx] = useState(0);

  useEffect(() => {
    if (images.length <= 1) return;
    const t = setInterval(() => setIdx((i) => (i + 1) % images.length), 4000);
    return () => clearInterval(t);
  }, [images.length]);

  const isExpired = ad.expired_at && new Date(ad.expired_at) < new Date();
  if (isExpired) return null;

  return (
    <div className={styles.adCard}>
      {/* Image / placeholder */}
      <div className={styles.adImageWrap}>
        {images.length > 0 ? (
          <>
            <img
              key={idx}
              src={images[idx]?.image}
              alt={ad.title}
              className={styles.adImage}
            />
            {images.length > 1 && (
              <>
                <div className={styles.adDots}>
                  {images.map((_, i) => (
                    <button
                      key={i}
                      className={`${styles.adDot} ${i === idx ? styles.adDotActive : ""}`}
                      onClick={() => setIdx(i)}
                    />
                  ))}
                </div>
                <button className={styles.adPrev} onClick={() => setIdx((i) => (i - 1 + images.length) % images.length)}>‹</button>
                <button className={styles.adNext} onClick={() => setIdx((i) => (i + 1) % images.length)}>›</button>
              </>
            )}
          </>
        ) : (
          <div className={styles.adImagePlaceholder}>
            <span>🏥</span>
          </div>
        )}
        <span className={styles.adBadge}>Ad</span>
      </div>

      {/* Content */}
      <div className={styles.adBody}>
        <h3 className={styles.adTitle}>{ad.title}</h3>
        {ad.description && (
          <p className={styles.adDesc}>
            {ad.description.length > 120 ? ad.description.slice(0, 120) + "…" : ad.description}
          </p>
        )}
        {ad.expired_at && (
          <p className={styles.adExpiry}>
            Until {new Date(ad.expired_at).toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" })}
          </p>
        )}
        <Link to={`/ads/${ad.id}`} className={styles.adCta}>Learn More →</Link>
      </div>
    </div>
  );
}

// ── Organisation card ─────────────────────────────────────────────────────────
function OrgCard({ org }) {
  const name = org.company_name ?? "Healthcare Organisation";
  const initials = name.split(" ").map((w) => w[0]).slice(0, 2).join("").toUpperCase();

  return (
    <Link to={`/employers/${org.id}`} className={styles.orgCard}>
      <div className={styles.orgLogoWrap}>
        {org.logo ? (
          <img src={org.logo} alt={name} className={styles.orgLogo} />
        ) : (
          <div className={styles.orgLogoInitials}>{initials}</div>
        )}
      </div>
      <div className={styles.orgCardBody}>
        <h3 className={styles.orgName}>{name}</h3>
        {org.organization_type && (
          <p className={styles.orgType}>{org.organization_type}</p>
        )}
        {org.description && (
          <p className={styles.orgDesc}>
            {org.description.length > 90 ? org.description.slice(0, 90) + "…" : org.description}
          </p>
        )}
        <div className={styles.orgMeta}>
          {org.size > 0 && <span className={styles.orgChip}>👥 {org.size}+ staff</span>}
          {org.website && <span className={styles.orgChip}>🌐 Website</span>}
          {org.verified && <span className={`${styles.orgChip} ${styles.orgChipGreen}`}>✓ Verified</span>}
        </div>
      </div>
      <span className={styles.orgArrow}>→</span>
    </Link>
  );
}

// ── Main page ─────────────────────────────────────────────────────────────────
export default function AdsPage() {
  const [adPage, setAdPage]   = useState(1);
  const [orgPage, setOrgPage] = useState(1);
  const orgsRef = useRef(null);

  // Fetch all active ads (no company filter = all)
  const { data: adsData, isLoading: loadingAds } = useGetAdsQuery({});
  const allAds = (adsData?.results ?? adsData ?? []).filter(
    (a) => a.active && (!a.expired_at || new Date(a.expired_at) > new Date())
  );

  // Ads pagination
  const adTotalPages = Math.ceil(allAds.length / ADS_PER_PAGE);
  const paginatedAds = allAds.slice((adPage - 1) * ADS_PER_PAGE, adPage * ADS_PER_PAGE);

  // Fetch all plans to identify pro/enterprise
  const { data: plansData } = useGetPlansQuery();
  const plans = plansData?.results ?? plansData ?? [];

  const premiumPlanIds = new Set(
    plans
      .filter((p) => {
        const t = (p.type ?? p.name ?? "").toLowerCase();
        return t.includes("pro") || t.includes("enterprise");
      })
      .map((p) => p.id)
  );

  // Fetch all subscriptions (no filter = all active)
  const { data: subsData } = useGetSubscriptionsQuery({});
  const subs = subsData?.results ?? subsData ?? [];
  const premiumCompanyIds = new Set(
    subs
      .filter((s) => {
        const planId = s.plan?.id ?? s.plan;
        const isActive = !s.end_date || new Date(s.end_date) > new Date();
        return premiumPlanIds.has(planId) && isActive;
      })
      .map((s) => s.company?.id ?? s.company)
  );

  // Fetch company profiles — only verified ones
  const { data: orgsData, isLoading: loadingOrgs } = useGetCompanyProfilesQuery({
    limit: 200,
    verified: true,
  });
  // Exclude rejected organisations from public display
  const rawOrgs = (orgsData?.results ?? orgsData ?? []).filter(
    o => o.rejected !== true && o.rejected !== 1
  );
  // If subscriptions loaded but none are premium, still show verified orgs
  // (graceful fallback so page isn't empty during early setup)
  const allOrgs = premiumCompanyIds.size > 0
    ? rawOrgs.filter((o) => premiumCompanyIds.has(o.id))
    : rawOrgs;

  // Orgs pagination
  const orgTotalPages = Math.ceil(allOrgs.length / ORGS_PER_PAGE);
  const paginatedOrgs = allOrgs.slice((orgPage - 1) * ORGS_PER_PAGE, orgPage * ORGS_PER_PAGE);

  function changeAdPage(p) { setAdPage(p); window.scrollTo({ top: 0, behavior: "smooth" }); }
  function changeOrgPage(p) {
    setOrgPage(p);
    orgsRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
  }

  return (
    <div className={styles.page}>

      {/* ── Hero ────────────────────────────────────────────────────────── */}
      <div className={styles.hero}>
        <div className={styles.heroInner}>
          <p className={styles.eyebrow}>Featured Organisations & Opportunities</p>
          <h1 className={styles.heroTitle}>Healthcare in Nigeria,<br />Reimagined</h1>
          <p className={styles.heroSub}>Discover top employers, open roles, and exclusive offers from Nigeria's leading healthcare institutions</p>
        </div>
      </div>

      {/* ── Ads section ─────────────────────────────────────────────────── */}
      {(loadingAds || allAds.length > 0) && (
        <section className={styles.adsSection}>
          <div className={styles.sectionHead}>
            <h2 className={styles.sectionTitle}>
              <span className={styles.sectionPill}>Sponsored</span>
              Latest Opportunities & Announcements
            </h2>
            <p className={styles.sectionSub}>Curated ads from verified healthcare organisations</p>
          </div>

          {loadingAds ? (
            <div className={styles.loadingWrap}><div className={styles.spinner} /></div>
          ) : (
            <>
              <div className={styles.adsGrid}>
                {paginatedAds.map((ad) => <AdCarousel key={ad.id} ad={ad} />)}
              </div>
              {adTotalPages > 1 && (
                <Pagination current={adPage} total={adTotalPages} onChange={changeAdPage} />
              )}
            </>
          )}
        </section>
      )}

      {/* ── Organisations section ────────────────────────────────────────── */}
      <section className={styles.orgsSection} ref={orgsRef}>
        <div className={styles.sectionHead}>
          <h2 className={styles.sectionTitle}>
            <span className={styles.sectionPillGreen}>Pro & Enterprise</span>
            Featured Healthcare Organisations
          </h2>
          <p className={styles.sectionSub}>
            Organisations on Pro and Enterprise plans — click any to explore their jobs and details
          </p>
        </div>

        {loadingOrgs ? (
          <div className={styles.loadingWrap}><div className={styles.spinner} /></div>
        ) : allOrgs.length === 0 ? (
          <div className={styles.emptyState}>
            <span>🏥</span>
            <p>No featured organisations yet.</p>
          </div>
        ) : (
          <>
            <div className={styles.orgsGrid}>
              {paginatedOrgs.map((org) => <OrgCard key={org.id} org={org} />)}
            </div>
            {orgTotalPages > 1 && (
              <Pagination current={orgPage} total={orgTotalPages} onChange={changeOrgPage} />
            )}
            <p className={styles.orgCount}>
              Showing {(orgPage - 1) * ORGS_PER_PAGE + 1}–{Math.min(orgPage * ORGS_PER_PAGE, allOrgs.length)} of {allOrgs.length} organisations
            </p>
          </>
        )}
      </section>

      {/* ── CTA ─────────────────────────────────────────────────────────── */}
      <section className={styles.cta}>
        <div className={styles.ctaInner}>
          <h2>Want Your Organisation Featured Here?</h2>
          <p>Upgrade to Pro or Enterprise to reach thousands of qualified healthcare professionals</p>
          <Link to="/pricing" className={styles.ctaBtn}>View Plans →</Link>
        </div>
      </section>
    </div>
  );
}

// ── Reusable pagination ───────────────────────────────────────────────────────
function Pagination({ current, total, onChange }) {
  const pages = Array.from({ length: total }, (_, i) => i + 1)
    .filter((p) => p === 1 || p === total || Math.abs(p - current) <= 1)
    .reduce((acc, p, i, arr) => {
      if (i > 0 && p - arr[i - 1] > 1) acc.push("…");
      acc.push(p);
      return acc;
    }, []);

  return (
    <div className={styles.pagination}>
      <button className={styles.pageBtn} onClick={() => onChange(current - 1)} disabled={current === 1}>← Prev</button>
      <div className={styles.pageNums}>
        {pages.map((p, i) =>
          p === "…"
            ? <span key={`e${i}`} className={styles.ellipsis}>…</span>
            : <button key={p} className={`${styles.pageNum} ${p === current ? styles.pageNumActive : ""}`} onClick={() => onChange(p)}>{p}</button>
        )}
      </div>
      <button className={styles.pageBtn} onClick={() => onChange(current + 1)} disabled={current === total}>Next →</button>
    </div>
  );
}