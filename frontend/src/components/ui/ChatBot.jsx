import { useState, useRef, useEffect } from "react";
import "./ChatBot.css";

export default function Chatbot() {
  const [open, setOpen]         = useState(false);
  const [closing, setClosing]   = useState(false);
  const [messages, setMessages] = useState([]);
  const [input, setInput]       = useState("");
  const [loading, setLoading]   = useState(false);
  const messagesEndRef           = useRef(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, loading]);

  const openChat = () => setOpen(true);

  const closeChat = () => {
    setClosing(true);
    setTimeout(() => { setOpen(false); setClosing(false); }, 240);
  };

  const sendMessage = async () => {
    if (!input.trim() || loading) return;
    const currentInput = input;
    setMessages((prev) => [...prev, { sender: "user", text: currentInput }]);
    setLoading(true);
    setInput("");

    try {
      const response = await fetch("/api/chatbot/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: currentInput }),
      });
      const data = await response.json();
      setMessages((prev) => [...prev, { sender: "bot", text: data.reply }]);
    } catch {
      setMessages((prev) => [...prev, { sender: "bot", text: "Sorry, something went wrong. Please try again." }]);
    }

    setLoading(false);
  };

  const handleKey = (e) => {
    if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); sendMessage(); }
  };

  return (
    <>
      {/* Chat window */}
      {(open || closing) && (
        <div className={`chat-window ${closing ? "closing" : ""}`}>
          <div className="chat-header">
            <div className="chat-avatar">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="white" opacity="0.9">
                <path d="M20 2H4c-1.1 0-2 .9-2 2v18l4-4h14c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2z"/>
              </svg>
            </div>
            <div className="chat-header-info">
              <h3>Assistant</h3>
              <p>● Online</p>
            </div>
            <button className="close-btn" onClick={closeChat} aria-label="Close chat">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none"
                   stroke="rgba(255,255,255,0.7)" strokeWidth="2.5" strokeLinecap="round">
                <line x1="18" y1="6"  x2="6"  y2="18"/>
                <line x1="6"  y1="6"  x2="18" y2="18"/>
              </svg>
            </button>
          </div>

          <div className="chat-messages">
            {messages.length === 0 && !loading && (
              <div className="empty-state">
                <svg width="40" height="40" viewBox="0 0 24 24" fill="white">
                  <path d="M20 2H4c-1.1 0-2 .9-2 2v18l4-4h14c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2z"/>
                </svg>
                <span>Start a conversation…</span>
              </div>
            )}
            {messages.map((msg, i) => (
              <div key={i} className={`msg-row ${msg.sender}`}>
                <div className={`msg-bubble ${msg.sender}`}>{msg.text}</div>
              </div>
            ))}
            {loading && (
              <div className="msg-row bot">
                <div className="typing-indicator">
                  <div className="typing-dot"/><div className="typing-dot"/><div className="typing-dot"/>
                </div>
              </div>
            )}
            <div ref={messagesEndRef}/>
          </div>

          <div className="chat-input-area">
            <input
              className="chat-input"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKey}
              placeholder="Type a message…"
            />
            <button className="send-btn" onClick={sendMessage} disabled={!input.trim() || loading}>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="white">
                <path d="M2.01 21L23 12 2.01 3 2 10l15 2-15 2z"/>
              </svg>
            </button>
          </div>
        </div>
      )}

      {/* FAB — hidden while chat is open */}
      <button
        className={`chat-fab${open ? " hidden" : ""}`}
        onClick={openChat}
        aria-label="Open chat"
      >
        <svg width="22" height="22" viewBox="0 0 24 24" fill="white">
          <path d="M20 2H4c-1.1 0-2 .9-2 2v18l4-4h14c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2z"/>
        </svg>
      </button>
    </>
  );
}