import { useState } from "react";
import { Link } from "react-router";
import styles from "./EmployeeDashboard.module.css";
import {
  useGetAppliedJobsQuery,
  useGetJobsQuery,
} from "../../services/jobsApi";
import { useWhoAmIQuery } from "../../services/userApi";
import { useGetMyProfileQuery } from "../../services/talentApi";
import { useGetPaymentsQuery } from "../../services/paymentApi";
import { useMemo } from "react";

export default function EmployeeDashboard() {
  const { data: user } = useWhoAmIQuery();

  const { data: profile } = useGetMyProfileQuery(user?.talent_id, {
    skip: !user?.talent_id,
  });

  const {
    data: appliedJobsData,
    isLoading: applicationsLoading,
    isError: applicationsError,
  } = useGetAppliedJobsQuery(
    { limit: 3, talent: user?.talent_id },
    { skip: !user?.talent_id },
  );

  const { data: earningsData } = useGetPaymentsQuery();
  const allEarnings   = earningsData?.results ?? earningsData ?? [];
  const totalEarned   = allEarnings
    .filter(p => p.type === "incoming" && p.status === "success")
    .reduce((sum, p) => sum + parseFloat(p.amount ?? 0), 0);
  const recentPayments = allEarnings.slice(0, 3);
  function fmtMoney(n) {
    if (!n) return "₦0";
    return `₦${Number(n).toLocaleString()}`;
  }

  const { data: jobsData } = useGetJobsQuery(
    { limit: 2, title: profile?.profession || "" },
    { skip: !profile?.profession },
  );

  const profileCompleteness = useMemo(() => {
    if (!profile) return { percentage: 0, missing: [] };
    const skills = profile.skill || [];
    const workExperience = profile.work_experience || [];
    const education = profile.education || [];
    const credentials = profile.credentials || [];
    const checks = [
      {
        name: "Profile Photo",
        completed: !!profile.images && profile.images.length > 0,
        weight: 15,
      },
      { name: "Full Name", completed: !!profile.full_name?.trim(), weight: 10 },
      { name: "Profession", completed: !!profile.profession, weight: 10 },
      {
        name: "Specialization",
        completed: !!profile.specialization?.trim(),
        weight: 10,
      },
      {
        name: "Phone Number",
        completed: !!profile.phone_number?.trim(),
        weight: 5,
      },
      { name: "Location", completed: !!profile.location?.trim(), weight: 5 },
      {
        name: "Biography",
        completed: !!profile.biography?.trim() && profile.biography.length > 50,
        weight: 10,
      },
      {
        name: "Years of Experience",
        completed:
          profile.years_of_experience !== null &&
          profile.years_of_experience >= 0,
        weight: 5,
      },
      { name: "At least 3 Skills", completed: skills.length >= 3, weight: 10 },
      {
        name: "At least 1 Work Experience",
        completed: workExperience.length >= 1,
        weight: 10,
      },
      {
        name: "At least 1 Education",
        completed: education.length >= 1,
        weight: 5,
      },
      {
        name: "Resume/CV Uploaded",
        completed: credentials.some((c) => c.type === "RESUME"),
        weight: 5,
      },
      {
        name: "Professional License",
        completed: credentials.some((c) => c.type === "LICENSE"),
        weight: 5,
      },
      {
        name: "At least 1 Certification",
        completed: credentials.some((c) => c.type === "CERTIFICATE"),
        weight: 5,
      },
    ];
    const totalWeight = checks.reduce((sum, c) => sum + c.weight, 0);
    const completedWeight = checks
      .filter((c) => c.completed)
      .reduce((sum, c) => sum + c.weight, 0);
    return {
      percentage: Math.round((completedWeight / totalWeight) * 100),
      missing: checks.filter((c) => !c.completed),
    };
  }, [profile]);

  // ── Correct status labels matching ApplicationStatus model ────────────────
  const STATUS_LABELS = {
    PENDING: "Pending",
    UNDER_REVIEW: "Under Review",
    SELECTED: "Selected",
    REJECTED: "Rejected",
  };

  const STATUS_CLASS = {
    PENDING: "pending",
    UNDER_REVIEW: "underreview",
    SELECTED: "accepted",
    REJECTED: "rejected",
  };

  const stats = useMemo(() => {
    if (!appliedJobsData?.results)
      return [
        { label: "Applications Submitted", value: "0", icon: "📄" },
        { label: "Under Review", value: "0", icon: "🔍" },
        { label: "Selected", value: "0", icon: "✅" },
      ];
    const applications = appliedJobsData.results;
    const total = appliedJobsData.count || applications.length;
    const underReview = applications.filter(
      (a) => a.status === "UNDER_REVIEW",
    ).length;
    const selected = applications.filter((a) => a.status === "SELECTED").length;
    return [
      { label: "Applications Submitted", value: total.toString(), icon: "📄" },
      { label: "Under Review", value: underReview.toString(), icon: "🔍" },
      { label: "Selected", value: selected.toString(), icon: "✅" },
      { label: "Total Earnings", value: fmtMoney(totalEarned), icon: "💰" },
    ];
  }, [appliedJobsData]);

  const formatDate = (d) =>
    new Date(d).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });

  const getProgressColor = () => {
    const p = profileCompleteness.percentage;
    if (p === 100) return "#10b981";
    if (p >= 75) return "#059669";
    if (p >= 50) return "#f59e0b";
    return "#ef4444";
  };

  const applications = appliedJobsData?.results || [];
  const recommendedJobs = jobsData?.results || [];
  const userName = user?.fullname || user?.username || "User";

  return (
    <div className={styles.dashboard}>
      <div className={styles.dashboardHeader}>
        <div>
          <h1>Welcome back, {userName}!</h1>
          <p>Here's what's happening with your applications</p>
        </div>
        <Link
          to={`/employee-dashboard/profile/edit/${user?.talent_id}`}
          className={styles.editProfile}
        >
          Edit Profile
        </Link>
      </div>

      <div className={styles.statsGrid}>
        {stats.map((stat, index) => (
          <div key={index} className={styles.statCard}>
            <span className={styles.statIcon}>{stat.icon}</span>
            <div>
              <p className={styles.statValue}>{stat.value}</p>
              <p className={styles.statLabel}>{stat.label}</p>
            </div>
          </div>
        ))}
      </div>

      <div className={styles.mainContent}>
        <section className={styles.applications}>
          <div className={styles.sectionHeader}>
            <h2>Recent Applications</h2>
            <Link to="/employee-dashboard/applications">View All</Link>
          </div>

          <div className={styles.applicationsList}>
            {applicationsLoading ? (
              <p>Loading applications...</p>
            ) : applicationsError ? (
              <p>Error loading applications.</p>
            ) : applications.length === 0 ? (
              <p>
                No applications yet. <Link to="/jobs">Browse jobs</Link> to get
                started!
              </p>
            ) : (
              applications.map((app) => (
                <div key={app.id} className={styles.applicationCard}>
                  <div className={styles.applicationInfo}>
                    <h3>{app.job?.title || "Job Title"}</h3>
                    <p className={styles.hospital}>
                      {app.company?.company_name || "Company"}
                    </p>
                    <p className={styles.appliedDate}>
                      Applied {formatDate(app.applied_at)}
                    </p>
                  </div>
                  <div className={styles.applicationStatus}>
                    <span
                      className={`${styles.statusBadge} ${styles[STATUS_CLASS[app.status] || "pending"]}`}
                    >
                      {STATUS_LABELS[app.status] ?? app.status}
                    </span>
                  </div>
                </div>
              ))
            )}
          </div>
        </section>

        <aside className={styles.sidebar}>
          <div className={styles.profileCompletion}>
            <div className={styles.completionHeader}>
              <h3>Profile Completion</h3>
              {profile?.verified && (
                <span className={styles.verifiedBadge}>✓ Verified</span>
              )}
            </div>
            <div className={styles.progressBar}>
              <div
                className={styles.progress}
                style={{
                  width: `${profileCompleteness.percentage}%`,
                  backgroundColor: getProgressColor(),
                }}
              />
            </div>
            <p className={styles.completionText}>
              {profileCompleteness.percentage}% Complete
            </p>
            {profileCompleteness.percentage < 100 && (
              <div className={styles.missingItemsSmall}>
                <p className={styles.missingTitle}>Next steps:</p>
                {profileCompleteness.missing.slice(0, 3).map((item, i) => (
                  <p key={i} className={styles.missingItemSmall}>
                    • {item.name}
                  </p>
                ))}
                {profileCompleteness.missing.length > 3 && (
                  <p className={styles.moreItems}>
                    +{profileCompleteness.missing.length - 3} more
                  </p>
                )}
              </div>
            )}
            <Link
              to={`/employee-dashboard/profile/edit/${user?.talent_id}`}
              className={styles.completeProfile}
            >
              {profileCompleteness.percentage === 100
                ? "Edit Profile"
                : "Complete Your Profile"}
            </Link>
          </div>

          <div className={styles.recommendedJobs}>
            <h3>Recommended Jobs</h3>
            {recommendedJobs.length === 0 ? (
              <p className={styles.noJobs}>
                Complete your profile to see personalized job matches!
              </p>
            ) : (
              recommendedJobs.map((job) => (
                <div key={job.id} className={styles.jobCard}>
                  <h4>{job.title}</h4>
                  <p>{job.company?.company_name || "Company"}</p>
                  <p className={styles.jobLocation}>📍 {job.location}</p>
                  <Link to={`/jobs/${job.id}`}>View Details</Link>
                </div>
              ))
            )}
          </div>

          <div className={styles.earningsCard}>
            <h3>💰 Earnings</h3>
            <p className={styles.earningsTotal}>{fmtMoney(totalEarned)}</p>
            <p className={styles.earningsSubLabel}>Total earned from locum jobs</p>
            {recentPayments.length > 0 && (
              <div className={styles.earningsList}>
                {recentPayments.filter(p => p.type === "incoming").map(p => (
                  <div key={p.id} className={styles.earningsItem}>
                    <span className={styles.earningsItemJob}>
                      {p.recipients?.[0]?.job?.title ?? p.reason}
                    </span>
                    <span className={styles.earningsItemAmt}>+{fmtMoney(p.amount)}</span>
                  </div>
                ))}
              </div>
            )}
            <Link to={`/employee-dashboard/profile/edit/${user?.talent_id}`}
              className={styles.completeProfile}>
              View All Earnings
            </Link>
          </div>

          <div className={styles.quickActions}>
            <h3>Quick Actions</h3>
            <Link
              to="/employee-dashboard/interviews"
              className={styles.actionButton}
            >
              Check Interviews
            </Link>
            <Link to="/employee-dashboard/chat" className={styles.actionButton}>
              Messages
            </Link>
          </div>
        </aside>
      </div>
    </div>
  );
}