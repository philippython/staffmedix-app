import { useState } from "react";
import styles from "./AdminMonetization.module.css";
import {
  useGetSubscriptionsQuery,
  useGetPlansQuery,
  useCancelSubscriptionMutation,
  useDeleteSubscriptionMutation,
  useUpdateSubscriptionMutation,
} from "../../services/subscriptionApi";
import {
  useGetAdsQuery,
  useToggleAdMutation,
  useDeleteAdMutation,
} from "../../services/adsApi";

// ── Helpers ───────────────────────────────────────────────────────────────
function fmt(n) {
  if (n == null || isNaN(n)) return "₦0";
  return n >= 1_000_000 ? `₦${(n / 1_000_000).toFixed(1)}M`
    : n >= 1_000 ? `₦${(n / 1_000).toFixed(1)}K`
    : `₦${Number(n).toLocaleString()}`;
}
function fmtDate(d) {
  if (!d) return "—";
  try { return new Date(d).toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" }); }
  catch { return d; }
}
function daysLeft(date) {
  if (!date) return null;
  return Math.ceil((new Date(date) - Date.now()) / 86400000);
}
function subIsActive(s) {
  if (s.active === false) return false;
  if (s.expiry_date && new Date(s.expiry_date) < new Date()) return false;
  return true;
}
function adStatus(a) {
  if (a.active === false) return "inactive";
  const now = new Date();
  if (a.expired_at && new Date(a.expired_at) < now) return "expired";
  if (a.created_at && a.expired_at && new Date(a.created_at) > now) return "pending";
  if (a.active) return "active";
  return "pending";
}

const PLAN_COLORS = ["#0d9269","#3b82f6","#f59e0b","#8b5cf6","#ef4444","#ec4899"];
const SUB_PAGE = 12;
const AD_PAGE  = 9;

// ── Small reusable pieces ─────────────────────────────────────────────────
function Shimmer({ w = 56, h = 18 }) {
  return <span className={styles.shimmer} style={{ width: w, height: h }} />;
}

function StatCard({ icon, label, value, loading, accent }) {
  return (
    <div className={`${styles.statCard} ${accent ? styles[`stat_${accent}`] : ""}`}>
      <span className={styles.statIcon}>{icon}</span>
      <div>
        <p className={styles.statVal}>{loading ? <Shimmer /> : value}</p>
        <p className={styles.statLbl}>{label}</p>
      </div>
    </div>
  );
}

function Toast({ t }) {
  if (!t) return null;
  return <div className={`${styles.toast} ${styles[t.type]}`}>{t.msg}</div>;
}

function ConfirmModal({ msg, sub, onOk, onCancel, busy }) {
  return (
    <div className={styles.overlay} onClick={onCancel}>
      <div className={styles.modal} onClick={e => e.stopPropagation()}>
        <h3>{msg}</h3>
        {sub && <p>{sub}</p>}
        <div className={styles.modalFoot}>
          <button className={styles.btnGhost} onClick={onCancel}>Go back</button>
          <button className={styles.btnDanger} disabled={busy} onClick={onOk}>
            {busy ? "Processing…" : "Confirm"}
          </button>
        </div>
      </div>
    </div>
  );
}

function FilterTabs({ tabs, active, onChange }) {
  return (
    <div className={styles.tabs}>
      {tabs.map(t => (
        <button
          key={t.key}
          className={`${styles.tab} ${active === t.key ? styles.tabActive : ""}`}
          onClick={() => onChange(t.key)}
        >
          {t.label}
          {t.count != null && <span className={styles.tabBadge}>{t.count}</span>}
        </button>
      ))}
    </div>
  );
}

function Paginator({ page, total, onChange }) {
  if (total <= 1) return null;
  return (
    <div className={styles.pager}>
      <button className={styles.pgBtn} disabled={page === 1} onClick={() => onChange(page - 1)}>←</button>
      {[...Array(total)].map((_, i) => (
        <button
          key={i}
          className={`${styles.pgBtn} ${page === i + 1 ? styles.pgActive : ""}`}
          onClick={() => onChange(i + 1)}
        >{i + 1}</button>
      ))}
      <button className={styles.pgBtn} disabled={page === total} onClick={() => onChange(page + 1)}>→</button>
    </div>
  );
}

// ── Plans panel ───────────────────────────────────────────────────────────
function PlansPanel({ plans, planCounts, totalSubs, loading }) {
  return (
    <div className={styles.plansGrid}>
      {loading
        ? [...Array(3)].map((_, i) => <div key={i} className={styles.planCardSkel} />)
        : plans.length === 0
        ? <p className={styles.empty}>No plans configured</p>
        : plans.map((plan, i) => {
            const count = planCounts[plan.name ?? plan.type] ?? 0;
            const pct   = totalSubs ? Math.round((count / totalSubs) * 100) : 0;
            const color = PLAN_COLORS[i % PLAN_COLORS.length];
            return (
              <div key={plan.id ?? i} className={styles.planCard} style={{ "--plan-color": color }}>
                <div className={styles.planCardTop}>
                  <span className={styles.planDot} style={{ background: color }} />
                  <h3 className={styles.planName}>{plan.name ?? plan.type ?? "Plan"}</h3>
                  <span className={styles.planSubs}>{count} subscriber{count !== 1 ? "s" : ""}</span>
                </div>
                <p className={styles.planPrice}>
                  {plan.price != null ? fmt(plan.price) : "—"}
                  {plan.duration ? <span className={styles.planDur}> / {plan.duration}</span> : ""}
                </p>
                {plan.description && <p className={styles.planDesc}>{plan.description}</p>}
                <div className={styles.planBarWrap}>
                  <div className={styles.planBarTrack}>
                    <div className={styles.planBarFill} style={{ width: `${pct}%`, background: color }} />
                  </div>
                  <span className={styles.planPct}>{pct}%</span>
                </div>
              </div>
            );
          })}
    </div>
  );
}

// ── Subscriptions tab ─────────────────────────────────────────────────────
function SubscriptionsTab() {
  const [filter, setFilter]   = useState("all");
  const [search, setSearch]   = useState("");
  const [page, setPage]       = useState(1);
  const [confirm, setConfirm] = useState(null);

  const { data: subsRaw,  isLoading: loadSubs  } = useGetSubscriptionsQuery();
  const { data: plansRaw, isLoading: loadPlans } = useGetPlansQuery();
  const [cancelSub, { isLoading: cancelling }]   = useCancelSubscriptionMutation();
  const [deleteSub, { isLoading: deleting }]     = useDeleteSubscriptionMutation();

  const [toast, setToast] = useState(null);
  function toast_(msg, type = "success") {
    setToast({ msg, type });
    setTimeout(() => setToast(null), 3500);
  }

  const allSubs  = subsRaw?.results  ?? subsRaw  ?? [];
  const allPlans = plansRaw?.results ?? plansRaw ?? [];

  const active   = allSubs.filter(subIsActive);
  const inactive = allSubs.filter(s => !subIsActive(s));
  const expiring = active.filter(s => { const d = daysLeft(s.expiry_date); return d != null && d >= 0 && d <= 7; });

  const totalRevenue = allSubs.reduce((sum, s) =>
    sum + parseFloat(s.amount ?? s.price ?? s.plan?.price ?? 0), 0);

  const now = new Date();
  const monthRevenue = allSubs
    .filter(s => { const d = s.start_date ? new Date(s.start_date) : null; return d && d.getMonth() === now.getMonth() && d.getFullYear() === now.getFullYear(); })
    .reduce((sum, s) => sum + parseFloat(s.amount ?? s.price ?? s.plan?.price ?? 0), 0);

  const planCounts = allSubs.reduce((acc, s) => {
    const k = s.plan?.name ?? s.plan?.type ?? s.plan_name ?? "Unknown";
    acc[k] = (acc[k] ?? 0) + 1;
    return acc;
  }, {});

  const filtered = allSubs.filter(s => {
    const ok =
      filter === "active"   ? subIsActive(s) :
      filter === "inactive" ? !subIsActive(s) :
      filter === "expiring" ? (() => { const d = daysLeft(s.expiry_date); return d != null && d >= 0 && d <= 7; })() :
      true;
    const q = search.trim().toLowerCase();
    return ok && (!q ||
      s.company?.company_name?.toLowerCase().includes(q) ||
      (s.plan?.name ?? s.plan_name ?? "").toLowerCase().includes(q));
  });

  const totalPg = Math.ceil(filtered.length / SUB_PAGE);
  const paged   = filtered.slice((page - 1) * SUB_PAGE, page * SUB_PAGE);

  async function doCancel(id) {
    try { await cancelSub(id).unwrap(); toast_("Subscription cancelled"); }
    catch { toast_("Failed to cancel", "error"); }
    finally { setConfirm(null); }
  }
  async function doDelete(id) {
    try { await deleteSub(id).unwrap(); toast_("Subscription deleted"); }
    catch { toast_("Failed to delete", "error"); }
    finally { setConfirm(null); }
  }

  return (
    <>
      <Toast t={toast} />
      {confirm && (
        <ConfirmModal
          msg={confirm.title}
          sub={confirm.sub}
          onOk={confirm.onOk}
          onCancel={() => setConfirm(null)}
          busy={cancelling || deleting}
        />
      )}

      {/* Stats */}
      <div className={styles.statsStrip}>
        <StatCard icon="📋" label="Total" value={allSubs.length} loading={loadSubs} />
        <StatCard icon="✅" label="Active" value={active.length} loading={loadSubs} accent="green" />
        <StatCard icon="⏰" label="Expiring (7d)" value={expiring.length} loading={loadSubs} accent="amber" />
        <StatCard icon="💰" label="Total Revenue" value={fmt(totalRevenue)} loading={loadSubs} accent="blue" />
        <StatCard icon="📅" label="This Month" value={fmt(monthRevenue)} loading={loadSubs} accent="purple" />
      </div>

      {/* Plans */}
      <div className={styles.sectionHead}><h2>Plans</h2></div>
      <PlansPanel plans={allPlans} planCounts={planCounts} totalSubs={allSubs.length} loading={loadPlans} />

      {/* Subscriptions table */}
      <div className={styles.sectionHead}>
        <h2>All Subscriptions</h2>
        <input
          className={styles.search}
          placeholder="Search company or plan…"
          value={search}
          onChange={e => { setSearch(e.target.value); setPage(1); }}
        />
      </div>

      <FilterTabs
        active={filter}
        onChange={k => { setFilter(k); setPage(1); }}
        tabs={[
          { key: "all",      label: "All",      count: allSubs.length },
          { key: "active",   label: "Active",   count: active.length },
          { key: "inactive", label: "Inactive", count: inactive.length },
          { key: "expiring", label: "Expiring", count: expiring.length },
        ]}
      />

      {loadSubs ? (
        <div className={styles.skelRows}>{[...Array(5)].map((_, i) => <div key={i} className={styles.skelRow} />)}</div>
      ) : paged.length === 0 ? (
        <div className={styles.emptyBox}><span>📭</span><p>No subscriptions found</p></div>
      ) : (
        <>
          <div className={styles.tableWrap}>
            <table className={styles.table}>
              <thead>
                <tr>
                  <th>Company</th>
                  <th>Plan</th>
                  <th>Amount</th>
                  <th>Start</th>
                  <th>Expiry</th>
                  <th>Status</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {paged.map(s => {
                  const live   = subIsActive(s);
                  const days   = daysLeft(s.expiry_date);
                  const amt    = parseFloat(s.amount ?? s.price ?? s.plan?.price ?? 0);
                  const plan   = s.plan?.name ?? s.plan?.type ?? s.plan_name ?? "—";
                  const co     = s.company?.company_name ?? s.company ?? "—";
                  return (
                    <tr key={s.id}>
                      <td className={styles.tdBold}>{co}</td>
                      <td><span className={styles.planPill}>{plan}</span></td>
                      <td className={styles.tdMoney}>{fmt(amt)}</td>
                      <td className={styles.tdMute}>{fmtDate(s.start_date)}</td>
                      <td className={styles.tdMute}>
                        {fmtDate(s.expiry_date)}
                        {days != null && days >= 0 && days <= 7 && (
                          <span className={styles.expBadge}>{days}d</span>
                        )}
                      </td>
                      <td>
                        <span className={`${styles.pill} ${live ? styles.pillGreen : styles.pillRed}`}>
                          {live ? "Active" : "Inactive"}
                        </span>
                      </td>
                      <td>
                        <div className={styles.rowBtns}>
                          {live && (
                            <button className={styles.btnAmber}
                              onClick={() => setConfirm({ title: "Cancel this subscription?", sub: `Company: ${co}`, onOk: () => doCancel(s.id) })}>
                              Cancel
                            </button>
                          )}
                          <button className={styles.btnRed}
                            onClick={() => setConfirm({ title: "Delete subscription?", sub: "This is permanent.", onOk: () => doDelete(s.id) })}>
                            Delete
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
          <Paginator page={page} total={totalPg} onChange={setPage} />
        </>
      )}
    </>
  );
}

// ── Ads tab ───────────────────────────────────────────────────────────────
function AdsTab() {
  const [filter, setFilter]   = useState("all");
  const [search, setSearch]   = useState("");
  const [page, setPage]       = useState(1);
  const [confirm, setConfirm] = useState(null);
  const [toast, setToast]     = useState(null);

  const { data: adsRaw, isLoading } = useGetAdsQuery();
  const [toggleAd, { isLoading: toggling }] = useToggleAdMutation();
  const [deleteAd, { isLoading: deleting }] = useDeleteAdMutation();

  function toast_(msg, type = "success") {
    setToast({ msg, type });
    setTimeout(() => setToast(null), 3500);
  }

  const allAds = adsRaw?.results ?? adsRaw ?? [];

  const byStatus = (st) => allAds.filter(a => adStatus(a) === st);
  const stats = {
    total:   allAds.length,
    active:  byStatus("active").length,
    pending: byStatus("pending").length,
    expired: byStatus("expired").length + byStatus("inactive").length,
  };

  const filtered = allAds.filter(a => {
    const st = adStatus(a);
    const ok = filter === "all" ? true : filter === "inactive" ? (st === "expired" || st === "inactive") : st === filter;
    const q  = search.trim().toLowerCase();
    return ok && (!q ||
      a.company?.company_name?.toLowerCase().includes(q) ||
      a.title?.toLowerCase().includes(q));
  });

  const totalPg = Math.ceil(filtered.length / AD_PAGE);
  const paged   = filtered.slice((page - 1) * AD_PAGE, page * AD_PAGE);

  async function doToggle(ad) {
    try { await toggleAd({ id: ad.id, active: !ad.active }).unwrap(); toast_(ad.active ? "Ad paused" : "Ad activated"); }
    catch { toast_("Failed to update", "error"); }
  }
  async function doDelete(id) {
    try { await deleteAd(id).unwrap(); toast_("Ad deleted"); }
    catch { toast_("Failed to delete", "error"); }
    finally { setConfirm(null); }
  }

  const pillCls = { active: styles.pillGreen, pending: styles.pillAmber, expired: styles.pillRed, inactive: styles.pillRed };

  return (
    <>
      <Toast t={toast} />
      {confirm && (
        <ConfirmModal
          msg="Delete this advertisement?"
          sub="This will permanently remove the ad."
          onOk={confirm.onOk}
          onCancel={() => setConfirm(null)}
          busy={deleting}
        />
      )}

      {/* Stats */}
      <div className={styles.statsStrip}>
        <StatCard icon="📢" label="Total Ads"  value={stats.total}   loading={isLoading} />
        <StatCard icon="✅" label="Active"      value={stats.active}  loading={isLoading} accent="green" />
        <StatCard icon="⏳" label="Pending"     value={stats.pending} loading={isLoading} accent="amber" />
        <StatCard icon="⛔" label="Expired"     value={stats.expired} loading={isLoading} accent="red" />
      </div>

      {/* Controls */}
      <div className={styles.sectionHead}>
        <FilterTabs
          active={filter}
          onChange={k => { setFilter(k); setPage(1); }}
          tabs={[
            { key: "all",      label: "All",      count: stats.total },
            { key: "active",   label: "Active",   count: stats.active },
            { key: "pending",  label: "Pending",  count: stats.pending },
            { key: "inactive", label: "Expired",  count: stats.expired },
          ]}
        />
        <input
          className={styles.search}
          placeholder="Search company or title…"
          value={search}
          onChange={e => { setSearch(e.target.value); setPage(1); }}
        />
      </div>

      {/* Cards */}
      {isLoading ? (
        <div className={styles.adGrid}>{[...Array(6)].map((_, i) => <div key={i} className={styles.adCardSkel} />)}</div>
      ) : paged.length === 0 ? (
        <div className={styles.emptyBox}><span>📢</span><p>No ads found</p></div>
      ) : (
        <>
          <div className={styles.adGrid}>
            {paged.map(ad => {
              const st    = adStatus(ad);
              const co    = ad.company?.company_name ?? "—";
              const days  = daysLeft(ad.expired_at);
              return (
                <div key={ad.id} className={styles.adCard}>
                  <div className={styles.adCardHead}>
                    <div className={styles.adCardInfo}>
                      <h3>{co}</h3>
                      {ad.title && <p className={styles.adTitle}>{ad.title}</p>}
                    </div>
                    <span className={`${styles.pill} ${pillCls[st] ?? styles.pillAmber}`}>
                      {st.charAt(0).toUpperCase() + st.slice(1)}
                    </span>
                  </div>

                  {ad.description && (
                    <p className={styles.adDesc}>{ad.description.slice(0, 90)}{ad.description.length > 90 ? "…" : ""}</p>
                  )}

                  <div className={styles.adMeta}>
                    {ad.expired_at && (
                      <span>
                        Expires {fmtDate(ad.expired_at)}
                        {days != null && days >= 0 && days <= 7 && (
                          <span className={styles.expBadge}>{days}d</span>
                        )}
                      </span>
                    )}
                    {ad.budget != null && <span>💰 {fmt(ad.budget)}</span>}
                  </div>

                  <div className={styles.adCardFoot}>
                    <button
                      className={ad.active ? styles.btnAmber : styles.btnGreen}
                      disabled={toggling}
                      onClick={() => doToggle(ad)}
                    >
                      {ad.active ? "⏸ Pause" : "▶ Activate"}
                    </button>
                    <button
                      className={styles.btnRed}
                      onClick={() => setConfirm({ onOk: () => doDelete(ad.id) })}
                    >
                      🗑 Delete
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
          <Paginator page={page} total={totalPg} onChange={setPage} />
        </>
      )}
    </>
  );
}

// ── Main page ─────────────────────────────────────────────────────────────
export default function AdminMonetization() {
  const [tab, setTab] = useState("subscriptions");

  return (
    <div className={styles.page}>
      <div className={styles.pageHead}>
        <div>
          <h1>Monetization</h1>
          <p>Manage subscriptions, plans and advertisements</p>
        </div>
      </div>

      <div className={styles.mainTabs}>
        <button
          className={`${styles.mainTab} ${tab === "subscriptions" ? styles.mainTabActive : ""}`}
          onClick={() => setTab("subscriptions")}
        >
          💳 Subscriptions & Plans
        </button>
        <button
          className={`${styles.mainTab} ${tab === "ads" ? styles.mainTabActive : ""}`}
          onClick={() => setTab("ads")}
        >
          📢 Advertisements
        </button>
      </div>

      <div className={styles.tabContent}>
        {tab === "subscriptions" ? <SubscriptionsTab /> : <AdsTab />}
      </div>
    </div>
  );
}