import { useState } from "react";
import styles from "./NotificationsPage.module.css";

export default function NotificationsPage() {
  const [filter, setFilter] = useState("all");

  const notifications = [
    {
      id: 1,
      type: "application",
      title: "Application Viewed",
      message:
        "General Hospital Lagos viewed your application for Senior ICU Nurse position",
      time: "2 hours ago",
      read: false,
    },
    {
      id: 2,
      type: "interview",
      title: "Interview Scheduled",
      message:
        "You have an interview scheduled for Jan 25, 2026 at 10:00 AM with St. Nicholas Hospital",
      time: "5 hours ago",
      read: false,
    },
    {
      id: 3,
      type: "message",
      title: "New Message",
      message:
        "St. Nicholas Hospital sent you a message regarding your application",
      time: "1 day ago",
      read: true,
    },
    {
      id: 4,
      type: "application",
      title: "Application Status Updated",
      message:
        "Your application for Pediatric Nurse has been moved to the next stage",
      time: "2 days ago",
      read: true,
    },
    {
      id: 5,
      type: "system",
      title: "Profile Update",
      message: "Your professional credentials have been verified successfully",
      time: "3 days ago",
      read: true,
    },
  ];

  const filteredNotifications = notifications.filter((notif) => {
    if (filter === "unread") return !notif.read;
    if (filter === "applications") return notif.type === "application";
    return true;
  });

  return (
    <div className={styles.notificationsPage}>
      <div className={styles.header}>
        <h1>Notifications</h1>
        <button className={styles.markAllRead}>Mark all as read</button>
      </div>

      <div className={styles.filters}>
        <button
          className={filter === "all" ? styles.active : ""}
          onClick={() => setFilter("all")}
        >
          All ({notifications.length})
        </button>
        <button
          className={filter === "unread" ? styles.active : ""}
          onClick={() => setFilter("unread")}
        >
          Unread ({notifications.filter((n) => !n.read).length})
        </button>
        <button
          className={filter === "applications" ? styles.active : ""}
          onClick={() => setFilter("applications")}
        >
          Applications
        </button>
      </div>

      <div className={styles.notificationsList}>
        {filteredNotifications.length > 0 ? (
          filteredNotifications.map((notif) => (
            <div
              key={notif.id}
              className={`${styles.notificationItem} ${
                !notif.read ? styles.unread : ""
              }`}
            >
              <div className={styles.notifIcon}>
                {notif.type === "application" && "📝"}
                {notif.type === "interview" && "📅"}
                {notif.type === "message" && "💬"}
                {notif.type === "system" && "🔔"}
              </div>
              <div className={styles.notifContent}>
                <h3>{notif.title}</h3>
                <p>{notif.message}</p>
                <span className={styles.time}>{notif.time}</span>
              </div>
              {!notif.read && <span className={styles.unreadDot}></span>}
            </div>
          ))
        ) : (
          <div className={styles.emptyState}>
            <p>No notifications to display</p>
          </div>
        )}
      </div>
    </div>
  );
}
