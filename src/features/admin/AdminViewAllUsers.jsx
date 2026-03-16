import { useState } from "react";
import { Link } from "react-router";
import Button from "../../components/Button";
import CustomSelect from "../../components/CustomSelect";
import Pagination from "../../components/Pagination";
import Input from "../../components/Input";
import styles from "./AdminViewAllUsers.module.css";
import {
  useGetAllUsersQuery,
  useToggleUserStatusMutation,
  useDeleteUserMutation,
} from "../../services/userApi";

const roleOptions   = ["All Roles", "Talent", "Employer", "Admin"];
const statusOptions = ["All Status", "Active", "Inactive"];

function Toast({ toast }) {
  if (!toast) return null;
  return (
    <div className={`${styles.toast} ${styles[toast.type]}`}>{toast.msg}</div>
  );
}

function ConfirmModal({ msg, onConfirm, onCancel, loading }) {
  return (
    <div className={styles.overlay} onClick={onCancel}>
      <div className={styles.confirmModal} onClick={e => e.stopPropagation()}>
        <p>{msg}</p>
        <div className={styles.confirmActions}>
          <button className={styles.confirmCancel} onClick={onCancel}>Cancel</button>
          <button className={styles.confirmDo} disabled={loading} onClick={onConfirm}>
            {loading ? "Processing…" : "Confirm"}
          </button>
        </div>
      </div>
    </div>
  );
}

