import { useState } from "react";
import { Link } from "react-router";
import styles from "./AllJobPostsList.module.css";
import {
  useGetJobsQuery,
  useGetAppliedJobsQuery,
  useDeleteJobMutation,
} from "../../services/jobsApi";
import { useWhoAmIQuery } from "../../services/userApi";

export default function AllJobPostsList() {
  const { data: user } = useWhoAmIQuery();
  const companyId = user?.company_id;

  const { data: jobsData, isLoading } = useGetJobsQuery(
    { company: companyId, limit: 100 },
    { skip: !companyId },
  );

  const { data: allAppliedData } = useGetAppliedJobsQuery(
    { limit: 500 },
    { skip: !companyId },
  );

  const [deleteJob, { isLoading: deleting }] = useDeleteJobMutation();
  const [confirmDeleteId, setConfirmDeleteId] = useState(null);
  const [deleteErr, setDeleteErr] = useState("");

  const jobPosts = jobsData?.results ?? [];

  // Index applied jobs by job id — cross-reference against employer's own job IDs
  const appliedByJob = {};
  const employerJobIds = new Set(jobPosts.map((j) => j.id));
  const allApplied = (allAppliedData?.results ?? allAppliedData ?? []).filter(
    (aj) => employerJobIds.has(aj.job?.id),
  );
  allApplied.forEach((aj) => {
    const jid = aj.job?.id;
    if (!jid) return;
    if (!appliedByJob[jid]) appliedByJob[jid] = [];
    appliedByJob[jid].push(aj);
  });

  async function handleDelete(jobId) {
    setDeleteErr("");
    try {
      await deleteJob(jobId).unwrap();
      setConfirmDeleteId(null);
    } catch (err) {
      setDeleteErr(err?.data?.detail || "Failed to delete job.");
    }
  }

  if (isLoading) return <p style={{ padding: "2rem" }}>Loading jobs...</p>;

  return (
    <div className={styles.allJobPosts}>
      <div className={styles.header}>
        <div>
          <h1>All Job Posts</h1>
          <p>Manage all your job postings in one place</p>
        </div>
        <Link to="/employer-dashboard/post-job" className={styles.createJobBtn}>
          + Create New Job
        </Link>
      </div>

      <div className={styles.jobsList}>
        {jobPosts.length === 0 ? (
          <div className={styles.empty}>
            <p>No job posts found.</p>
            <Link
              to="/employer-dashboard/post-job"
              className={styles.createJobBtn}
            >
              Post Your First Job
            </Link>
          </div>
        ) : (
          jobPosts.map((job) => {
            const jobApplied = appliedByJob[job.id] ?? [];
            const interviewCount = jobApplied.filter(
              (aj) => aj.interview,
            ).length;

            return (
              <div
                key={job.id}
                className={`${styles.jobCard} ${!job.active ? styles.inactiveCard : ""}`}
              >
                <div className={styles.cardHeader}>
                  <div>
                    <div className={styles.titleRow}>
                      <h3>{job.title}</h3>
                      <span
                        className={
                          job.active ? styles.activeBadge : styles.inactiveBadge
                        }
                      >
                        {job.active ? "Active" : "Inactive"}
                      </span>
                    </div>
                    <div className={styles.jobMeta}>
                      <span>📍 {job.location}</span>
                      <span>•</span>
                      <span>
                        💰 ₦{Number(job.salary_min).toLocaleString()} – ₦
                        {Number(job.salary_max).toLocaleString()}
                      </span>
                      <span>•</span>
                      <span>{job.employment_type}</span>
                    </div>
                  </div>
                </div>

                <div className={styles.cardBody}>
                  <div className={styles.statsGrid}>
                    <div className={styles.statItem}>
                      <span className={styles.statValue}>
                        {jobApplied.length}
                      </span>
                      <span className={styles.statLabel}>Applications</span>
                    </div>
                    <div className={styles.statItem}>
                      <span className={styles.statValue}>{interviewCount}</span>
                      <span className={styles.statLabel}>Interviews</span>
                    </div>
                    <div className={styles.statItem}>
                      <span className={styles.statValue}>{job.views ?? 0}</span>
                      <span className={styles.statLabel}>Views</span>
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
                    Edit
                  </Link>
                  <button
                    className={styles.deleteBtn}
                    onClick={() => {
                      setConfirmDeleteId(job.id);
                      setDeleteErr("");
                    }}
                  >
                    Delete
                  </button>
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* Delete confirmation modal */}
      {confirmDeleteId && (
        <div
          className={styles.modalOverlay}
          onClick={() => setConfirmDeleteId(null)}
        >
          <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
            <h3>Delete Job Post?</h3>
            <p>
              This will permanently delete{" "}
              <strong>
                {jobPosts.find((j) => j.id === confirmDeleteId)?.title}
              </strong>{" "}
              and all its applications. This cannot be undone.
            </p>
            {deleteErr && <p className={styles.deleteErr}>{deleteErr}</p>}
            <div className={styles.modalActions}>
              <button
                className={styles.cancelBtn}
                onClick={() => setConfirmDeleteId(null)}
              >
                Keep Job
              </button>
              <button
                className={styles.confirmDeleteBtn}
                onClick={() => handleDelete(confirmDeleteId)}
                disabled={deleting}
              >
                {deleting ? "Deleting…" : "Yes, Delete"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
