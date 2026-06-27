import { useState } from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { IconMessageCircle, IconX, IconSend } from '@tabler/icons-react';
import { useLanguage } from '../i18n/LanguageContext';
import './LessonChat.css';

// نصوص النافذة بثلاث لغات
const UI = {
  ar: {
    fab: 'تعثّرت؟ اسأل رفيق',
    empty: 'تعثّرت في خطوة؟ لم تفهم شيئاً؟ اسألني وسأساعدك في هذه المحطة تحديداً.',
    placeholder: 'اكتب سؤالك عن هذه المحطة…',
    typing: 'رفيق يكتب…',
    errServer: 'حدث خطأ: ',
    errConn: 'تعذّر الاتصال بالخادم.',
    unknown: 'غير معروف',
  },
  fr: {
    fab: 'Bloqué ? Demande à Rafiq',
    empty: 'Bloqué sur une étape ? Pose ta question, je t\'aide sur cette étape précisément.',
    placeholder: 'Écris ta question sur cette étape…',
    typing: 'Rafiq écrit…',
    errServer: 'Erreur : ',
    errConn: 'Impossible de se connecter au serveur.',
    unknown: 'inconnu',
  },
  en: {
    fab: 'Stuck? Ask Rafiq',
    empty: 'Stuck on a step? Ask me and I\'ll help you with this lesson specifically.',
    placeholder: 'Type your question about this lesson…',
    typing: 'Rafiq is typing…',
    errServer: 'Error: ',
    errConn: 'Could not connect to the server.',
    unknown: 'unknown',
  },
};

export default function LessonChat({ lessonTitle, lessonIntro, lessonContent }) {
  const { lang } = useLanguage();
  const t = UI[lang] || UI.ar;
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);

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
          messages: newMessages.map((m) => ({ role: m.role, content: m.content })),
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
      } else {
        setMessages([...newMessages, { role: 'assistant', content: t.errServer + (data.error || t.unknown) }]);
      }
    } catch (err) {
      setMessages([...newMessages, { role: 'assistant', content: t.errConn }]);
    } finally {
      setLoading(false);
    }
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
                    ? <ReactMarkdown remarkPlugins={[remarkGfm]}>{m.content}</ReactMarkdown>
                    : m.content}
                </div>
              </div>
            ))}
            {loading && <p className="lc-typing">{t.typing}</p>}
          </div>

          <div className="lc-input-row">
            <input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && send()}
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