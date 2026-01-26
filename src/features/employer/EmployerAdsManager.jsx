import { useState } from "react";
import { Link } from "react-router";
import styles from "./EmployerAdsManager.module.css";

export default function EmployerAdsManager() {
  const [ads, setAds] = useState([
    {
      id: 1,
      title: "Featured Hospital Listing",
      type: "Featured Listing",
      status: "active",
      startDate: "Jan 1, 2026",
      endDate: "Jan 31, 2026",
      impressions: 15234,
      clicks: 892,
      applications: 45,
      budget: "₦50,000",
    },
    {
      id: 2,
      title: "Premium Banner Ad",
      type: "Premium Banner",
      status: "paused",
      startDate: "Dec 15, 2025",
      endDate: "Jan 15, 2026",
      impressions: 8456,
      clicks: 534,
      applications: 28,
      budget: "₦75,000",
    },
  ]);

  const handlePauseResume = (adId) => {
    setAds(
      ads.map((ad) =>
        ad.id === adId
          ? { ...ad, status: ad.status === "active" ? "paused" : "active" }
          : ad
      )
    );
  };

  const handleDelete = (adId) => {
    if (window.confirm("Are you sure you want to delete this ad?")) {
      setAds(ads.filter((ad) => ad.id !== adId));
    }
  };

  const totalStats = {
    totalImpressions: ads.reduce((sum, ad) => sum + ad.impressions, 0),
    totalClicks: ads.reduce((sum, ad) => sum + ad.clicks, 0),
    totalApplications: ads.reduce((sum, ad) => sum + ad.applications, 0),
    activeAds: ads.filter((ad) => ad.status === "active").length,
  };

  return (
    <div className={styles.adsManager}>
      <div className={styles.header}>
        <div>
          <h1>My Advertisements</h1>
          <p>Manage your advertising campaigns</p>
        </div>
        <div className={styles.headerActions}>
          <Link to="/pricing" className={styles.createAdBtn}>
            + Create New Ad
          </Link>
          <Link to="/employer-dashboard" className={styles.backBtn}>
            Back to Dashboard
          </Link>
        </div>
      </div>

      <div className={styles.statsGrid}>
        <div className={styles.statCard}>
          <span className={styles.statIcon}>👁️</span>
          <div>
            <p className={styles.statValue}>
              {totalStats.totalImpressions.toLocaleString()}
            </p>
            <p className={styles.statLabel}>Total Impressions</p>
          </div>
        </div>
        <div className={styles.statCard}>
          <span className={styles.statIcon}>🖱️</span>
          <div>
            <p className={styles.statValue}>
              {totalStats.totalClicks.toLocaleString()}
            </p>
            <p className={styles.statLabel}>Total Clicks</p>
          </div>
        </div>
        <div className={styles.statCard}>
          <span className={styles.statIcon}>📝</span>
          <div>
            <p className={styles.statValue}>{totalStats.totalApplications}</p>
            <p className={styles.statLabel}>Applications Generated</p>
          </div>
        </div>
        <div className={styles.statCard}>
          <span className={styles.statIcon}>📊</span>
          <div>
            <p className={styles.statValue}>{totalStats.activeAds}</p>
            <p className={styles.statLabel}>Active Campaigns</p>
          </div>
        </div>
      </div>

      <div className={styles.adsList}>
        {ads.length > 0 ? (
          ads.map((ad) => (
            <div key={ad.id} className={styles.adCard}>
              <div className={styles.cardHeader}>
                <div>
                  <h3>{ad.title}</h3>
                  <span className={styles.adType}>{ad.type}</span>
                </div>
                <span
                  className={`${styles.statusBadge} ${styles[ad.status]}`}
                >
                  {ad.status.charAt(0).toUpperCase() + ad.status.slice(1)}
                </span>
              </div>

              <div className={styles.cardBody}>
                <div className={styles.adDates}>
                  <div className={styles.dateItem}>
                    <span className={styles.label}>Start Date:</span>
                    <span className={styles.value}>{ad.startDate}</span>
                  </div>
                  <div className={styles.dateItem}>
                    <span className={styles.label}>End Date:</span>
                    <span className={styles.value}>{ad.endDate}</span>
                  </div>
                  <div className={styles.dateItem}>
                    <span className={styles.label}>Budget:</span>
                    <span className={styles.value}>{ad.budget}</span>
                  </div>
                </div>

                <div className={styles.performanceStats}>
                  <div className={styles.perfItem}>
                    <span className={styles.perfValue}>
                      {ad.impressions.toLocaleString()}
                    </span>
                    <span className={styles.perfLabel}>Impressions</span>
                  </div>
                  <div className={styles.perfItem}>
                    <span className={styles.perfValue}>
                      {ad.clicks.toLocaleString()}
                    </span>
                    <span className={styles.perfLabel}>Clicks</span>
                  </div>
                  <div className={styles.perfItem}>
                    <span className={styles.perfValue}>{ad.applications}</span>
                    <span className={styles.perfLabel}>Applications</span>
                  </div>
                  <div className={styles.perfItem}>
                    <span className={styles.perfValue}>
                      {((ad.clicks / ad.impressions) * 100).toFixed(1)}%
                    </span>
                    <span className={styles.perfLabel}>CTR</span>
                  </div>
                </div>
              </div>

              <div className={styles.cardActions}>
                <button className={styles.editBtn}>✏️ Edit</button>
                <button
                  className={
                    ad.status === "active" ? styles.pauseBtn : styles.resumeBtn
                  }
                  onClick={() => handlePauseResume(ad.id)}
                >
                  {ad.status === "active" ? "⏸️ Pause" : "▶️ Resume"}
                </button>
                <button className={styles.analyticsBtn}>
                  📊 View Analytics
                </button>
                <button
                  className={styles.deleteBtn}
                  onClick={() => handleDelete(ad.id)}
                >
                  🗑️ Delete
                </button>
              </div>
            </div>
          ))
        ) : (
          <div className={styles.emptyState}>
            <h3>No Active Campaigns</h3>
            <p>Start advertising to reach more healthcare professionals</p>
            <Link to="/pricing" className={styles.createFirstAdBtn}>
              Create Your First Ad
            </Link>
          </div>
        )}
      </div>

      <div className={styles.helpSection}>
        <h3>💡 Advertising Tips</h3>
        <ul>
          <li>
            Featured listings get 3x more visibility than regular job posts
          </li>
          <li>Premium banners appear on the homepage and job search pages</li>
          <li>Update your ads regularly to maintain engagement</li>
          <li>Monitor your CTR to optimize ad performance</li>
        </ul>
      </div>
    </div>
  );
}