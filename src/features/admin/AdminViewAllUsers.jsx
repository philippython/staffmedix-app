import { useState } from "react";
import { Link } from "react-router";
import AppNav from "../../components/AppNav";
import Footer from "../../components/Footer";
import Button from "../../components/Button";
import CustomSelect from "../../components/CustomSelect";
import Pagination from "../../components/Pagination";
import Input from "../../components/Input";
import styles from "./AdminViewAllUsers.module.css";
import { useGetAllUsersQuery, useToggleUserStatusMutation, useDeleteUserMutation } from "../../services/userApi";

const roleOptions = ["All Roles", "Talent", "Employer", "Admin"];
const statusOptions = ["All Status", "Active", "Inactive"];

export default function AdminViewAllUsers() {
  const [currentPage, setCurrentPage] = useState(1);
  const [roleFilter, setRoleFilter] = useState("All Roles");
  const [statusFilter, setStatusFilter] = useState("All Status");
  const [searchQuery, setSearchQuery] = useState("");

  const {
    data: usersData,
    isLoading,
    isError,
  } = useGetAllUsersQuery({
    role: roleFilter !== "All Roles" ? roleFilter.toLowerCase() : undefined,
    is_active: statusFilter === "Active" ? 1 : statusFilter === "Inactive" ? 0 : undefined,
    search: searchQuery || undefined,
    offset: currentPage === 1 ? 0 : (currentPage - 1) * 20,
    limit: 20,
  });

  const [toggleUserStatus] = useToggleUserStatusMutation();
  const [deleteUser] = useDeleteUserMutation();

  const users = usersData?.results || usersData || [];
  const totalCount = usersData?.count || users.length;

  const handleToggleStatus = async (userId, currentStatus) => {
    const action = currentStatus === 1 ? "deactivate" : "activate";
    
    if (window.confirm(`Are you sure you want to ${action} this user?`)) {
      try {
        await toggleUserStatus({
          userId,
          is_active: currentStatus === 1 ? 0 : 1,
        }).unwrap();
        alert(`User ${action}d successfully!`);
      } catch (error) {
        alert(`Failed to ${action} user. Please try again.`);
      }
    }
  };

  const handleDeleteUser = async (userId) => {
    if (
      window.confirm(
        "Are you sure you want to delete this user? This action cannot be undone."
      )
    ) {
      try {
        await deleteUser(userId).unwrap();
        alert("User deleted successfully!");
      } catch (error) {
        alert("Failed to delete user. Please try again.");
      }
    }
  };

  const getRoleBadgeColor = (role) => {
    const colors = {
      talent: "#3b82f6",
      employer: "#10b981",
      admin: "#8b5cf6",
    };
    return colors[role] || "#6b7280";
  };

  return (
    <>
      <AppNav />
      <main className={styles.adminViewAllUsers}>
        <div className={styles.container}>
          <div className={styles.header}>
            <div>
              <h1>User Management</h1>
              <p>View and manage all platform users</p>
            </div>
            <Link to="/admin/users/create">
              <Button variant="coloredButton">Create New User</Button>
            </Link>
          </div>

          {/* Filters */}
          <div className={styles.filters}>
            <div className={styles.searchGroup}>
              <label>Search Users</label>
              <Input>
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="20"
                  height="20"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                >
                  <circle cx="11" cy="11" r="8" />
                  <path d="m21 21-4.3-4.3" />
                </svg>
                <input
                  type="text"
                  placeholder="Search by name, email, username..."
                  value={searchQuery}
                  onChange={(e) => {
                    setSearchQuery(e.target.value);
                    setCurrentPage(1);
                  }}
                />
              </Input>
            </div>

            <div className={styles.filterRow}>
              <div className={styles.filterGroup}>
                <label>Role</label>
                <CustomSelect
                  options={roleOptions}
                  selectedOption={roleFilter}
                  onOptionChange={(option) => {
                    setRoleFilter(option);
                    setCurrentPage(1);
                  }}
                />
              </div>

              <div className={styles.filterGroup}>
                <label>Status</label>
                <CustomSelect
                  options={statusOptions}
                  selectedOption={statusFilter}
                  onOptionChange={(option) => {
                    setStatusFilter(option);
                    setCurrentPage(1);
                  }}
                />
              </div>
            </div>

            <div className={styles.stats}>
              <p>
                Showing <strong>{users.length}</strong> of{" "}
                <strong>{totalCount}</strong> users
              </p>
            </div>
          </div>

          {/* Users Table */}
          {isError ? (
            <div className={styles.error}>
              Failed to load users. Please try again.
            </div>
          ) : isLoading ? (
            <div className={styles.loading}>
              <div className={styles.spinner}></div>
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
                    {users.map((user) => (
                      <tr key={user.id}>
                        <td>
                          <div className={styles.userCell}>
                            <div className={styles.avatar}>
                              {user.first_name?.[0] || user.username?.[0] || "U"}
                            </div>
                            <div>
                              <div className={styles.userName}>
                                {user.first_name && user.last_name
                                  ? `${user.first_name} ${user.last_name}`
                                  : user.username}
                              </div>
                              <div className={styles.username}>
                                @{user.username}
                              </div>
                            </div>
                          </div>
                        </td>
                        <td>{user.email}</td>
                        <td>
                          <span
                            className={styles.roleBadge}
                            style={{
                              backgroundColor: getRoleBadgeColor(user.role),
                            }}
                          >
                            {user.role.charAt(0).toUpperCase() + user.role.slice(1)}
                          </span>
                        </td>
                        <td>
                          <span
                            className={
                              user.is_active === 1
                                ? styles.activeStatus
                                : styles.inactiveStatus
                            }
                          >
                            {user.is_active === 1 ? "Active" : "Inactive"}
                          </span>
                        </td>
                        <td>
                          {new Date(user.date_joined || user.created_at).toLocaleDateString()}
                        </td>
                        <td>
                          <div className={styles.actions}>
                            <button
                              className={styles.toggleBtn}
                              onClick={() =>
                                handleToggleStatus(user.id, user.is_active)
                              }
                              title={
                                user.is_active === 1 ? "Deactivate" : "Activate"
                              }
                            >
                              {user.is_active === 1 ? (
                                <svg
                                  xmlns="http://www.w3.org/2000/svg"
                                  width="18"
                                  height="18"
                                  viewBox="0 0 24 24"
                                  fill="none"
                                  stroke="currentColor"
                                  strokeWidth="2"
                                >
                                  <circle cx="12" cy="12" r="10" />
                                  <line x1="15" y1="9" x2="9" y2="15" />
                                  <line x1="9" y1="9" x2="15" y2="15" />
                                </svg>
                              ) : (
                                <svg
                                  xmlns="http://www.w3.org/2000/svg"
                                  width="18"
                                  height="18"
                                  viewBox="0 0 24 24"
                                  fill="none"
                                  stroke="currentColor"
                                  strokeWidth="2"
                                >
                                  <polyline points="20 6 9 17 4 12" />
                                </svg>
                              )}
                            </button>
                            <button
                              className={styles.deleteBtn}
                              onClick={() => handleDeleteUser(user.id)}
                              title="Delete user"
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
                                <polyline points="3 6 5 6 21 6" />
                                <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
                              </svg>
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
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
              <h3>No users found</h3>
              <p>
                {searchQuery
                  ? "No users match your search criteria"
                  : "No users registered yet"}
              </p>
            </div>
          )}
        </div>
      </main>
      <Footer />
    </>
  );
}