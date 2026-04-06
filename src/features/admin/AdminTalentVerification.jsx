import { useState } from "react";
import styles from "./AdminTalentVerification.module.css";
import {
  useGetTalentsQuery,
  useUpdateTalentProfileMutation,
  useGetTalentProfileQuery,
} from "../../services/talentApi";
import { useSendNotificationMutation } from "../../services/notificationApi";

function getInitial(t) {
  return (t?.full_name?.[0] || t?.user?.username?.[0] || "T").toUpperCase();
}

function completionScore(t, work, edu, skills, creds) {
  const checks = [
    !!t.full_name, !!t.profession, !!t.location, !!t.license_number,
    !!t.phone_number, !!t.biography, !!t.specialization,
    (work?.length  ?? 0) > 0,
    (edu?.length   ?? 0) > 0,
    (skills?.length ?? 0) > 0,
    (creds?.length ?? 0) > 0,
  ];
  return Math.round((checks.filter(Boolean).length / checks.length) * 100);
}

// ── Detail panel ──────────────────────────────────────────────────────────
function TalentDetail({ talent, onClose, onVerify, onReject, onQuery, loadingAction }) {
  const { data: merged = talent, isFetching: subLoading } = useGetTalentProfileQuery(talent.id, {
    refetchOnMountOrArgChange: true,
  });

  const [queryMsg, setQueryMsg]         = useState("");
  const [showQueryBox, setShowQueryBox] = useState(false);

  const workList  = merged?.work_experience ?? [];
  const eduList   = merged?.education       ?? [];
  const skillList = merged?.skill           ?? [];
  const credList  = merged?.credentials     ?? [];

  const score      = completionScore(merged, workList, eduList, skillList, credList);
  const scoreColor = score >= 80 ? "#0d9269" : score >= 50 ? "#f59e0b" : "#ef4444";

  const missing = [];
  if (!merged.full_name)       missing.push("Full name");
  if (!merged.profession)      missing.push("Profession");
  if (!merged.location)        missing.push("Location");
  if (!merged.license_number)  missing.push("License number");
  if (!merged.phone_number)    missing.push("Phone number");
  if (!merged.biography)       missing.push("Biography");
  if (!merged.specialization)  missing.push("Specialization");
  if (!workList.length)        missing.push("Work experience");
  if (!eduList.length)         missing.push("Education history");
  if (!skillList.length)       missing.push("Skills");
  if (!credList.length)        missing.push("Credentials / documents");

  const defaultQuery = missing.length
    ? `Hi ${merged.full_name ?? "there"},\n\nYour profile is ${score}% complete. To be verified on StaffMedix, please complete the following:\n\n${missing.map(m => `• ${m}`).join("\n")}\n\nOnce these are added, we'll review your profile for verification.\n\nThe StaffMedix Admin Team`
    : `Hi ${merged.full_name ?? "there"},\n\nYour profile looks great! We're currently reviewing your credentials and will get back to you shortly.\n\nThe StaffMedix Admin Team`;

  return (
    <div className={styles.overlay} onClick={onClose}>
      <div className={styles.panel} onClick={e => e.stopPropagation()}>

        {/* Panel header */}
        <div className={styles.panelHead}>
          <div className={styles.panelAvatar}>{getInitial(talent)}</div>
          <div className={styles.panelHeadInfo}>
            <h2>{merged.full_name || merged.user?.username || talent.user?.username || "Unknown"}</h2>
            <p>{merged.profession || "No profession set"} {merged.specialization ? `· ${merged.specialization}` : ""}</p>
            <span className={`${styles.verBadge} ${merged.verified ? styles.verified : merged.rejected ? styles.rejected : styles.unverified}`}>
              {merged.verified ? "✓ Verified" : merged.rejected ? "✗ Rejected" : "⏳ Pending"}
            </span>
          </div>
          <div style={{display:'flex', gap:'0.5rem', alignItems:'center'}}>
            <a href={`/talents/${talent.id}`} target="_blank" rel="noopener noreferrer"
              className={styles.viewFileBtn} title="Open full profile page">
              ↗ Full Profile
            </a>
            <button className={styles.closeBtn} onClick={onClose}>✕</button>
          </div>
        </div>

        {/* Completion bar */}
        <div className={styles.completionWrap}>
          <div className={styles.completionLabelRow}>
            <span>Profile completion</span>
            <span style={{ color: scoreColor, fontWeight: 700 }}>{score}%</span>
          </div>
          <div className={styles.completionBar}>
            <div className={styles.completionFill} style={{ width: `${score}%`, background: scoreColor }} />
          </div>
          {missing.length > 0 && (
            <p className={styles.missingNote}>Missing: {missing.join(", ")}</p>
          )}
        </div>

        {/* Info grid */}
        <div className={styles.infoGrid}>
          <div className={styles.infoBlock}><span className={styles.infoLabel}>📧 Email</span><span className={styles.infoVal}>{merged.email || merged.user?.email || "—"}</span></div>
          <div className={styles.infoBlock}><span className={styles.infoLabel}>📞 Phone</span><span className={styles.infoVal}>{merged.phone_number || "—"}</span></div>
          <div className={styles.infoBlock}><span className={styles.infoLabel}>📍 Location</span><span className={styles.infoVal}>{merged.location || "—"}</span></div>
          <div className={styles.infoBlock}><span className={styles.infoLabel}>🪪 License No.</span><span className={styles.infoVal}>{merged.license_number || "—"}</span></div>
          <div className={styles.infoBlock}><span className={styles.infoLabel}>⏱ Experience</span><span className={styles.infoVal}>{merged.years_of_experience != null ? `${merged.years_of_experience} yrs` : "—"}</span></div>
          <div className={styles.infoBlock}><span className={styles.infoLabel}>🎯 Specialization</span><span className={styles.infoVal}>{merged.specialization || "—"}</span></div>
        </div>

        {/* Bio */}
        {merged.biography && (
          <div className={styles.bioWrap}>
            <span className={styles.sectionTitle}>Biography</span>
            <p className={styles.bioText}>{merged.biography}</p>
          </div>
        )}

        {/* Work experience */}
        <div className={styles.section}>
          <span className={styles.sectionTitle}>Work Experience ({subLoading ? "…" : workList.length})</span>
          {subLoading ? <p className={styles.empty}>Loading…</p>
            : workList.length === 0 ? <p className={styles.empty}>No work experience added</p>
            : workList.map(w => (
              <div key={w.id} className={styles.listItem}>
                <span className={styles.listMain}>{w.job_title} · {w.facility}</span>
                <span className={styles.listSub}>{w.start_date} → {w.end_date || "Present"}{w.description && ` · ${w.description}`}</span>
              </div>
            ))}
        </div>

        {/* Education */}
        <div className={styles.section}>
          <span className={styles.sectionTitle}>Education ({subLoading ? "…" : eduList.length})</span>
          {subLoading ? <p className={styles.empty}>Loading…</p>
            : eduList.length === 0 ? <p className={styles.empty}>No education added</p>
            : eduList.map(e => (
              <div key={e.id} className={styles.listItem}>
                <span className={styles.listMain}>{e.degree} · {e.institution}</span>
                <span className={styles.listSub}>{e.year}</span>
              </div>
            ))}
        </div>

        {/* Skills */}
        <div className={styles.section}>
          <span className={styles.sectionTitle}>Skills ({subLoading ? "…" : skillList.length})</span>
          {subLoading ? <p className={styles.empty}>Loading…</p>
            : skillList.length === 0 ? <p className={styles.empty}>No skills added</p>
            : <div className={styles.skillPills}>{skillList.map(s => <span key={s.id} className={styles.skillPill}>{s.name}</span>)}</div>}
        </div>

        {/* Credentials */}
        <div className={styles.section}>
          <span className={styles.sectionTitle}>Credentials ({subLoading ? "…" : credList.length})</span>
          {subLoading ? <p className={styles.empty}>Loading…</p>
            : credList.length === 0 ? <p className={styles.empty}>No credentials uploaded</p>
            : credList.map(c => (
              <div key={c.id} className={styles.credRow}>
                <div>
                  <span className={styles.listMain}>{c.type || "Document"}</span>
                  <span className={styles.listSub}>Uploaded: {c.upload_date || "—"}</span>
                </div>
                {c.file && <a href={c.file} target="_blank" rel="noopener noreferrer" className={styles.viewFileBtn}>View file ↗</a>}
              </div>
            ))}
        </div>

        {/* Query box */}
        {showQueryBox && (
          <div className={styles.queryBox}>
            <span className={styles.sectionTitle}>📨 Message to Talent</span>
            <textarea className={styles.queryTextarea} value={queryMsg || defaultQuery}
              onChange={e => setQueryMsg(e.target.value)} rows={9} />
            <div className={styles.queryActions}>
              <button className={styles.cancelQueryBtn} onClick={() => setShowQueryBox(false)}>Cancel</button>
              <button className={styles.sendQueryBtn} disabled={loadingAction}
                onClick={() => onQuery(talent, queryMsg || defaultQuery)}>
                {loadingAction ? "Sending…" : "Send Message"}
              </button>
            </div>
          </div>
        )}

        {/* Action footer */}
        <div className={styles.panelFooter}>
          <button className={styles.queryBtn} onClick={() => { setQueryMsg(defaultQuery); setShowQueryBox(v => !v); }}>
            📨 Query Talent
          </button>
          {!talent.verified ? (
            <>
              <button className={styles.rejectBtn} disabled={loadingAction} onClick={() => onReject(talent.id)}>
                {loadingAction ? "…" : "✗ Reject"}
              </button>
              <button className={styles.verifyBtn} disabled={loadingAction} onClick={() => onVerify(talent.id)}>
                {loadingAction ? "…" : "✓ Verify"}
              </button>
            </>
          ) : (
            <button className={styles.revokeBtn} disabled={loadingAction} onClick={() => onReject(talent.id)}>
              {loadingAction ? "…" : "Revoke Verification"}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

// ── Main page ─────────────────────────────────────────────────────────────
export default function AdminTalentVerification() {
  const [filter, setFilter]       = useState("unverified");
  const [search, setSearch]       = useState("");
  const [selected, setSelected]   = useState(null);
  const [loadingId, setLoadingId] = useState(null);
  const [toast, setToast]         = useState(null);

  const { data: talentsData, isLoading, refetch } = useGetTalentsQuery({ limit: 1000 });
  const [updateTalent]     = useUpdateTalentProfileMutation();
  const [sendNotification] = useSendNotificationMutation();

  const allTalents = (talentsData?.results ?? talentsData ?? []).map(t => ({
    ...t,
    verified: t.verified === true || t.verified === 1,
    rejected: t.rejected === true || t.rejected === 1,
  }));

  // Log raw API shape on first load to debug field names
  if (allTalents.length > 0 && !window.__talentLogDone) {
    window.__talentLogDone = true;
    const s = allTalents[0];
  }

  const filtered = allTalents.filter(t => {
    const matchesFilter =
      filter === "all"      ? true :
      filter === "verified" ? t.verified === true :
      filter === "rejected" ? t.rejected === true :
                              !t.verified && !t.rejected;
    const q = search.toLowerCase();
    const matchesSearch = !q ||
      t.full_name?.toLowerCase().includes(q) ||
      t.profession?.toLowerCase().includes(q) ||
      t.location?.toLowerCase().includes(q) ||
      t.license_number?.toLowerCase().includes(q) ||
      t.email?.toLowerCase().includes(q) ||
      t.user?.email?.toLowerCase().includes(q);
    return matchesFilter && matchesSearch;
  });

  const counts = {
    unverified: allTalents.filter(t => !t.verified && !t.rejected).length,
    verified:   allTalents.filter(t =>  t.verified).length,
    rejected:   allTalents.filter(t =>  t.rejected).length,
    all:        allTalents.length,
  };

  function showToast(msg, type = "success") {
    setToast({ msg, type });
    setTimeout(() => setToast(null), 3500);
  }

  async function handleVerify(talentId) {
    const payload = { talentId, data: { verified: true, rejected: false } };
    setLoadingId(talentId);
    try {
      const result = await updateTalent(payload).unwrap();
      showToast("Talent verified successfully");
      setSelected(prev => prev?.id === talentId ? { ...prev, verified: true, rejected: false } : prev);
      refetch();
    } catch (err) {
      showToast("Failed to verify talent", "error");
    } finally { setLoadingId(null); }
  }

  async function handleReject(talentId) {
    const payload = { talentId, data: { verified: false, rejected: true } };
    setLoadingId(talentId);
    try {
      const result = await updateTalent(payload).unwrap();
      showToast("Talent rejected");
      setSelected(prev => prev?.id === talentId ? { ...prev, verified: false, rejected: true } : prev);
      refetch();
    } catch (err) {
      showToast("Failed to update talent", "error");
    } finally { setLoadingId(null); }
  }

  async function handleQuery(talent, message) {
    setLoadingId(talent.id);
    try {
      const userId =
        talent.user_id ??
        (typeof talent.user === "object" ? talent.user?.id : talent.user) ??
        null;


      if (!userId) {
        showToast("Cannot resolve user ID — check serializer.", "error");
        return;
      }

      await sendNotification({
        userId,
        subject: "Action Required: Complete your StaffMedix profile",
        content: message,
      }).unwrap();
      showToast("Message sent to talent");
    } catch (err) {
      showToast("Failed to send message", "error");
    } finally {
      setLoadingId(null);
    }
  }

  return (
    <div className={styles.page}>

      {toast && <div className={`${styles.toast} ${styles[toast.type]}`}>{toast.msg}</div>}

      <div className={styles.header}>
        <div>
          <h1>Talent Verification</h1>
          <p>Review profiles and verify healthcare professionals</p>
        </div>
      </div>

      <div className={styles.statsRow}>
        <div className={styles.statCard}>
          <span className={styles.statNum}>{isLoading ? "—" : counts.unverified}</span>
          <span className={styles.statLabel}>Pending</span>
        </div>
        <div className={`${styles.statCard} ${styles.statGreen}`}>
          <span className={styles.statNum}>{isLoading ? "—" : counts.verified}</span>
          <span className={styles.statLabel}>Verified</span>
        </div>
        <div className={`${styles.statCard} ${styles.statBlue}`}>
          <span className={styles.statNum}>{isLoading ? "—" : counts.all}</span>
          <span className={styles.statLabel}>Total Talents</span>
        </div>
      </div>

      <div className={styles.controls}>
        <div className={styles.filterTabs}>
          {[
            { key: "unverified", label: "Pending",  count: counts.unverified },
            { key: "verified",   label: "Verified", count: counts.verified },
            { key: "rejected",   label: "Rejected", count: counts.rejected },
            { key: "all",        label: "All",      count: counts.all },
          ].map(tab => (
            <button
              key={tab.key}
              className={`${styles.tab} ${filter === tab.key ? styles.activeTab : ""}`}
              onClick={() => setFilter(tab.key)}
            >
              {tab.label} <span className={styles.tabCount}>{tab.count}</span>
            </button>
          ))}
        </div>
        <input
          className={styles.search}
          placeholder="Search by name, profession, email…"
          value={search}
          onChange={e => setSearch(e.target.value)}
        />
      </div>

      {isLoading ? (
        <div className={styles.loadingGrid}>
          {[...Array(4)].map((_, i) => <div key={i} className={styles.shimmerCard} />)}
        </div>
      ) : filtered.length === 0 ? (
        <div className={styles.emptyState}>
          <span>🔍</span>
          <p>No talents found{search ? ` matching "${search}"` : ""}</p>
        </div>
      ) : (
        <div className={styles.grid}>
          {filtered.map(t => {
            const score      = completionScore(t, [], [], [], []);
            const scoreColor = score >= 80 ? "#0d9269" : score >= 50 ? "#f59e0b" : "#ef4444";
            return (
              <div key={t.id} className={styles.card} onClick={() => setSelected(t)}>
                <div className={styles.cardTop}>
                  <div className={styles.avatar}>{getInitial(t)}</div>
                  <div className={styles.cardInfo}>
                    <h3>{t.full_name || t.user?.username || "—"}</h3>
                    <p>{t.profession || "No profession"}{t.specialization ? ` · ${t.specialization}` : ""}</p>
                    <span className={styles.location}>📍 {t.location || "No location"}</span>
                  </div>
                  <span className={`${styles.badge} ${t.verified ? styles.verified : t.rejected ? styles.rejected : styles.unverified}`}>
                    {t.verified ? "Verified" : t.rejected ? "Rejected" : "Pending"}
                  </span>
                </div>

                <div className={styles.cardMeta}>
                  <span>🪪 {t.license_number || "No license"}</span>
                  <span>⏱ {t.years_of_experience != null ? `${t.years_of_experience} yrs exp` : "Exp N/A"}</span>
                </div>

                <div className={styles.miniBar}>
                  <div className={styles.miniBarTrack}>
                    <div className={styles.miniBarFill} style={{ width: `${score}%`, background: scoreColor }} />
                  </div>
                  <span style={{ color: scoreColor }}>{score}%</span>
                </div>

                <div className={styles.cardFooter}>
                  <button className={styles.detailBtn}
                    onClick={e => { e.stopPropagation(); setSelected(t); }}>
                    View Profile
                  </button>
                  {!t.verified ? (
                    <button className={styles.quickVerifyBtn} disabled={loadingId === t.id}
                      onClick={e => { e.stopPropagation(); handleVerify(t.id); }}>
                      {loadingId === t.id ? "…" : "✓ Verify"}
                    </button>
                  ) : (
                    <button className={styles.quickRevokeBtn} disabled={loadingId === t.id}
                      onClick={e => { e.stopPropagation(); handleReject(t.id); }}>
                      Revoke
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}

      {selected && (
        <TalentDetail
          key={selected.id}
          talent={selected}
          onClose={() => setSelected(null)}
          onVerify={handleVerify}
          onReject={handleReject}
          onQuery={handleQuery}
          loadingAction={loadingId === selected.id}
        />
      )}
    </div>
  );
}