import { Link } from "react-router";
import styles from "./AdminDashboard.module.css";
import { useGetAllUsersQuery } from "../../services/userApi";
import { useGetJobsQuery, useGetAppliedJobsQuery } from "../../services/jobsApi";
import { useGetSubscriptionsQuery } from "../../services/subscriptionApi";
import { useGetPaymentsQuery, useGetRecipientsQuery, useUpdateRecipientMutation } from "../../services/paymentApi";
import { useGetTalentsQuery } from "../../services/talentApi";
import { useGetAllCompanyProfilesQuery } from "../../services/employerApi";

// ── Helpers ────────────────────────────────────────────────────────────────

function StatCard({ label, value, icon, isLoading, sub }) {
  return (
    <div className={styles.statCard}>
      <div className={styles.statIcon}>{icon}</div>
      <div className={styles.statInfo}>
        <p className={styles.statValue}>
          {isLoading ? <span className={styles.shimmer} /> : value}
        </p>
        <p className={styles.statLabel}>{label}</p>
        {sub && <span className={styles.statSub}>{sub}</span>}
      </div>
    </div>
  );
}

function fmt(n) {
  if (!n) return "₦0";
  return n >= 1_000_000 ? `₦${(n / 1_000_000).toFixed(1)}M`
    : n >= 1_000 ? `₦${(n / 1_000).toFixed(1)}K`
    : `₦${Number(n).toLocaleString()}`;
}

function calcStats(subscriptions = [], payments = []) {
  const COMMISSION = 0.05;
  const now       = new Date();
  const thisMonth = now.getMonth();
  const thisYear  = now.getFullYear();

  // Paid subs only — Basic plan is FREE (amount = 0), skip it
  const paidSubs = subscriptions.filter(s => parseFloat(s.plan?.amount ?? 0) > 0);

  // Total Revenue = sum of paid subscription amounts
  const subRevenue = paidSubs.reduce((sum, s) => sum + parseFloat(s.plan?.amount ?? 0), 0);

  // 5% commission on all successful locum payments
  const locumRevenue = payments
    .filter(p => p.reason === "locum" && (p.status === "success" || p.status === "SUCCESS"))
    .reduce((sum, p) => sum + parseFloat(p.amount ?? 0) * COMMISSION, 0);

  // Platform earnings = sub revenue + locum commission
  const platformEarnings = subRevenue + locumRevenue;

  // Total locum gross (shown separately)
  const totalLocum = payments
    .filter(p => p.reason === "locum" && (p.status === "success" || p.status === "SUCCESS"))
    .reduce((sum, p) => sum + parseFloat(p.amount ?? 0), 0);

  // This month
  const monthlySubRev = paidSubs
    .filter(s => { const d = s.start_date ? new Date(s.start_date) : null; return d && d.getMonth() === thisMonth && d.getFullYear() === thisYear; })
    .reduce((sum, s) => sum + parseFloat(s.plan?.amount ?? 0), 0);

  const monthlyLocumRev = payments
    .filter(p => {
      if (p.reason !== "locum" || (p.status !== "success" && p.status !== "SUCCESS")) return false;
      const d = p.created_at ? new Date(p.created_at) : null;
      return d && d.getMonth() === thisMonth && d.getFullYear() === thisYear;
    })
    .reduce((sum, p) => sum + parseFloat(p.amount ?? 0) * COMMISSION, 0);

  const monthlyPlatform = monthlySubRev + monthlyLocumRev;

  return {
    subRevenue:       fmt(subRevenue),
    platformEarnings: fmt(platformEarnings),
    locumCommission:  fmt(locumRevenue),
    totalLocum:       fmt(totalLocum),
    monthlyPlatform:  fmt(monthlyPlatform),
    monthlySubRev:    fmt(monthlySubRev),
  };
}

function timeAgo(dateStr) {
  if (!dateStr) return "—";
  const diff = Date.now() - new Date(dateStr).getTime();
  const mins  = Math.floor(diff / 60000);
  const hours = Math.floor(diff / 3600000);
  const days  = Math.floor(diff / 86400000);
  if (mins  < 60)  return `${mins}m ago`;
  if (hours < 24)  return `${hours}h ago`;
  return `${days}d ago`;
}

function getInitial(user) {
  return (user?.first_name?.[0] || user?.username?.[0] || "U").toUpperCase();
}

function roleBg(role) {
  const map = { talent: "#3b82f6", employer: "#10b981", admin: "#8b5cf6" };
  return map[role?.toLowerCase()] ?? "#6b7280";
}

// ── Dashboard ──────────────────────────────────────────────────────────────

