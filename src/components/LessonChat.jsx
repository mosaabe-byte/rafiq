import { useState } from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { IconMessageCircle, IconX, IconSend } from '@tabler/icons-react';
import './LessonChat.css';

export default function LessonChat({ lessonTitle, lessonIntro, lessonContent }) {
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
          },
        }),
      });

      const data = await res.json();
      if (data.reply) {
        setMessages([...newMessages, { role: 'assistant', content: data.reply }]);
      } else {
        setMessages([...newMessages, { role: 'assistant', content: 'حدث خطأ: ' + (data.error || 'غير معروف') }]);
      }
    } catch (err) {
      setMessages([...newMessages, { role: 'assistant', content: 'تعذّر الاتصال بالخادم.' }]);
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
          <span>تعثّرت؟ اسأل رفيق</span>
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
              <p className="lc-empty">
                تعثّرت في خطوة؟ لم تفهم شيئاً؟ اسألني وسأساعدك في هذه المحطة تحديداً.
              </p>
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
            {loading && <p className="lc-typing">رفيق يكتب…</p>}
          </div>

          <div className="lc-input-row">
            <input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && send()}
              placeholder="اكتب سؤالك عن هذه المحطة…"
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