import { useParams, Link } from 'react-router-dom';
import { IconArrowRight, IconCopy, IconCheck, IconCircleCheck, IconBulb, IconAlertTriangle } from '@tabler/icons-react';
import { useState } from 'react';
import { learningContent } from '../data/learningContent';
import './SessionDetail.css';

export default function SessionDetail() {
  const { id } = useParams();
  const session = learningContent[id];
  const [copiedIdx, setCopiedIdx] = useState(null);

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
              return null;
            })}
          </div>
        </div>
      ))}

      <Link to="/learn" className="sd-done">أنهيت هذه المحطة — رجوع للرحلة</Link>
    </div>
  );
}