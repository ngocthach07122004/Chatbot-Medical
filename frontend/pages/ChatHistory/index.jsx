import React, { useMemo, useState } from "react";
import classNames from "classnames/bind";
import styles from "./ChatHistory.module.scss";

const cx = classNames.bind(styles);

const seedSessions = [
  {
    id: "s1",
    title: "Follow-up on chest pain",
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 3).toISOString(),
    messages: [
      { id: "m1", role: "user", content: "Hi, I still feel mild chest pain when running." },
      { id: "m2", role: "assistant", content: "Thanks for sharing. Is the pain sharp or dull? Any shortness of breath?" },
      { id: "m3", role: "user", content: "Mostly dull, sometimes tight. Breathing is okay." },
    ],
  },
  {
    id: "s2",
    title: "Diet plan for hypertension",
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 26).toISOString(),
    messages: [
      { id: "m1", role: "user", content: "Can you suggest a low-salt weekly meal plan?" },
      { id: "m2", role: "assistant", content: "Absolutely. Focus on DASH diet principles with whole grains and greens." },
    ],
  },
  {
    id: "s3",
    title: "Medication interactions",
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 72).toISOString(),
    messages: [
      { id: "m1", role: "user", content: "Is it safe to take ibuprofen with my current meds?" },
      { id: "m2", role: "assistant", content: "Let me check common interactions. Also, consider paracetamol when appropriate." },
    ],
  },
];

const ChatHistory = () => {
  const [sessions, setSessions] = useState(seedSessions);
  const [query, setQuery] = useState("");
  const [selectedId, setSelectedId] = useState(sessions[0]?.id || null);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return sessions;
    return sessions.filter((s) =>
      s.title.toLowerCase().includes(q) ||
      s.messages.some((m) => m.content.toLowerCase().includes(q))
    );
  }, [sessions, query]);

  const selected = useMemo(() =>
    sessions.find((s) => s.id === selectedId) || filtered[0] || null,
  [sessions, selectedId, filtered]);

  const handleDelete = (id) => {
    setSessions((prev) => prev.filter((s) => s.id !== id));
    if (id === selectedId) setSelectedId(null);
  };

  const formatDate = (iso) => new Date(iso).toLocaleString();

  return (
    <div className={cx("wrapper")}>
      <div className={cx("header_row")}>
        <h1>Chat History</h1>
        <div className={cx("search")}> 
          <i className="fa-solid fa-magnifying-glass" />
          <input
            placeholder="Search by title or message"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />
        </div>
      </div>

      <div className={cx("grid")}>
        {/* Sessions list */}
        <aside className={cx("sessions")}> 
          {filtered.map((s) => (
            <button
              key={s.id}
              className={cx("session_item", selected?.id === s.id ? "active" : null)}
              onClick={() => setSelectedId(s.id)}
            >
              <div className={cx("title")}>{s.title}</div>
              <div className={cx("meta")}>
                <span><i className="fa-regular fa-clock" /> {formatDate(s.createdAt)}</span>
                <span>• {s.messages.length} messages</span>
              </div>
              <div className={cx("preview")}>{s.messages[0]?.content?.slice(0, 80)}{(s.messages[0]?.content?.length||0) > 80 ? "…" : ""}</div>
              <div className={cx("actions")}>
                <span className={cx("link_btn")} onClick={(e)=>{ e.stopPropagation(); handleDelete(s.id); }}>
                  <i className="fa-solid fa-trash" /> Delete
                </span>
              </div>
            </button>
          ))}
          {filtered.length === 0 && (
            <div className={cx("empty")}>
              <i className="fa-regular fa-folder-open"/> No sessions match your search.
            </div>
          )}
        </aside>

        {/* Transcript view */}
        <main className={cx("transcript")}> 
          {selected ? (
            <>
              <div className={cx("transcript_header")}>
                <h2>{selected.title}</h2>
                <div className={cx("muted")}>{formatDate(selected.createdAt)} • {selected.messages.length} messages</div>
              </div>
              <div className={cx("messages")}> 
                {selected.messages.map((m) => (
                  <div key={m.id} className={cx("msg", m.role === "user" ? "user" : "assistant")}> 
                    <div className={cx("avatar")}>
                      {m.role === "user" ? <i className="fa-solid fa-user"/> : <i className="fa-solid fa-robot"/>}
                    </div>
                    <div className={cx("bubble")}>
                      {m.content}
                    </div>
                  </div>
                ))}
              </div>
            </>
          ) : (
            <div className={cx("empty_center")}>Select a session to view its transcript</div>
          )}
        </main>
      </div>
    </div>
  );
};

export default ChatHistory;
