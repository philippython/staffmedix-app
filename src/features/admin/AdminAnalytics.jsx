import styles from "./AdminAnalytics.module.css";

export default function AdminAnalytics() {
  const metrics = [
    {
      label: "Total Users",
      current: "2,543",
      previous: "2,278",
      change: "+11.6%",
    },
    { label: "Active Jobs", current: "156", previous: "144", change: "+8.3%" },
    {
      label: "Applications",
      current: "3,892",
      previous: "3,421",
      change: "+13.8%",
    },
    {
      label: "Revenue (₦)",
      current: "12.5M",
      previous: "10.5M",
      change: "+19.0%",
    },
  ];

  const userStats = [
    { category: "Nurses", count: 1245, percentage: 49 },
    { category: "Doctors", count: 678, percentage: 27 },
    { category: "Allied Health", count: 423, percentage: 17 },
    { category: "Others", count: 197, percentage: 7 },
  ];

  const recentActivity = [
    {
      action: "New user registration",
      user: "Dr. Sarah Okonkwo",
      time: "5 min ago",
    },
    {
      action: "Job posted",
      user: "General Hospital Lagos",
      time: "12 min ago",
    },
    {
      action: "Application submitted",
      user: "Nurse Chioma Eze",
      time: "28 min ago",
    },
    {
      action: "New employer signup",
      user: "St. Mary's Clinic",
      time: "1 hour ago",
    },
    {
      action: "Document verified",
      user: "Dr. James Adebayo",
      time: "2 hours ago",
    },
  ];

  const topEmployers = [
    { name: "General Hospital Lagos", jobs: 15, applications: 234 },
    { name: "St. Nicholas Hospital", jobs: 12, applications: 189 },
    { name: "National Hospital Abuja", jobs: 10, applications: 156 },
    { name: "Federal Medical Centre", jobs: 9, applications: 143 },
  ];

  return (
    <div className={styles.analyticsPage}>
      <div className={styles.header}>
        <h1>System Analytics</h1>
        <div className={styles.dateRange}>
          <select className={styles.rangeSelect}>
            <option>Last 7 days</option>
            <option>Last 30 days</option>
            <option>Last 90 days</option>
            <option>This year</option>
          </select>
        </div>
      </div>

      <div className={styles.metricsGrid}>
        {metrics.map((metric, index) => (
          <div key={index} className={styles.metricCard}>
            <div className={styles.metricHeader}>
              <h3>{metric.label}</h3>
              <span
                className={`${styles.changeIndicator} ${
                  metric.change.startsWith("+")
                    ? styles.positive
                    : styles.negative
                }`}
              >
                {metric.change}
              </span>
            </div>
            <p className={styles.metricValue}>{metric.current}</p>
            <p className={styles.metricPrevious}>Previous: {metric.previous}</p>
          </div>
        ))}
      </div>

      <div className={styles.chartsSection}>
        <div className={styles.chartCard}>
          <h2>User Growth Trend</h2>
          <div className={styles.chartPlaceholder}>
            <div className={styles.lineChart}>
              <div className={styles.chartBar} style={{ height: "40%" }}></div>
              <div className={styles.chartBar} style={{ height: "55%" }}></div>
              <div className={styles.chartBar} style={{ height: "45%" }}></div>
              <div className={styles.chartBar} style={{ height: "65%" }}></div>
              <div className={styles.chartBar} style={{ height: "75%" }}></div>
              <div className={styles.chartBar} style={{ height: "85%" }}></div>
              <div className={styles.chartBar} style={{ height: "95%" }}></div>
            </div>
            <p className={styles.chartLabel}>
              User registration growth over time
            </p>
          </div>
        </div>

        <div className={styles.chartCard}>
          <h2>User Distribution</h2>
          <div className={styles.distributionChart}>
            {userStats.map((stat, index) => (
              <div key={index} className={styles.statItem}>
                <div className={styles.statInfo}>
                  <span className={styles.statCategory}>{stat.category}</span>
                  <span className={styles.statCount}>{stat.count}</span>
                </div>
                <div className={styles.progressBar}>
                  <div
                    className={styles.progressFill}
                    style={{ width: `${stat.percentage}%` }}
                  ></div>
                </div>
                <span className={styles.percentage}>{stat.percentage}%</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className={styles.mainContent}>
        <section className={styles.activitySection}>
          <h2>Recent Activity</h2>
          <div className={styles.activityList}>
            {recentActivity.map((activity, index) => (
              <div key={index} className={styles.activityItem}>
                <div className={styles.activityIcon}>📊</div>
                <div className={styles.activityContent}>
                  <p className={styles.activityAction}>{activity.action}</p>
                  <p className={styles.activityUser}>{activity.user}</p>
                </div>
                <span className={styles.activityTime}>{activity.time}</span>
              </div>
            ))}
          </div>
        </section>

        <aside className={styles.sidebar}>
          <div className={styles.topEmployers}>
            <h3>Top Employers</h3>
            {topEmployers.map((employer, index) => (
              <div key={index} className={styles.employerItem}>
                <div className={styles.employerRank}>{index + 1}</div>
                <div className={styles.employerInfo}>
                  <h4>{employer.name}</h4>
                  <div className={styles.employerStats}>
                    <span>{employer.jobs} jobs</span>
                    <span>•</span>
                    <span>{employer.applications} apps</span>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className={styles.exportSection}>
            <h3>Export Reports</h3>
            <button className={styles.exportBtn}>📊 Export Analytics</button>
            <button className={styles.exportBtn}>📄 Generate PDF Report</button>
            <button className={styles.exportBtn}>📈 Export User Data</button>
          </div>
        </aside>
      </div>
    </div>
  );
}
