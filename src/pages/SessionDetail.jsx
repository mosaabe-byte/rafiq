import { useParams, Link } from 'react-router-dom';
import { IconArrowRight, IconCopy, IconCheck, IconCircleCheck, IconBulb, IconAlertTriangle, IconChevronDown, IconFileCode } from '@tabler/icons-react';
import { useState } from 'react';
import { learningContent } from '../data/learningContent';
import './SessionDetail.css';
import LessonChat from '../components/LessonChat';

export default function SessionDetail() {
  const { id } = useParams();
  const session = learningContent[id];
  const [copiedIdx, setCopiedIdx] = useState(null);
  const [openCode, setOpenCode] = useState({});

  if (!session) {
    return (
      <div className="session-detail">
        <Link to="/learn" className="back-link"><IconArrowRight size={18} /> رجوع للرحلة</Link>
        <div className="not-ready">
          <p>محتوى هذه المحطة قيد الإعداد.</p>
          <p className="not-ready-sub">نبنيها قريباً بنفس عناية المحطات السابقة.</p>
        </div>
      </div>
    );
  }

  function copyCode(text, idx) {
    navigator.clipboard.writeText(text);
    setCopiedIdx(idx);
    setTimeout(() => setCopiedIdx(null), 1500);
  }

  let codeCounter = 0;
  function toggleCode(idx) {
    setOpenCode((prev) => ({ ...prev, [idx]: !prev[idx] }));
  }

  return (
    <div className="session-detail">
      <Link to="/learn" className="back-link"><IconArrowRight size={18} /> رجوع للرحلة</Link>

      <div className="sd-header">
        <div className="sd-num">{id}</div>
        <div>
          <h1>{session.title}</h1>
        </div>
      </div>
      <p className="sd-intro">{session.intro}</p>

      {session.sections.map((sec, si) => (
        <div key={si} className="sd-section">
          <div className="sd-section-head">
            <h2>{sec.title}</h2>
            {sec.subtitle && <p>{sec.subtitle}</p>}
          </div>

          <div className="sd-steps">
            {sec.steps.map((step, sti) => {
              if (step.type === 'text') {
                return <p key={sti} className="sd-text">{step.text}</p>;
              }
              if (step.type === 'instruction') {
                return (
                  <div key={sti} className="sd-instruction">
                    <span className="sd-inst-icon">{step.icon}</span>
                    <span>{step.text}</span>
                  </div>
                );
              }
              if (step.type === 'code') {
                const idx = codeCounter++;
                return (
                  <div key={sti} className="sd-code">
                    <code>{step.text}</code>
                    <button onClick={() => copyCode(step.text, idx)}>
                      {copiedIdx === idx ? <IconCheck size={15} /> : <IconCopy size={15} />}
                      {copiedIdx === idx ? 'تم' : 'نسخ'}
                    </button>
                  </div>
                );
              }
              if (step.type === 'tip') {
                return (
                  <div key={sti} className="sd-alert sd-tip">
                    <IconBulb size={18} /> <span>{step.text}</span>
                  </div>
                );
              }
              if (step.type === 'warn') {
                return (
                  <div key={sti} className="sd-alert sd-warn">
                    <IconAlertTriangle size={18} /> <span>{step.text}</span>
                  </div>
                );
              }
              if (step.type === 'verify') {
                return (
                  <div key={sti} className="sd-verify">
                    <div className="sd-verify-head"><IconCircleCheck size={16} /> النتيجة المتوقّعة</div>
                    <div className="sd-verify-out">{step.text}</div>
                    {step.note && <div className="sd-verify-note">{step.note}</div>}
                  </div>
                );
              }
              if (step.type === 'codeblock') {
                const idx = codeCounter++;
                const isOpen = openCode[idx];
                return (
                  <div key={sti} className="sd-codeblock">
                    <button className="sd-codeblock-head" onClick={() => toggleCode(idx)}>
                      <IconFileCode size={16} />
                      <span className="sd-codeblock-label">{step.label || 'الكود الكامل'}</span>
                      <IconChevronDown size={16} className={'sd-cb-chevron' + (isOpen ? ' open' : '')} />
                    </button>
                    {isOpen && (
                      <div className="sd-codeblock-body">
                        <button className="sd-cb-copy" onClick={() => copyCode(step.text, 'cb' + idx)}>
                          {copiedIdx === 'cb' + idx ? <IconCheck size={14} /> : <IconCopy size={14} />}
                          {copiedIdx === 'cb' + idx ? 'تم النسخ' : 'نسخ'}
                        </button>
                        <pre><code>{step.text}</code></pre>
                      </div>
                    )}
                  </div>
                );
              }
              return null;
            })}
          </div>
        </div>
      ))}

      <Link to="/learn" className="sd-done">أنهيت هذه المحطة — رجوع للرحلة</Link>
      <LessonChat
        lessonTitle={session.title}
        lessonIntro={session.intro}
        lessonContent={session.sections.map((sec) =>
          sec.title + ': ' + sec.steps.map((st) => st.text).join(' | ')
        ).join('\n')}
      />
    </div>
  );
}