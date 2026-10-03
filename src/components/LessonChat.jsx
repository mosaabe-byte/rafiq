import { useState, useEffect, useRef } from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { IconMessageCircle, IconX, IconSend } from '@tabler/icons-react';
import { useLanguage } from '../i18n/LanguageContext';
import './LessonChat.css';
import DOMPurify from 'dompurify';
import { supabase } from '../lib/supabase';
import { useAuth } from '../auth/AuthContext';

// نصوص النافذة بثلاث لغات
const UI = {
  ar: {
    fab: 'تعثّرت؟ اسأل رفيق',
    empty: 'تعثّرت في خطوة؟ لم تفهم شيئاً؟ اسألني وسأساعدك في هذه المحطة تحديداً.',
    placeholder: 'اكتب سؤالك عن هذه المحطة…',
    typing: 'رفيق يكتب…',
    errServer: 'حدث خطأ: ',
    errConn: 'تعذّر الاتصال بالخادم.',
    err_service_paused: "رفيق متوقّف مؤقّتًا من جهتنا، لا من جهتك. محادثتك ومشروعك محفوظان، ونعمل على إعادته.",
    err_overloaded: "رفيق مشغول جدًّا في هذه اللحظة. انتظر قليلًا ثمّ أعد الإرسال.",
    err_bad_request: "تعذّرت معالجة هذه الرسالة. أعد صياغتها أو أرسلها من جديد، وإن تكرّر هذا فأبلغنا.",
    err_server_error: "حدث خلل عندنا أثناء تحضير الردّ. أعد الإرسال، وإن تكرّر فأبلغنا.",
    unknown: 'غير معروف',
  },
  fr: {
    fab: 'Bloqué ? Demande à Rafiq',
    empty: 'Bloqué sur une étape ? Pose ta question, je t\'aide sur cette étape précisément.',
    placeholder: 'Écris ta question sur cette étape…',
    typing: 'Rafiq écrit…',
    errServer: 'Erreur : ',
    errConn: 'Impossible de se connecter au serveur.',
    err_service_paused: "Rafiq est temporairement indisponible de notre côté, pas du vôtre. Votre conversation et votre projet sont sauvegardés ; nous travaillons à le rétablir.",
    err_overloaded: "Rafiq est très sollicité en ce moment. Patientez un peu, puis renvoyez votre message.",
    err_bad_request: "Ce message n'a pas pu être traité. Reformulez-le ou renvoyez-le ; si cela se répète, signalez-le-nous.",
    err_server_error: "Un problème est survenu de notre côté en préparant la réponse. Renvoyez votre message ; si cela se répète, signalez-le-nous.",
    unknown: 'inconnu',
  },
  en: {
    fab: 'Stuck? Ask Rafiq',
    empty: 'Stuck on a step? Ask me and I\'ll help you with this lesson specifically.',
    placeholder: 'Type your question about this lesson…',
    typing: 'Rafiq is typing…',
    errServer: 'Error: ',
    errConn: 'Could not connect to the server.',
    err_service_paused: "Rafiq is temporarily unavailable on our side, not yours. Your conversation and project are saved, and we're working to bring it back.",
    err_overloaded: "Rafiq is very busy right now. Wait a moment, then send your message again.",
    err_bad_request: "This message couldn't be processed. Rephrase it or send it again; if this keeps happening, let us know.",
    err_server_error: "Something went wrong on our side while preparing the reply. Send your message again; if it keeps happening, let us know.",
    unknown: 'unknown',
  },
};

