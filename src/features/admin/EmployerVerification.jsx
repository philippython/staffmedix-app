import { useState } from "react";
import { Link } from "react-router";
import AppNav from "../../components/AppNav";
import Footer from "../../components/Footer";
import Button from "../../components/Button";
import CustomSelect from "../../components/CustomSelect";
import Pagination from "../../components/Pagination";
import Input from "../../components/Input";
import styles from "./EmployerVerification.module.css";
import {
  useGetAllCompanyProfilesQuery,
  useSetCompanyVerifiedMutation,
} from "../../services/employerApi";

const statusOptions = ["All Status", "Pending", "Verified", "Rejected"];

function getInitials(name = "") {
  return name.split(" ").filter(Boolean).map((w) => w[0]).slice(0, 2).join("").toUpperCase() || "?";
}

function CompletionBar({ pct }) {
  const cls = pct < 40 ? styles.low : pct < 75 ? styles.mid : "";
  return (
    <div className={styles.completionWrap}>
      <div className={styles.completionBar}>
        <div className={`${styles.completionFill} ${cls}`} style={{ width: `${pct}%` }} />
      </div>
      <span className={styles.completionPct}>{pct}%</span>
    </div>
  );
}

// Count how many of the 16 verification fields are filled
function calcCompletion(company) {
  const fields = [
    "company_name", "website", "description", "organization_type",
    "registration_number", "staff_size", "logo",
  ];
  const filled = fields.filter((f) => company[f]);
  return Math.round((filled.length / fields.length) * 100);
}

