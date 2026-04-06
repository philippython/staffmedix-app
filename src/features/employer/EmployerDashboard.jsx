import { Link } from "react-router";
import styles from "./EmployerDashboard.module.css";
import VerificationBanner from "../../components/VerificationBanner";
import { useCompanyVerification } from "../../hooks/useCompanyVerification";
import { useGetCompanyProfileByIdQuery } from "../../services/employerApi";
import {
  useGetJobsQuery,
  useGetAppliedJobsQuery,
} from "../../services/jobsApi";
import { useWhoAmIQuery } from "../../services/userApi";
import {
  useGetSubscriptionsQuery,
  useGetPlanByIdQuery,
} from "../../services/subscriptionApi";
import { usePlanFeatures } from "../../hooks/usePlanFeatures";
import { useGetPaymentsQuery } from "../../services/paymentApi";

export default function EmployerDashboard() {
  const { data: user } = useWhoAmIQuery();
  const companyId = user?.company_id;

  const { data: company } = useGetCompanyProfileByIdQuery(companyId, {
    skip: !companyId,
  });

  const { data: jobsData, isLoading } = useGetJobsQuery(
    { company: companyId, limit: 100 },
    { skip: !companyId },
  );

  const { data: subscriptionsData } = useGetSubscriptionsQuery(
    { companyId },
    { skip: !companyId },
  );

  const allSubscriptions =
    subscriptionsData?.results ?? subscriptionsData ?? [];
  const subscription =
    allSubscriptions.find((s) => s.active === true) ??
    allSubscriptions.find(
      (s) => s.expiry_date && new Date(s.expiry_date) > new Date(),
    ) ??
    null;

  // subscription.plan can be a UUID string OR a nested plan object {id, type, name}
  const planIsObj  = subscription?.plan && typeof subscription.plan === "object";
  const planId     = planIsObj ? subscription.plan.id : subscription?.plan;
  const { data: planData } = useGetPlanByIdQuery(planId, {
    skip: !planId || planIsObj,
  });
  const resolvedPlan = planIsObj ? subscription.plan : planData;

  const isBasicPlan = !subscription;
  const planName = resolvedPlan?.type ?? resolvedPlan?.name ?? "Basic";
  const expiryDate = subscription?.expiry_date
    ? new Date(subscription.expiry_date).toLocaleDateString("en-GB", {
        day: "numeric",
        month: "short",
        year: "numeric",
      })
    : null;

  const verification = useCompanyVerification();
  const { hasMessaging, planType, canPostLocum } = usePlanFeatures();
  const { data: paymentsData } = useGetPaymentsQuery();

  const jobPosts = jobsData?.results ?? [];

  // Fetch all applied jobs for this company to count interviews
  const { data: allAppliedData } = useGetAppliedJobsQuery(
    { limit: 500 },
    { skip: !companyId },
  );

  // Filter using employer's own job IDs — most reliable since jobPosts is already
  // scoped to this company via useGetJobsQuery({ company: companyId })
  const employerJobIds = new Set(jobPosts.map((j) => j.id));
  const allApplied = (allAppliedData?.results ?? allAppliedData ?? []).filter(
    (aj) => employerJobIds.has(aj.job?.id),
  );

  const totalApplications = allApplied.length;

  const scheduledInterviews = allApplied.filter(
    (aj) => aj.interview && aj.interview.status === "UPCOMING",
  ).length;

  const stats = [
    {
      label: "Total Job Posts",
      value: jobPosts.length.toString(),
      icon: "💼",
    },
    {
      label: "Total Applications",
      value: totalApplications.toString(),
      icon: "📄",
    },
    {
      label: "Interviews Scheduled",
      value: scheduledInterviews.toString(),
      icon: "📅",
    },
    {
      label: "Active Jobs",
      value: jobPosts.filter((j) => j.active).length.toString(),
      icon: "✅",
    },
  ];

  return (
    <div className={styles.dashboard}>
      <div className={styles.dashboardHeader}>
        <div>
          <h1>Welcome back, {company?.company_name ?? "Employer"}!</h1>
          <p>Manage your job postings and candidate applications</p>
        </div>
        <div className={styles.headerActionButtons}>
          <Link
            to="/employer-dashboard/settings"
            className={styles.settingsButton}
          >
            ⚙️ Settings
          </Link>
          <Link
            to="/employer-dashboard/post-job"
            className={styles.postJobButton}
          >
            + Post New Job
          </Link>
        </div>
      </div>

      <VerificationBanner verification={verification} />

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
        <section className={styles.jobPostsSection}>
          <div className={styles.sectionHeader}>
            <h2>Job Posts</h2>
            <Link to="/employer-dashboard/all-job-posts">View All</Link>
          </div>

          <div className={styles.jobPostsList}>
            {isLoading ? (
              <p>Loading...</p>
            ) : jobPosts.length === 0 ? (
              <p>No job posts yet.</p>
            ) : (
              jobPosts.slice(0, 3).map((job) => (
                <div key={job.id} className={styles.jobPostCard}>
                  <div className={styles.jobPostHeader}>
                    <h3>{job.title}</h3>
                  </div>
                  <div className={styles.jobPostDetails}>
                    <span>
                      👥{" "}
                      {allApplied.filter((aj) => aj.job?.id === job.id).length}{" "}
                      applicant
                      {allApplied.filter((aj) => aj.job?.id === job.id)
                        .length !== 1
                        ? "s"
                        : ""}
                    </span>
                    <span>
                      🎯{" "}
                      {
                        allApplied.filter(
                          (aj) => aj.job?.id === job.id && aj.interview,
                        ).length
                      }{" "}
                      interview
                      {allApplied.filter(
                        (aj) => aj.job?.id === job.id && aj.interview,
                      ).length !== 1
                        ? "s"
                        : ""}{" "}
                      scheduled
                    </span>
                    <span>
                      📅 Posted:{" "}
                      {new Date(job.created_at).toLocaleDateString("en-GB", {
                        day: "numeric",
                        month: "short",
                        year: "numeric",
                      })}
                    </span>
                    <span>
                      ⏰ Deadline:{" "}
                      {new Date(job.deadline).toLocaleDateString("en-GB", {
                        day: "numeric",
                        month: "short",
                        year: "numeric",
                      })}
                    </span>
                  </div>
                  <div className={styles.jobPostActions}>
                    <Link
                      to={`/employer-dashboard/view-applications/${job.id}`}
                      className={styles.viewButton}
                    >
                      View Applications
                    </Link>
                    <Link to={`/employer-dashboard/job-edit/${job.id}`}>
                      <button className={styles.editButton}>Edit</button>
                    </Link>
                  </div>
                </div>
              ))
            )}
          </div>
        </section>

        <aside className={styles.sidebar}>
          <div className={styles.recentApplications}>
            <h3>Recent Applications</h3>
            {allApplied.length === 0 ? (
              <p>No recent applications.</p>
            ) : (
              allApplied.slice(0, 3).map((aj) => (
                <div key={aj.id} className={styles.recentAppItem}>
                  <div className={styles.recentAppInfo}>
                    <span className={styles.recentAppName}>
                      {aj.talent?.full_name ?? "Candidate"}
                    </span>
                    <span className={styles.recentAppJob}>
                      {aj.job?.title ?? "Position"}
                    </span>
                  </div>
                  <span className={styles.recentAppStatus}>{aj.status}</span>
                </div>
              ))
            )}
            <Link
              to="/employer-dashboard/applications"
              className={styles.viewAllApps}
            >
              View All Applications
            </Link>
          </div>

          <div className={styles.quickActions}>
            <h3>Quick Actions</h3>
            <Link
              to="/employer-dashboard/interviews"
              className={styles.actionButton}
            >
              📝 Check Interviews
            </Link>
            <Link
              to="/employer-dashboard/settings"
              className={styles.actionButton}
            >
              💎 Upgrade Plan
            </Link>
            <Link
              to="/employer-dashboard/ads-manager"
              className={styles.actionButton}
            >
              📢 Advertise Your Organization
            </Link>
            {hasMessaging ? (
              <Link to="/employer-dashboard/chat" className={styles.actionButton}>
                💬 Messages
              </Link>
            ) : (
              <span className={styles.actionButtonLocked} title="Messaging requires Professional or Enterprise plan">
                💬 Messages <span className={styles.planLockBadge}>Pro+</span>
              </span>
            )}
            {canPostLocum ? (
              <Link to="/employer-dashboard/settings?tab=payments" className={styles.actionButton}>
                💰 Locum Payments
              </Link>
            ) : (
              <span className={styles.actionButtonLocked} title="Locum payments require Enterprise plan">
                💰 Locum Payments <span className={styles.planLockBadge}>Enterprise</span>
              </span>
            )}
          </div>

          <div className={styles.subscriptionInfo}>
            <h3>Subscription Status</h3>
            <div
              className={`${styles.planBadge} ${isBasicPlan ? styles.planBadgeFree : styles.planBadgePaid}`}
            >
              {planName} Plan
            </div>
            {isBasicPlan ? (
              <>
                <p className={styles.planDetails}>
                  Free plan • Limited features
                </p>
                <Link
                  to="/employer-dashboard/settings"
                  className={styles.upgradeLink}
                >
                  ⬆️ Upgrade Now
                </Link>
              </>
            ) : (
              <>
                <p className={styles.planDetails}>
                  {planName} plan • Full access
                </p>
                {expiryDate && (
                  <p className={styles.renewalDate}>Expires on {expiryDate}</p>
                )}
              </>
            )}
          </div>
        </aside>
      </div>
    </div>
  );
}