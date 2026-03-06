import { useState, useEffect, useRef } from "react";
import styles from "./ChatPage.module.css";
import { useWhoAmIQuery } from "../../services/userApi";
import { useSelector } from "react-redux";
import {
  useGetChatsQuery,
  useCreateChatMutation,
  useGetMessagesQuery,
  useSendMessageMutation,
} from "../../services/chatApi";
import { useGetCompanyProfilesQuery } from "../../services/employerApi";
import { useGetTalentsQuery } from "../../services/talentApi";

// ── Helpers ───────────────────────────────────────────────────────────────────
function fmtStatus(raw) {
  if (!raw) return "Active";
  // e.g. "ACTIVE" → "Active", "active" → "Active"
  const s = String(raw).toLowerCase();
  return s.charAt(0).toUpperCase() + s.slice(1);
}

function fmtMsgTime(ts) {
  if (!ts) return "";
  return new Date(ts).toLocaleTimeString("en-NG", {
    hour: "2-digit",
    minute: "2-digit",
  });
}

// Group messages into day buckets: "Today", "Yesterday", "Mon 24 Feb" etc.
function groupByDay(messages) {
  const groups = []; // [{ label, messages }]
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const yesterday = new Date(today);
  yesterday.setDate(today.getDate() - 1);

  let currentLabel = null;
  let currentGroup = null;

  for (const msg of messages) {
    const d = new Date(msg.timestamp ?? msg.created_at ?? Date.now());
    d.setHours(0, 0, 0, 0);

    let label;
    if (d.getTime() === today.getTime()) label = "Today";
    else if (d.getTime() === yesterday.getTime()) label = "Yesterday";
    else
      label = new Date(msg.timestamp ?? msg.created_at).toLocaleDateString(
        "en-GB",
        {
          weekday: "short",
          day: "numeric",
          month: "short",
        },
      );

    if (label !== currentLabel) {
      currentLabel = label;
      currentGroup = { label, messages: [] };
      groups.push(currentGroup);
    }
    currentGroup.messages.push(msg);
  }
  return groups;
}

