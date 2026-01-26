import { useState } from "react";
import { Link } from "react-router";
import styles from "./EmployerSettings.module.css";

export default function EmployerSettings() {
  const [activeSection, setActiveSection] = useState("profile");

  const [profileData, setProfileData] = useState({
    organizationName: "General Hospital Lagos",
    email: "admin@generalhospital.ng",
    phone: "+234 803 456 7890",
    website: "https://generalhospital.ng",
    address: "123 Medical Avenue, Lagos",
    city: "Lagos",
    state: "Lagos",
    description: "Leading healthcare facility in Lagos...",
  });

  const [passwordData, setPasswordData] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  const [notificationSettings, setNotificationSettings] = useState({
    emailNewApplications: true,
    emailMessages: true,
    emailInterviews: true,
    smsReminders: false,
    weeklyReport: true,
  });

  const handleProfileChange = (e) => {
    setProfileData({ ...profileData, [e.target.name]: e.target.value });
  };

  const handlePasswordChange = (e) => {
    setPasswordData({ ...passwordData, [e.target.name]: e.target.value });
  };

  const handleNotificationChange = (e) => {
    setNotificationSettings({
      ...notificationSettings,
      [e.target.name]: e.target.checked,
    });
  };

  const handleProfileSubmit = (e) => {
    e.preventDefault();
    console.log("Profile updated:", profileData);
  };

  const handlePasswordSubmit = (e) => {
    e.preventDefault();
    console.log("Password changed");
  };

  return (
    <div className={styles.settingsPage}>
      <div className={styles.header}>
        <h1>Settings</h1>
        <p>Manage your organization profile and preferences</p>
      </div>

      <div className={styles.mainContent}>
        <aside className={styles.sidebar}>
          <button
            className={activeSection === "profile" ? styles.active : ""}
            onClick={() => setActiveSection("profile")}
          >
            🏥 Organization Profile
          </button>
          <button
            className={activeSection === "password" ? styles.active : ""}
            onClick={() => setActiveSection("password")}
          >
            🔒 Password & Security
          </button>
          <button
            className={activeSection === "notifications" ? styles.active : ""}
            onClick={() => setActiveSection("notifications")}
          >
            🔔 Notifications
          </button>
          <button
            className={activeSection === "billing" ? styles.active : ""}
            onClick={() => setActiveSection("billing")}
          >
            💳 Billing & Subscription
          </button>
          <button
            className={activeSection === "team" ? styles.active : ""}
            onClick={() => setActiveSection("team")}
          >
            👥 Team Members
          </button>
        </aside>

        <div className={styles.settingsContent}>
          {activeSection === "profile" && (
            <div className={styles.section}>
              <h2>Organization Profile</h2>
              <form onSubmit={handleProfileSubmit}>
                <div className={styles.formRow}>
                  <div className={styles.formGroup}>
                    <label>Organization Name *</label>
                    <input
                      type="text"
                      name="organizationName"
                      value={profileData.organizationName}
                      onChange={handleProfileChange}
                      required
                    />
                  </div>

                  <div className={styles.formGroup}>
                    <label>Email Address *</label>
                    <input
                      type="email"
                      name="email"
                      value={profileData.email}
                      onChange={handleProfileChange}
                      required
                    />
                  </div>
                </div>

                <div className={styles.formRow}>
                  <div className={styles.formGroup}>
                    <label>Phone Number *</label>
                    <input
                      type="tel"
                      name="phone"
                      value={profileData.phone}
                      onChange={handleProfileChange}
                      required
                    />
                  </div>

                  <div className={styles.formGroup}>
                    <label>Website</label>
                    <input
                      type="url"
                      name="website"
                      value={profileData.website}
                      onChange={handleProfileChange}
                    />
                  </div>
                </div>

                <div className={styles.formGroup}>
                  <label>Address *</label>
                  <input
                    type="text"
                    name="address"
                    value={profileData.address}
                    onChange={handleProfileChange}
                    required
                  />
                </div>

                <div className={styles.formRow}>
                  <div className={styles.formGroup}>
                    <label>City *</label>
                    <input
                      type="text"
                      name="city"
                      value={profileData.city}
                      onChange={handleProfileChange}
                      required
                    />
                  </div>

                  <div className={styles.formGroup}>
                    <label>State *</label>
                    <select
                      name="state"
                      value={profileData.state}
                      onChange={handleProfileChange}
                      required
                    >
                      <option value="lagos">Lagos</option>
                      <option value="abuja">Abuja (FCT)</option>
                      <option value="kano">Kano</option>
                      <option value="rivers">Rivers</option>
                    </select>
                  </div>
                </div>

                <div className={styles.formGroup}>
                  <label>Organization Description</label>
                  <textarea
                    name="description"
                    value={profileData.description}
                    onChange={handleProfileChange}
                    rows="4"
                  ></textarea>
                </div>

                <div className={styles.formGroup}>
                  <label>Organization Logo</label>
                  <div className={styles.fileUpload}>
                    <input type="file" accept="image/*" />
                    <p className={styles.fileHint}>
                      PNG, JPG up to 5MB. Recommended: 300x300px
                    </p>
                  </div>
                </div>

                <button type="submit" className={styles.saveBtn}>
                  Save Changes
                </button>
              </form>
            </div>
          )}

          {activeSection === "password" && (
            <div className={styles.section}>
              <h2>Password & Security</h2>
              <form onSubmit={handlePasswordSubmit}>
                <div className={styles.formGroup}>
                  <label>Current Password *</label>
                  <input
                    type="password"
                    name="currentPassword"
                    value={passwordData.currentPassword}
                    onChange={handlePasswordChange}
                    required
                  />
                </div>

                <div className={styles.formGroup}>
                  <label>New Password *</label>
                  <input
                    type="password"
                    name="newPassword"
                    value={passwordData.newPassword}
                    onChange={handlePasswordChange}
                    required
                  />
                </div>

                <div className={styles.formGroup}>
                  <label>Confirm New Password *</label>
                  <input
                    type="password"
                    name="confirmPassword"
                    value={passwordData.confirmPassword}
                    onChange={handlePasswordChange}
                    required
                  />
                </div>

                <button type="submit" className={styles.saveBtn}>
                  Update Password
                </button>
              </form>

              <div className={styles.securitySection}>
                <h3>Two-Factor Authentication</h3>
                <p>Add an extra layer of security to your account</p>
                <button className={styles.enableBtn}>Enable 2FA</button>
              </div>
            </div>
          )}

          {activeSection === "notifications" && (
            <div className={styles.section}>
              <h2>Notification Preferences</h2>

              <div className={styles.notificationGroup}>
                <h3>Email Notifications</h3>
                <label className={styles.checkboxLabel}>
                  <input
                    type="checkbox"
                    name="emailNewApplications"
                    checked={notificationSettings.emailNewApplications}
                    onChange={handleNotificationChange}
                  />
                  <span>New job applications</span>
                </label>
                <label className={styles.checkboxLabel}>
                  <input
                    type="checkbox"
                    name="emailMessages"
                    checked={notificationSettings.emailMessages}
                    onChange={handleNotificationChange}
                  />
                  <span>New messages from candidates</span>
                </label>
                <label className={styles.checkboxLabel}>
                  <input
                    type="checkbox"
                    name="emailInterviews"
                    checked={notificationSettings.emailInterviews}
                    onChange={handleNotificationChange}
                  />
                  <span>Interview reminders</span>
                </label>
                <label className={styles.checkboxLabel}>
                  <input
                    type="checkbox"
                    name="weeklyReport"
                    checked={notificationSettings.weeklyReport}
                    onChange={handleNotificationChange}
                  />
                  <span>Weekly activity report</span>
                </label>
              </div>

              <div className={styles.notificationGroup}>
                <h3>SMS Notifications</h3>
                <label className={styles.checkboxLabel}>
                  <input
                    type="checkbox"
                    name="smsReminders"
                    checked={notificationSettings.smsReminders}
                    onChange={handleNotificationChange}
                  />
                  <span>Interview reminders via SMS</span>
                </label>
              </div>

              <button className={styles.saveBtn}>Save Preferences</button>
            </div>
          )}

          {activeSection === "billing" && (
            <div className={styles.section}>
              <h2>Billing & Subscription</h2>

              <div className={styles.currentPlan}>
                <h3>Current Plan: Professional</h3>
                <p>₦25,000/month • Renews on Feb 28, 2026</p>
                <Link to="/pricing" className={styles.changePlanBtn}>
                  Change Plan
                </Link>
              </div>

              <div className={styles.billingHistory}>
                <h3>Billing History</h3>
                <div className={styles.invoiceList}>
                  <div className={styles.invoiceItem}>
                    <span>Jan 2026</span>
                    <span>₦25,000</span>
                    <button className={styles.downloadBtn}>Download</button>
                  </div>
                  <div className={styles.invoiceItem}>
                    <span>Dec 2025</span>
                    <span>₦25,000</span>
                    <button className={styles.downloadBtn}>Download</button>
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeSection === "team" && (
            <div className={styles.section}>
              <h2>Team Members</h2>
              <p className={styles.sectionDesc}>
                Manage team members who have access to your account
              </p>

              <button className={styles.inviteBtn}>+ Invite Team Member</button>

              <div className={styles.teamList}>
                <div className={styles.teamMember}>
                  <div>
                    <h4>Admin User</h4>
                    <p>admin@generalhospital.ng</p>
                  </div>
                  <span className={styles.roleBadge}>Owner</span>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
