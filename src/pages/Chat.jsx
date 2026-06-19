// src/pages/Chat.jsx
import { useState } from "react";

export default function Chat() {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);

  async function sendMessage() {
    const text = input.trim();
    if (!text || loading) return;

    // نضيف رسالة المستخدم للقائمة
    const newMessages = [...messages, { role: "user", content: text }];
    setMessages(newMessages);
    setInput("");
    setLoading(true);

    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ messages: newMessages }),
      });

      const data = await res.json();

      if (data.reply) {
        setMessages([...newMessages, { role: "assistant", content: data.reply }]);
      } else {
        setMessages([
          ...newMessages,
          { role: "assistant", content: "حدث خطأ: " + (data.error || "غير معروف") },
        ]);
      }
    } catch (err) {
      setMessages([
        ...newMessages,
        { role: "assistant", content: "تعذّر الاتصال بالخادم." },
      ]);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div style={{ maxWidth: 700, margin: "0 auto", padding: 16 }} dir="rtl">
      <h2>محادثة رفيق</h2>

      <div
        style={{
          border: "1px solid #ddd",
          borderRadius: 12,
          padding: 16,
          minHeight: 300,
          marginBottom: 12,
          background: "#fafafa",
        }}
      >
        {messages.length === 0 && (
          <p style={{ color: "#888" }}>اكتب سؤالك الأول لرفيق…</p>
        )}

        {messages.map((m, i) => (
          <div
            key={i}
            style={{
              textAlign: m.role === "user" ? "left" : "right",
              margin: "8px 0",
            }}
          >
            <span
              style={{
                display: "inline-block",
                padding: "8px 12px",
                borderRadius: 12,
                background: m.role === "user" ? "#d4eaff" : "#e8e8e8",
                maxWidth: "80%",
              }}
            >
              {m.content}
            </span>
          </div>
        ))}

        {loading && <p style={{ color: "#888" }}>رفيق يكتب…</p>}
      </div>

      <div style={{ display: "flex", gap: 8 }}>
        <input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && sendMessage()}
          placeholder="اكتب رسالتك هنا…"
          style={{
            flex: 1,
            padding: "10px 12px",
            borderRadius: 8,
            border: "1px solid #ccc",
          }}
        />
        <button
          onClick={sendMessage}
          disabled={loading}
          style={{
            padding: "10px 20px",
            borderRadius: 8,
            border: "none",
            background: "#2563eb",
            color: "white",
            cursor: "pointer",
          }}
        >
          إرسال
        </button>
      </div>
    </div>
  );
}