import { Link } from "react-router";
import styles from "./EmployeeDashboard.module.css";
import {
  useGetAppliedJobsQuery,
  useGetJobsQuery,
} from "../../services/jobsApi";
import { useWhoAmIQuery } from "../../services/userApi";
import { useGetMyProfileQuery } from "../../services/talentApi";
import { useMemo } from "react";

export default function EmployeeDashboard() {
  // Get current user info
  const { data: user, isLoading: userLoading } = useWhoAmIQuery();

  // Get talent profile for completeness calculation
  const { data: profile, isLoading: profileLoading } = useGetMyProfileQuery(
    user?.talent_id,
    {
      skip: !user?.talent_id,
    },
  );

  // Get applied jobs for the current user
  const {
    data: appliedJobsData,
    isLoading: applicationsLoading,
    isError: applicationsError,
  } = useGetAppliedJobsQuery({ limit: 3 });

  // Get jobs for recommendations based on profession using API filters
  const { data: jobsData } = useGetJobsQuery(
    {
      limit: 2,
      title__icontains: profile?.profession || "",
    },
    {
      skip: !profile?.profession,
    },
  );

  // Calculate profile completeness (same logic as TalentProfileEdit)
  const profileCompleteness = useMemo(() => {
    if (!profile) return { percentage: 0, missing: [] };

    const skills = profile.skill || [];
    const workExperience = profile.work_experience || [];
    const education = profile.education || [];
    const credentials = profile.credentials || [];

    const checks = [
      {
        name: "Profile Photo",
        completed: !!profile.img?.image,
        weight: 15,
      },
      {
        name: "Full Name",
        completed: !!profile.full_name?.trim(),
        weight: 10,
      },
      {
        name: "Profession",
        completed: !!profile.profession,
        weight: 10,
      },
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
      {
        name: "Location",
        completed: !!profile.location?.trim(),
        weight: 5,
      },
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
      {
        name: "At least 3 Skills",
        completed: skills.length >= 3,
        weight: 10,
      },
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

    const totalWeight = checks.reduce((sum, check) => sum + check.weight, 0);
    const completedWeight = checks
      .filter((check) => check.completed)
      .reduce((sum, check) => sum + check.weight, 0);

    const percentage = Math.round((completedWeight / totalWeight) * 100);
    const missing = checks.filter((check) => !check.completed);

    return { percentage, missing };
  }, [profile]);

  // Get recommended jobs - now filtered by API
  const recommendedJobs = useMemo(() => {
    if (!jobsData?.results) return [];
    return jobsData.results.slice(0, 2);
  }, [jobsData]);

  // Format status for display
  const formatStatus = (status) => {
    const statusMap = {
      PENDING: "Pending",
      "UNDER REVIEW": "Under Review",
      INTERVIEW_SCHEDULED: "Interview Scheduled",
      SHORTLISTED: "Shortlisted",
      ACCEPTED: "Accepted",
      REJECTED: "Rejected",
      WITHDRAWN: "Withdrawn",
    };
    return statusMap[status] || status;
  };

  // Get status class (matching your original CSS classes)
  const getStatusClass = (status) => {
    const displayStatus = formatStatus(status);
    const statusMap = {
      Pending: "pending",
      "Under Review": "underreview",
      "Interview Scheduled": "interviewscheduled",
      Shortlisted: "shortlisted",
      Rejected: "rejected",
      Withdrawn: "withdrawn",
      Accepted: "accepted",
    };
    return statusMap[displayStatus] || "";
  };

  // Calculate stats from applied jobs data
  const stats = useMemo(() => {
    if (!appliedJobsData?.results) {
      return [
        { label: "Applications Submitted", value: "0", icon: "📄" },
        { label: "Interviews Scheduled", value: "0", icon: "📅" },
        { label: "Profile Views", value: "0", icon: "👁️" },
      ];
    }

    const applications = appliedJobsData.results;
    const totalApplications = appliedJobsData.count || applications.length;
    const interviewsScheduled = applications.filter(
      (app) => app.status === "INTERVIEW_SCHEDULED",
    ).length;

    return [
      {
        label: "Applications Submitted",
        value: totalApplications.toString(),
        icon: "📄",
      },
      {
        label: "Interviews Scheduled",
        value: interviewsScheduled.toString(),
        icon: "📅",
      },
      { label: "Profile Views", value: "0", icon: "👁️" },
    ];
  }, [appliedJobsData]);

  // Format date
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  };

  // Get progress bar color based on percentage
  const getProgressColor = () => {
    const percentage = profileCompleteness.percentage;
    if (percentage === 100) return "#10b981";
    if (percentage >= 75) return "#059669";
    if (percentage >= 50) return "#f59e0b";
    return "#ef4444";
  };

  const applications = appliedJobsData?.results || [];
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
              <p>Error loading applications. Please try again later.</p>
            ) : applications.length === 0 ? (
              <p>
                No applications yet. <Link to="/jobs">Browse jobs</Link> to get
                started!
              </p>
            ) : (
              applications.map((app) => (
                <div key={app.id} className={styles.applicationCard}>
                  <div className={styles.applicationInfo}>
                    <h3>{app["job"]?.title || "Job Title"}</h3>
                    <p className={styles.hospital}>
                      {app["company"]?.company_name || "Company"}
                    </p>
                    <p className={styles.appliedDate}>
                      Applied on {formatDate(app.applied_at)}
                    </p>
                  </div>
                  <div className={styles.applicationStatus}>
                    <span
                      className={`${styles.statusBadge} ${
                        styles[getStatusClass(app.status)]
                      }`}
                    >
                      {formatStatus(app.status)}
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
              ></div>
            </div>
            <p className={styles.completionText}>
              {profileCompleteness.percentage}% Complete
            </p>

            {profileCompleteness.percentage < 100 && (
              <div className={styles.missingItemsSmall}>
                <p className={styles.missingTitle}>Next steps:</p>
                {profileCompleteness.missing.slice(0, 3).map((item, index) => (
                  <p key={index} className={styles.missingItemSmall}>
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
                No recommendations yet. Complete your profile to see
                personalized job matches!
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

          <div className={styles.quickActions}>
            <h3>Quick Actions</h3>
            <Link
              to="/employee-dashboard/interviews"
              className={styles.actionButton}
            >
              Check Interviews
            </Link>
            <Link to="/notifications" className={styles.actionButton}>
              View Notifications
            </Link>
            <Link to="/chat" className={styles.actionButton}>
              Messages
            </Link>
          </div>
        </aside>
      </div>
    </div>
  );
}
