// src/pages/Chat.jsx
import { useState, useEffect, useRef } from "react";
import { useSearchParams } from "react-router-dom";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { supabase } from "../lib/supabase";
import { useAuth } from "../auth/AuthContext";
import { useLanguage } from "../i18n/LanguageContext";
import "./Chat.css";

// الحدود اليومية لكل نموذج (مطابقة لسجلّ النماذج api/models.js)
const DAILY_LIMITS = { fast: 20, deep: 5 };
function getLimit(key) {
  return DAILY_LIMITS[key] ?? DAILY_LIMITS.fast;
}

export default function Chat() {
  const { user } = useAuth();
  const { lang, t } = useLanguage();
  const [searchParams] = useSearchParams();

  const [todayCount, setTodayCount] = useState(0);
  const [limitReached, setLimitReached] = useState(false);

  const [projects, setProjects] = useState([]);
  const [selectedProjectId, setSelectedProjectId] = useState("");
  const [modelKey, setModelKey] = useState("fast");
  const [completedStations, setCompletedStations] = useState([]);
  const [userName, setUserName] = useState("");
  const [conversationId, setConversationId] = useState(null);

  const [messages, setMessages] = useState([]);
  const messagesEndRef = useRef(null);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [loadingHistory, setLoadingHistory] = useState(false);
  const [copiedIndex, setCopiedIndex] = useState(null);
  const [reportingIndex, setReportingIndex] = useState(null);
  const [reportReason, setReportReason] = useState("");
  const [reportSending, setReportSending] = useState(false);
  const [reportedIndexes, setReportedIndexes] = useState([]);

  // استبدال {n} أو {phase} داخل نص الترجمة
  function tt(key, vars) {
    let str = t(key);
    if (vars) {
      Object.keys(vars).forEach((k) => {
        str = str.replace("{" + k + "}", vars[k]);
      });
    }
    return str;
  }

  // التمرير التلقائي لآخر رسالة عند كل تحديث
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth", block: "end" });
  }, [messages, loading, loadingHistory]);

  async function submitReport(messageIndex) {
    if (reportSending) return;
    setReportSending(true);

    const reportedMsg = messages[messageIndex]?.content || "";
    const prevUserMsg =
      messageIndex > 0 && messages[messageIndex - 1]?.role === "user"
        ? messages[messageIndex - 1].content
        : null;

    const { error } = await supabase.from("error_reports").insert({
      user_id: user.id,
      project_id: selectedProjectId ? Number(selectedProjectId) : null,
      reported_message: reportedMsg,
      user_question: prevUserMsg,
      reason: reportReason.trim() || null,
    });

    setReportSending(false);

    if (!error) {
      setReportedIndexes((prev) => [...prev, messageIndex]);
      setReportingIndex(null);
      setReportReason("");
    }
  }

  // جلب المحطات المكتملة واسم المستخدم (لسياق رفيق والترحيب)
  useEffect(() => {
    if (!user) return;
    let cancelled = false;

    async function loadUserContext() {
      const { data: stations, error: stationsError } = await supabase
        .from("station_completions")
        .select("station_number")
        .eq("user_id", user.id)
        .order("station_number", { ascending: true });

      if (!cancelled && !stationsError && stations) {
        setCompletedStations(stations.map((r) => r.station_number));
      }

      const { data: profile, error: profileError } = await supabase
        .from("profiles")
        .select("name")
        .eq("id", user.id)
        .maybeSingle();

      if (!cancelled && !profileError && profile?.name) {
        setUserName(profile.name);
      }
    }

    loadUserContext();
    return () => { cancelled = true; };
  }, [user]);

  // تحميل قائمة المشاريع عند فتح الصفحة
  useEffect(() => {
    async function loadProjects() {
      const { data, error } = await supabase
        .from("projects")
        .select("id, name, emoji, level, phase_number, progress, platform, tech_stack")
        .order("created_at", { ascending: false });

      if (!error && data) {
        setProjects(data);

        const fromUrl = searchParams.get("project");
        if (fromUrl && data.some((p) => String(p.id) === fromUrl)) {
          setSelectedProjectId(fromUrl);

          const phaseFromUrl = searchParams.get("phase");
          if (phaseFromUrl) {
            setInput(tt("chat.lessonPhasePrompt", { phase: phaseFromUrl }));
          }
        }
      }
    }
    loadProjects();
    // eslint-disable-next-line react-hooks/exhaustive-deps
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
        .eq("model_key", modelKey)
        .gte("created_at", startOfDay.toISOString());

      if (!error && typeof count === "number") {
        setTodayCount(count);
        setLimitReached(count >= getLimit(modelKey));
      }
    }

    countTodayMessages();
  }, [user, modelKey]);

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
  }, [selectedProjectId, user?.id]);

  async function sendMessage() {
    const text = input.trim();
    if (!text || loading || !conversationId) return;

    const limit = getLimit(modelKey);
    if (todayCount >= limit) {
      setLimitReached(true);
      return;
    }

    const selectedProject = projects.find((p) => p.id === Number(selectedProjectId));

    const newCount = todayCount + 1;
    setTodayCount(newCount);
    if (newCount >= limit) setLimitReached(true);

    const newMessages = [...messages, { role: "user", content: text }];
    setMessages(newMessages);
    setInput("");
    setLoading(true);

    await supabase.from("messages").insert({
      conversation_id: conversationId,
      user_id: user.id,
      role: "user",
      content: text,
      model_key: modelKey,
    });

    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          messages: newMessages.map((m) => ({ role: m.role, content: m.content })),
          project: selectedProject,
          lang,
          modelKey,
          completedStations,
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
          { role: "assistant", content: t("chat.errorPrefix") + (data.error || t("chat.errorUnknown")) },
        ]);
      }
    } catch (err) {
      setMessages([
        ...newMessages,
        { role: "assistant", content: t("chat.connFailed") },
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
    <div className="chat-page">
      <h2 className="chat-title">{t("chat.title")}</h2>

      <select
        className="chat-select"
        value={selectedProjectId}
        onChange={(e) => setSelectedProjectId(e.target.value)}
      >
        <option value="">{t("chat.selectProject")}</option>
        {projects.map((p) => (
          <option key={p.id} value={p.id}>
            {p.emoji} {p.name}
          </option>
        ))}
      </select>

{selectedProjectId && (
        <div className="model-switch">
          <button
            className={"model-opt" + (modelKey === "fast" ? " active" : "")}
            onClick={() => setModelKey("fast")}
          >
            {t("chat.modelFast")}
          </button>
          <button
            className={"model-opt" + (modelKey === "deep" ? " active" : "")}
            onClick={() => setModelKey("deep")}
          >
            {t("chat.modelDeep")}
          </button>
        </div>
      )}
      {/* منطقة الرسائل: تتمدّد وتتمرّر وحدها */}
      <div className="chat-messages">
        {!selectedProjectId && (
          <p className="chat-hint">{t("chat.pickToStart")}</p>
        )}

        {selectedProjectId && loadingHistory && (
          <p className="chat-hint">{t("chat.loadingHistory")}</p>
        )}

        {selectedProjectId && !loadingHistory && messages.length === 0 && (
          <div className="chat-welcome">
            {(() => {
              const p = projects.find((pr) => pr.id === Number(selectedProjectId));
              const name =
                user?.user_metadata?.name ||
                user?.user_metadata?.full_name ||
                "";
              const envReady = completedStations.includes(1);
              const greeting = "مرحباً بك صديقي 🌱";

              if (envReady) {
                return (
                  <>
                    <p className="chat-welcome-title">{greeting}</p>
                    <p>
                      أهلاً بعودتك — أراك بدأت مشروعاً جديداً
                      {p?.name ? ` «${p.name}»` : ""}. بيئتك جاهزة من قبل،
                      فلا داعي لإعدادها ثانيةً. لنبدأ إذاً من التخطيط: ما الفكرة
                      التي تريد أن نحوّلها إلى مشروع هذه المرّة؟
                    </p>
                    <p className="chat-welcome-hint">
                      اكتب سؤالك في الأسفل، وأنا معك خطوة خطوة.
                    </p>
                  </>
                );
              }

              return (
                <>
                  <p className="chat-welcome-title">{greeting}</p>
                  <p>
                    أنا رفيقك في رحلة بناء مشروعك
                    {p?.name ? ` «${p.name}»` : ""}. لعلّك تسأل الآن: من أين أبدأ،
                    وما أول خطوة؟ هذا طبيعيّ تماماً لكل مبتدئ — ولا تقلق، فأنا هنا
                    لآخذ بيدك خطوة خطوة حتى تنجزه.
                  </p>
                  <p>
                    لكن أخبرني أولاً: هل أعددت بيئة التطوير (Node و VS Code) من
                    قبل، أم نُعدّها معاً؟ إن كانت جاهزة، نبدأ من التخطيط مباشرةً؛
                    وإن لم تكن، فمحطتنا الأولى هي إعداد بيئتك — وأرافقك فيها.
                  </p>
                  <p className="chat-welcome-hint">أخبرني في الأسفل، وأنا معك.</p>
                </>
              );
            })()}
          </div>
        )}

        {messages.map((m, i) => (
          <div key={i} className={"chat-row " + (m.role === "user" ? "user" : "assistant")}>
            <div className="rafiq-bubble">
              {m.role === "assistant" ? (
                <ReactMarkdown remarkPlugins={[remarkGfm]}>{m.content}</ReactMarkdown>
              ) : (
                m.content
              )}
            </div>

            {m.role === "assistant" && (
              <div className="chat-actions">
                <button className="chat-action-btn" onClick={() => copyMessage(m.content, i)}>
                  {copiedIndex === i ? t("chat.copied") : t("chat.copy")}
                </button>

                {reportedIndexes.includes(i) ? (
                  <span className="chat-report-thanks">{t("chat.reportThanks")}</span>
                ) : (
                  <button
                    className="chat-action-btn report"
                    onClick={() => {
                      setReportingIndex(reportingIndex === i ? null : i);
                      setReportReason("");
                    }}
                  >
                    {t("chat.report")}
                  </button>
                )}
              </div>
            )}

            {reportingIndex === i && (
              <div className="chat-report-box">
                <div className="chat-report-q">{t("chat.reportQuestion")}</div>
                <textarea
                  className="chat-report-textarea"
                  value={reportReason}
                  onChange={(e) => setReportReason(e.target.value)}
                  placeholder={t("chat.reportPlaceholder")}
                />
                <div className="chat-report-actions">
                  <button className="chat-report-send" onClick={() => submitReport(i)} disabled={reportSending}>
                    {reportSending ? t("chat.reportSending") : t("chat.reportSend")}
                  </button>
                  <button
                    className="chat-report-cancel"
                    onClick={() => {
                      setReportingIndex(null);
                      setReportReason("");
                    }}
                  >
                    {t("chat.cancel")}
                  </button>
                </div>
              </div>
            )}
          </div>
        ))}

        {loading && <p className="chat-hint">{t("chat.typing")}</p>}
        <div ref={messagesEndRef} />
      </div>

      {/* تنبيه بلوغ الحدّ اليومي */}
      {limitReached && (
        <div className="chat-limit">
          {tt("chat.limitTitle", { n: getLimit(modelKey) })}
          <br />
          <span className="chat-limit-sub">{t("chat.limitSub")}</span>
        </div>
      )}

      {/* منطقة الإدخال: ثابتة أسفل الشاشة دائماً */}
      <div className="chat-input-row">
        <input
          className="chat-input"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && sendMessage()}
          placeholder={
            limitReached
              ? t("chat.inputLimitReached")
              : selectedProjectId
              ? t("chat.inputPlaceholder")
              : t("chat.inputPickFirst")
          }
          disabled={!selectedProjectId || limitReached}
        />
        <button
          className="chat-send"
          onClick={sendMessage}
          disabled={loading || !selectedProjectId || limitReached}
        >
          {t("chat.send")}
        </button>
      </div>
    </div>
  );
}