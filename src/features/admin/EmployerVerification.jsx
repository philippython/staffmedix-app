import { useState } from "react";
import { Link } from "react-router";
import CustomSelect from "../../components/CustomSelect";
import Pagination from "../../components/Pagination";
import Input from "../../components/Input";
import styles from "./EmployerVerification.module.css";
import {
  useGetAllCompanyProfilesQuery,
  useSetCompanyVerifiedMutation,
} from "../../services/employerApi";
import { useSendNotificationMutation } from "../../services/notificationApi";

const statusOptions = ["All Status", "Pending", "Verified", "Rejected"];
const PAGE_SIZE = 20;

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

function calcCompletion(company) {
  const fields = ["company_name", "website", "description", "organization_type", "registration_number", "size", "logo"];
  return Math.round((fields.filter((f) => company[f]).length / fields.length) * 100);
}

export default function EmployerVerification() {
  const [currentPage, setCurrentPage]   = useState(1);
  const [statusFilter, setStatusFilter] = useState("All Status");
  const [searchQuery, setSearchQuery]   = useState("");
  const [queryTarget, setQueryTarget]   = useState(null);
  const [queryMsg, setQueryMsg]         = useState("");
  const [toast, setToast]               = useState(null);

  const { data: companiesData, isLoading, isError, refetch } =
    useGetAllCompanyProfilesQuery({ limit: 1000 });

  const [setCompanyVerified]                            = useSetCompanyVerifiedMutation();
  const [sendNotification, { isLoading: sendingQuery }] = useSendNotificationMutation();

  // Normalise — cover verified/rejected as 0/1/bool/null
  const allCompanies = (companiesData?.results ?? companiesData ?? []).map(c => ({
    ...c,
    verified: c.verified === true || c.verified === 1,
    rejected: c.rejected === true || c.rejected === 1,
  }));

  // Client-side filter
  const filtered = allCompanies.filter(c => {
    const matchesStatus =
      statusFilter === "Verified" ?  c.verified :
      statusFilter === "Rejected" ?  c.rejected :
      statusFilter === "Pending"  ? !c.verified && !c.rejected :
      true;

    const q = searchQuery.trim().toLowerCase();
    const matchesSearch = !q ||
      c.company_name?.toLowerCase().includes(q) ||
      c.user?.email?.toLowerCase().includes(q) ||
      c.email?.toLowerCase().includes(q) ||
      c.registration_number?.toLowerCase().includes(q) ||
      c.organization_type?.toLowerCase().includes(q);

    return matchesStatus && matchesSearch;
  });

  // Counts always from full dataset
  const totalAll      = allCompanies.length;
  const totalVerified = allCompanies.filter(c =>  c.verified).length;
  const totalRejected = allCompanies.filter(c =>  c.rejected).length;
  const totalPending  = allCompanies.filter(c => !c.verified && !c.rejected).length;

  // Pagination
  const totalPages = Math.ceil(filtered.length / PAGE_SIZE);
  const paginated  = filtered.slice((currentPage - 1) * PAGE_SIZE, currentPage * PAGE_SIZE);

  function handleFilterChange(opt) { setStatusFilter(opt); setCurrentPage(1); }
  function handleSearchChange(e)   { setSearchQuery(e.target.value); setCurrentPage(1); }

  function showToast(msg, type = "success") {
    setToast({ msg, type });
    setTimeout(() => setToast(null), 3500);
  }

  async function handleVerify(id, name) {
    try {
      await setCompanyVerified({ profileId: id, verified: true, rejected: false }).unwrap();
      showToast(`"${name}" verified`);
      refetch();
    } catch {
      showToast("Failed to verify. Please try again.", "error");
    }
  }

  async function handleReject(id, name) {
    try {
      await setCompanyVerified({ profileId: id, verified: false, rejected: true }).unwrap();
      showToast(`"${name}" rejected`);
      refetch();
    } catch {
      showToast("Failed to reject. Please try again.", "error");
    }
  }

  function openQuery(company) {
    const missing = [];
    if (!company.company_name)        missing.push("Company name");
    if (!company.organization_type)   missing.push("Organisation type");
    if (!company.registration_number) missing.push("Registration number");
    if (!company.website)             missing.push("Website");
    if (!company.description)         missing.push("Description");
    if (!company.logo)                missing.push("Company logo");

    const defaultMsg = missing.length
      ? `Hi ${company.company_name ?? "there"},\n\nTo complete verification on StaffMedix, please provide the following:\n\n${missing.map(m => `• ${m}`).join("\n")}\n\nOnce updated, we will review your profile.\n\nThe StaffMedix Admin Team`
      : `Hi ${company.company_name ?? "there"},\n\nYour profile is under review. We will be in touch shortly.\n\nThe StaffMedix Admin Team`;

    setQueryMsg(defaultMsg);
    setQueryTarget(company);
  }

  async function handleSendQuery() {
    if (!queryTarget) return;
    try {
      // Cover all serializer shapes:
      // user_id (explicit FK field) → user.id (nested object) → user (raw PK)
      const userId =
        queryTarget.user_id ??
        (typeof queryTarget.user === "object" ? queryTarget.user?.id : queryTarget.user) ??
        null;

      if (!userId) {
        showToast("Cannot resolve user ID — check serializer exposes user_id.", "error");
        return;
      }

      await sendNotification({
        userId,
        subject: "Action Required: Complete your StaffMedix employer profile",
        content: queryMsg,
      }).unwrap();
      showToast("Message sent to employer");
      setQueryTarget(null);
    } catch {
      showToast("Failed to send message", "error");
    }
  }

  return (
    <>
      <main className={styles.employerVerification}>
        <div className={styles.container}>

          {/* Header */}
          <div className={styles.header}>
            <div>
              <h1>Employer Verification</h1>
              <p>Review and verify employer organisations</p>
            </div>
          </div>

          {/* Stats */}
          <div className={styles.statsBar}>
            <div className={styles.statCard}>
              <div className={styles.statNum}>{isLoading ? "—" : totalAll}</div>
              <div className={styles.statLabel}>Total Employers</div>
            </div>
            <div className={styles.statCard}>
              <div className={styles.statNum}>{isLoading ? "—" : totalPending}</div>
              <div className={styles.statLabel}>Pending Review</div>
            </div>
            <div className={styles.statCard}>
              <div className={styles.statNum}>{isLoading ? "—" : totalVerified}</div>
              <div className={styles.statLabel}>Verified</div>
            </div>
            <div className={styles.statCard}>
              <div className={styles.statNum}>{isLoading ? "—" : totalRejected}</div>
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
                  onChange={handleSearchChange}
                />
              </Input>
            </div>
            <div className={styles.filterGroup}>
              <label>Status</label>
              <CustomSelect
                options={statusOptions}
                selectedOption={statusFilter}
                onOptionChange={handleFilterChange}
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
          ) : paginated.length > 0 ? (
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
                    {paginated.map((company) => {
                      const pct        = calcCompletion(company);
                      const isVerified = company.verified;
                      const isRejected = company.rejected;
                      const email      = company.user?.email ?? company.email ?? "—";
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
                          <td>{email}</td>
                          <td>{company.registration_number ?? "—"}</td>
                          <td><CompletionBar pct={pct} /></td>
                          <td>
                            {isVerified
                              ? <span className={styles.verifiedBadge}>Verified</span>
                              : isRejected
                              ? <span className={styles.rejectedBadge}>Rejected</span>
                              : <span className={styles.pendingBadge}>Pending</span>
                            }
                          </td>
                          <td>
                            <div className={styles.actions}>
                              {/* Verify — show when not yet verified */}
                              {!isVerified && (
                                <button
                                  className={styles.verifyBtn}
                                  onClick={() => handleVerify(company.id, company.company_name)}
                                >
                                  ✓ Verify
                                </button>
                              )}
                              {/* Reject — show when pending (not verified, not already rejected) */}
                              {!isVerified && !isRejected && (
                                <button
                                  className={styles.rejectBtn}
                                  onClick={() => handleReject(company.id, company.company_name)}
                                >
                                  ✗ Reject
                                </button>
                              )}
                              {/* Revoke — show when verified */}
                              {isVerified && (
                                <button
                                  className={styles.rejectBtn}
                                  onClick={() => handleReject(company.id, company.company_name)}
                                >
                                  ✗ Revoke
                                </button>
                              )}
                              <button
                                className={styles.queryBtn}
                                onClick={() => openQuery(company)}
                                title="Send query"
                              >
                                📨
                              </button>
                              <Link
                                to={`/employers/${company.id}`}
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

              {totalPages > 1 && (
                <Pagination
                  pages={totalPages}
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
                {statusFilter !== "All Status" || searchQuery
                  ? "Try adjusting your search or filter"
                  : "Employer registrations will appear here"}
              </p>
            </div>
          )}

        </div>

        {/* Toast */}
        {toast && (
          <div className={`${styles.toast} ${styles[toast.type]}`}>{toast.msg}</div>
        )}

        {/* Query modal */}
        {queryTarget && (
          <div className={styles.modalOverlay} onClick={() => setQueryTarget(null)}>
            <div className={styles.modal} onClick={e => e.stopPropagation()}>
              <div className={styles.modalHeader}>
                <h3>📨 Message to {queryTarget.company_name}</h3>
                <button className={styles.modalClose} onClick={() => setQueryTarget(null)}>✕</button>
              </div>
              <div className={styles.modalBody}>
                <label className={styles.modalLabel}>Subject</label>
                <p className={styles.modalSubject}>Action Required: Complete your StaffMedix employer profile</p>
                <label className={styles.modalLabel}>Message</label>
                <textarea
                  className={styles.modalTextarea}
                  value={queryMsg}
                  onChange={e => setQueryMsg(e.target.value)}
                  rows={10}
                />
              </div>
              <div className={styles.modalFooter}>
                <button className={styles.modalCancel} onClick={() => setQueryTarget(null)}>Cancel</button>
                <button
                  className={styles.modalSend}
                  disabled={sendingQuery}
                  onClick={handleSendQuery}
                >
                  {sendingQuery ? "Sending…" : "Send Message"}
                </button>
              </div>
            </div>
          </div>
        )}

      </main>
    </>
  );
}