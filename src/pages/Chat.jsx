// src/pages/Chat.jsx
import { useState, useEffect } from "react";
import { supabase } from "../lib/supabase";
import { useAuth } from "../auth/AuthContext";

export default function Chat() {
  const { user } = useAuth();

  const [projects, setProjects] = useState([]);
  const [selectedProjectId, setSelectedProjectId] = useState("");
  const [conversationId, setConversationId] = useState(null);

  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [loadingHistory, setLoadingHistory] = useState(false);

  // تحميل قائمة المشاريع عند فتح الصفحة
  useEffect(() => {
    async function loadProjects() {
      const { data, error } = await supabase
        .from("projects")
        .select("id, name, emoji")
        .order("created_at", { ascending: false });

      if (!error && data) setProjects(data);
    }
    loadProjects();
  }, []);

  // عند اختيار مشروع: نحمّل محادثته السابقة أو نُنشئ محادثة جديدة
  useEffect(() => {
    if (!selectedProjectId || !user) return;

    async function loadOrCreateConversation() {
      setLoadingHistory(true);
      setMessages([]);
      setConversationId(null);

      // 1. نبحث عن محادثة سابقة لهذا المشروع
      const { data: existing, error: findError } = await supabase
        .from("conversations")
        .select("id")
        .eq("user_id", user.id)
        .eq("project_id", selectedProjectId)
        .order("created_at", { ascending: false })
        .limit(1)
        .maybeSingle();

      if (findError) {
        setLoadingHistory(false);
        return;
      }

      let convId = existing?.id;

      // 2. إن لم توجد، نُنشئ محادثة جديدة
      if (!convId) {
        const { data: created, error: createError } = await supabase
          .from("conversations")
          .insert({ user_id: user.id, project_id: selectedProjectId })
          .select("id")
          .single();

        if (createError) {
          setLoadingHistory(false);
          return;
        }
        convId = created.id;
      }

      setConversationId(convId);

      // 3. نحمّل رسائل هذه المحادثة (إن وُجدت)
      const { data: msgs, error: msgsError } = await supabase
        .from("messages")
        .select("role, content")
        .eq("conversation_id", convId)
        .order("created_at", { ascending: true });

      if (!msgsError && msgs) setMessages(msgs);

      setLoadingHistory(false);
    }

    loadOrCreateConversation();
  }, [selectedProjectId, user]);

  async function sendMessage() {
    const text = input.trim();
    if (!text || loading || !conversationId) return;

    const newMessages = [...messages, { role: "user", content: text }];
    setMessages(newMessages);
    setInput("");
    setLoading(true);

    // حفظ رسالة المستخدم في القاعدة
    await supabase.from("messages").insert({
      conversation_id: conversationId,
      user_id: user.id,
      role: "user",
      content: text,
    });

    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          messages: newMessages.map((m) => ({ role: m.role, content: m.content })),
        }),
      });

      const data = await res.json();

      if (data.reply) {
        setMessages([...newMessages, { role: "assistant", content: data.reply }]);

        // حفظ رد رفيق + عدد التوكنات
        await supabase.from("messages").insert({
          conversation_id: conversationId,
          user_id: user.id,
          role: "assistant",
          content: data.reply,
          input_tokens: data.usage?.input_tokens ?? null,
          output_tokens: data.usage?.output_tokens ?? null,
        });
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

      <select
        value={selectedProjectId}
        onChange={(e) => setSelectedProjectId(e.target.value)}
        style={{
          width: "100%",
          padding: "10px 12px",
          borderRadius: 8,
          border: "1px solid #ccc",
          marginBottom: 12,
        }}
      >
        <option value="">اختر مشروعاً للمحادثة عنه...</option>
        {projects.map((p) => (
          <option key={p.id} value={p.id}>
            {p.emoji} {p.name}
          </option>
        ))}
      </select>

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
        {!selectedProjectId && (
          <p style={{ color: "#888" }}>اختر مشروعاً أعلاه لتبدأ أو تكمل محادثتك معه.</p>
        )}

        {selectedProjectId && loadingHistory && (
          <p style={{ color: "#888" }}>جاري تحميل المحادثة السابقة…</p>
        )}

        {selectedProjectId && !loadingHistory && messages.length === 0 && (
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
          placeholder={selectedProjectId ? "اكتب رسالتك هنا…" : "اختر مشروعاً أولاً"}
          disabled={!selectedProjectId}
          style={{
            flex: 1,
            padding: "10px 12px",
            borderRadius: 8,
            border: "1px solid #ccc",
          }}
        />
        <button
          onClick={sendMessage}
          disabled={loading || !selectedProjectId}
          style={{
            padding: "10px 20px",
            borderRadius: 8,
            border: "none",
            background: "#2563eb",
            color: "white",
            cursor: selectedProjectId ? "pointer" : "not-allowed",
          }}
        >
          إرسال
        </button>
      </div>
    </div>
  );
}