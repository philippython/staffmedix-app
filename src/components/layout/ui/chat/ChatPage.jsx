import { useState } from "react";
import styles from "./ChatPage.module.css";

export default function ChatPage() {
  const [selectedChat, setSelectedChat] = useState(1);
  const [message, setMessage] = useState("");

  const conversations = [
    {
      id: 1,
      name: "General Hospital Lagos",
      lastMessage: "Thank you for your application...",
      time: "10:30 AM",
      unread: 2,
      avatar: "🏥",
    },
    {
      id: 2,
      name: "St. Nicholas Hospital",
      lastMessage: "When are you available for an interview?",
      time: "Yesterday",
      unread: 0,
      avatar: "🏥",
    },
    {
      id: 3,
      name: "Federal Medical Centre",
      lastMessage: "We reviewed your credentials",
      time: "2 days ago",
      unread: 1,
      avatar: "🏥",
    },
  ];

  const messages = [
    {
      id: 1,
      sender: "them",
      text: "Hello! Thank you for applying to the Senior ICU Nurse position.",
      time: "10:00 AM",
    },
    {
      id: 2,
      sender: "me",
      text: "Thank you for considering my application. I'm very interested in the position.",
      time: "10:15 AM",
    },
    {
      id: 3,
      sender: "them",
      text: "We've reviewed your credentials and would like to schedule an interview. Are you available this week?",
      time: "10:30 AM",
    },
    {
      id: 4,
      sender: "me",
      text: "Yes, I'm available. What day and time works best for you?",
      time: "10:32 AM",
    },
  ];

  const handleSendMessage = (e) => {
    e.preventDefault();
    if (message.trim()) {
      console.log("Sending message:", message);
      setMessage("");
    }
  };

  return (
    <div className={styles.chatPage}>
      <div className={styles.chatSidebar}>
        <div className={styles.sidebarHeader}>
          <h2>Messages</h2>
          <button className={styles.newChatButton}>+</button>
        </div>

        <div className={styles.searchBar}>
          <input type="text" placeholder="Search conversations..." />
        </div>

        <div className={styles.conversationsList}>
          {conversations.map((conv) => (
            <div
              key={conv.id}
              className={`${styles.conversationItem} ${
                selectedChat === conv.id ? styles.active : ""
              }`}
              onClick={() => setSelectedChat(conv.id)}
            >
              <div className={styles.avatar}>{conv.avatar}</div>
              <div className={styles.conversationInfo}>
                <div className={styles.conversationHeader}>
                  <h3>{conv.name}</h3>
                  <span className={styles.time}>{conv.time}</span>
                </div>
                <div className={styles.conversationFooter}>
                  <p className={styles.lastMessage}>{conv.lastMessage}</p>
                  {conv.unread > 0 && (
                    <span className={styles.unreadBadge}>{conv.unread}</span>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className={styles.chatMain}>
        <div className={styles.chatHeader}>
          <div className={styles.chatHeaderInfo}>
            <div className={styles.avatar}>🏥</div>
            <div>
              <h3>General Hospital Lagos</h3>
              <p className={styles.status}>
                <span className={styles.onlineIndicator}></span>Active now
              </p>
            </div>
          </div>
          <div className={styles.chatActions}>
            <button className={styles.iconButton}>📞</button>
            <button className={styles.iconButton}>📹</button>
            <button className={styles.iconButton}>⋮</button>
          </div>
        </div>

        <div className={styles.messagesContainer}>
          {messages.map((msg) => (
            <div
              key={msg.id}
              className={`${styles.message} ${
                msg.sender === "me" ? styles.myMessage : styles.theirMessage
              }`}
            >
              <div className={styles.messageContent}>
                <p>{msg.text}</p>
                <span className={styles.messageTime}>{msg.time}</span>
              </div>
            </div>
          ))}
        </div>

        <form className={styles.messageInput} onSubmit={handleSendMessage}>
          <button type="button" className={styles.attachButton}>
            📎
          </button>
          <input
            type="text"
            placeholder="Type your message..."
            value={message}
            onChange={(e) => setMessage(e.target.value)}
          />
          <button type="submit" className={styles.sendButton}>
            ➤
          </button>
        </form>
      </div>
    </div>
  );
}