export default function LessonChat({ lessonKey, lessonTitle, lessonIntro, lessonContent }) {
  const { lang } = useLanguage();
  const t = UI[lang] || UI.ar;
  const { user } = useAuth();
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [conversationId, setConversationId] = useState(null);
  // حقل السؤال متعدّد الأسطر — كحقل المحادثة
  const isTouch = typeof window !== 'undefined' && window.matchMedia('(pointer: coarse)').matches;
  const inputRef = useRef(null);
  useEffect(() => {
    const el = inputRef.current;
    if (!el) return;
    el.style.height = 'auto';
    el.style.height = Math.min(el.scrollHeight, 160) + 'px';
  }, [input, open]);

  // محادثة الدرس محفوظة: واحدة لكلّ مستخدم ودرس، تُجلَب حين يُفتح الدرس
  useEffect(() => {
    if (!user || !lessonKey) return;
    let cancelled = false;
    (async () => {
      const { data: conv } = await supabase
        .from('conversations')
        .select('id')
        .eq('user_id', user.id)
        .eq('lesson_key', lessonKey)
        .maybeSingle();
      if (cancelled || !conv) return;
      setConversationId(conv.id);
      const { data: msgs } = await supabase
        .from('messages')
        .select('role, content')
        .eq('conversation_id', conv.id)
        .order('created_at', { ascending: true });
      if (!cancelled && msgs) setMessages(msgs);
    })();
    return () => { cancelled = true; };
  }, [user, lessonKey]);

  // يحفظ رسالتَي الجولة، وينشئ محادثة الدرس عند أوّل رسالة لا عند الفتح
  async function persistExchange(userText, replyText, modelKey, usage) {
    if (!user || !lessonKey) return;
    let convId = conversationId;
    if (!convId) {
      const { data: created, error } = await supabase
        .from('conversations')
        .insert({ user_id: user.id, lesson_key: lessonKey })
        .select('id')
        .single();
      if (error) {
        // أُنشئت في نافذة أخرى (الفهرس الفريد يرفض الثانية): نجلبها بدل أن نفقد الرسالتين
        const { data: existing } = await supabase
          .from('conversations')
          .select('id')
          .eq('user_id', user.id)
          .eq('lesson_key', lessonKey)
          .maybeSingle();
        convId = existing?.id;
      } else {
        convId = created.id;
      }
      if (!convId) return;
      setConversationId(convId);
    }
    await supabase.from('messages').insert({
      conversation_id: convId, user_id: user.id, role: 'user', content: userText, model_key: modelKey,
    });
    await supabase.from('messages').insert({
      conversation_id: convId, user_id: user.id, role: 'assistant', content: replyText,
      input_tokens: usage?.input_tokens ?? null, output_tokens: usage?.output_tokens ?? null,
    });
  }

  async function send() {
    const text = input.trim();
    if (!text || loading) return;

    const newMessages = [...messages, { role: 'user', content: text }];
    setMessages(newMessages);
    setInput('');
    setLoading(true);

    try {
      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          messages: newMessages.slice(-20).map((m) => ({ role: m.role, content: m.content })),
          lesson: {
            title: lessonTitle,
            intro: lessonIntro,
            content: lessonContent,
            lang: lang,
          },
        }),
      });

      const data = await res.json();
      if (data.reply) {
        setMessages([...newMessages, { role: 'assistant', content: data.reply }]);
        if (user) {
          await supabase.from('usage_log').insert({
            user_id: user.id,
            model: data.modelKey ?? null,
            tokens_in: data.usage?.input_tokens ?? 0,
            tokens_out: data.usage?.output_tokens ?? 0,
            latency_ms: data.latencyMs ?? null,
            cache_write_tokens: data.usage?.cache_creation_input_tokens ?? null,
            cache_read_tokens: data.usage?.cache_read_input_tokens ?? null,
          });
        }
        await persistExchange(text, data.reply, data.modelKey ?? null, data.usage);
      } else {
        setMessages([...newMessages, { role: 'assistant', content: (data.errorCode && t['err_' + data.errorCode]) || (t.errServer + (data.error || t.unknown)) }]);
      }
    } catch (err) {
      setMessages([...newMessages, { role: 'assistant', content: t.errConn }]);
    } finally {
      setLoading(false);
    }
  }

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

  return (
    <>
      {/* الزرّ العائم */}
      {!open && (
        <button className="lesson-chat-fab" onClick={() => setOpen(true)}>
          <IconMessageCircle size={20} />
          <span>{t.fab}</span>
        </button>
      )}

      {/* النافذة */}
      {open && (
        <div className="lesson-chat-panel">
          <div className="lc-head">
            <div className="lc-head-title">
              <IconMessageCircle size={18} />
              <span>رفيق — {lessonTitle}</span>
            </div>
            <button className="lc-close" onClick={() => setOpen(false)}>
              <IconX size={18} />
            </button>
          </div>

          <div className="lc-messages">
            {messages.length === 0 && (
              <p className="lc-empty">{t.empty}</p>
            )}
            {messages.map((m, i) => (
              <div key={i} className={'lc-msg ' + (m.role === 'user' ? 'lc-user' : 'lc-bot')}>
                <div className="lc-bubble rafiq-bubble">
                  {m.role === 'assistant'
                    ? <ReactMarkdown
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
      return <code className={className}>{children}</code>;
    },
                  }}
                >
                  {m.content}
                </ReactMarkdown>
                    : m.content}
                </div>
              </div>
            ))}
            {loading && <p className="lc-typing">{t.typing}</p>}
          </div>

          <div className="lc-input-row">
            <textarea
              ref={inputRef}
              rows={1}
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter' && !e.shiftKey && !isTouch && !e.nativeEvent.isComposing) {
                  e.preventDefault();
                  send();
                }
              }}
              placeholder={t.placeholder}
            />
            <button onClick={send} disabled={loading}>
              <IconSend size={18} />
            </button>
          </div>
        </div>
      )}
    </>
  );
}