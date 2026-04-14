import { useState } from "react";
import styles from "./AdminLocumManager.module.css";
import {
  useGetRecipientsQuery,
  useUpdateRecipientMutation,
} from "../../services/paymentApi";

const TALENT_SHARE = 0.95;

function fmt(n) {
  if (!n && n !== 0) return "₦0";
  return `₦${Number(parseFloat(n)).toLocaleString()}`;
}
function fmtDate(d) {
  if (!d) return "—";
  try { return new Date(d).toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" }); }
  catch { return d; }
}

export default function AdminLocumManager() {
  const [filter, setFilter]   = useState("pending");
  const [search, setSearch]   = useState("");
  const [toast, setToast]     = useState(null);

  const { data: raw, isLoading, refetch } = useGetRecipientsQuery();
  const [updateRecipient, { isLoading: saving }] = useUpdateRecipientMutation();

  const all      = raw?.results ?? raw ?? [];
  const pending  = all.filter(r => !r.eligible);
  const approved = all.filter(r => r.eligible === true);
  const shown    = (filter === "pending" ? pending : filter === "approved" ? approved : all)
    .filter(r => {
      if (!search.trim()) return true;
      const q = search.toLowerCase();
      return (r.talent_name  || "").toLowerCase().includes(q)
          || (r.talent_email || "").toLowerCase().includes(q)
          || (r.job_title    || "").toLowerCase().includes(q)
          || (r.company_name || "").toLowerCase().includes(q);
    });

  function showToast(msg, type = "success") {
    setToast({ msg, type });
    setTimeout(() => setToast(null), 3500);
  }

  async function handleApprove(id) {
    try {
      await updateRecipient({ id, eligible: true }).unwrap();
      showToast("✅ Payment approved — talent can now withdraw");
      refetch();
    } catch (err) {
      showToast("Failed to approve: " + (err?.data?.error ?? "unknown error"), "error");
    }
  }

  async function handleRevoke(id) {
    try {
      await updateRecipient({ id, eligible: false }).unwrap();
      showToast("Approval revoked");
      refetch();
    } catch (err) {
      showToast("Failed to revoke", "error");
    }
  }

  const totalGross    = all.reduce((s, r) => s + parseFloat(r.payment_amount ?? 0), 0);
  const totalPlatform = totalGross * 0.05;
  const totalTalent   = totalGross * TALENT_SHARE;

  return (
    <div className={styles.page}>
      {toast && (
        <div className={`${styles.toast} ${styles[toast.type]}`}>{toast.msg}</div>
      )}

      <div className={styles.header}>
        <div>
          <h1>🏥 Locum Payment Manager</h1>
          <p>Approve payments so talents can withdraw their earnings</p>
        </div>
      </div>

      {/* Summary cards */}
      <div className={styles.cards}>
        <div className={styles.card}>
          <span className={styles.cardIcon}>⏳</span>
          <div>
            <p className={styles.cardVal}>{isLoading ? "…" : pending.length}</p>
            <p className={styles.cardLbl}>Pending Approval</p>
          </div>
        </div>
        <div className={`${styles.card} ${styles.cardGreen}`}>
          <span className={styles.cardIcon}>✅</span>
          <div>
            <p className={styles.cardVal}>{isLoading ? "…" : approved.length}</p>
            <p className={styles.cardLbl}>Approved</p>
          </div>
        </div>
        <div className={`${styles.card} ${styles.cardBlue}`}>
          <span className={styles.cardIcon}>💰</span>
          <div>
            <p className={styles.cardVal}>{fmt(totalGross)}</p>
            <p className={styles.cardLbl}>Total Gross Paid</p>
          </div>
        </div>
        <div className={`${styles.card} ${styles.cardPurple}`}>
          <span className={styles.cardIcon}>📈</span>
          <div>
            <p className={styles.cardVal}>{fmt(totalPlatform)}</p>
            <p className={styles.cardLbl}>Platform Earnings (5%)</p>
          </div>
        </div>
        <div className={`${styles.card} ${styles.cardTeal}`}>
          <span className={styles.cardIcon}>👤</span>
          <div>
            <p className={styles.cardVal}>{fmt(totalTalent)}</p>
            <p className={styles.cardLbl}>Talent Earnings (95%)</p>
          </div>
        </div>
      </div>

      {/* Controls */}
      <div className={styles.controls}>
        <div className={styles.tabs}>
          {[
            { key: "pending",  label: "Pending",  count: pending.length },
            { key: "approved", label: "Approved", count: approved.length },
            { key: "all",      label: "All",      count: all.length },
          ].map(t => (
            <button
              key={t.key}
              className={`${styles.tab} ${filter === t.key ? styles.tabActive : ""}`}
              onClick={() => setFilter(t.key)}
            >
              {t.label} <span className={styles.badge}>{t.count}</span>
            </button>
          ))}
        </div>
        <input
          className={styles.search}
          placeholder="Search talent, job, company…"
          value={search}
          onChange={e => setSearch(e.target.value)}
        />
      </div>

      {/* Table */}
      {isLoading ? (
        <div className={styles.loading}>Loading payments…</div>
      ) : shown.length === 0 ? (
        <div className={styles.empty}>
          <span>🏥</span>
          <p>{filter === "pending" ? "No payments pending approval" : "No payments found"}</p>
        </div>
      ) : (
        <div className={styles.tableWrap}>
          <table className={styles.table}>
            <thead>
              <tr>
                <th>Talent</th>
                <th>Job</th>
                <th>Employer / Company</th>
                <th>Gross Amount</th>
                <th>Talent Receives (95%)</th>
                <th>Platform (5%)</th>
                <th>Date</th>
                <th>Status</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {shown.map(r => {
                const gross    = parseFloat(r.payment_amount ?? 0);
                const net      = gross * TALENT_SHARE;
                const platform = gross * 0.05;
                const isPmtOk  = r.payment_status === "success" || r.payment_status === "SUCCESS";
                return (
                  <tr key={r.id} className={r.eligible ? styles.rowApproved : styles.rowPending}>
                    <td>
                      <div className={styles.talentCell}>
                        <div className={styles.talentAvatar}>
                          {(r.talent_name || r.talent_email || "T")[0].toUpperCase()}
                        </div>
                        <div>
                          <div className={styles.talentName}>{r.talent_name || "—"}</div>
                          <div className={styles.talentEmail}>{r.talent_email || "—"}</div>
                        </div>
                      </div>
                    </td>
                    <td className={styles.tdMute}>{r.job_title ?? "—"}</td>
                    <td className={styles.tdMute}>{r.company_name || r.employer_email || "—"}</td>
                    <td className={styles.tdMoney}>{fmt(gross)}</td>
                    <td className={styles.tdGreen}>{fmt(net)}</td>
                    <td className={styles.tdPurple}>{fmt(platform)}</td>
                    <td className={styles.tdMute}>{fmtDate(r.payment_date ?? r.date)}</td>
                    <td>
                      {!isPmtOk && (
                        <span className={styles.pillRed}>Payment Failed</span>
                      )}
                      {isPmtOk && (
                        <span className={r.eligible ? styles.pillGreen : styles.pillAmber}>
                          {r.eligible ? "✅ Approved" : "⏳ Pending"}
                        </span>
                      )}
                    </td>
                    <td>
                      {isPmtOk && (
                        <div className={styles.actions}>
                          {!r.eligible ? (
                            <button
                              className={styles.btnApprove}
                              disabled={saving}
                              onClick={() => handleApprove(r.id)}
                            >
                              ✓ Approve
                            </button>
                          ) : (
                            <button
                              className={styles.btnRevoke}
                              disabled={saving}
                              onClick={() => handleRevoke(r.id)}
                            >
                              Revoke
                            </button>
                          )}
                        </div>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}