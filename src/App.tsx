//1
import { useMemo, useState } from "react";
import {
  Brain,
  ChevronRight,
  CircleUserRound,
  Inbox,
  MessageCircle,
  PenLine,
  Plus,
  Send,
  Sparkles,
  UserRound,
  Zap
} from "lucide-react";

type Contact = {
  id: number;
  name: string;
  language: string;
  avatar: string;
  messages: string[];
  unread: number;
};

const initialContacts: Contact[] = [
  { id: 1, name: "Professor", language: "English", avatar: "P", messages: ["Tomorrow's lab is postponed."], unread: 1 },
  { id: 2, name: "Mother", language: "Telugu", avatar: "M", messages: ["రేపు సాయంత్రం ఇంటికి వస్తావా?"], unread: 1 },
  { id: 3, name: "Ravi", language: "English", avatar: "R", messages: ["Are you coming?"], unread: 1 },
  { id: 4, name: "Amazon", language: "English", avatar: "A", messages: ["Your package is arriving today."], unread: 1 },
  { id: 5, name: "Bank", language: "English", avatar: "B", messages: ["Your OTP is 4829"], unread: 1 },
  { id: 6, name: "Ananya", language: "Hindi", avatar: "A", messages: ["कल 10 बजे मिलते हैं।"], unread: 1 },
  { id: 7, name: "College", language: "English", avatar: "C", messages: ["Hackathon registration closes tonight."], unread: 1 },
  { id: 8, name: "Arjun", language: "English", avatar: "A", messages: ["Can you send the notes?"], unread: 1 }
];

