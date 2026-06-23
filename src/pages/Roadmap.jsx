import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  IconRoute, IconCheck, IconLoader2, IconCircleDot,
IconLock, IconCloud, IconCloudOff, IconChevronDown,
} from '@tabler/icons-react';
import { supabase } from '../lib/supabase';
import { useLanguage } from '../i18n/LanguageContext';
import './Roadmap.css';

function phaseNumber(phaseText) {
  if (!phaseText) return 1;
  const m = String(phaseText).match(/\d+/);
  return m ? parseInt(m[0], 10) : 1;
}

export default function Roadmap() {
  const { t } = useLanguage();
  const navigate = useNavigate();
  const [projects, setProjects] = useState([]);
  const [selectedId, setSelectedId] = useState(null);
  const [loading, setLoading] = useState(true);
  const [cloudOk, setCloudOk] = useState(true);
  const [openGuide, setOpenGuide] = useState(null);
  const [celebration, setCelebration] = useState(null); // {type: 'phase'|'project', text}
  const [advancing, setAdvancing] = useState(false);

  async function completePhase() {
    if (!selected || advancing) return;
    setAdvancing(true);

    const current = phaseNumber(selected.phase);
    const isLastPhase = current >= phases.length;
    const nextPhase = isLastPhase ? current : current + 1;

    // عنوان المرحلة الجديدة (مثل: "المرحلة 4: البناء")
    const nextTitle = phases.find((p) => p.n === nextPhase)?.title || '';
    const newPhaseText = `${t('roadmap.phaseLabel')} ${nextPhase}: ${nextTitle}`;
    const newProgress = Math.round((nextPhase / phases.length) * 100);

    const { error } = await supabase
      .from('projects')
      .update({ phase: newPhaseText, progress: newProgress })
      .eq('id', selected.id);

    if (!error) {
      // تحديث محلي فوري
      setProjects((prev) =>
        prev.map((p) =>
          p.id === selected.id ? { ...p, phase: newPhaseText, progress: newProgress } : p
        )
      );

      const justCompleted = phases.find((p) => p.n === current)?.title || '';

      if (isLastPhase) {
        setCelebration({ type: 'project', text: selected.name });
      } else {
        setCelebration({ type: 'phase', text: justCompleted });
        setTimeout(() => setCelebration(null), 4000);
      }
    }

    setAdvancing(false);
  }

  const phases = [
    { n: 1, title: t('roadmap.phase1title'), desc: t('roadmap.phase1desc') },
    { n: 2, title: t('roadmap.phase2title'), desc: t('roadmap.phase2desc') },
    { n: 3, title: t('roadmap.phase3title'), desc: t('roadmap.phase3desc') },
    { n: 4, title: t('roadmap.phase4title'), desc: t('roadmap.phase4desc') },
    { n: 5, title: t('roadmap.phase5title'), desc: t('roadmap.phase5desc') },
    { n: 6, title: t('roadmap.phase6title'), desc: t('roadmap.phase6desc') },
    { n: 7, title: t('roadmap.phase7title'), desc: t('roadmap.phase7desc') },
  ];

  useEffect(() => {
    async function fetchProjects() {
      setLoading(true);
      const { data, error } = await supabase
        .from('projects')
        .select('*')
        .order('created_at', { ascending: true });
      if (error) {
        console.error('تعذّر الاتصال بالسحابة:', error.message);
        setCloudOk(false);
      } else {
        setProjects(data || []);
        setCloudOk(true);
        if (data && data.length > 0) setSelectedId(data[0].id);
      }
      setLoading(false);
    }
    fetchProjects();
  }, []);

  const selected = projects.find((p) => p.id === selectedId) || null;
  const currentPhase = selected ? phaseNumber(selected.phase) : 0;

  return (
    <div className="roadmap">
      {/* شريط تهنئة المرحلة */}
      {celebration?.type === 'phase' && (
        <div className="phase-celebration">
          🎉 أكملت مرحلة «{celebration.text}» — خطوة أقرب لتطبيقك!
        </div>
      )}

      {/* بطاقة احتفال إكمال المشروع */}
      {celebration?.type === 'project' && (
        <div className="project-celebration-overlay" onClick={() => setCelebration(null)}>
          <div className="project-celebration-card" onClick={(e) => e.stopPropagation()}>
            <div className="celebration-emoji">🚀</div>
            <h2>مبروك! أنهيت رحلتك</h2>
            <p>
              أكملت كل مراحل «{celebration.text}» من الفكرة إلى النشر.
              <br />
              هذا أول تطبيق لك — والأول دائماً الأصعب والأجمل.
            </p>
            <button className="celebration-close" onClick={() => setCelebration(null)}>
              متابعة رحلتي ✨
            </button>
          </div>
        </div>
      )}

      <div className="rm-header">
        <div className="rm-title">
          <IconRoute size={20} className="rm-icon" />
          <span>{t('roadmap.title')}</span>
        </div>
        <p>{t('roadmap.subtitle')}</p>
      </div>

      {loading ? (
        <div className="rm-loading">
          <IconLoader2 size={22} className="spin" /> {t('roadmap.loading')}
        </div>
      ) : !cloudOk ? (
        <div className="rm-empty">
          <IconCloudOff size={28} />
          <p>{t('roadmap.cloudOff')}</p>
        </div>
      ) : projects.length === 0 ? (
        <div className="rm-empty">
          <IconRoute size={28} />
          <p>{t('roadmap.empty')}</p>
        </div>
      ) : (
        <>
          <div className="project-picker">
            {projects.map((p) => (
              <button
                key={p.id}
                className={'picker-chip' + (p.id === selectedId ? ' active' : '')}
                onClick={() => setSelectedId(p.id)}
              >
                <span className="chip-emoji">{p.emoji || '📁'}</span>
                {p.name}
              </button>
            ))}
          </div>

          <div className="cloud-bar">
            <IconCloud size={14} /> {t('roadmap.cloud')}
          </div>

          <div className="timeline">
            {phases.map((ph) => {
              const isDone = ph.n < currentPhase;
              const isCurrent = ph.n === currentPhase;
              const isLocked = ph.n > currentPhase;
              const state = isDone ? 'done' : isCurrent ? 'current' : 'locked';
              return (
                <div key={ph.n} className={'phase-row ' + state}>
                  <div className="phase-line-col">
                    <div className={'phase-dot ' + state}>
                      {isDone ? <IconCheck size={16} />
                        : isCurrent ? <IconCircleDot size={16} />
                        : <IconLock size={13} />}
                    </div>
                    {ph.n < phases.length && <div className={'phase-line ' + (isDone ? 'done' : '')} />}
                  </div>
<div className="phase-content">
                    <button
                      className="phase-head phase-toggle"
                      onClick={() => setOpenGuide(openGuide === ph.n ? null : ph.n)}
                    >
                      <span className="phase-num">{t('roadmap.phaseLabel')} {ph.n}</span>
                      <span className="phase-title">{ph.title}</span>
                      {isCurrent && <span className="phase-badge">{t('roadmap.youAreHere')}</span>}
                      <IconChevronDown
                        size={16}
                        className={'phase-chevron' + (openGuide === ph.n ? ' open' : '')}
                      />
                    </button>
                    <p className="phase-desc">{ph.desc}</p>
                    {openGuide === ph.n && (

                      <div className="phase-guide">
                        <ol className="guide-steps">
                          {(t('roadmap.guides')[ph.n]?.steps || []).map((step, i) => (
                            <li key={i}>{step}</li>
                          ))}
                        </ol>
                        {selected && (
                          <button
                            className="ask-rafiq-btn"
                            onClick={() =>
                              navigate(
                                `/chat?project=${selected.id}&phase=${encodeURIComponent(ph.title)}`
                              )
                            }
                          >
                            🤖 {t('roadmap.askRafiq')}
                          </button>
                        )}
                        {isCurrent && (
                          <button
                            className="complete-phase-btn"
                            onClick={completePhase}
                            disabled={advancing}
                          >
                            {advancing ? <IconLoader2 size={15} className="spin" /> : <IconCheck size={15} />}
                            {ph.n >= phases.length ? 'أنهيتُ المشروع! 🚀' : 'أكملتُ هذه المرحلة'}
                          </button>
                        )}
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>

          {selected && (
            <div className="progress-summary">
              <div className="ps-text">
                <strong>{selected.name}</strong> {t('roadmap.summaryIn')} {currentPhase} {t('roadmap.summaryOf')} {phases.length}
              </div>
              <div className="ps-bar">
                <div className="ps-fill" style={{ width: `${(currentPhase / phases.length) * 100}%` }} />
              </div>
              <div className="ps-percent">{Math.round((currentPhase / phases.length) * 100)}% {t('roadmap.summaryPercent')}</div>
            </div>
          )}
        </>
      )}
    </div>
  );
}