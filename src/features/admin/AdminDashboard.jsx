import { Link } from "react-router";
import styles from "./AdminDashboard.module.css";
import { useGetAllUsersQuery } from "../../services/userApi";
import { useGetJobsQuery, useGetAppliedJobsQuery } from "../../services/jobsApi";
import { useGetSubscriptionsQuery } from "../../services/subscriptionApi";
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

function calcRevenue(subscriptions = []) {
  const now = new Date();
  const thisMonth = now.getMonth();
  const thisYear  = now.getFullYear();
  let total = 0, monthly = 0;
  for (const sub of subscriptions) {
    const amount = parseFloat(sub.amount ?? sub.price ?? sub.plan?.price ?? 0);
    total += amount;
    const start = sub.start_date ? new Date(sub.start_date) : null;
    if (start && start.getMonth() === thisMonth && start.getFullYear() === thisYear)
      monthly += amount;
  }
  const fmt = (n) =>
    n >= 1_000_000 ? `₦${(n / 1_000_000).toFixed(1)}M`
    : n >= 1_000   ? `₦${(n / 1_000).toFixed(1)}K`
    : `₦${n.toLocaleString()}`;
  return { total: fmt(total), monthly: fmt(monthly) };
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
  const { total: revenueTotal, monthly: revenueMonthly } = calcRevenue(allSubs);
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
    const name = s.plan?.name ?? s.plan_name ?? "Unknown";
    acc[name] = (acc[name] ?? 0) + 1;
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
          <Link to="/admin-dashboard/verification" className={styles.settingsButton}>
            🔍 Verifications
          </Link>
        </div>
      </div>

      {/* ── Stats ── */}
      <div className={styles.statsGrid}>
        <StatCard label="Total Users"    value={totalUsers}      icon="👥" isLoading={loadingCount}   sub={`${totalSubs} active subscriptions`} />
        <StatCard label="Active Jobs"    value={totalActiveJobs} icon="💼" isLoading={loadingJobs}    sub={`${totalJobs} total postings`} />
        <StatCard label="Total Revenue"  value={revenueTotal}    icon="💰" isLoading={loadingSubs}    sub={`${revenueMonthly} this month`} />
      </div>

      {/* ── Verification cards ── */}
      <div className={styles.verificationGrid}>
        <Link to="/admin-dashboard/verification" className={styles.verifyCard}>
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
              <Link to="/admin-dashboard/verification" className={styles.quickItem}>
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
    </div>
  );
}