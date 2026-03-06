import { useState } from "react";
import styles from "./AdminVerification.module.css";

export default function AdminVerification() {
  const [filter, setFilter] = useState("pending");
  const [selectedUser, setSelectedUser] = useState(null);

  const verifications = [
    {
      id: 1,
      name: "Dr. Amaka Johnson",
      type: "Employee",
      profession: "Medical Doctor",
      license: "MD-12345-NG",
      status: "pending",
      documents: 5,
      submittedDate: "Jan 20, 2026",
      email: "amaka.johnson@email.com",
      phone: "+234 801 234 5678",
    },
    {
      id: 2,
      name: "Nurse Chioma Obi",
      type: "Employee",
      profession: "Registered Nurse",
      license: "RN-67890-NG",
      status: "pending",
      documents: 4,
      submittedDate: "Jan 19, 2026",
      email: "chioma.obi@email.com",
      phone: "+234 802 345 6789",
    },
    {
      id: 3,
      name: "General Hospital Ikeja",
      type: "Employer",
      profession: "Hospital",
      license: "CAC-BN-123456",
      status: "pending",
      documents: 8,
      submittedDate: "Jan 18, 2026",
      email: "admin@generalhospital.ng",
      phone: "+234 803 456 7890",
    },
    {
      id: 4,
      name: "Dr. Ibrahim Yusuf",
      type: "Employee",
      profession: "Surgeon",
      license: "MD-54321-NG",
      status: "approved",
      documents: 6,
      submittedDate: "Jan 15, 2026",
      email: "ibrahim.yusuf@email.com",
      phone: "+234 804 567 8901",
    },
    {
      id: 5,
      name: "St. Mary's Clinic",
      type: "Employer",
      profession: "Clinic",
      license: "CAC-RC-987654",
      status: "rejected",
      documents: 3,
      submittedDate: "Jan 10, 2026",
      email: "info@stmarysclinic.ng",
      phone: "+234 805 678 9012",
    },
  ];

  const filteredVerifications = verifications.filter((v) => {
    if (filter === "all") return true;
    return v.status === filter;
  });

  return (
    <div className={styles.verificationPage}>
      <div className={styles.header}>
        <h1>Credential Verification</h1>
        <p>Review and verify user credentials and documents</p>
      </div>

      <div className={styles.stats}>
        <div className={styles.statCard}>
          <span className={styles.statNumber}>
            {verifications.filter((v) => v.status === "pending").length}
          </span>
          <span className={styles.statLabel}>Pending</span>
        </div>
        <div className={styles.statCard}>
          <span className={styles.statNumber}>
            {verifications.filter((v) => v.status === "approved").length}
          </span>
          <span className={styles.statLabel}>Approved</span>
        </div>
        <div className={styles.statCard}>
          <span className={styles.statNumber}>
            {verifications.filter((v) => v.status === "rejected").length}
          </span>
          <span className={styles.statLabel}>Rejected</span>
        </div>
      </div>

      <div className={styles.filters}>
        <button
          className={filter === "pending" ? styles.active : ""}
          onClick={() => setFilter("pending")}
        >
          Pending ({verifications.filter((v) => v.status === "pending").length})
        </button>
        <button
          className={filter === "approved" ? styles.active : ""}
          onClick={() => setFilter("approved")}
        >
          Approved
        </button>
        <button
          className={filter === "rejected" ? styles.active : ""}
          onClick={() => setFilter("rejected")}
        >
          Rejected
        </button>
        <button
          className={filter === "all" ? styles.active : ""}
          onClick={() => setFilter("all")}
        >
          All
        </button>
      </div>

      <div className={styles.verificationList}>
        {filteredVerifications.map((item) => (
          <div key={item.id} className={styles.verificationCard}>
            <div className={styles.cardHeader}>
              <div className={styles.userBasicInfo}>
                <h3>{item.name}</h3>
                <div className={styles.userMeta}>
                  <span className={styles.userType}>{item.type}</span>
                  <span>•</span>
                  <span>{item.profession}</span>
                </div>
              </div>
              <span className={`${styles.statusBadge} ${styles[item.status]}`}>
                {item.status.charAt(0).toUpperCase() + item.status.slice(1)}
              </span>
            </div>

            <div className={styles.cardBody}>
              <div className={styles.infoRow}>
                <div className={styles.infoItem}>
                  <span className={styles.label}>📋 License:</span>
                  <span className={styles.value}>{item.license}</span>
                </div>
                <div className={styles.infoItem}>
                  <span className={styles.label}>📄 Documents:</span>
                  <span className={styles.value}>{item.documents} files</span>
                </div>
                <div className={styles.infoItem}>
                  <span className={styles.label}>📅 Submitted:</span>
                  <span className={styles.value}>{item.submittedDate}</span>
                </div>
              </div>

              <div className={styles.contactInfo}>
                <span>📧 {item.email}</span>
                <span>📞 {item.phone}</span>
              </div>
            </div>

            <div className={styles.cardActions}>
              <button
                className={styles.viewDocsBtn}
                onClick={() => setSelectedUser(item)}
              >
                📂 View Documents
              </button>
              {item.status === "pending" && (
                <>
                  <button className={styles.approveBtn}>✓ Approve</button>
                  <button className={styles.rejectBtn}>✗ Reject</button>
                </>
              )}
              <button className={styles.detailsBtn}>Details</button>
            </div>
          </div>
        ))}
      </div>

      {selectedUser && (
        <div className={styles.modal} onClick={() => setSelectedUser(null)}>
          <div
            className={styles.modalContent}
            onClick={(e) => e.stopPropagation()}
          >
            <div className={styles.modalHeader}>
              <h3>Documents for {selectedUser.name}</h3>
              <button
                className={styles.closeModal}
                onClick={() => setSelectedUser(null)}
              >
                ✕
              </button>
            </div>
            <div className={styles.modalBody}>
              <div className={styles.documentList}>
                <div className={styles.documentItem}>
                  <span>📄 Professional License</span>
                  <button className={styles.downloadBtn}>Download</button>
                </div>
                <div className={styles.documentItem}>
                  <span>📄 ID Card</span>
                  <button className={styles.downloadBtn}>Download</button>
                </div>
                <div className={styles.documentItem}>
                  <span>📄 Certificate</span>
                  <button className={styles.downloadBtn}>Download</button>
                </div>
                <div className={styles.documentItem}>
                  <span>📄 CV/Resume</span>
                  <button className={styles.downloadBtn}>Download</button>
                </div>
                <div className={styles.documentItem}>
                  <span>📄 Reference Letter</span>
                  <button className={styles.downloadBtn}>Download</button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