export default function AdminDashboard() {

  // ── Fetches ──────────────────────────────────────────────────────────────
  const { data: usersData,     isLoading: loadingUsers }     = useGetAllUsersQuery({ limit: 6, offset: 0 });
  const { data: allUsersCount, isLoading: loadingCount }     = useGetAllUsersQuery({ limit: 1 });
  const { data: activeJobsData,isLoading: loadingJobs }      = useGetJobsQuery({ is_active: true, limit: 1 });
  const { data: allJobsData,   isLoading: loadingAllJobs }   = useGetJobsQuery({ limit: 1 });
  const { data: allSubsData,   isLoading: loadingSubs }      = useGetSubscriptionsQuery();
  const { data: talentsData,   isLoading: loadingTalents }   = useGetTalentsQuery({ limit: 1000 });
  const { data: companiesData, isLoading: loadingCompanies } = useGetAllCompanyProfilesQuery({ limit: 1000 });
  const { data: appsData,      isLoading: loadingApps }      = useGetAppliedJobsQuery({ limit: 5 });

  // ── Derived ───────────────────────────────────────────────────────────────
  const totalUsers      = allUsersCount?.count     ?? "—";
  const totalActiveJobs = activeJobsData?.count    ?? "—";
  const totalJobs       = allJobsData?.count       ?? "—";

  const allSubs         = allSubsData?.results ?? allSubsData ?? [];
  const { data: paymentsRaw }   = useGetPaymentsQuery();
  const { data: recipientsRaw } = useGetRecipientsQuery();
  const allPayments   = paymentsRaw?.results   ?? paymentsRaw   ?? [];
  const allRecipients = recipientsRaw?.results ?? recipientsRaw ?? [];

  const stats = calcStats(allSubs, allPayments);

  // Locum management
  const [approveRecipient, { isLoading: approving }] = useUpdateRecipientMutation();

  async function handleApproveLocum(recipientId) {
    try {
      await approveRecipient({ id: recipientId, eligible: true }).unwrap();
    } catch (e) {
      console.error("Approve failed:", e);
    }
  }

  const pendingLocum   = allRecipients.filter(r => !r.eligible);
  const approvedLocum  = allRecipients.filter(r => r.eligible === true);
  // totalLocum is in stats.totalLocum
  const totalSubs       = allSubs.length;

  const allTalents       = talentsData?.results  ?? talentsData  ?? [];
  const allCompanies     = companiesData?.results ?? companiesData ?? [];
  const pendingTalents   = allTalents.filter((t) => !t.verified).length;
  const pendingEmployers = allCompanies.filter((c) => !c.verified).length;
  const verifiedTalents  = allTalents.filter((t) =>  t.verified).length;

  const recentUsers   = usersData?.results ?? usersData ?? [];
  const recentApps    = appsData?.results  ?? appsData  ?? [];

  // Subscription plan breakdown
  const planCounts = allSubs.reduce((acc, s) => {
    const k = s.plan?.type ?? "Unknown";
    acc[k] = (acc[k] ?? 0) + 1;
    return acc;
  }, {});

  return (
    <div className={styles.dashboard}>

      {/* ── Header ── */}
      <div className={styles.dashboardHeader}>
        <div>
          <h1>Admin Dashboard</h1>
          <p>System overview and management</p>
        </div>
        <div className={styles.headerActions}>
          <Link to="/admin-dashboard/all-users" className={styles.analyticsButton}>
            👥 Manage Users
          </Link>
          <Link to="/admin-dashboard/monetization" className={styles.settingsButton}>
            💳 Monetization
          </Link>
          <Link to="/admin-dashboard/employer-verification" className={styles.settingsButton}>
            🔍 Verifications
          </Link>
        </div>
      </div>

      {/* ── Stats ── */}
      <div className={styles.statsGrid}>
        <StatCard label="Total Users"    value={totalUsers}      icon="👥" isLoading={loadingCount}   sub={`${totalSubs} active subscriptions`} />
        <StatCard label="Active Jobs"    value={totalActiveJobs} icon="💼" isLoading={loadingJobs}    sub={`${totalJobs} total postings`} />
        <StatCard label="Subscription Revenue" value={stats.subRevenue}       icon="💰" isLoading={loadingSubs} sub={`${stats.monthlySubRev} this month (paid plans only)`} />
        <StatCard label="Platform Earnings"    value={stats.platformEarnings} icon="📈" isLoading={loadingSubs} sub={`Subs + ${stats.locumCommission} locum commission`} />
        <StatCard label="Locum Payments"       value={stats.totalLocum}       icon="🏥" isLoading={loadingSubs} sub={`${pendingLocum.length} pending approval`} />
      </div>

      {/* ── Verification cards ── */}
      <div className={styles.verificationGrid}>
        <Link to="/admin-dashboard/employer-verification" className={styles.verifyCard}>
          <div className={styles.verifyCardIcon}>🏥</div>
          <div className={styles.verifyCardInfo}>
            <p className={styles.verifyCardNum}>
              {loadingCompanies ? <span className={styles.shimmer} /> : pendingEmployers}
            </p>
            <p className={styles.verifyCardLabel}>Pending Employer Verifications</p>
            <span className={styles.verifyCardCta}>Review now →</span>
          </div>
        </Link>
        <Link to="/admin-dashboard/talent-verification" className={styles.verifyCard}>
          <div className={styles.verifyCardIcon}>👤</div>
          <div className={styles.verifyCardInfo}>
            <p className={styles.verifyCardNum}>
              {loadingTalents ? <span className={styles.shimmer} /> : pendingTalents}
            </p>
            <p className={styles.verifyCardLabel}>Pending Talent Verifications</p>
            <span className={styles.verifyCardCta}>Review now →</span>
          </div>
        </Link>
      </div>

      {/* ── Main content ── */}
      <div className={styles.mainContent}>

        {/* Left column */}
        <div className={styles.leftCol}>

          {/* Recent registrations */}
          <section className={styles.card}>
            <div className={styles.cardHeader}>
              <h2>Recent Registrations</h2>
              <Link to="/admin-dashboard/all-users">View all →</Link>
            </div>
            {loadingUsers ? (
              <div className={styles.loadingRows}>
                {[...Array(4)].map((_, i) => <div key={i} className={styles.shimmerRow} />)}
              </div>
            ) : recentUsers.length === 0 ? (
              <p className={styles.empty}>No users yet.</p>
            ) : (
              <div className={styles.userList}>
                {recentUsers.map((user) => (
                  <div key={user.id} className={styles.userRow}>
                    <div className={styles.userAvatar} style={{ background: roleBg(user.role) }}>
                      {getInitial(user)}
                    </div>
                    <div className={styles.userMeta}>
                      <span className={styles.userName}>
                        {user.first_name && user.last_name
                          ? `${user.first_name} ${user.last_name}`
                          : user.username}
                      </span>
                      <span className={styles.userEmail}>{user.email}</span>
                    </div>
                    <span className={styles.rolePill} style={{ background: roleBg(user.role) }}>
                      {user.role}
                    </span>
                    <span className={styles.timeAgo}>
                      {timeAgo(user.date_joined ?? user.created_at)}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </section>

          {/* Recent applications */}
          <section className={styles.card}>
            <div className={styles.cardHeader}>
              <h2>Recent Job Applications</h2>
              <Link to="/admin-dashboard/applications">View all →</Link>
            </div>
            {loadingApps ? (
              <div className={styles.loadingRows}>
                {[...Array(3)].map((_, i) => <div key={i} className={styles.shimmerRow} />)}
              </div>
            ) : recentApps.length === 0 ? (
              <p className={styles.empty}>No applications yet.</p>
            ) : (
              <div className={styles.appList}>
                {recentApps.map((app) => (
                  <div key={app.id} className={styles.appRow}>
                    <div className={styles.appInfo}>
                      <span className={styles.appTalent}>
                        {app.talent?.full_name ?? app.talent?.user?.username ?? "Unknown"}
                      </span>
                      <span className={styles.appJob}>
                        → {app.job?.title ?? "Unknown Job"}
                      </span>
                    </div>
                    <div className={styles.appRight}>
                      <span className={`${styles.appStatus} ${styles[app.status]}`}>
                        {app.status}
                      </span>
                      <span className={styles.timeAgo}>{timeAgo(app.created_at)}</span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </section>
        </div>

        {/* Right sidebar */}
        <aside className={styles.sidebar}>

          {/* Platform overview */}
          <div className={styles.card}>
            <div className={styles.cardHeader}><h2>Platform Overview</h2></div>
            <div className={styles.overviewList}>
              <div className={styles.overviewRow}>
                <span className={styles.overviewLabel}>Verified Talents</span>
                <span className={styles.overviewValue}>
                  {loadingTalents ? <span className={styles.shimmerSm} /> : verifiedTalents}
                </span>
              </div>
              <div className={styles.overviewRow}>
                <span className={styles.overviewLabel}>Total Talents</span>
                <span className={styles.overviewValue}>
                  {loadingTalents ? <span className={styles.shimmerSm} /> : allTalents.length}
                </span>
              </div>
              <div className={styles.overviewRow}>
                <span className={styles.overviewLabel}>Total Employers</span>
                <span className={styles.overviewValue}>
                  {loadingCompanies ? <span className={styles.shimmerSm} /> : allCompanies.length}
                </span>
              </div>
              <div className={styles.overviewRow}>
                <span className={styles.overviewLabel}>Verified Employers</span>
                <span className={styles.overviewValue}>
                  {loadingCompanies ? <span className={styles.shimmerSm} /> : allCompanies.filter(c => c.verified).length}
                </span>
              </div>
              <div className={styles.overviewRow}>
                <span className={styles.overviewLabel}>Active Subscriptions</span>
                <span className={styles.overviewValue}>
                  {loadingSubs ? <span className={styles.shimmerSm} /> : totalSubs}
                </span>
              </div>
            </div>
          </div>

          {/* Subscription breakdown */}
          {!loadingSubs && Object.keys(planCounts).length > 0 && (
            <div className={styles.card}>
              <div className={styles.cardHeader}><h2>Subscriptions by Plan</h2></div>
              <div className={styles.overviewList}>
                {Object.entries(planCounts).map(([plan, count]) => (
                  <div key={plan} className={styles.overviewRow}>
                    <span className={styles.overviewLabel}>{plan}</span>
                    <span className={styles.overviewValue}>{count}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Quick actions */}
          <div className={styles.card}>
            <div className={styles.cardHeader}><h2>Quick Actions</h2></div>
            <div className={styles.quickList}>
              <Link to="/admin-dashboard/all-users/create" className={styles.quickItem}>
                <span>➕</span><span>Create User</span>
              </Link>
              <Link to="/admin-dashboard/employer-verification" className={styles.quickItem}>
                <span>🔍</span>
                <span>
                  Verify Employers
                  {pendingEmployers > 0 && (
                    <span className={styles.badge}>{pendingEmployers}</span>
                  )}
                </span>
              </Link>
              <Link to="/admin-dashboard/talent-verification" className={styles.quickItem}>
                <span>👤</span>
                <span>
                  Verify Talents
                  {pendingTalents > 0 && (
                    <span className={styles.badge}>{pendingTalents}</span>
                  )}
                </span>
              </Link>
              <Link to="/admin-dashboard/monetization" className={styles.quickItem}>
                <span>💳</span><span>Subscriptions & Ads</span>
              </Link>
            </div>
          </div>

        </aside>
      </div>

      {/* ── Locum Payment Manager ─────────────────────────────────────────── */}
      <section className={styles.locumSection}>
        <div className={styles.locumHeader}>
          <h2>🏥 Locum Payment Manager</h2>
          <div className={styles.locumTabs}>
            <span className={styles.locumTabBadge}>
              {pendingLocum.length} pending · {approvedLocum.length} approved
            </span>
          </div>
        </div>

        {pendingLocum.length === 0 && approvedLocum.length === 0 ? (
          <p className={styles.emptyMsg}>No locum payments recorded yet.</p>
        ) : (
          <div className={styles.locumTable}>
            <div className={styles.locumTableHead}>
              <span>Talent</span>
              <span>Job</span>
              <span>Employer</span>
              <span>Gross Amount</span>
              <span>Talent Gets (95%)</span>
              <span>Date</span>
              <span>Status</span>
            </div>
            {[...pendingLocum, ...approvedLocum].map(r => {
              const gross       = parseFloat(r.payment_amount ?? 0);
              const talentShare = gross * 0.95;
              const employer    = r.company_name || r.employer_email || "—";
              const talent      = r.talent_name  || r.talent_email   || "—";
              const job         = r.job_title    ?? "—";
              const date        = r.payment_date ?? r.date;
              const isPending   = !r.eligible;
              const fmt = (n) => n ? `₦${Number(n).toLocaleString()}` : "₦0";
              return (
                <div key={r.id} className={`${styles.locumTableRow} ${isPending ? styles.locumRowPending : styles.locumRowApproved}`}>
                  <span className={styles.locumCell}>{talent}</span>
                  <span className={styles.locumCell}>{job}</span>
                  <span className={styles.locumCell}>{employer}</span>
                  <span className={styles.locumCell}>{fmt(gross)}</span>
                  <span className={styles.locumCell}>{fmt(talentShare)}</span>
                  <span className={styles.locumCell}>
                    {date ? new Date(date).toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" }) : "—"}
                  </span>
                  <span className={styles.locumCell}>
                    <div style={{display:"flex",gap:"0.4rem",alignItems:"center",flexWrap:"wrap"}}>
                      <span className={isPending ? styles.locumBadgePending : styles.locumBadgeApproved}>
                        {isPending ? "⏳ Pending" : "✅ Approved"}
                      </span>
                      {isPending && (
                        <button
                          onClick={() => handleApproveLocum(r.id)}
                          disabled={approving}
                          style={{
                            padding:"0.15rem 0.5rem",
                            fontSize:"0.68rem",
                            fontWeight:700,
                            background:"#0d9269",
                            color:"#fff",
                            border:"none",
                            borderRadius:"0.35rem",
                            cursor:"pointer",
                          }}
                        >
                          {approving ? "…" : "✓ Approve"}
                        </button>
                      )}
                    </div>
                  </span>
                </div>
              );
            })}
          </div>
        )}
      </section>
    </div>
  );
}