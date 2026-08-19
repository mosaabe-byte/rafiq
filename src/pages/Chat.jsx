// src/pages/Chat.jsx
import { useState, useEffect, useRef } from "react";
import { useSearchParams } from "react-router-dom";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { supabase } from "../lib/supabase";
import { searchLibrary } from "../lib/embedding";
import { useAuth } from "../auth/AuthContext";
import { useLanguage } from "../i18n/LanguageContext";
import "./Chat.css";
import DOMPurify from "dompurify";

// الحدود اليومية لكل نموذج (مطابقة لسجلّ النماذج api/models.js)
const DAILY_LIMITS = { fast: 20, deep: 5 };
function getLimit(key) {
  return DAILY_LIMITS[key] ?? DAILY_LIMITS.fast;
}

// نصوص بنود المراحل (لرسالة الاستقبال الذكية)
const PHASE_BANDS = {
  1: ["اكتب فكرة مشروعك في جملة واحدة واضحة.", "حدّد المشكلة التي يحلّها مشروعك ومن هم المستخدمون.", "اكتب قائمة بأهم 3 وظائف يجب أن ينجزها المشروع.", "ارسم تصوّراً بسيطاً للنتيجة النهائية على ورقة."],
  2: ["ارسم الشاشات الرئيسية بشكل تخطيطي بسيط.", "حدّد كيف ينتقل المستخدم من شاشة إلى أخرى.", "اختر الألوان والخطوط الأساسية لمشروعك.", "راجع التصميم وتأكد أنه بسيط وسهل الاستخدام."],
  3: ["ثبّت الأدوات اللازمة (محرّر الكود، Node.js).", "أنشئ مجلد المشروع وافتحه في محرّر الكود.", "هيّئ المشروع الأساسي وتأكد أنه يعمل محلياً.", "اربط المشروع بمستودع Git لحفظ نسخك."],
  4: ["ابنِ الشاشات واحدة تلو الأخرى حسب تصميمك.", "اكتب الكود لكل وظيفة من الوظائف الأساسية.", "اختبر كل جزء بمجرد الانتهاء منه.", "أصلح الأخطاء أولاً بأول قبل الانتقال للتالي."],
  5: ["اربط الشاشات ببعضها عبر التنقّل.", "اربط الأزرار والنماذج بالوظائف المناسبة.", "تأكد أن البيانات تنتقل بشكل صحيح بين الأجزاء.", "اختبر الرحلة الكاملة للمستخدم."],
  6: ["اختر مكان حفظ البيانات (قاعدة بيانات سحابية).", "صمّم جداول البيانات التي يحتاجها مشروعك.", "اربط التطبيق بقاعدة البيانات للقراءة والكتابة.", "أضف حماية البيانات حتى يرى كل مستخدم بياناته فقط."],
  7: ["جهّز المشروع للنشر وتأكد أنه يعمل دون أخطاء.", "ارفع الكود إلى مستودع Git على الإنترنت.", "اربط المستودع بمنصّة نشر (مثل Vercel).", "انشر المشروع وشارك الرابط مع الآخرين."],
};

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
  const [completedBands, setCompletedBands] = useState([]); // [{phase, band}] للمشروع المختار
  const [entryPhase, setEntryPhase] = useState(null); // المرحلة التي دخل منها المستخدم من «الطريق»
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
  const [libraryFiles, setLibraryFiles] = useState([]);
  const [showFilePicker, setShowFilePicker] = useState(false);
  const [attachedFile, setAttachedFile] = useState(null); // { id, name, content }
  const [attachedImage, setAttachedImage] = useState(null); // { dataUrl, mediaType }

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

  // جلب ملفّات المكتبة التي لها نصّ مستخرَج (لإرفاقها في المحادثة)
  useEffect(() => {
    async function loadLibrary() {
      const { data, error } = await supabase
        .from("library_files")
        .select("id, name, project_id, content_text")
        .eq("user_id", user.id)
        .order("created_at", { ascending: false });
      if (!error && data) setLibraryFiles(data);
    }
    if (user?.id) loadLibrary();
  }, [user]);

  // التمرير التلقائي لآخر رسالة عند كل تحديث
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth", block: "end" });
  }, [messages, loading, loadingHistory]);

  // جلب البنود المُنجَزة للمشروع المختار (لسياق رفيق)
  useEffect(() => {
    if (!user || !selectedProjectId) {
      setCompletedBands([]);
      return;
    }
    let cancelled = false;

    async function loadBands() {
      const { data, error } = await supabase
        .from('band_completions')
        .select('phase_number, band_number')
        .eq('user_id', user.id)
        .eq('project_id', selectedProjectId)
        .order('phase_number', { ascending: true })
        .order('band_number', { ascending: true });

      if (!cancelled && !error && data) {
        setCompletedBands(data.map((b) => ({ phase: b.phase_number, band: b.band_number })));
      }
    }

    loadBands();
    return () => { cancelled = true; };
  }, [user?.id, selectedProjectId]);

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
        .select("full_name")
        .eq("id", user.id)
        .maybeSingle();

      if (!cancelled && !profileError && profile?.full_name) {
        setUserName(profile.full_name);
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
        .select("id, name, emoji, level, phase_number, progress, platform, tech_stack, audience")
        .order("created_at", { ascending: false });

      if (!error && data) {
        setProjects(data);

        const fromUrl = searchParams.get("project");
        if (fromUrl && data.some((p) => String(p.id) === fromUrl)) {
          setSelectedProjectId(fromUrl);

          const phaseFromUrl = searchParams.get("phase");
          if (phaseFromUrl) {
            setEntryPhase(phaseFromUrl);
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

    // بحث دلاليّ صامت في المكتبة (RAG) — فقط إن لم يُرفق ملفّ صراحةً
    let libraryContext = null;
    if (!attachedFile && user?.id) {
      try {
        const results = await searchLibrary(text, user.id, 4);
        const relevant = results.filter((r) => r.similarity >= 0.4);
        if (relevant.length > 0) {
          libraryContext = relevant.map((r) => r.content).join("\n---\n");
        }
      } catch (e) {
        console.error("تعذّر البحث في المكتبة:", e.message);
      }
    }
    
    const newCount = todayCount + 1;
    setTodayCount(newCount);
    if (newCount >= limit) setLimitReached(true);

    const newMessages = [...messages, { role: "user", content: text }];
    setMessages(newMessages);
    setInput("");
    setAttachedImage(null);
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
          completedBands,
          attachedFile: attachedFile
            ? { name: attachedFile.name, content: attachedFile.content }
            : null,
          libraryContext,
          attachedImage: attachedImage
            ? { dataUrl: attachedImage.dataUrl, mediaType: attachedImage.mediaType }
            : null,
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

  // الملفّات القابلة للإرفاق: ما له نصّ، ضمن المشروع المختار أو العامّ (project_id = null)
  const attachableFiles = libraryFiles.filter(
    (f) =>
      f.content_text &&
      f.content_text.trim() &&
      (f.project_id === Number(selectedProjectId) || f.project_id === null)
  );

  function attachFile(f) {
    setAttachedFile({ id: f.id, name: f.name, content: f.content_text });
    setShowFilePicker(false);
  }

// اختيار صورة وتحويلها إلى base64 لعرضها ولإرسالها لرفيق
  function pickImage(e) {
    const f = e.target.files?.[0];
    if (!f) return;
    if (!f.type.startsWith("image/")) return;
    if (f.size > 5 * 1024 * 1024) {
      setMessage?.({ type: "error", text: "الصورة كبيرة (الحدّ 5 ميغابايت)." });
      return;
    }
    const reader = new FileReader();
    reader.onload = () => {
      setAttachedImage({ dataUrl: reader.result, mediaType: f.type });
    };
    reader.readAsDataURL(f);
  }
  function removeImage() {
    setAttachedImage(null);
  }

  function removeAttached() {
    setAttachedFile(null);
  }

  // عرض SVG آمن: ينظّف الكود من أي سكربت أو حدث قبل عرضه رسماً
  function SafeSvg({ code }) {
    const clean = DOMPurify.sanitize(code, {
      USE_PROFILES: { svg: true, svgFilters: true },
    });
    return (
      <div
        className="rafiq-svg"
        dangerouslySetInnerHTML={{ __html: clean }}
      />
    );
  }

  // كتلة كود بإطار وزرّ نسخ (تجربة مشابهة لِـ Claude)
  function CodeBlock({ code, lang }) {
    const [copied, setCopied] = useState(false);
    const doCopy = async () => {
      try {
        await navigator.clipboard.writeText(code);
        setCopied(true);
        setTimeout(() => setCopied(false), 1500);
      } catch (e) {}
    };
    return (
      <div className="code-block">
        <div className="code-block-head">
          <span className="code-block-lang">{lang || "code"}</span>
          <button className="code-block-copy" onClick={doCopy}>
            {copied ? t("chat.copied") : t("chat.copy")}
          </button>
        </div>
        <pre className="code-block-body"><code>{code}</code></pre>
      </div>
    );
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
              const greeting = "مرحباً بك صديقي 🌱";
              const phase = p?.phase_number || 1;

              // بنود المرحلة الحالية المُنجَزة
              const doneInPhase = completedBands
                .filter((b) => b.phase === phase)
                .map((b) => b.band)
                .sort((a, b) => a - b);
              const totalDone = completedBands.length;
              const lastBand = doneInPhase[doneInPhase.length - 1];
              const lastText = lastBand ? PHASE_BANDS[phase]?.[lastBand - 1] : null;
              const phaseComplete = doneInPhase.length >= 4;
              // حالة 0: دخل من مدخل مرحلة محدّدة في «الطريق» — نخصّ تلك المرحلة
              if (entryPhase) {
                // نجد رقم المرحلة من اسمها (entryPhase نصّ مثل «التخطيط»)
                let entryNum = null;
                for (let n = 1; n <= 7; n++) {
                  if (t('roadmap.phase' + n + 'title') === entryPhase) { entryNum = n; break; }
                }
                const entryDone = entryNum
                  ? completedBands.filter((b) => b.phase === entryNum).map((b) => b.band).sort((a, b) => a - b)
                  : [];
                const entryComplete = entryDone.length >= 4;
                const entryLastBand = entryDone[entryDone.length - 1];
                const entryLastText = (entryNum && entryLastBand) ? PHASE_BANDS[entryNum]?.[entryLastBand - 1] : null;

                return (
                  <>
                    <p className="chat-welcome-title">{greeting}</p>
                    {entryComplete ? (
                      <p>
                        بخصوص مرحلة «{entryPhase}» — ما الذي يشغل بالك فيها؟
                        تريد تعديلاً، أم إضافةً، أم فهمَ تفصيلٍ معيّن؟ أنا معك، اسألني.
                      </p>
                    ) : entryLastText ? (
                      <>
                        <p>
                          بخصوص مرحلة «{entryPhase}» — أراك أنجزتَ حتى: «{entryLastText}».
                          ما الذي يشغل بالك فيها؟ تعديلٌ، أم إضافةٌ، أم فهمُ تفصيل؟
                        </p>
                        <p>أم تريد أن نكمل بقيّة بنود هذه المرحلة؟</p>
                      </>
                    ) : (
                      <p>
                        بخصوص مرحلة «{entryPhase}» — بمَ أساعدك فيها؟ نبدأ خطواتها،
                        أم تريد فهمَ تفصيلٍ معيّن أولاً؟ أنا معك، اسألني.
                      </p>
                    )}
                    <p className="chat-welcome-hint">اكتب في الأسفل، وأنا رهن إشارتك.</p>
                  </>
                );
              }
              // بنود منجزة في هذا المشروع عبر أي مرحلة (تاريخ المشروع)
              const doneInProject = completedBands.length;
              const isMidJourney = doneInProject > 0 && phase > 1;

              // حالة 1: أنجز بنوداً في مرحلته — يذكّره أين توقّف
              if (lastText && !phaseComplete) {
                return (
                  <>
                    <p className="chat-welcome-title">{greeting}</p>
                    <p>
                      أهلاً بعودتك إلى «{p?.name}». أرانا توقّفنا عند: «{lastText}»
                      — أنجزتَ {doneInPhase.length} من 4 بنود في هذه المرحلة.
                    </p>
                    <p>نكمل من حيث توقّفنا؟ أم تريد أن نراجع ما بنيناه أولاً؟</p>
                    <p className="chat-welcome-hint">اكتب في الأسفل، وأنا معك.</p>
                  </>
                );
              }

              // حالة 2: أكمل كل بنود المرحلة — يقترح الانتقال
              if (phaseComplete) {
                return (
                  <>
                    <p className="chat-welcome-title">{greeting}</p>
                    <p>
                      أهلاً بعودتك إلى «{p?.name}». أتممتَ كل بنود هذه المرحلة —
                      عملٌ رائع. جاهز أن ننتقل للمرحلة التالية، أم نراجع ما أنجزت؟
                    </p>
                    <p className="chat-welcome-hint">اكتب في الأسفل، وأنا معك.</p>
                  </>
                );
              }

              // حالة 3: عائد بمشاريع سابقة لكن لم يبدأ بنود هذا المشروع
              if (totalDone === 0 && completedStations.includes(1)) {
                return (
                  <>
                    <p className="chat-welcome-title">{greeting}</p>
                    <p>
                      أهلاً بعودتك إلى «{p?.name}». بيئتك جاهزة من قبل، فلنبدأ
                      التخطيط لمشروعك مباشرةً — أول خطوة أن نحدّد بوضوح مَن
                      سيستخدمه وما أهمّ ما يفعله. جاهز نبدأ؟
                    </p>
                    <p className="chat-welcome-hint">اكتب في الأسفل، وأنا معك خطوة خطوة.</p>
                  </>
                );
              }

              // حالة 3.5: عائد له تاريخ في المشروع لكن مرحلته الحالية فارغة (انتقل إليها للتوّ)
              if (isMidJourney) {
                const phaseName = t('roadmap.phase' + phase + 'title');
                return (
                  <>
                    <p className="chat-welcome-title">{greeting}</p>
                    <p>
                      أهلاً بعودتك إلى «{p?.name}». أنجزتَ ما قبل هذه المرحلة،
                      وأنت الآن في «{phaseName}». لنبدأ خطواتها — رافقني بحسب
                      ما وصلت إليه.
                    </p>
                    <p className="chat-welcome-hint">اكتب في الأسفل، وأنا معك خطوة خطوة.</p>
                  </>
                );
              }

              // حالة 4: مبتدئ في أول مشروع
              return (
                <>
                  <p className="chat-welcome-title">{greeting}</p>
                  <p>
                    أنا رفيقك في رحلة بناء مشروع «{p?.name}». لعلّك تسأل: من أين أبدأ؟
                    هذا طبيعيّ لكل مبتدئ — ولا تقلق، فأنا هنا لآخذ بيدك خطوة خطوة.
                  </p>
                  <p>
                    أخبرني أولاً: هل أعددت بيئة التطوير (Node و VS Code)، أم نُعدّها معاً؟
                    إن كانت جاهزة، نبدأ من التخطيط؛ وإن لم تكن، فمحطتنا الأولى إعدادها.
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
                <ReactMarkdown
  remarkPlugins={[remarkGfm]}
  components={{
    strong: ({ children }) => <span>{children}</span>,
    em: ({ children }) => <span>{children}</span>,
    code: ({ className, children }) => {
      const raw = String(children);
      const isSvg =
        /language-svg/.test(className || "") || raw.includes("<svg");
      if (isSvg) {
        const match = raw.match(/<svg[\s\S]*<\/svg>/i);
        return <SafeSvg code={match ? match[0] : raw} />;
      }
      // كتلة كود حقيقيّة: لها لغة، أو متعدّدة الأسطر → إطار وزرّ نسخ
      const langMatch = /language-(\w+)/.exec(className || "");
      const isBlock = !!langMatch || raw.includes("\n");
      if (isBlock) {
        return <CodeBlock code={raw.replace(/\n$/, "")} lang={langMatch ? langMatch[1] : ""} />;
      }
      // كود صغير داخل السطر يبقى عاديّاً
      return <code className={className}>{children}</code>;
    },
  }}
>
  {m.content}
</ReactMarkdown>
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

      {/* ── إرفاق ملفّ من المكتبة ── */}
      {selectedProjectId && !limitReached && (
        <div className="attach-bar">
          {attachedFile ? (
            <div className="attach-chip">
              <span className="attach-chip-name">📎 {attachedFile.name}</span>
              <button
                type="button"
                className="attach-chip-x"
                onClick={removeAttached}
                aria-label={t("chat.remove")}
              >
                ✕
              </button>
            </div>
          ) : (
            <button
              type="button"
              className="attach-btn"
              onClick={() => setShowFilePicker((v) => !v)}
            >
              📎 {t("chat.attach")}
            </button>
          )}

          {showFilePicker && !attachedFile && (
            <div className="attach-list">
              {attachableFiles.length === 0 ? (
                <p className="attach-empty">{t("chat.noTextFiles")}</p>
              ) : (
                attachableFiles.map((f) => (
                  <button
                    type="button"
                    key={f.id}
                    className="attach-item"
                    onClick={() => attachFile(f)}
                  >
                    <span className="attach-item-name">{f.name}</span>
                    {!f.project_id && (
                      <span className="attach-item-tag">{t("chat.general")}</span>
                    )}
                  </button>
                ))
              )}
            </div>
          )}
        </div>
      )}

      {/* معاينة الصورة المرفقة قبل الإرسال */}
      {selectedProjectId && !limitReached && attachedImage && (
        <div className="image-preview">
          <img src={attachedImage.dataUrl} alt="معاينة" className="image-preview-img" />
          <button
            type="button"
            className="image-preview-x"
            onClick={removeImage}
            aria-label={t("chat.remove")}
          >
            ✕
          </button>
        </div>
      )}

      {/* منطقة الإدخال: ثابتة أسفل الشاشة دائماً */}
      <div className="chat-input-row">
        {selectedProjectId && !limitReached && (
          <>
            <input
              type="file"
              accept="image/*"
              id="rafiq-image-input"
              style={{ display: "none" }}
              onChange={pickImage}
            />
            <button
              type="button"
              className="chat-image-btn"
              onClick={() => document.getElementById("rafiq-image-input").click()}
              aria-label={t("chat.attachImage")}
              title={t("chat.attachImage")}
            >
              🖼️
            </button>
          </>
        )}
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