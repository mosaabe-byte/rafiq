import { useState, useEffect } from 'react';
import {
  IconChartBar, IconVocabulary, IconTrophy, IconHistory,
  IconFlame, IconArrowLeft,
} from '@tabler/icons-react';
import { Link } from 'react-router-dom';
import './Profile.css';

const STORAGE_KEY = 'rafiq_projects';

const skills = [
  { name: 'HTML / CSS', pct: 70, color: 'purple' },
  { name: 'JavaScript', pct: 45, color: 'purple' },
  { name: 'React', pct: 40, color: 'teal' },
  { name: 'إدارة البيانات', pct: 35, color: 'teal' },
  { name: 'النشر', pct: 15, color: 'amber' },
];

const badges = [
  { icon: '🚀', name: 'أول تشغيل', desc: 'شغّلت رفيق على جهازك', earned: true },
  { icon: '🧱', name: 'بنّاء', desc: 'بنيت هيكل التطبيق كاملاً', earned: true },
  { icon: '💾', name: 'حافظ', desc: 'فعّلت الحفظ الدائم', earned: true },
  { icon: '📚', name: 'مُعجمي', desc: 'بنيت المعجم التقني', earned: true },
  { icon: '☁️', name: 'سحابي', desc: 'اربط رفيق بالسحابة', earned: false },
  { icon: '🌐', name: 'ناشر', desc: 'انشر رفيق على الإنترنت', earned: false },
];

const activities = [
  { type: 'done', text: 'بنيت المعجم التقني بالبحث والنطق الصوتي', time: 'الجلسة 5' },
  { type: 'done', text: 'فعّلت الحفظ الدائم بالإضافة والتعديل والحذف', time: 'الجلسة 4' },
  { type: 'done', text: 'بنيت لوحة المشاريع بالفلترة والإحصاءات', time: 'الجلسة 3' },
  { type: 'done', text: 'أنشأت هيكل التطبيق بخمس صفحات وتنقل', time: 'الجلسة 2' },
  { type: 'done', text: 'جهّزت بيئة التطوير وتجاوزت عقبات حقيقية', time: 'الجلسة 1' },
];

export default function Profile() {
  const [projectCount, setProjectCount] = useState(0);

  useEffect(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) setProjectCount(JSON.parse(raw).length);
    } catch (e) {
      console.error('تعذّر قراءة المشاريع', e);
    }
  }, []);

  const earnedCount = badges.filter((b) => b.earned).length;
  const xp = 340;
  const xpMax = 500;
  const xpPct = Math.round((xp / xpMax) * 100);

  return (
    <div className="profile">
      <div className="profile-hero">
        <div className="big-avatar">ع</div>
        <div className="hero-info">
          <div className="hero-name">عبد الرحيم</div>
          <div className="hero-level">
            مستوى 3 — مطور ناشئ
            <span className="level-pill">في تقدّم</span>
          </div>
        </div>
      </div>

      <div className="xp-section">
        <div className="xp-header">
          <span>نقاط الخبرة</span>
          <span className="xp-val">{xp} / {xpMax} XP</span>
        </div>
        <div className="xp-track">
          <div className="xp-fill" style={{ width: xpPct + '%' }} />
        </div>
        <div className="xp-next">{xpMax - xp} نقطة للمستوى 4 — مطور محترف</div>
      </div>

      <div className="profile-stats">
        <div className="ps-box">
          <div className="ps-n">{projectCount}</div>
          <div className="ps-l">مشاريع في لوحتك</div>
        </div>
        <div className="ps-box">
          <div className="ps-n">18</div>
          <div className="ps-l">مصطلحاً في معجمك</div>
        </div>
        <div className="ps-box">
          <div className="ps-n">{earnedCount}/{badges.length}</div>
          <div className="ps-l">إنجازات</div>
        </div>
        <div className="ps-box">
          <div className="ps-n flame"><IconFlame size={18} /> 5</div>
          <div className="ps-l">جلسات متتالية</div>
        </div>
      </div>

      <div className="profile-section">
        <h2><IconChartBar size={16} /> مستوى مهاراتي</h2>
        <div className="skills-list">
          {skills.map((s) => (
            <div key={s.name} className="skill-row">
              <span className="skill-name">{s.name}</span>
              <div className="skill-track">
                <div className={'skill-fill sf-' + s.color} style={{ width: s.pct + '%' }} />
              </div>
              <span className="skill-pct">{s.pct}%</span>
            </div>
          ))}
        </div>
      </div>

      <div className="profile-section">
        <h2><IconTrophy size={16} /> الإنجازات</h2>
        <div className="badges-grid">
          {badges.map((b) => (
            <div key={b.name} className={'badge-card' + (b.earned ? ' earned' : ' locked')}>
              <div className="badge-icon">{b.icon}</div>
              <div className="badge-name">{b.name}</div>
              <div className="badge-desc">{b.desc}</div>
            </div>
          ))}
        </div>
      </div>

      <div className="profile-section">
        <h2><IconHistory size={16} /> رحلتك حتى الآن</h2>
        <div className="activity-list">
          {activities.map((a, i) => (
            <div key={i} className="activity-item">
              <div className={'act-dot act-' + a.type} />
              <div className="act-content">
                <div className="act-text">{a.text}</div>
                <div className="act-time">{a.time}</div>
              </div>
            </div>
          ))}
        </div>
      </div>

      <Link to="/" className="next-step-card">
        <div className="ns-icon"><IconArrowLeft size={16} /></div>
        <div className="ns-text">
          <div className="ns-title">خطوتك القادمة</div>
          <div className="ns-sub">أضف مشاريعك الحقيقية المتفرقة إلى لوحتك لتجمعها في مكان واحد</div>
        </div>
      </Link>
    </div>
  );
}