export default function AdminViewAllUsers() {
  const [currentPage, setCurrentPage] = useState(1);
  const [roleFilter, setRoleFilter]   = useState("All Roles");
  const [statusFilter, setStatusFilter] = useState("All Status");
  const [searchQuery, setSearchQuery] = useState("");
  const [toast, setToast]             = useState(null);
  const [confirm, setConfirm]         = useState(null); // { msg, onConfirm }

  // AbstractUser.is_active is a boolean — send true/false not 1/0
  const isActiveParam =
    statusFilter === "Active"   ? true  :
    statusFilter === "Inactive" ? false :
    undefined;

  const { data: usersData, isLoading, isError } = useGetAllUsersQuery({
    role:      roleFilter !== "All Roles" ? roleFilter.toLowerCase() : undefined,
    is_active: isActiveParam,
    search:    searchQuery || undefined,
    offset:    (currentPage - 1) * 20,
    limit:     20,
  });

  const [toggleUserStatus, { isLoading: toggling }] = useToggleUserStatusMutation();
  const [deleteUser,        { isLoading: deleting }] = useDeleteUserMutation();

  const users      = usersData?.results ?? usersData ?? [];
  const totalCount = usersData?.count   ?? users.length;

  // Log ALL keys of first user — reveals exactly what the serializer returns
  if (users.length > 0) {
    const u = users[0];
 
  }

  function showToast(msg, type = "success") {
    setToast({ msg, type });
    setTimeout(() => setToast(null), 3500);
  }

  function askConfirm(msg, onConfirm) {
    setConfirm({ msg, onConfirm });
  }

  async function handleToggleStatus(userId, currentActive) {
    // AbstractUser.is_active is boolean
    const newActive = !currentActive;
    const action    = newActive ? "activate" : "deactivate";
    askConfirm(`${action.charAt(0).toUpperCase() + action.slice(1)} this user?`, async () => {
      setConfirm(null);
      try {
        await toggleUserStatus({ userId, is_active: newActive }).unwrap();
        showToast(`User ${action}d successfully`);
      } catch {
        showToast(`Failed to ${action} user`, "error");
      }
    });
  }

  async function handleDeleteUser(userId) {
    askConfirm("Delete this user? This cannot be undone.", async () => {
      setConfirm(null);
      try {
        await deleteUser(userId).unwrap();
        showToast("User deleted");
      } catch {
        showToast("Failed to delete user", "error");
      }
    });
  }

  const roleBg = (role) =>
    ({ talent: "#3b82f6", employer: "#10b981", admin: "#8b5cf6" })[role?.toLowerCase()] ?? "#6b7280";

  const fmtDate = (d) => {
    if (!d) return "—";
    try { return new Date(d).toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" }); }
    catch { return d; }
  };

  return (
    <>
      <Toast toast={toast} />
      {confirm && (
        <ConfirmModal
          msg={confirm.msg}
          onConfirm={confirm.onConfirm}
          onCancel={() => setConfirm(null)}
          loading={toggling || deleting}
        />
      )}

      <main className={styles.adminViewAllUsers}>
        <div className={styles.container}>
          <div className={styles.header}>
            <div>
              <h1>User Management</h1>
              <p>View and manage all platform users</p>
            </div>
            <Link to="/admin-dashboard/create-user">
              <Button variant="coloredButton">+ Create New User</Button>
            </Link>
          </div>

          {/* Filters */}
          <div className={styles.filters}>
            <div className={styles.searchGroup}>
              <label>Search Users</label>
              <Input>
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <circle cx="11" cy="11" r="8" /><path d="m21 21-4.3-4.3" />
                </svg>
                <input
                  type="text"
                  placeholder="Search by name, email, username..."
                  value={searchQuery}
                  onChange={e => { setSearchQuery(e.target.value); setCurrentPage(1); }}
                />
              </Input>
            </div>

            <div className={styles.filterRow}>
              <div className={styles.filterGroup}>
                <label>Role</label>
                <CustomSelect
                  options={roleOptions}
                  selectedOption={roleFilter}
                  onOptionChange={opt => { setRoleFilter(opt); setCurrentPage(1); }}
                />
              </div>
              <div className={styles.filterGroup}>
                <label>Status</label>
                <CustomSelect
                  options={statusOptions}
                  selectedOption={statusFilter}
                  onOptionChange={opt => { setStatusFilter(opt); setCurrentPage(1); }}
                />
              </div>
            </div>

            <div className={styles.stats}>
              <p>Showing <strong>{users.length}</strong> of <strong>{totalCount}</strong> users</p>
            </div>
          </div>

          {/* Table */}
          {isError ? (
            <div className={styles.error}>Failed to load users. Please try again.</div>
          ) : isLoading ? (
            <div className={styles.loading}>
              <div className={styles.spinner} />
              <p>Loading users...</p>
            </div>
          ) : users.length > 0 ? (
            <>
              <div className={styles.tableContainer}>
                <table className={styles.usersTable}>
                  <thead>
                    <tr>
                      <th>User</th>
                      <th>Email</th>
                      <th>Role</th>
                      <th>Status</th>
                      <th>Joined</th>
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {users.map(user => {
                      // AbstractUser.is_active is boolean true/false
                      // If is_active is absent from serializer, default to true
                      const active = user.is_active === undefined || user.is_active === null
                        ? true
                        : user.is_active === true || user.is_active === 1;
                      return (
                        <tr key={user.id}>
                          <td>
                            <div className={styles.userCell}>
                              <div
                                className={styles.avatar}
                                style={{ background: roleBg(user.role) }}
                              >
                                {(user.first_name?.[0] || user.username?.[0] || "U").toUpperCase()}
                              </div>
                              <div>
                                <div className={styles.userName}>
                                  {user.first_name && user.last_name
                                    ? `${user.first_name} ${user.last_name}`
                                    : user.username}
                                </div>
                                <div className={styles.username}>@{user.username}</div>
                              </div>
                            </div>
                          </td>
                          <td className={styles.tdEmail}>{user.email}</td>
                          <td>
                            <span
                              className={styles.roleBadge}
                              style={{ background: roleBg(user.role) }}
                            >
                              {user.role
                                ? user.role.charAt(0).toUpperCase() + user.role.slice(1).toLowerCase()
                                : "—"}
                            </span>
                          </td>
                          <td>
                            <span className={active ? styles.activeStatus : styles.inactiveStatus}>
                              {active ? "Active" : "Inactive"}
                            </span>
                          </td>
                          <td className={styles.tdDate}>
                            {(() => {
                              const d = user.date_joined ?? user.created_at ?? user.joined ?? user.timestamp;
                              return d ? fmtDate(d) : <span style={{color:'#9ca3af',fontSize:'0.72rem'}}>—</span>;
                            })()}
                          </td>
                          <td>
                            <div className={styles.actions}>
                              <button
                                className={`${styles.toggleBtn} ${active ? styles.toggleDeactivate : styles.toggleActivate}`}
                                onClick={() => handleToggleStatus(user.id, active)}
                                title={active ? "Deactivate" : "Activate"}
                              >
                                {active ? (
                                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                    <circle cx="12" cy="12" r="10" />
                                    <line x1="15" y1="9" x2="9" y2="15" /><line x1="9" y1="9" x2="15" y2="15" />
                                  </svg>
                                ) : (
                                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                    <polyline points="20 6 9 17 4 12" />
                                  </svg>
                                )}
                              </button>
                              <button
                                className={styles.deleteBtn}
                                onClick={() => handleDeleteUser(user.id)}
                                title="Delete user"
                              >
                                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                  <polyline points="3 6 5 6 21 6" />
                                  <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
                                </svg>
                              </button>
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
                <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
                <circle cx="9" cy="7" r="4" />
                <path d="M22 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75" />
              </svg>
              <h3>No users found</h3>
              <p>{searchQuery ? "No users match your search criteria" : "No users registered yet"}</p>
            </div>
          )}
        </div>
      </main>
    </>
  );
}