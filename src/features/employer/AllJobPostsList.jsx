import { Link } from "react-router";
import styles from "./AllJobPostsList.module.css";
import { useGetJobsQuery } from "../../services/jobsApi";
import { useWhoAmIQuery } from "../../services/userApi";

export default function AllJobPostsList() {
  const { data: user } = useWhoAmIQuery();
  const { data: jobsData, isLoading } = useGetJobsQuery(
    { company: user?.company_id, limit: 100 },
    { skip: !user?.company_id },
  );

  const jobPosts = jobsData?.results ?? [];

  if (isLoading) return <p>Loading jobs...</p>;

  return (
    <div className={styles.allJobPosts}>
      <div className={styles.header}>
        <div>
          <h1 onClick={() => console.log(user)}>All Job Posts</h1>
          <p>Manage all your job postings in one place</p>
        </div>
        <Link to="/employer-dashboard/post-job" className={styles.createJobBtn}>
          + Create New Job
        </Link>
      </div>

      <div className={styles.jobsList}>
        {jobPosts.length === 0 ? (
          <p>No job posts found.</p>
        ) : (
          jobPosts.map((job) => (
            <div key={job.id} className={styles.jobCard}>
              <div className={styles.cardHeader}>
                <div>
                  <h3>{job.title}</h3>
                  <div className={styles.jobMeta}>
                    <span>📍 {job.location}</span>
                    <span>•</span>
                    <span>
                      💰 ₦{Number(job.salary_min).toLocaleString()} - ₦
                      {Number(job.salary_max).toLocaleString()}
                    </span>
                  </div>
                </div>
              </div>

              <div className={styles.cardBody}>
                <div className={styles.statsGrid}>
                  <div className={styles.statItem}>
                    <span className={styles.statValue}>
                      {job.applications_count ?? 0}
                    </span>
                    <span className={styles.statLabel}>Applications</span>
                  </div>
                  <div className={styles.statItem}>
                    <span className={styles.statValue}>{job.views ?? 0}</span>
                    <span className={styles.statLabel}>Views</span>
                  </div>
                  <div className={styles.statItem}>
                    <span className={styles.statValue}>
                      {new Date(job.created_at).toLocaleDateString("en-GB", {
                        day: "numeric",
                        month: "short",
                        year: "numeric",
                      })}
                    </span>
                    <span className={styles.statLabel}>Posted</span>
                  </div>
                  <div className={styles.statItem}>
                    <span className={styles.statValue}>
                      {new Date(job.deadline).toLocaleDateString("en-GB", {
                        day: "numeric",
                        month: "short",
                        year: "numeric",
                      })}
                    </span>
                    <span className={styles.statLabel}>Deadline</span>
                  </div>
                </div>
              </div>

              <div className={styles.cardActions}>
                <Link
                  to={`/employer-dashboard/view-applications/${job.id}`}
                  className={styles.viewAppsBtn}
                >
                  View Applications
                </Link>
                <Link
                  to={`/employer-dashboard/job-edit/${job.id}`}
                  className={styles.editBtn}
                >
                  Edit Job
                </Link>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
