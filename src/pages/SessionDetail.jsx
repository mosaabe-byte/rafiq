import { useParams, Link, useNavigate } from 'react-router-dom';
import { IconArrowRight, IconCopy, IconCheck, IconCircleCheck, IconBulb, IconAlertTriangle, IconChevronDown, IconFileCode, IconLoader2 } from '@tabler/icons-react';
import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import { useAuth } from '../auth/AuthContext';
import { learningContent, t } from '../data/learningContent';
import { useLanguage } from '../i18n/LanguageContext';
import './SessionDetail.css';
import LessonChat from '../components/LessonChat';

// نصوص الواجهة الثابتة لهذه الشاشة، ثلاثية اللغة
const UI = {
  back: { ar: 'رجوع للرحلة', fr: 'Retour au parcours', en: 'Back to path' },
  notReady: {
    ar: 'محتوى هذه المحطة قيد الإعداد.',
    fr: 'Le contenu de cette étape est en préparation.',
    en: "This station's content is being prepared.",
  },
  notReadySub: {
    ar: 'نبنيها قريباً بنفس عناية المحطات السابقة.',
    fr: 'Nous la construirons bientôt avec le même soin que les étapes précédentes.',
    en: "We'll build it soon with the same care as previous stations.",
  },
  copied: { ar: 'تم', fr: 'Copié', en: 'Copied' },
  copy: { ar: 'نسخ', fr: 'Copier', en: 'Copy' },
  copiedFull: { ar: 'تم النسخ', fr: 'Copié', en: 'Copied' },
  fullCode: { ar: 'الكود الكامل', fr: 'Code complet', en: 'Full code' },
  expected: { ar: 'النتيجة المتوقّعة', fr: 'Résultat attendu', en: 'Expected result' },
  done: { ar: 'أكملتُ هذه المحطة', fr: "J'ai terminé cette étape", en: "I've completed this station" },
  doneSaving: { ar: 'جارٍ الحفظ…', fr: 'Enregistrement…', en: 'Saving…' },
  alreadyDone: { ar: '✓ أكملت هذه المحطة — رجوع للرحلة', fr: '✓ Étape terminée — retour au parcours', en: '✓ Station completed — back to path' },
};