export default function EmployerVerification() {
  const [currentPage, setCurrentPage] = useState(1);
  const [statusFilter, setStatusFilter] = useState("All Status");
  const [searchQuery, setSearchQuery] = useState("");

  const {
    data: companiesData,
    isLoading,
    isError,
  } = useGetAllCompanyProfilesQuery({
    verified:
      statusFilter === "Verified" ? true
      : statusFilter === "Rejected" ? false
      : undefined,
    search: searchQuery || undefined,
    offset: (currentPage - 1) * 20,
    limit: 20,
  });

  const [setCompanyVerified] = useSetCompanyVerifiedMutation();

  const companies = companiesData?.results ?? companiesData ?? [];
  const totalCount = companiesData?.count ?? companies.length;

  const pending   = companies.filter((c) => !c.verified && !c.rejected).length;
  const verified  = companies.filter((c) =>  c.verified).length;
  const rejected  = companies.filter((c) =>  c.rejected).length;

  const handleVerify = async (id, name) => {
    if (!window.confirm(`Verify "${name}"?`)) return;
    try {
      await setCompanyVerified({ profileId: id, verified: true }).unwrap();
    } catch {
      alert("Failed to verify. Please try again.");
    }
  };

  const handleReject = async (id, name) => {
    if (!window.confirm(`Reject "${name}"?`)) return;
    try {
      await setCompanyVerified({ profileId: id, verified: false }).unwrap();
    } catch {
      alert("Failed to reject. Please try again.");
    }
  };

  return (
    <>
      <AppNav />
      <main className={styles.employerVerification}>
        <div className={styles.container}>

          {/* Header */}
          <div className={styles.header}>
            <div>
              <h1>Employer Verification</h1>
              <p>Review and verify employer organisations</p>
            </div>
            <Link to="/admin/users">
              <Button variant="outline">← Back to Users</Button>
            </Link>
          </div>

          {/* Stats */}
          <div className={styles.statsBar}>
            <div className={styles.statCard}>
              <div className={styles.statNum}>{totalCount}</div>
              <div className={styles.statLabel}>Total Employers</div>
            </div>
            <div className={styles.statCard}>
              <div className={styles.statNum}>{pending}</div>
              <div className={styles.statLabel}>Pending Review</div>
            </div>
            <div className={styles.statCard}>
              <div className={styles.statNum}>{verified}</div>
              <div className={styles.statLabel}>Verified</div>
            </div>
            <div className={styles.statCard}>
              <div className={styles.statNum}>{rejected}</div>
              <div className={styles.statLabel}>Rejected</div>
            </div>
          </div>

          {/* Filters */}
          <div className={styles.filters}>
            <div className={styles.searchGroup}>
              <label>Search Employers</label>
              <Input>
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <circle cx="11" cy="11" r="8" /><path d="m21 21-4.3-4.3" />
                </svg>
                <input
                  type="text"
                  placeholder="Search by company name, email..."
                  value={searchQuery}
                  onChange={(e) => { setSearchQuery(e.target.value); setCurrentPage(1); }}
                />
              </Input>
            </div>
            <div className={styles.filterGroup}>
              <label>Status</label>
              <CustomSelect
                options={statusOptions}
                selectedOption={statusFilter}
                onOptionChange={(opt) => { setStatusFilter(opt); setCurrentPage(1); }}
              />
            </div>
          </div>

          {/* Table */}
          {isError ? (
            <div className={styles.error}>Failed to load employers. Please try again.</div>
          ) : isLoading ? (
            <div className={styles.loading}>
              <div className={styles.spinner} />
              <p>Loading employers...</p>
            </div>
          ) : companies.length > 0 ? (
            <>
              <div className={styles.tableContainer}>
                <table className={styles.table}>
                  <thead>
                    <tr>
                      <th>Company</th>
                      <th>Contact Email</th>
                      <th>Reg. Number</th>
                      <th>Profile</th>
                      <th>Status</th>
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {companies.map((company) => {
                      const pct = calcCompletion(company);
                      const isVerified = company.verified === true;
                      const isRejected = company.rejected === true;
                      return (
                        <tr key={company.id}>
                          <td>
                            <div className={styles.employerCell}>
                              {company.logo ? (
                                <img src={company.logo} alt={company.company_name} className={styles.logo} />
                              ) : (
                                <div className={styles.logoInitials}>
                                  {getInitials(company.company_name)}
                                </div>
                              )}
                              <div>
                                <div className={styles.companyName}>{company.company_name}</div>
                                <div className={styles.companyType}>{company.organization_type ?? "—"}</div>
                              </div>
                            </div>
                          </td>
                          <td>{company.user?.email ?? "—"}</td>
                          <td>{company.registration_number ?? "—"}</td>
                          <td><CompletionBar pct={pct} /></td>
                          <td>
                            {isVerified ? (
                              <span className={styles.verifiedBadge}>Verified</span>
                            ) : isRejected ? (
                              <span className={styles.rejectedBadge}>Rejected</span>
                            ) : (
                              <span className={styles.pendingBadge}>Pending</span>
                            )}
                          </td>
                          <td>
                            <div className={styles.actions}>
                              {!isVerified && (
                                <button
                                  className={styles.verifyBtn}
                                  onClick={() => handleVerify(company.id, company.company_name)}
                                >
                                  ✓ Verify
                                </button>
                              )}
                              {!isRejected && (
                                <button
                                  className={styles.rejectBtn}
                                  onClick={() => handleReject(company.id, company.company_name)}
                                >
                                  ✗ Reject
                                </button>
                              )}
                              <Link
                                to={`/organisations/${company.id}`}
                                className={styles.viewBtn}
                                title="View profile"
                              >
                                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                  <path d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7Z"/>
                                  <circle cx="12" cy="12" r="3"/>
                                </svg>
                              </Link>
                            </div>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
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
              <svg xmlns="http://www.w3.org/2000/svg" width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1">
                <rect x="2" y="7" width="20" height="14" rx="2" ry="2"/>
                <path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16"/>
              </svg>
              <h3>No employers found</h3>
              <p>
                {statusFilter !== "All Status"
                  ? `No ${statusFilter.toLowerCase()} employers at the moment`
                  : "Employer registrations will appear here"}
              </p>
            </div>
          )}

        </div>
      </main>
      <Footer />
    </>
  );
}