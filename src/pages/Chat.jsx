// src/pages/Chat.jsx
import { useState, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { supabase } from "../lib/supabase";
import { useAuth } from "../auth/AuthContext";

const DAILY_LIMIT = 10; // الحدّ اليومي لرسائل المستخدم المجاني

export default function Chat() {
  const { user } = useAuth();
  const [searchParams] = useSearchParams();

  const [todayCount, setTodayCount] = useState(0);
  const [limitReached, setLimitReached] = useState(false);

  const [projects, setProjects] = useState([]);
  const [selectedProjectId, setSelectedProjectId] = useState("");
  const [conversationId, setConversationId] = useState(null);

  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [loadingHistory, setLoadingHistory] = useState(false);
  const [copiedIndex, setCopiedIndex] = useState(null);

  // تحميل قائمة المشاريع عند فتح الصفحة
  useEffect(() => {
    async function loadProjects() {
      const { data, error } = await supabase
        .from("projects")
        .select("id, name, emoji, level, phase, progress, platform")
        .order("created_at", { ascending: false });

      if (!error && data) {
        setProjects(data);

        const fromUrl = searchParams.get("project");
        if (fromUrl && data.some((p) => String(p.id) === fromUrl)) {
          setSelectedProjectId(fromUrl);

          const phaseFromUrl = searchParams.get("phase");
          if (phaseFromUrl) {
            setInput(`أين وصلت في مرحلة «${phaseFromUrl}»؟ وما الخطوة التالية التي أنصح بها؟`);
          }
        }
      }
    }
    loadProjects();
  }, [searchParams]);
// عدّ رسائل المستخدم المُرسَلة اليوم (للحدّ اليومي)
  useEffect(() => {
    if (!user) return;

    async function countTodayMessages() {
      const startOfDay = new Date();
      startOfDay.setHours(0, 0, 0, 0);

      const { count, error } = await supabase
        .from("messages")
        .select("id", { count: "exact", head: true })
        .eq("user_id", user.id)
        .eq("role", "user")
        .gte("created_at", startOfDay.toISOString());

      if (!error && typeof count === "number") {
        setTodayCount(count);
        setLimitReached(count >= DAILY_LIMIT);
      }
    }

    countTodayMessages();
  }, [user]);

  // عند اختيار مشروع: نحمّل محادثته السابقة أو نُنشئ محادثة جديدة
  useEffect(() => {
    if (!selectedProjectId || !user) return;

    async function loadOrCreateConversation() {
      setLoadingHistory(true);
      setMessages([]);
      setConversationId(null);

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

    // فحص الحدّ اليومي قبل الإرسال
    if (todayCount >= DAILY_LIMIT) {
      setLimitReached(true);
      return;
    }

    const selectedProject = projects.find((p) => p.id === Number(selectedProjectId));

    // تحديث العدّاد المحلي فوراً
    const newCount = todayCount + 1;
    setTodayCount(newCount);
    if (newCount >= DAILY_LIMIT) setLimitReached(true);

    const newMessages = [...messages, { role: "user", content: text }];
    setMessages(newMessages);
    setInput("");
    setLoading(true);

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
          project: selectedProject,
        }),
      });

      const data = await res.json();

      if (data.reply) {
        setMessages([...newMessages, { role: "assistant", content: data.reply }]);

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

  async function copyMessage(text, index) {
    try {
      await navigator.clipboard.writeText(text);
      setCopiedIndex(index);
      setTimeout(() => setCopiedIndex(null), 1500);
    } catch (err) {
      // نسخ احتياطي إن لم يدعم المتصفّح clipboard API
    }
  }

  return (
    <div
      style={{
        maxWidth: 760,
        margin: "0 auto",
        height: "calc(100vh - 120px)",
        display: "flex",
        flexDirection: "column",
        padding: "12px 16px 0",
      }}
      dir="rtl"
    >
      <h2 style={{ margin: "0 0 10px" }}>محادثة رفيق</h2>

      <select
        value={selectedProjectId}
        onChange={(e) => setSelectedProjectId(e.target.value)}
        style={{
          width: "100%",
          padding: "10px 12px",
          borderRadius: 8,
          border: "1px solid #ccc",
          marginBottom: 10,
          flexShrink: 0,
        }}
      >
        <option value="">اختر مشروعاً للمحادثة عنه...</option>
        {projects.map((p) => (
          <option key={p.id} value={p.id}>
            {p.emoji} {p.name}
          </option>
        ))}
      </select>

      {/* منطقة الرسائل: تتمدّد وتتمرّر وحدها */}
      <div
        style={{
          flex: 1,
          overflowY: "auto",
          border: "1px solid #ddd",
          borderRadius: 12,
          padding: 16,
          marginBottom: 12,
          background: "#fafafa",
          minHeight: 0,
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
              display: "flex",
              flexDirection: "column",
              alignItems: m.role === "user" ? "flex-start" : "flex-end",
              margin: "10px 0",
            }}
          >
            <div
              style={{
                padding: "10px 14px",
                borderRadius: 12,
                background: m.role === "user" ? "#d4eaff" : "#ffffff",
                border: m.role === "user" ? "none" : "1px solid #e5e5e5",
                maxWidth: "85%",
                lineHeight: 1.7,
                overflowWrap: "anywhere",
              }}
              className="rafiq-bubble"
            >
              {m.role === "assistant" ? (
                <ReactMarkdown remarkPlugins={[remarkGfm]}>{m.content}</ReactMarkdown>
              ) : (
                m.content
              )}
            </div>

            {m.role === "assistant" && (
              <button
                onClick={() => copyMessage(m.content, i)}
                style={{
                  marginTop: 4,
                  padding: "3px 10px",
                  fontSize: 12,
                  border: "1px solid #ddd",
                  borderRadius: 6,
                  background: "#fff",
                  color: "#555",
                  cursor: "pointer",
                }}
              >
                {copiedIndex === i ? "✓ تم النسخ" : "📋 نسخ"}
              </button>
            )}
          </div>
        ))}

        {loading && <p style={{ color: "#888" }}>رفيق يكتب…</p>}
      </div>

      {/* تنبيه بلوغ الحدّ اليومي */}
      {limitReached && (
        <div
          style={{
            background: "#fff7ed",
            border: "1px solid #fed7aa",
            borderRadius: 10,
            padding: "12px 14px",
            marginBottom: 10,
            color: "#9a3412",
            fontSize: 14,
            lineHeight: 1.7,
            flexShrink: 0,
          }}
        >
          🌙 وصلت إلى حدّك اليومي ({DAILY_LIMIT} رسائل). عُد غداً لمواصلة رحلتك مع رفيق.
          <br />
          <span style={{ fontSize: 13, color: "#c2410c" }}>
            قريباً ستتمكّن من رفع هذا الحدّ ومواصلة المحادثة بلا توقّف.
          </span>
        </div>
      )}

      {/* منطقة الإدخال: ثابتة أسفل الشاشة دائماً */}
      <div
        style={{
          display: "flex",
          gap: 8,
          paddingBottom: 12,
          flexShrink: 0,
        }}
      >
        <input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && sendMessage()}
          placeholder={
            limitReached
              ? "وصلت حدّك اليومي — عُد غداً"
              : selectedProjectId
              ? "اكتب رسالتك هنا…"
              : "اختر مشروعاً أولاً"
          }
          disabled={!selectedProjectId || limitReached}
          style={{
            flex: 1,
            padding: "10px 12px",
            borderRadius: 8,
            border: "1px solid #ccc",
          }}
        />
        <button
          onClick={sendMessage}
          disabled={loading || !selectedProjectId || limitReached}
          style={{
            padding: "10px 20px",
            borderRadius: 8,
            border: "none",
            background: limitReached ? "#9ca3af" : "#2563eb",
            color: "white",
            cursor: selectedProjectId && !limitReached ? "pointer" : "not-allowed",
            flexShrink: 0,
          }}
        >
          إرسال
        </button>
      </div>
    </div>
  );
}