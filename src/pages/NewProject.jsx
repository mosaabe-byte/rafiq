import { useState, useRef, useEffect } from 'react';
import {
  IconSparkles, IconArrowLeft, IconCheck, IconLoader2,
  IconMessageCircle, IconClipboardText, IconWand,
} from '@tabler/icons-react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../lib/supabase';
import { useLanguage } from '../i18n/LanguageContext';
import './NewProject.css';

// خيارات التقنيات — ترشد المبتدئ الذي قد لا يعرف تقنيته
const TECH_OPTIONS = [
  'HTML و CSS و JavaScript',
  'React (مع Vite)',
  'React (مع Create React App)',
  'Next.js',
  'Vue.js',
  'React Native (موبايل)',
  'Flutter (موبايل)',
  'Python (Django أو Flask)',
  'لست متأكّداً بعد',
];

// خطوات المحادثة الموجّهة
const steps = [
  { key: 'name', bot: 'أهلاً بك! أنا رفيق. لنحوّل فكرتك إلى مشروع واضح. ما اسم الفكرة أو المشروع الذي يدور في ذهنك؟', type: 'text', placeholder: 'مثال: تطبيق لتنظيم وصفات الطبخ' },
  { key: 'audience', bot: 'فكرة جميلة! ولمن هذا المشروع؟ من سيستخدمه؟', type: 'text', placeholder: 'مثال: ربات البيوت، الطلاب، أصحاب المتاجر...' },
  { key: 'platform', bot: 'واضح. على أي منصة تتخيله؟', type: 'choice', options: ['ويب', 'موبايل', 'ويب + موبايل'] },
  { key: 'tech_stack', bot: 'وبأي تقنية تبنيه؟ إن لم تكن متأكّداً بعد، اختر «لست متأكّداً» وسأساعدك على القرار لاحقاً.', type: 'choice', options: TECH_OPTIONS },
  { key: 'level', bot: 'وأخيراً، كيف تقيّم مستواك في البرمجة حالياً؟ هذا يساعدني أرافقك بالشكل المناسب.', type: 'choice', options: ['مبتدئ', 'متوسط', 'متقدم'] },
];

const platformEmoji = { 'ويب': '🌐', 'موبايل': '📱', 'ويب + موبايل': '💻' };

// تحليل نص حر لاستخراج اسم/منصة/مستوى — يفيد عند لصق فكرة أو خلاصة محادثة
function analyzeIdea(text) {
  const hasWeb = /(ويب|موقع|web|site)/i.test(text);
  const hasMobile = /(موبايل|جوال|هاتف|mobile|app|android|ios|ايفون|اندرويد)/i.test(text);
  let platform = 'ويب';
  if (hasWeb && hasMobile) platform = 'ويب + موبايل';
  else if (hasMobile) platform = 'موبايل';

  let level = 'مبتدئ';
  if (/(متقدم|محترف|خبير|expert|advanced)/i.test(text)) level = 'متقدم';
  else if (/(متوسط|intermediate)/i.test(text)) level = 'متوسط';

  let name = (text.trim().split(/[.\n،]/)[0] || '').trim();
  if (name.length > 60) name = name.slice(0, 57) + '...';
  if (!name) name = 'مشروع جديد';
  return { name, platform, level };
}

