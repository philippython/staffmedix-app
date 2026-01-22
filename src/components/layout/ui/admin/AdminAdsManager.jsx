import { useState } from "react";
import styles from "./AdminAdsManager.module.css";

export default function AdminAdsManager() {
  const [filter, setFilter] = useState("all");

  const advertisements = [
    {
      id: 1,
      organization: "General Hospital Lagos",
      adType: "Featured Listing",
      status: "active",
      startDate: "Jan 1, 2026",
      endDate: "Jan 31, 2026",
      price: "₦50,000",
      impressions: 15234,
      clicks: 892,
    },
    {
      id: 2,
      organization: "St. Nicholas Hospital",
      adType: "Premium Banner",
      status: "active",
      startDate: "Jan 15, 2026",
      endDate: "Feb 15, 2026",
      price: "₦75,000",
      impressions: 8456,
      clicks: 534,
    },
    {
      id: 3,
      organization: "Federal Medical Centre",
      adType: "Featured Listing",
      status: "pending",
      startDate: "Jan 25, 2026",
      endDate: "Feb 25, 2026",
      price: "₦50,000",
      impressions: 0,
      clicks: 0,
    },
    {
      id: 4,
      organization: "National Hospital Abuja",
      adType: "Sponsored Post",
      status: "expired",
      startDate: "Dec 1, 2025",
      endDate: "Dec 31, 2025",
      price: "₦35,000",
      impressions: 22456,
      clicks: 1234,
    },
    {
      id: 5,
      organization: "Cedarcrest Hospitals",
      adType: "Premium Banner",
      status: "pending",
      startDate: "Feb 1, 2026",
      endDate: "Mar 1, 2026",
      price: "₦75,000",
      impressions: 0,
      clicks: 0,
    },
  ];

  const adTypes = [
    { name: "Featured Listing", price: "₦50,000/month", active: 12 },
    { name: "Premium Banner", price: "₦75,000/month", active: 5 },
    { name: "Sponsored Post", price: "₦35,000/month", active: 8 },
    { name: "Homepage Takeover", price: "₦150,000/month", active: 2 },
  ];

  const filteredAds = advertisements.filter((ad) => {
    if (filter === "all") return true;
    return ad.status === filter;
  });

  const stats = {
    total: advertisements.length,
    active: advertisements.filter((a) => a.status === "active").length,
    pending: advertisements.filter((a) => a.status === "pending").length,
    revenue: "₦2.8M",
  };

  return (
    <div className={styles.adsManager}>
      <div className={styles.header}>
        <h1>Advertisement Manager</h1>
        <p>Manage organization advertisements and sponsorships</p>
      </div>

      <div className={styles.statsGrid}>
        <div className={styles.statCard}>
          <span className={styles.statValue}>{stats.total}</span>
          <span className={styles.statLabel}>Total Ads</span>
        </div>
        <div className={styles.statCard}>
          <span className={styles.statValue}>{stats.active}</span>
          <span className={styles.statLabel}>Active</span>
        </div>
        <div className={styles.statCard}>
          <span className={styles.statValue}>{stats.pending}</span>
          <span className={styles.statLabel}>Pending Approval</span>
        </div>
        <div className={styles.statCard}>
          <span className={styles.statValue}>{stats.revenue}</span>
          <span className={styles.statLabel}>Monthly Revenue</span>
        </div>
      </div>

      <div className={styles.mainContent}>
        <section className={styles.adsSection}>
          <div className={styles.sectionHeader}>
            <h2>All Advertisements</h2>
            <div className={styles.filters}>
              <button
                className={filter === "all" ? styles.active : ""}
                onClick={() => setFilter("all")}
              >
                All
              </button>
              <button
                className={filter === "active" ? styles.active : ""}
                onClick={() => setFilter("active")}
              >
                Active
              </button>
              <button
                className={filter === "pending" ? styles.active : ""}
                onClick={() => setFilter("pending")}
              >
                Pending
              </button>
              <button
                className={filter === "expired" ? styles.active : ""}
                onClick={() => setFilter("expired")}
              >
                Expired
              </button>
            </div>
          </div>

          <div className={styles.adsList}>
            {filteredAds.map((ad) => (
              <div key={ad.id} className={styles.adCard}>
                <div className={styles.adHeader}>
                  <div>
                    <h3>{ad.organization}</h3>
                    <span className={styles.adType}>{ad.adType}</span>
                  </div>
                  <span
                    className={`${styles.statusBadge} ${styles[ad.status]}`}
                  >
                    {ad.status.charAt(0).toUpperCase() + ad.status.slice(1)}
                  </span>
                </div>

                <div className={styles.adDetails}>
                  <div className={styles.detailRow}>
                    <span className={styles.label}>Period:</span>
                    <span className={styles.value}>
                      {ad.startDate} - {ad.endDate}
                    </span>
                  </div>
                  <div className={styles.detailRow}>
                    <span className={styles.label}>Price:</span>
                    <span className={styles.value}>{ad.price}</span>
                  </div>
                  {ad.status === "active" && (
                    <>
                      <div className={styles.detailRow}>
                        <span className={styles.label}>Impressions:</span>
                        <span className={styles.value}>
                          {ad.impressions.toLocaleString()}
                        </span>
                      </div>
                      <div className={styles.detailRow}>
                        <span className={styles.label}>Clicks:</span>
                        <span className={styles.value}>
                          {ad.clicks.toLocaleString()}
                        </span>
                      </div>
                    </>
                  )}
                </div>

                <div className={styles.adActions}>
                  {ad.status === "pending" && (
                    <>
                      <button className={styles.approveBtn}>Approve</button>
                      <button className={styles.rejectBtn}>Reject</button>
                    </>
                  )}
                  {ad.status === "active" && (
                    <button className={styles.pauseBtn}>Pause</button>
                  )}
                  {ad.status === "expired" && (
                    <button className={styles.renewBtn}>Renew</button>
                  )}
                  <button className={styles.detailsBtn}>View Details</button>
                </div>
              </div>
            ))}
          </div>
        </section>

        <aside className={styles.sidebar}>
          <div className={styles.adTypesCard}>
            <h3>Ad Packages</h3>
            {adTypes.map((type, index) => (
              <div key={index} className={styles.packageItem}>
                <div className={styles.packageInfo}>
                  <h4>{type.name}</h4>
                  <p className={styles.packagePrice}>{type.price}</p>
                </div>
                <div className={styles.packageActive}>
                  <span>{type.active}</span>
                  <span className={styles.activeLabel}>active</span>
                </div>
              </div>
            ))}
          </div>

          <div className={styles.performanceCard}>
            <h3>Overall Performance</h3>
            <div className={styles.performanceStats}>
              <div className={styles.perfItem}>
                <span className={styles.perfLabel}>Total Impressions</span>
                <span className={styles.perfValue}>46,146</span>
              </div>
              <div className={styles.perfItem}>
                <span className={styles.perfLabel}>Total Clicks</span>
                <span className={styles.perfValue}>2,660</span>
              </div>
              <div className={styles.perfItem}>
                <span className={styles.perfLabel}>Avg. CTR</span>
                <span className={styles.perfValue}>5.8%</span>
              </div>
            </div>
          </div>

          <div className={styles.quickActions}>
            <h3>Quick Actions</h3>
            <button className={styles.actionBtn}>📊 View Full Analytics</button>
            <button className={styles.actionBtn}>📄 Generate Report</button>
            <button className={styles.actionBtn}>💰 Revenue Dashboard</button>
          </div>
        </aside>
      </div>
    </div>
  );
}