export default function App() {
  const [page, setPage] = useState<"messages" | "assistant">("messages");
  const [mode, setMode] = useState<"sender" | "user">("sender");
  const [contacts, setContacts] = useState(initialContacts);
  const [selectedId, setSelectedId] = useState(1);
  const [draft, setDraft] = useState("");
  const [awake, setAwake] = useState(false);
  const [instruction, setInstruction] = useState("");

  const selected = contacts.find(c => c.id === selectedId) ?? contacts[0];
  const unreadTotal = useMemo(() => contacts.reduce((sum, c) => sum + c.unread, 0), [contacts]);

  function sendMessage() {
    const text = draft.trim();
    if (!text) return;
    setContacts(prev => prev.map(c =>
      c.id === selectedId
        ? { ...c, messages: [...c.messages, text], unread: mode === "sender" ? c.unread + 1 : c.unread }
        : c
    ));
    setDraft("");
  }

  function openContact(id: number) {
    setSelectedId(id);
    if (mode === "user") {
      setContacts(prev => prev.map(c => c.id === id ? { ...c, unread: 0 } : c));
    }
  }

  return (
    <div className="app-shell">
      <aside className="sidebar">
        <div className="brand">
          <div className="brand-mark"><Brain size={18} /></div>
          <div>
            <div className="brand-name">PCA</div>
            <div className="brand-sub">Personal Communication Assistant</div>
          </div>
        </div>

        <nav className="nav">
          <button className={page === "messages" ? "nav-item active" : "nav-item"} onClick={() => setPage("messages")}>
            <MessageCircle size={17} />
            Messages
            {unreadTotal > 0 && <span className="badge">{unreadTotal}</span>}
          </button>
          <button className={page === "assistant" ? "nav-item active" : "nav-item"} onClick={() => setPage("assistant")}>
            <Sparkles size={17} />
            PCA Assistant
          </button>
        </nav>

        <div className="sidebar-bottom">
          <div className="status-dot"><span /> Demo mode</div>
          <div className="muted">Frontend prototype · local state only</div>
        </div>
      </aside>

      <main className="main">
        {page === "messages" ? (
          <section className="page">
            <header className="topbar">
              <div>
                <h1>Messages</h1>
                <p>Simulate conversations before PCA processes them.</p>
              </div>
              <div className="mode-switch">
                <button className={mode === "sender" ? "small-btn active" : "small-btn"} onClick={() => setMode("sender")}>
                  <PenLine size={14} /> Sender mode
                </button>
                <button className={mode === "user" ? "small-btn active" : "small-btn"} onClick={() => setMode("user")}>
                  <UserRound size={14} /> User mode
                </button>
              </div>
            </header>

            <div className="message-layout">
              <section className="contact-panel">
                <div className="panel-head">
                  <span>Conversations</span>
                  <button className="icon-btn" title="New contact"><Plus size={16} /></button>
                </div>
                <div className="contacts">
                  {contacts.map(c => (
                    <button key={c.id} className={selectedId === c.id ? "contact active" : "contact"} onClick={() => openContact(c.id)}>
                      <div className="avatar">{c.avatar}</div>
                      <div className="contact-info">
                        <div className="contact-name">{c.name}</div>
                        <div className="contact-preview">{c.messages[c.messages.length - 1]}</div>
                      </div>
                      {c.unread > 0 && <span className="unread">{c.unread}</span>}
                    </button>
                  ))}
                </div>
              </section>

              <section className="chat-panel">
                <div className="chat-head">
                  <div className="avatar">{selected.avatar}</div>
                  <div>
                    <div className="chat-title">{selected.name}</div>
                    <div className="muted">{selected.language} · simulated SMS</div>
                  </div>
                </div>

                <div className="messages">
                  {selected.messages.map((m, i) => {
                    const own = i % 2 === 1;
                    return (
                      <div key={i} className={own ? "bubble-row own" : "bubble-row"}>
                        <div className={own ? "bubble own" : "bubble"}>{m}</div>
                      </div>
                    );
                  })}
                  {selected.messages.length === 1 && (
                    <div className="demo-hint">This message is {selected.unread ? "unread" : "read"}.</div>
                  )}
                </div>

                <div className="composer">
                  <input
                    value={draft}
                    onChange={e => setDraft(e.target.value)}
                    onKeyDown={e => e.key === "Enter" && sendMessage()}
                    placeholder={mode === "sender" ? `Write as ${selected.name}…` : "Write as user…"}
                  />
                  <button className="send-btn" onClick={sendMessage}><Send size={17} /></button>
                </div>
              </section>
            </div>
          </section>
        ) : (
          <section className="page assistant-page">
            <header className="topbar">
              <div>
                <h1>PCA Assistant</h1>
                <p>Your communication layer, simplified.</p>
              </div>
              <div className="pill"><Inbox size={14} /> {unreadTotal} unread</div>
            </header>

            <div className="assistant-grid">
              <section className="hero-card">
                <div className={awake ? "wake-orb awake" : "wake-orb"}><Zap size={28} /></div>
                <div className="eyebrow">PCA CORE</div>
                <h2>{awake ? "PCA is awake." : "Wake PCA."}</h2>
                <p>
                  {awake
                    ? "Unread messages have been collected and summarized for you."
                    : "Let PCA look through your unread messages and prepare a Telugu briefing."}
                </p>
                <button className="primary-btn" onClick={() => setAwake(true)}>
                  {awake ? "Refresh analysis" : "Wake PCA"} <ChevronRight size={17} />
                </button>
              </section>

              <section className="analysis-card">
                <div className="card-title">Message briefing</div>
                {awake ? (
                  <div className="analysis-content">
                    <div className="brief-item">
                      <div className="mini-icon"><CircleUserRound size={16} /></div>
                      <div>
                        <strong>Professor</strong>
                        <p>ల్యాబ్ రేపటికి వాయిదా పడింది.</p>
                      </div>
                    </div>
                    <div className="brief-item">
                      <div className="mini-icon"><CircleUserRound size={16} /></div>
                      <div>
                        <strong>Ravi</strong>
                        <p>రవి మీరు వస్తున్నారా అని అడుగుతున్నాడు.</p>
                      </div>
                    </div>
                    <div className="brief-item">
                      <div className="mini-icon"><CircleUserRound size={16} /></div>
                      <div>
                        <strong>Amazon</strong>
                        <p>మీ ప్యాకేజ్ ఈరోజు వస్తుంది.</p>
                      </div>
                    </div>
                    <div className="divider" />
                    <label className="label">Reply instruction</label>
                    <input
                      className="reply-input"
                      value={instruction}
                      onChange={e => setInstruction(e.target.value)}
                      placeholder="ఉదా: Reply that I'll come."
                    />
                    <button className="secondary-btn" disabled={!instruction.trim()}>
                      Generate replies <Send size={15} />
                    </button>
                  </div>
                ) : (
                  <div className="empty-state">
                    <Sparkles size={20} />
                    <span>Wake PCA to analyse unread messages.</span>
                  </div>
                )}
              </section>
            </div>
          </section>
        )}
      </main>
    </div>
  );
}