export default function NewProject() {
  const navigate = useNavigate();
  const [mode, setMode] = useState('chat'); // 'chat' أو 'paste'

  // حالة المحادثة
  const [messages, setMessages] = useState([{ from: 'bot', text: steps[0].bot }]);
  const [stepIndex, setStepIndex] = useState(0);
  const [answers, setAnswers] = useState({});
  const [input, setInput] = useState('');
  const { t } = useLanguage();

  // حالة اللصق
  const [pasteText, setPasteText] = useState('');
  const [draft, setDraft] = useState(null); // المشروع المستخرج للمراجعة

  const [saving, setSaving] = useState(false);
  const [done, setDone] = useState(false);
  const [savedName, setSavedName] = useState('');
  const endRef = useRef(null);

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, saving, done]);

  const current = steps[stepIndex];
  const allAnswered = stepIndex >= steps.length;

  function submitAnswer(value) {
    if (!value || (typeof value === 'string' && !value.trim())) return;
    const newAnswers = { ...answers, [current.key]: value };
    const newMessages = [...messages, { from: 'user', text: value }];
    setAnswers(newAnswers);
    setInput('');
    if (stepIndex < steps.length - 1) {
      newMessages.push({ from: 'bot', text: steps[stepIndex + 1].bot });
    } else {
      newMessages.push({ from: 'bot', text: 'ممتاز! جهّزت لك المشروع. اضغط "أضف إلى مشاريعي" لحفظه في لوحتك.' });
    }
    setMessages(newMessages);
    setStepIndex(stepIndex + 1);
  }

  function buildFromChat() {
    return {
      name: answers.name,
      emoji: platformEmoji[answers.platform] || '📁',
      status: 'active',
      level: answers.level,
      platform: answers.platform,
      tech_stack: answers.tech_stack || null,
      audience: answers.audience || null,
      progress: 0,
      phase_number: 1,
    };
  }

  function analyzePaste() {
    if (!pasteText.trim()) return;
    const r = analyzeIdea(pasteText);
    setDraft({
      name: r.name,
      emoji: platformEmoji[r.platform] || '📁',
      status: 'active',
      level: r.level,
      platform: r.platform,
      tech_stack: 'لست متأكّداً بعد',
      audience: null,
      progress: 0,
      phase_number: 1,
    });
  }

  async function saveProject(project) {
    setSaving(true);

    // جلب المستخدم الحالي لربط المشروع به
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      setSaving(false);
      if (mode === 'chat') {
        setMessages((prev) => [...prev, { from: 'bot', text: 'يجب تسجيل الدخول أولاً لحفظ المشروع.' }]);
      }
      return;
    }

    const { data: created, error } = await supabase
      .from('projects')
      .insert([{ ...project, user_id: user.id }])
      .select()
      .single();
    if (error) {
      setSaving(false);
      console.error('تعذّر حفظ المشروع:', error.message);
      if (mode === 'chat') {
        setMessages((prev) => [...prev, { from: 'bot', text: 'حدث خطأ أثناء الحفظ. تأكد من اتصالك وحاول مرة أخرى.' }]);
      }
      return;
    }

    // الإحداث يُنجز البندين 1 و2 من التخطيط (الفكرة والمستخدمون) — نسجّلهما تلقائياً
    if (created) {
      const bands = [
        { user_id: user.id, project_id: created.id, phase_number: 1, band_number: 1 },
        { user_id: user.id, project_id: created.id, phase_number: 1, band_number: 2 },
      ];
      await supabase.from('band_completions').insert(bands);

      // تحديث التقدّم ليعكس البندين المُنجَزين (2 من 28)
      const initialProgress = Math.round((2 / 28) * 100);
      await supabase.from('projects').update({ progress: initialProgress }).eq('id', created.id);
    }

    setSaving(false);
    setSavedName(project.name);
    setDone(true);
  }

  function switchMode(m) {
    if (m === mode) return;
    setMode(m);
    setDone(false);
    setDraft(null);
  }

  // شاشة النجاح المشتركة
  if (done) {
    return (
      <div className="newproject">
        <div className="chat-area" style={{ justifyContent: 'center' }}>
          <div className="success-card">
            <div className="success-icon"><IconCheck size={26} /></div>
            <div className="success-title">{t('new.successTitle').replace('{name}', savedName)}</div>
            <button className="go-dashboard" onClick={() => navigate('/')}>
              <IconArrowLeft size={16} /> {t('new.goDashboard')}
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="newproject">
      <div className="np-header">
        <div className="np-title">
          <IconSparkles size={18} className="np-spark" />
          <span>{t('new.title')}</span>
        </div>
        <div className="mode-tabs">
          <button className={'mode-tab' + (mode === 'chat' ? ' active' : '')} onClick={() => switchMode('chat')}>
            <IconMessageCircle size={15} /> {t('new.tabChat')}
          </button>
          <button className={'mode-tab' + (mode === 'paste' ? ' active' : '')} onClick={() => switchMode('paste')}>
            <IconClipboardText size={15} /> {t('new.tabPaste')}
          </button>
        </div>
      </div>

      {mode === 'chat' ? (
        <>
          <div className="chat-area">
            {messages.map((m, i) => (
              <div key={i} className={'bubble-row ' + m.from}>
                {m.from === 'bot' && <div className="bot-avatar">ر</div>}
                <div className={'bubble ' + m.from}>{m.text}</div>
              </div>
            ))}
            <div ref={endRef} />
          </div>

          {!allAnswered && current && (
            <div className="input-zone">
              {current.type === 'text' ? (
                <div className="text-input-row">
                  <input
                    type="text" value={input}
                    onChange={(e) => setInput(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && submitAnswer(input)}
                    placeholder={current.placeholder} autoFocus
                  />
                  <button className="send-btn" onClick={() => submitAnswer(input)} disabled={!input.trim()}>{t('new.send')}</button>
                </div>
              ) : (
                <div className="choices-row">
                  {current.options.map((opt) => (
                    <button key={opt} className="choice-chip" onClick={() => submitAnswer(opt)}>{opt}</button>
                  ))}
                </div>
              )}
            </div>
          )}

          {allAnswered && (
            <div className="input-zone">
              <button className="save-project-btn" onClick={() => saveProject(buildFromChat())} disabled={saving}>
                {saving ? (<><IconLoader2 size={18} className="spin" /> {t('new.saving')}</>) : (<><IconCheck size={18} /> {t('new.addToProjects')}</>)}
              </button>
            </div>
          )}
        </>
      ) : (
        <>
          <div className="chat-area">
            <div className="paste-intro">
             {t('new.pasteIntro')}
            </div>
            <textarea
              className="paste-box"
              value={pasteText}
              onChange={(e) => setPasteText(e.target.value)}
              placeholder={t('new.pastePlaceholder')}
            />
            <button className="analyze-btn" onClick={analyzePaste} disabled={!pasteText.trim()}>
              <IconWand size={17} /> {t('new.analyze')}
            </button>

            {draft && (
              <div className="draft-card">
                <div className="draft-title">{t('new.draftTitle')}</div>
                <label className="draft-field">
                  <span>{t('new.fieldName')}</span>
                  <input type="text" value={draft.name} onChange={(e) => setDraft({ ...draft, name: e.target.value })} />
                </label>
                <label className="draft-field">
                  <span>{t('new.fieldPlatform')}</span>
                  <select value={draft.platform} onChange={(e) => setDraft({ ...draft, platform: e.target.value, emoji: platformEmoji[e.target.value] })}>
                    <option value="ويب">ويب</option>
                    <option value="موبايل">موبايل</option>
                    <option value="ويب + موبايل">ويب + موبايل</option>
                  </select>
                </label>

                <label className="draft-field">
                  <span>{t('new.fieldTech')}</span>
                  <select value={draft.tech_stack} onChange={(e) => setDraft({ ...draft, tech_stack: e.target.value })}>
                    {TECH_OPTIONS.map((opt) => (
                      <option key={opt} value={opt}>{opt}</option>
                    ))}
                  </select>
                </label>
                
                <label className="draft-field">
                  <span>{t('new.fieldLevel')}</span>
                  <select value={draft.level} onChange={(e) => setDraft({ ...draft, level: e.target.value })}>
                    <option value="مبتدئ">مبتدئ</option>
                    <option value="متوسط">متوسط</option>
                    <option value="متقدم">متقدم</option>
                  </select>
                </label>
                <button className="save-project-btn" onClick={() => saveProject(draft)} disabled={saving}>
                  {saving ? (<><IconLoader2 size={18} className="spin" /> جارٍ الحفظ...</>) : (<><IconCheck size={18} /> أضف إلى مشاريعي</>)}
                </button>
              </div>
            )}
            <div ref={endRef} />
          </div>
        </>
      )}
    </div>
  );
}

