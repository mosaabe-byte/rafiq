import { useState, useEffect } from 'react';
import {
  IconRoute, IconCheck, IconLoader2, IconCircleDot,
  IconLock, IconCloud, IconCloudOff,
} from '@tabler/icons-react';
import { supabase } from '../lib/supabase';
import './Roadmap.css';

// المراحل السبع التي يمر بها كل مشروع — قلب خارطة الطريق
const phases = [
  { n: 1, key: 'التخطيط', title: 'التخطيط', desc: 'حدّد الفكرة، الجمهور، والهدف. ارسم ملامح المشروع قبل أي كود.' },
  { n: 2, key: 'التصميم', title: 'التصميم', desc: 'صمّم الشاشات وتجربة المستخدم. كيف يبدو المشروع وكيف يُستعمل.' },
  { n: 3, key: 'الإعداد', title: 'الإعداد', desc: 'جهّز بيئة العمل والأدوات: المحرر، اللغة، المكتبات الأساسية.' },
  { n: 4, key: 'البناء', title: 'البناء', desc: 'اكتب الكود وابنِ الشاشات والمزايا الأساسية، واحدة تلو الأخرى.' },
  { n: 5, key: 'الربط', title: 'الربط', desc: 'اربط الأجزاء معاً: التنقل، الحالة، والمنطق الداخلي.' },
  { n: 6, key: 'البيانات', title: 'البيانات', desc: 'احفظ بيانات المستخدم محلياً أو في قاعدة بيانات.' },
  { n: 7, key: 'السحابة', title: 'السحابة والنشر', desc: 'اربط بقاعدة سحابية وانشر المشروع على الإنترنت للعالم.' },
];

// يستخرج رقم المرحلة من نص مثل "المرحلة 7: السحابة"
function phaseNumber(phaseText) {
  if (!phaseText) return 1;
  const m = String(phaseText).match(/\d+/);
  return m ? parseInt(m[0], 10) : 1;
}

export default function Roadmap() {
  const [projects, setProjects] = useState([]);
  const [selectedId, setSelectedId] = useState(null);
  const [loading, setLoading] = useState(true);
  const [cloudOk, setCloudOk] = useState(true);

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
      <div className="rm-header">
        <div className="rm-title">
          <IconRoute size={20} className="rm-icon" />
          <span>خارطة الطريق</span>
        </div>
        <p>رحلة مشروعك عبر سبع مراحل — من الفكرة إلى النشر</p>
      </div>

      {loading ? (
        <div className="rm-loading">
          <IconLoader2 size={22} className="spin" /> جارٍ تحميل مشاريعك...
        </div>
      ) : !cloudOk ? (
        <div className="rm-empty">
          <IconCloudOff size={28} />
          <p>تعذّر الاتصال بالسحابة. تحقق من اتصالك وحاول مجدداً.</p>
        </div>
      ) : projects.length === 0 ? (
        <div className="rm-empty">
          <IconRoute size={28} />
          <p>لا توجد مشاريع بعد. أضف مشروعاً من شاشة "جديد" لترى خارطته هنا.</p>
        </div>
      ) : (
        <>
          {/* اختيار المشروع */}
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

          {/* شريط الحالة السحابية */}
          <div className="cloud-bar">
            <IconCloud size={14} /> متصل بالسحابة — خارطة محدّثة من أي جهاز
          </div>

          {/* الخط الزمني للمراحل */}
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
                    <div className="phase-head">
                      <span className="phase-num">المرحلة {ph.n}</span>
                      <span className="phase-title">{ph.title}</span>
                      {isCurrent && <span className="phase-badge">أنت هنا</span>}
                    </div>
                    <p className="phase-desc">{ph.desc}</p>
                  </div>
                </div>
              );
            })}
          </div>

          {/* ملخص التقدّم */}
          {selected && (
            <div className="progress-summary">
              <div className="ps-text">
                <strong>{selected.name}</strong> في المرحلة {currentPhase} من {phases.length}
              </div>
              <div className="ps-bar">
                <div className="ps-fill" style={{ width: `${(currentPhase / phases.length) * 100}%` }} />
              </div>
              <div className="ps-percent">{Math.round((currentPhase / phases.length) * 100)}% من الرحلة</div>
            </div>
          )}
        </>
      )}
    </div>
  );
}
