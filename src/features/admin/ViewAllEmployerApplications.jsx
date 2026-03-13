import { useState } from "react";
import { Link, useParams } from "react-router-dom";
import AppNav from "../../components/AppNav";
import Footer from "../../components/Footer";
import Button from "../../components/Button";
import CustomSelect from "../../components/CustomSelect";
import Pagination from "../../components/Pagination";
import styles from "./ViewAllEmployerApplications.module.css";
import {
  useGetCompanyApplicationsQuery,
  useUpdateApplicationStatusMutation,
} from "../../services/companiesApi";

const statusOptions = ["All Status", "Pending", "Reviewing", "Accepted", "Rejected"];

export default function ViewAllEmployerApplications() {
  const { jobId } = useParams();
  const [currentPage, setCurrentPage] = useState(1);
  const [statusFilter, setStatusFilter] = useState("All Status");

  const {
    data: applicationsData,
    isLoading,
    isError,
  } = useGetCompanyApplicationsQuery({
    job_id: jobId || undefined,
    status: statusFilter !== "All Status" ? statusFilter.toLowerCase() : undefined,
    offset: currentPage === 1 ? 0 : (currentPage - 1) * 20,
    limit: 20,
  });

  const [updateStatus] = useUpdateApplicationStatusMutation();

  const applications = applicationsData?.results || applicationsData || [];
  const totalCount = applicationsData?.count || applications.length;

  const handleStatusUpdate = async (applicationId, newStatus) => {
    if (
      window.confirm(
        `Are you sure you want to ${newStatus} this application?`
      )
    ) {
      try {
        await updateStatus({ applicationId, status: newStatus }).unwrap();
        alert(`Application ${newStatus} successfully!`);
      } catch (error) {
        console.error("Failed to update status:", error);
        alert("Failed to update application status. Please try again.");
      }
    }
  };

  const getStatusColor = (status) => {
    const colors = {
      pending: "#f59e0b",
      reviewing: "#3b82f6",
      accepted: "#10b981",
      rejected: "#ef4444",
      withdrawn: "#6b7280",
    };
    return colors[status] || "#6b7280";
  };

  return (
    <>
      <AppNav />
      <main className={styles.viewAllApplications}>
        <div className={styles.container}>
          <div className={styles.header}>
            <div>
              <h1>All Applications</h1>
              <p>Manage and review candidate applications</p>
            </div>
            <Link to="/employer/dashboard">
              <Button variant="outline">Back to Dashboard</Button>
            </Link>
          </div>

          {/* Filters */}
          <div className={styles.filters}>
            <div className={styles.filterGroup}>
              <label>Filter by Status</label>
              <CustomSelect
                options={statusOptions}
                selectedOption={statusFilter}
                onOptionChange={(option) => {
                  setStatusFilter(option);
                  setCurrentPage(1);
                }}
              />
            </div>

            <div className={styles.stats}>
              <p>
                Showing <strong>{applications.length}</strong> of{" "}
                <strong>{totalCount}</strong> applications
              </p>
            </div>
          </div>

          {/* Applications List */}
          {isError ? (
            <div className={styles.error}>
              Failed to load applications. Please try again.
            </div>
          ) : isLoading ? (
            <div className={styles.loading}>
              <div className={styles.spinner}></div>
              <p>Loading applications...</p>
            </div>
          ) : applications.length > 0 ? (
            <>
              <div className={styles.applicationsGrid}>
                {applications.map((application) => (
                  <div key={application.id} className={styles.applicationCard}>
                    <div className={styles.cardHeader}>
                      <div className={styles.applicantInfo}>
                        <div className={styles.applicantAvatar}>
                          {application.talent?.talent_images?.[0]?.image ? (
                            <img
                              src={application.talent.talent_images[0].image}
                              alt={application.talent.full_name}
                            />
                          ) : (
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              width="32"
                              height="32"
                              viewBox="0 0 24 24"
                              fill="none"
                              stroke="currentColor"
                              strokeWidth="2"
                            >
                              <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
                              <circle cx="12" cy="7" r="4" />
                            </svg>
                          )}
                        </div>
                        <div>
                          <h3>
                            {application.talent?.full_name ||
                              application.talent?.user?.username ||
                              "Anonymous"}
                          </h3>
                          <p className={styles.jobTitle}>
                            Applied for: {application.job?.title}
                          </p>
                        </div>
                      </div>
                      <span
                        className={styles.statusBadge}
                        style={{
                          backgroundColor: getStatusColor(application.status),
                        }}
                      >
                        {application.status.charAt(0).toUpperCase() +
                          application.status.slice(1)}
                      </span>
                    </div>

                    <div className={styles.cardBody}>
                      <div className={styles.detailsGrid}>
                        {application.talent?.profession && (
                          <div className={styles.detail}>
                            <strong>Profession:</strong>
                            <span>{application.talent.profession}</span>
                          </div>
                        )}
                        {application.talent?.location && (
                          <div className={styles.detail}>
                            <strong>Location:</strong>
                            <span>{application.talent.location}</span>
                          </div>
                        )}
                        {application.talent?.years_of_experience !== null && (
                          <div className={styles.detail}>
                            <strong>Experience:</strong>
                            <span>
                              {application.talent.years_of_experience} years
                            </span>
                          </div>
                        )}
                        <div className={styles.detail}>
                          <strong>Applied:</strong>
                          <span>
                            {new Date(application.created_at).toLocaleDateString()}
                          </span>
                        </div>
                      </div>

                      {application.cover_letter && (
                        <div className={styles.coverLetter}>
                          <strong>Cover Letter:</strong>
                          <p>
                            {application.cover_letter.length > 200
                              ? `${application.cover_letter.substring(0, 200)}...`
                              : application.cover_letter}
                          </p>
                        </div>
                      )}
                    </div>

                    <div className={styles.cardFooter}>
                      <Link
                        to={`/talents/${application.talent?.id}`}
                        className={styles.viewProfileBtn}
                      >
                        View Profile
                      </Link>

                      {application.resume && (
                        <a
                          href={application.resume}
                          target="_blank"
                          rel="noopener noreferrer"
                          className={styles.downloadBtn}
                        >
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            width="18"
                            height="18"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="2"
                          >
                            <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                            <polyline points="7 10 12 15 17 10" />
                            <line x1="12" y1="15" x2="12" y2="3" />
                          </svg>
                          Resume
                        </a>
                      )}

                      {application.status === "pending" && (
                        <>
                          <Button
                            variant="outline"
                            onClick={() =>
                              handleStatusUpdate(application.id, "reviewing")
                            }
                          >
                            Mark Reviewing
                          </Button>
                          <button
                            className={styles.acceptBtn}
                            onClick={() =>
                              handleStatusUpdate(application.id, "accepted")
                            }
                          >
                            Accept
                          </button>
                          <button
                            className={styles.rejectBtn}
                            onClick={() =>
                              handleStatusUpdate(application.id, "rejected")
                            }
                          >
                            Reject
                          </button>
                        </>
                      )}

                      {application.status === "reviewing" && (
                        <>
                          <button
                            className={styles.acceptBtn}
                            onClick={() =>
                              handleStatusUpdate(application.id, "accepted")
                            }
                          >
                            Accept
                          </button>
                          <button
                            className={styles.rejectBtn}
                            onClick={() =>
                              handleStatusUpdate(application.id, "rejected")
                            }
                          >
                            Reject
                          </button>
                        </>
                      )}
                    </div>
                  </div>
                ))}
              </div>

              {totalCount > 20 && (
                <Pagination
                  pages={Math.ceil(totalCount / 20)}
                  currentPage={currentPage}
                  onPageChange={setCurrentPage}
                />
              )}
            </>
          ) : (
            <div className={styles.emptyState}>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="64"
                height="64"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="1"
              >
                <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
                <circle cx="9" cy="7" r="4" />
                <path d="M22 21v-2a4 4 0 0 0-3-3.87" />
                <path d="M16 3.13a4 4 0 0 1 0 7.75" />
              </svg>
              <h3>No applications found</h3>
              <p>
                {statusFilter !== "All Status"
                  ? `No ${statusFilter.toLowerCase()} applications at the moment`
                  : "Applications will appear here once candidates apply"}
              </p>
            </div>
          )}
        </div>
      </main>
      <Footer />
    </>
  );
}