// ── Component ─────────────────────────────────────────────────────────────────
export default function ChatPage() {
  const token = useSelector((s) => s.auth.token);
  const { data: whoAmI } = useWhoAmIQuery(undefined, { skip: !token });
  const isEmployer = whoAmI?.role === "EMPLOYER";
  const isTalent = whoAmI?.role === "TALENT";

  const [selectedChatId, setSelectedChatId] = useState(null);
  const [messageText, setMessageText] = useState("");
  const [showNewChat, setShowNewChat] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [conversationSearch, setConversationSearch] = useState("");
  const [showSidebar, setShowSidebar] = useState(true);
  const messagesEndRef = useRef(null);
  const [sentByMeIds] = useState(() => new Set());

  // ── API ───────────────────────────────────────────────────────────────────
  const { data: chatsData, isLoading: loadingChats } = useGetChatsQuery(
    undefined,
    { skip: !token, pollingInterval: 10000 },
  );
  const chats = chatsData?.results ?? chatsData ?? [];

  // currentData clears to undefined when chatId changes (unlike data which keeps stale value)
  // This prevents the previous chat's messages showing while new ones load
  const { currentData: messagesData, isFetching: fetchingMessages } =
    useGetMessagesQuery(
      { chatId: selectedChatId },
      { skip: !selectedChatId, pollingInterval: 5000 },
    );
  const messages = messagesData?.results ?? messagesData ?? [];

  const { data: employersData } = useGetCompanyProfilesQuery(
    { limit: 100 },
    { skip: !isTalent || !showNewChat },
  );
  const { data: talentsData } = useGetTalentsQuery(
    { limit: 100 },
    { skip: !isEmployer || !showNewChat },
  );

  // ✅ FIXED: properly destructure createChat and creatingChat
  const [createChat, { isLoading: creatingChat }] = useCreateChatMutation();
  const [sendMessage, { isLoading: sending }] = useSendMessageMutation();

  // ── Search ────────────────────────────────────────────────────────────────
  const allEmployers = (employersData?.results ?? employersData ?? []).filter(
    (e) => e.verified === true || e.is_verified === true,
  );
  const allTalents = (talentsData?.results ?? talentsData ?? []).filter(
    (t) => t.verified === true || t.is_verified === true,
  );
  const searchResults = isEmployer
    ? allTalents.filter((t) =>
        (t.full_name ?? t.name ?? "")
          .toLowerCase()
          .includes(searchQuery.toLowerCase()),
      )
    : allEmployers.filter((e) =>
        (e.company_name ?? "")
          .toLowerCase()
          .includes(searchQuery.toLowerCase()),
      );

  // ── Auto-scroll ───────────────────────────────────────────────────────────
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // ── Helpers ───────────────────────────────────────────────────────────────
  const selectedChat = chats.find((c) => c.id === selectedChatId);

  function getChatName(chat) {
    if (isEmployer) {
      const t = chat.talent_detail ?? chat.talent;
      return (typeof t === "object" ? t?.full_name : null) ?? "Unknown Talent";
    }
    const o = chat.organization_detail ?? chat.organization;
    return (
      (typeof o === "object" ? o?.company_name : null) ?? "Unknown Organisation"
    );
  }

  function getChatInitials(chat) {
    return getChatName(chat).charAt(0).toUpperCase();
  }

  function isMyMessage(msg) {
    if (msg.sender_type) {
      return isEmployer
        ? msg.sender_type === "organization"
        : msg.sender_type === "talent";
    }
    return sentByMeIds.has(msg.id);
  }

  async function handleStartChat(person) {
    // Check if chat already exists locally first
    const existing = chats.find((c) =>
      isEmployer
        ? (c.talent?.id ?? c.talent) === person.id
        : (c.organization?.id ?? c.organization) === person.id,
    );
    if (existing) {
      openChat(existing.id);
      setShowNewChat(false);
      setSearchQuery("");
      return;
    }

    try {
      // Only send the OTHER side's ID — backend injects current user's side
      const payload = isEmployer
        ? { talent: person.id }
        : { organization: person.id };
      const newChat = await createChat(payload).unwrap();
      openChat(newChat.id);
      setShowNewChat(false);
      setSearchQuery("");
    } catch (err) {
      // 400 "already exists" — backend returns the existing chat_id
      if (err?.data?.chat_id) {
        openChat(err.data.chat_id);
        setShowNewChat(false);
        setSearchQuery("");
        return;
      }
      // Also handle if backend returns the id in a different field
      if (err?.data?.id) {
        openChat(err.data.id);
        setShowNewChat(false);
        setSearchQuery("");
        return;
      }
      alert(
        err?.data?.detail ??
          err?.data?.error ??
          "Failed to start conversation.",
      );
    }
  }

  async function handleSend(e) {
    e.preventDefault();
    if (!messageText.trim() || !selectedChatId) return;
    try {
      const sent = await sendMessage({
        chat: selectedChatId,
        content: messageText.trim(),
      }).unwrap();
      if (sent?.id) sentByMeIds.add(sent.id);
      setMessageText("");
    } catch {
      alert("Failed to send message.");
    }
  }

  function openChat(chatId) {
    setSelectedChatId(chatId);
    setShowSidebar(false);
  }

  const filteredChats = chats.filter((c) =>
    getChatName(c).toLowerCase().includes(conversationSearch.toLowerCase()),
  );

  const messageGroups = groupByDay(messages);

  return (
    <div className={styles.page}>
      {/* ── Sidebar ──────────────────────────────────────────────────────── */}
      <aside
        className={`${styles.sidebar} ${showSidebar ? styles.sidebarVisible : styles.sidebarHidden}`}
      >
        <div className={styles.sidebarHeader}>
          <h2 className={styles.sidebarTitle}>Messages</h2>
          <button
            className={styles.newChatBtn}
            onClick={() => setShowNewChat((v) => !v)}
            title="New conversation"
          >
            {showNewChat ? "✕" : "+"}
          </button>
        </div>

        {/* New chat search */}
        {showNewChat && (
          <div className={styles.newChatPanel}>
            <p className={styles.newChatLabel}>
              {isEmployer
                ? "Find verified talent"
                : "Find verified organisations"}
            </p>
            <input
              autoFocus
              type="text"
              className={styles.newChatInput}
              placeholder={
                isEmployer ? "Search by name…" : "Search by organisation…"
              }
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
            {searchQuery.length > 0 && (
              <div className={styles.searchDropdown}>
                {searchResults.length === 0 ? (
                  <p className={styles.noResults}>No verified results found</p>
                ) : (
                  searchResults.slice(0, 8).map((person) => {
                    const label =
                      person.company_name ?? person.full_name ?? "?";
                    return (
                      <button
                        key={person.id}
                        className={styles.searchItem}
                        onClick={() => handleStartChat(person)}
                        disabled={creatingChat}
                      >
                        <span className={styles.searchAvatar}>
                          {label.charAt(0).toUpperCase()}
                        </span>
                        <div className={styles.searchInfo}>
                          <span className={styles.searchName}>{label}</span>
                          {(person.profession || person.state) && (
                            <span className={styles.searchSub}>
                              {person.profession ?? person.state}
                            </span>
                          )}
                        </div>
                        <span className={styles.verBadge}>✓</span>
                      </button>
                    );
                  })
                )}
              </div>
            )}
          </div>
        )}

        {/* Conversation search */}
        <div className={styles.convSearch}>
          <span className={styles.convSearchIcon}>🔍</span>
          <input
            type="text"
            placeholder="Search conversations…"
            value={conversationSearch}
            onChange={(e) => setConversationSearch(e.target.value)}
          />
        </div>

        {/* Conversations list */}
        <div className={styles.convList}>
          {loadingChats ? (
            <div className={styles.convState}>
              <div className={styles.spinner} />
            </div>
          ) : filteredChats.length === 0 ? (
            <div className={styles.convState}>
              <span className={styles.convEmptyIcon}>💬</span>
              <p>
                {chats.length === 0 ? "No conversations yet" : "No results"}
              </p>
              {chats.length === 0 && (
                <button
                  className={styles.startFirstBtn}
                  onClick={() => setShowNewChat(true)}
                >
                  Start a conversation
                </button>
              )}
            </div>
          ) : (
            filteredChats.map((chat) => {
              const lastMsg =
                selectedChatId === chat.id && messages.length > 0
                  ? messages[messages.length - 1].content
                  : (chat.last_message ?? "No messages yet");
              return (
                <button
                  key={chat.id}
                  className={`${styles.convItem} ${selectedChatId === chat.id ? styles.convItemActive : ""}`}
                  onClick={() => openChat(chat.id)}
                >
                  <div className={styles.convAvatar}>
                    {getChatInitials(chat)}
                  </div>
                  <div className={styles.convInfo}>
                    <div className={styles.convTop}>
                      <span className={styles.convName}>
                        {getChatName(chat)}
                      </span>
                      {chat.last_message_time && (
                        <span className={styles.convTime}>
                          {new Date(chat.last_message_time).toLocaleDateString(
                            "en-GB",
                            {
                              day: "numeric",
                              month: "short",
                            },
                          )}
                        </span>
                      )}
                    </div>
                    <p className={styles.convPreview}>{lastMsg}</p>
                  </div>
                </button>
              );
            })
          )}
        </div>
      </aside>

      {/* ── Chat area ────────────────────────────────────────────────────── */}
      <div
        className={`${styles.chatArea} ${!showSidebar ? styles.chatAreaVisible : styles.chatAreaHidden}`}
      >
        {selectedChat ? (
          <>
            {/* Header */}
            <div className={styles.chatHeader}>
              <button
                className={styles.mobileBack}
                onClick={() => setShowSidebar(true)}
              >
                ←
              </button>
              <div className={styles.chatHeaderAvatar}>
                {getChatInitials(selectedChat)}
              </div>
              <div className={styles.chatHeaderInfo}>
                <h3 className={styles.chatHeaderName}>
                  {getChatName(selectedChat)}
                </h3>
              </div>
            </div>

            {/* Messages — grouped by day */}
            <div className={styles.messages}>
              {fetchingMessages && messages.length === 0 ? (
                <div className={styles.messagesEmpty}>
                  <div className={styles.spinner} />
                </div>
              ) : messages.length === 0 ? (
                <div className={styles.messagesEmpty}>
                  <span>👋</span>
                  <p>No messages yet — say hello!</p>
                </div>
              ) : (
                messageGroups.map((group) => (
                  <div key={group.label}>
                    {/* Day divider */}
                    <div className={styles.dayDivider}>
                      <span className={styles.dayLabel}>{group.label}</span>
                    </div>

                    {group.messages.map((msg) => {
                      const mine = isMyMessage(msg);
                      return (
                        <div
                          key={msg.id}
                          className={`${styles.msgRow} ${mine ? styles.msgRowMine : styles.msgRowTheirs}`}
                        >
                          <div
                            className={`${styles.bubble} ${mine ? styles.bubbleMine : styles.bubbleTheirs}`}
                          >
                            <p className={styles.bubbleText}>{msg.content}</p>
                            {msg.timestamp && (
                              <span className={styles.bubbleTime}>
                                {fmtMsgTime(msg.timestamp)}
                              </span>
                            )}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                ))
              )}
              <div ref={messagesEndRef} />
            </div>

            {/* Input */}
            <form className={styles.inputBar} onSubmit={handleSend}>
              <input
                type="text"
                className={styles.inputField}
                placeholder="Type a message…"
                value={messageText}
                onChange={(e) => setMessageText(e.target.value)}
                disabled={sending}
              />
              <button
                type="submit"
                className={styles.sendBtn}
                disabled={sending || !messageText.trim()}
              >
                {sending ? "…" : "➤"}
              </button>
            </form>
          </>
        ) : (
          <div className={styles.emptyState}>
            <span className={styles.emptyIcon}>💬</span>
            <h3>Your Messages</h3>
            <p>Select a conversation or start a new one.</p>
            <button
              className={styles.emptyNewBtn}
              onClick={() => {
                setShowSidebar(true);
                setShowNewChat(true);
              }}
            >
              + New Conversation
            </button>
          </div>
        )}
      </div>

      {/* Mobile FAB */}
      <button
        className={styles.fab}
        onClick={() => {
          setShowSidebar(true);
          setShowNewChat(true);
        }}
        aria-label="New conversation"
      >
        +
      </button>
    </div>
  );
}