export default function SessionDetail() {
  const { id } = useParams();
  const { lang } = useLanguage();
  const session = learningContent[id];
  const [copiedIdx, setCopiedIdx] = useState(null);
  const [openCode, setOpenCode] = useState({});
  const { user } = useAuth();
  const navigate = useNavigate();
  const [isCompleted, setIsCompleted] = useState(false);
  const [saving, setSaving] = useState(false);

  // هل أكمل المستخدم هذه المحطة من قبل؟
  useEffect(() => {
    if (!user || !id) return;
    let cancelled = false;

    async function checkCompletion() {
      const { data } = await supabase
        .from('station_completions')
        .select('id')
        .eq('user_id', user.id)
        .eq('station_number', Number(id))
        .maybeSingle();

      if (!cancelled && data) setIsCompleted(true);
    }

    checkCompletion();
    return () => { cancelled = true; };
  }, [user, id]);

  // تسجيل إكمال المحطة ثم العودة للرحلة
  async function handleComplete() {
    if (!user || saving) return;
    setSaving(true);

    const { error } = await supabase.from('station_completions').insert({
      user_id: user.id,
      station_number: Number(id),
    });

    setSaving(false);
    if (!error) {
      setIsCompleted(true);
      navigate('/learn');
    }
  }

  if (!session) {
    return (
      <div className="session-detail">
        <Link to="/learn" className="back-link"><IconArrowRight size={18} /> {t(UI.back, lang)}</Link>
        <div className="not-ready">
          <p>{t(UI.notReady, lang)}</p>
          <p className="not-ready-sub">{t(UI.notReadySub, lang)}</p>
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
      <Link to="/learn" className="back-link"><IconArrowRight size={18} /> {t(UI.back, lang)}</Link>

      <div className="sd-header">
        <div className="sd-num">{id}</div>
        <div>
          <h1>{t(session.title, lang)}</h1>
        </div>
      </div>
      <p className="sd-intro">{t(session.intro, lang)}</p>

      {session.sections.map((sec, si) => (
        <div key={si} className="sd-section">
          <div className="sd-section-head">
            <h2>{t(sec.title, lang)}</h2>
            {sec.subtitle && <p>{t(sec.subtitle, lang)}</p>}
          </div>

          <div className="sd-steps">
            {sec.steps.map((step, sti) => {
              if (step.type === 'text') {
                return <p key={sti} className="sd-text">{t(step.text, lang)}</p>;
              }
              if (step.type === 'instruction') {
                return (
                  <div key={sti} className="sd-instruction">
                    <span className="sd-inst-icon">{step.icon}</span>
                    <span>{t(step.text, lang)}</span>
                  </div>
                );
              }
              if (step.type === 'code') {
                const idx = codeCounter++;
                const codeText = t(step.text, lang);
                return (
                  <div key={sti} className="sd-code">
                    <code>{codeText}</code>
                    <button onClick={() => copyCode(codeText, idx)}>
                      {copiedIdx === idx ? <IconCheck size={15} /> : <IconCopy size={15} />}
                      {copiedIdx === idx ? t(UI.copied, lang) : t(UI.copy, lang)}
                    </button>
                  </div>
                );
              }
              if (step.type === 'tip') {
                return (
                  <div key={sti} className="sd-alert sd-tip">
                    <IconBulb size={18} /> <span>{t(step.text, lang)}</span>
                  </div>
                );
              }
              if (step.type === 'warn') {
                return (
                  <div key={sti} className="sd-alert sd-warn">
                    <IconAlertTriangle size={18} /> <span>{t(step.text, lang)}</span>
                  </div>
                );
              }
              if (step.type === 'verify') {
                return (
                  <div key={sti} className="sd-verify">
                    <div className="sd-verify-head"><IconCircleCheck size={16} /> {t(UI.expected, lang)}</div>
                    <div className="sd-verify-out">{t(step.text, lang)}</div>
                    {step.note && <div className="sd-verify-note">{t(step.note, lang)}</div>}
                  </div>
                );
              }
              if (step.type === 'codeblock') {
                const idx = codeCounter++;
                const isOpen = openCode[idx];
                const codeText = t(step.text, lang);
                const label = step.label ? t(step.label, lang) : t(UI.fullCode, lang);
                return (
                  <div key={sti} className="sd-codeblock">
                    <button className="sd-codeblock-head" onClick={() => toggleCode(idx)}>
                      <IconFileCode size={16} />
                      <span className="sd-codeblock-label">{label}</span>
                      <IconChevronDown size={16} className={'sd-cb-chevron' + (isOpen ? ' open' : '')} />
                    </button>
                    {isOpen && (
                      <div className="sd-codeblock-body">
                        <button className="sd-cb-copy" onClick={() => copyCode(codeText, 'cb' + idx)}>
                          {copiedIdx === 'cb' + idx ? <IconCheck size={14} /> : <IconCopy size={14} />}
                          {copiedIdx === 'cb' + idx ? t(UI.copiedFull, lang) : t(UI.copy, lang)}
                        </button>
                        <pre><code>{codeText}</code></pre>
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

      {isCompleted ? (
        <Link to="/learn" className="sd-done completed">{t(UI.alreadyDone, lang)}</Link>
      ) : (
        <button className="sd-done" onClick={handleComplete} disabled={saving}>
          {saving ? <IconLoader2 size={16} className="spin" /> : <IconCircleCheck size={16} />}
          {saving ? t(UI.doneSaving, lang) : t(UI.done, lang)}
        </button>
      )}
      <LessonChat
        lessonTitle={t(session.title, lang)}
        lessonIntro={t(session.intro, lang)}
        lessonContent={session.sections.map((sec) =>
          t(sec.title, lang) + ': ' + sec.steps.map((st) => t(st.text, lang)).join(' | ')
        ).join('\n')}
      />
    </div>
  );
}