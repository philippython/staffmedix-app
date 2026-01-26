import { Link } from "react-router";
import styles from "./AdminDashboard.module.css";

export default function AdminDashboard() {
  const stats = [
    { label: "Total Users", value: "2,543", change: "+12%", icon: "👥" },
    { label: "Active Jobs", value: "156", change: "+8%", icon: "💼" },
    { label: "Pending Verifications", value: "23", change: "-5%", icon: "⏳" },
    { label: "Revenue (₦)", value: "12.5M", change: "+18%", icon: "💰" },
  ];

  const recentUsers = [
    {
      id: 1,
      name: "Dr. Amaka Johnson",
      type: "Employee",
      status: "Pending",
      date: "2 hours ago",
    },
    {
      id: 2,
      name: "General Hospital Lagos",
      type: "Employer",
      status: "Verified",
      date: "5 hours ago",
    },
    {
      id: 3,
      name: "Nurse Chioma Obi",
      type: "Employee",
      status: "Pending",
      date: "1 day ago",
    },
  ];

  const pendingActions = [
    { id: 1, action: "Verify Dr. Sarah credentials", priority: "High" },
    { id: 2, action: "Review hospital registration", priority: "Medium" },
    { id: 3, action: "Approve job posting", priority: "Low" },
  ];

  return (
    <div className={styles.dashboard}>
      <div className={styles.dashboardHeader}>
        <div>
          <h1>Admin Dashboard</h1>
          <p>System overview and management</p>
        </div>
        <div className={styles.headerActions}>
          <Link to="/admin/analytics" className={styles.analyticsButton}>
            📊 View Analytics
          </Link>
          <Link to="/admin/settings" className={styles.settingsButton}>
            ⚙️ Settings
          </Link>
        </div>
      </div>

      <div className={styles.statsGrid}>
        {stats.map((stat, index) => (
          <div key={index} className={styles.statCard}>
            <div className={styles.statIcon}>{stat.icon}</div>
            <div className={styles.statInfo}>
              <p className={styles.statValue}>{stat.value}</p>
              <p className={styles.statLabel}>{stat.label}</p>
              <span
                className={`${styles.statChange} ${
                  stat.change.startsWith("+")
                    ? styles.positive
                    : styles.negative
                }`}
              >
                {stat.change} from last month
              </span>
            </div>
          </div>
        ))}
      </div>

      <div className={styles.mainContent}>
        <section className={styles.recentActivity}>
          <div className={styles.sectionHeader}>
            <h2>Recent User Registrations</h2>
            <Link to="/admin/users">View All Users</Link>
          </div>

          <div className={styles.activityList}>
            {recentUsers.map((user) => (
              <div key={user.id} className={styles.activityItem}>
                <div className={styles.userInfo}>
                  <h3>{user.name}</h3>
                  <p className={styles.userType}>{user.type}</p>
                  <p className={styles.userDate}>{user.date}</p>
                </div>
                <div className={styles.userActions}>
                  <span
                    className={`${styles.statusBadge} ${
                      styles[user.status.toLowerCase()]
                    }`}
                  >
                    {user.status}
                  </span>
                  <Link
                    to={`/admin/verification/${user.id}`}
                    className={styles.viewButton}
                  >
                    Review
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </section>

        <aside className={styles.sidebar}>
          <div className={styles.quickActions}>
            <h3>Quick Actions</h3>
            <Link to="/admin/verification" className={styles.actionCard}>
              <span>🔍</span>
              <div>
                <h4>Verify Credentials</h4>
                <p>Review pending verifications</p>
              </div>
            </Link>
            <Link to="/admin/ads-manager" className={styles.actionCard}>
              <span>📢</span>
              <div>
                <h4>Manage Ads</h4>
                <p>Approve organization ads</p>
              </div>
            </Link>
            <Link to="/admin/reports" className={styles.actionCard}>
              <span>📋</span>
              <div>
                <h4>Generate Reports</h4>
                <p>System analytics & reports</p>
              </div>
            </Link>
          </div>

          <div className={styles.pendingActions}>
            <h3>Pending Actions</h3>
            {pendingActions.map((item) => (
              <div key={item.id} className={styles.pendingItem}>
                <div>
                  <p className={styles.actionText}>{item.action}</p>
                  <span
                    className={`${styles.priorityBadge} ${
                      styles[item.priority.toLowerCase()]
                    }`}
                  >
                    {item.priority}
                  </span>
                </div>
                <button className={styles.actionButton}>Act</button>
              </div>
            ))}
          </div>
        </aside>
      </div>
    </div>
  );
}
