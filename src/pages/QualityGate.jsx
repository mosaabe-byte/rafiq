import { useState } from 'react';
import { IconShieldCheck, IconArrowLeft, IconRefresh, IconBulb } from '@tabler/icons-react';
import { Link } from 'react-router-dom';
import { useLanguage } from '../i18n/LanguageContext';
import {
  tf, gateIntro, gateUI, categories, computeResult,
} from '../data/qualityGate';
import './QualityGate.css';

export default function QualityGate() {
  const { lang } = useLanguage();
  const [answers, setAnswers] = useState({});
  const [result, setResult] = useState(null);

  function setAnswer(qid, value) {
    setAnswers((prev) => ({ ...prev, [qid]: value }));
    // إخفاء النتيجة القديمة عند تغيير أي إجابة
    if (result) setResult(null);
  }

  function handleCompute() {
    setResult(computeResult(answers));
    // التمرير لأعلى لرؤية النتيجة
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  function handleReset() {
    setAnswers({});
    setResult(null);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  const totalQuestions = categories.reduce((s, c) => s + c.questions.length, 0);
  const answeredCount = Object.keys(answers).length;

  // لون النتيجة حسب النسبة (صادق: أخضر عالٍ، برتقالي متوسّط، أحمر منخفض)
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