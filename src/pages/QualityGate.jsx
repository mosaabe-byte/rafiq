import { useState, useEffect } from 'react';
import { IconShieldCheck, IconArrowLeft, IconRefresh, IconBulb, IconInfoCircle } from '@tabler/icons-react';
import { Link } from 'react-router-dom';
import { supabase } from '../lib/supabase';
import { useAuth } from '../auth/AuthContext';
import { useLanguage } from '../i18n/LanguageContext';
import {
  tf, gateIntro, gateUI, categories, computeResult, buildNotes, fillNote,
} from '../data/qualityGate';
import './QualityGate.css';

function fmtQDate(iso, lang) {
  try {
    const locales = { ar: "ar", fr: "fr-FR", en: "en-US" };
    return new Date(iso).toLocaleDateString(locales[lang] || "ar", {
      day: "numeric", month: "short", year: "numeric",
    });
  } catch (e) {
    return "";
  }
}

export default function QualityGate() {
  const { lang } = useLanguage();
  const { user } = useAuth();
  const [answers, setAnswers] = useState({});
  const [result, setResult] = useState(null);
  const [lastResult, setLastResult] = useState(null);
  const [history, setHistory] = useState([]);
  const [notes, setNotes] = useState([]);

  // بيانات رفيق الفعلية (للتحقّق من بعض الإجابات)
  const [userData, setUserData] = useState({ projectCount: 0, maxPhase: 0, conversationCount: 0 });

  useEffect(() => {
    if (!user) return;
    let cancelled = false;

    async function loadData() {
      const projectsRes = await supabase
        .from('projects')
        .select('phase_number')
        .eq('user_id', user.id);

      const convRes = await supabase
        .from('conversations')
        .select('id', { count: 'exact', head: true })
        .eq('user_id', user.id);

      if (cancelled) return;

      const rows = projectsRes.data || [];
      let maxPhase = 0;
      rows.forEach((p) => {
        const n = p.phase_number;
        if (n > maxPhase) maxPhase = n;
      });

      setUserData({
        projectCount: rows.length,
        maxPhase,
        conversationCount: convRes.count ?? 0,
      });

      // جلب تاريخ نتائج بوّابة الجودة (الأحدث أولاً، حتى 10 نتائج)
      const histRes = await supabase
        .from('quality_results')
        .select('percent, created_at')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false })
        .limit(10);

      if (!cancelled && histRes.data && histRes.data.length > 0) {
        const rows = histRes.data;
        setLastResult(rows[0]);
        // نعكس الترتيب ليكون الأقدم أولاً (للرسم من اليسار لليمين زمنياً)
        setHistory([...rows].reverse());
      }
    }

    loadData();
    return () => { cancelled = true; };
  }, [user]);

  function setAnswer(qid, value) {
    setAnswers((prev) => ({ ...prev, [qid]: value }));
    if (result) { setResult(null); setNotes([]); }
  }

  async function handleCompute() {
    const computed = computeResult(answers);
    setResult(computed);
    setNotes(buildNotes(answers, userData));
    window.scrollTo({ top: 0, behavior: "smooth" });

    // حفظ النتيجة (فقط إن أجاب المستخدم عن كل الأسئلة، لتكون ذات معنى)
    if (user && computed.complete) {
      const { error } = await supabase.from("quality_results").insert({
        user_id: user.id,
        percent: computed.percent,
        answered: computed.answered,
        total_questions: computed.totalQuestions,
      });
      if (!error) {
        setLastResult({
          percent: computed.percent,
          answered: computed.answered,
          total_questions: computed.totalQuestions,
          created_at: new Date().toISOString(),
        });
        setHistory((prev) => [
          ...prev,
          { percent: computed.percent, created_at: new Date().toISOString() },
        ]);
      }
    }
  }

  function handleReset() {
    setAnswers({});
    setResult(null);
    setNotes([]);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  const answeredCount = Object.keys(answers).length;

  function resultTone(pct) {
    if (pct >= 80) return 'high';
    if (pct >= 50) return 'mid';
    return 'low';
  }

  const options = [
    { value: 'yes', label: gateUI.yes },
    { value: 'no', label: gateUI.no },
    { value: 'na', label: gateUI.na },
  ];

  return (
    <div className="quality-gate">
      <div className="qg-header">
        <div className="qg-header-icon"><IconShieldCheck size={26} /></div>
        <h1>{tf(gateIntro.title, lang)}</h1>
        <p className="qg-subtitle">{tf(gateIntro.subtitle, lang)}</p>
      </div>

      {/* النتيجة (تظهر بعد الحساب) */}
      {result && (
        <div className={'qg-result ' + resultTone(result.percent)}>
          <div className="qg-result-title">{tf(gateUI.resultTitle, lang)}</div>
          <div className="qg-result-percent">{result.percent}%</div>
          <div className="qg-result-meta">
            {tf(gateUI.answered, lang)} {result.answered} {tf(gateUI.ofQuestions, lang)} {result.totalQuestions}
          </div>

          {!result.complete && (
            <div className="qg-result-hint">{tf(gateUI.incompleteHint, lang)}</div>
          )}

          {result.toImprove.length === 0 && result.complete ? (
            <div className="qg-allgood">{tf(gateUI.allGood, lang)}</div>
          ) : result.toImprove.length > 0 ? (
            <div className="qg-improve">
              <div className="qg-improve-title">{tf(gateUI.toImprove, lang)}</div>
              <ul className="qg-improve-list">
                {result.toImprove.map((q) => (
                  <li key={q.id}>{tf(q.text, lang)}</li>
                ))}
              </ul>
              <div className="qg-encourage">{tf(gateUI.encourage, lang)}</div>
            </div>
          ) : null}
        </div>
      )}

      {/* ملاحظات رفيق (تحقّق من البيانات الفعلية) */}
      {result && notes.length > 0 && (
        <div className="qg-notes">
          <div className="qg-notes-title">
            <IconInfoCircle size={17} /> {tf(gateUI.notesTitle, lang)}
          </div>
          <div className="qg-notes-intro">{tf(gateUI.notesIntro, lang)}</div>
          <ul className="qg-notes-list">
            {notes.map((n) => (
              <li key={n.key}>{fillNote(n.text, lang, n.value)}</li>
            ))}
          </ul>
        </div>
      )}

      {/* النتيجة السابقة أو رسم التحسّن (يظهر قبل الحساب فقط) */}
      {!result && history.length === 1 && (
        <div className="qg-last-result">
          <span className="qg-last-label">{tf(gateUI.lastResultLabel, lang)}</span>
          <span className="qg-last-value">{history[0].percent}%</span>
          <span className="qg-last-date">{fmtQDate(history[0].created_at, lang)}</span>
        </div>
      )}

      {!result && history.length > 1 && (
        <div className="qg-history">
          <div className="qg-history-head">
            <span className="qg-history-title">{tf(gateUI.historyTitle, lang)}</span>
            {(() => {
              const first = history[0].percent;
              const last = history[history.length - 1].percent;
              const diff = last - first;
              if (diff > 0) {
                return <span className="qg-trend up">+{diff}% {tf(gateUI.trendUp, lang)}</span>;
              }
              if (diff < 0) {
                return <span className="qg-trend down">{diff}% {tf(gateUI.trendDown, lang)}</span>;
              }
              return <span className="qg-trend flat">{tf(gateUI.trendFlat, lang)}</span>;
            })()}
          </div>

          <div className="qg-chart">
            {history.map((h, i) => (
              <div key={i} className="qg-bar-col">
                <div className="qg-bar-val">{h.percent}%</div>
                <div className="qg-bar-track">
                  <div
                    className={'qg-bar-fill ' + resultTone(h.percent)}
                    style={{ height: Math.max(h.percent, 4) + '%' }}
                  />
                </div>
                <div className="qg-bar-date">{fmtQDate(h.created_at, lang)}</div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* المقدّمة (تظهر قبل الحساب فقط) */}
      {!result && (
        <div className="qg-intro">{tf(gateIntro.intro, lang)}</div>
      )}

      {/* الأسئلة بالفئات */}
      {categories.map((cat) => (
        <div key={cat.key} className="qg-category">
          <h2 className="qg-cat-title">
            <span className="qg-cat-icon">{cat.icon}</span>
            {tf(cat.title, lang)}
          </h2>
          <div className="qg-questions">
            {cat.questions.map((q) => (
              <div key={q.id} className="qg-question">
                <div className="qg-q-text">{tf(q.text, lang)}</div>
                <div className="qg-q-hint">
                  <IconBulb size={13} /> {tf(q.hint, lang)}
                </div>
                <div className="qg-options">
                  {options.map((opt) => (
                    <button
                      key={opt.value}
                      className={
                        'qg-opt' +
                        (answers[q.id] === opt.value ? ' selected ' + opt.value : '')
                      }
                      onClick={() => setAnswer(q.id, opt.value)}
                    >
                      {tf(opt.label, lang)}
                    </button>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      ))}

      {/* أزرار الفعل */}
      <div className="qg-actions">
        <button className="qg-compute" onClick={handleCompute} disabled={answeredCount === 0}>
          {result ? tf(gateUI.recompute, lang) : tf(gateUI.compute, lang)}
        </button>
        {answeredCount > 0 && (
          <button className="qg-reset" onClick={handleReset}>
            <IconRefresh size={15} /> {tf(gateUI.reset, lang)}
          </button>
        )}
      </div>

      <Link to="/roadmap" className="qg-back">
        <IconArrowLeft size={16} /> {lang === 'ar' ? 'العودة لخارطة الطريق' : lang === 'fr' ? 'Retour à la feuille de route' : 'Back to roadmap'}
      </Link>
    </div>
  );
}