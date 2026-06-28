import { useState, useEffect } from 'react';
import {
  IconChartBar, IconArrowLeft, IconLogout, IconLoader2, IconTrophy,
  IconRoute2, IconHistory, IconFolderPlus, IconVocabulary, IconMessage,
} from '@tabler/icons-react';
import { Link } from 'react-router-dom';
import { supabase } from '../lib/supabase';
import { useAuth } from '../auth/AuthContext';
import { useLanguage } from '../i18n/LanguageContext';
import './Profile.css';

const LOCALES = { ar: 'ar', fr: 'fr-FR', en: 'en-US' };
const PHASE_NUMBERS = [1, 2, 3, 4, 5, 6, 7];

function extractPhaseNumber(phaseText) {
  if (!phaseText) return null;
  const m = String(phaseText).match(/(\d+)/);
  if (!m) return null;
  const n = parseInt(m[1], 10);
  return n >= 1 && n <= 7 ? n : null;
}

function computeBadges(data) {
  return [
    { key: 'firstProject', icon: '🚀', earned: data.projectCount >= 1 },
    { key: 'glossaryBuilder', icon: '📚', earned: data.termCount >= 5 },
    { key: 'firstChat', icon: '💬', earned: data.conversationCount >= 1 },
    { key: 'achiever', icon: '🎯', earned: data.hasCompletedProject },
    { key: 'publisher', icon: '🌐', earned: data.hasPublishedProject },
    { key: 'inspector', icon: '🔍', earned: data.reportCount >= 1 },
  ];
}

// منطق الخطوة الذكية: يُرجع مفتاح الاقتراح حسب حالة المستخدم (الأهمّ أولاً)
function computeNextStep(data) {
  if (data.projectCount === 0) return { key: 'addProject', to: '/' };
  if (data.conversationCount === 0) return { key: 'tryChat', to: '/chat' };
  if (data.termCount === 0) return { key: 'buildGlossary', to: '/glossary' };
  if (!data.hasPublishedProject) return { key: 'reachDeploy', to: '/roadmap' };
  return { key: 'keepGoing', to: '/learn' };
}

export default function Profile() {
  const { user, displayName, signOut } = useAuth();
  const { lang, t } = useLanguage();

  const [stats, setStats] = useState({ projects: 0, terms: 0, conversations: 0, avgProgress: 0 });
  const [phaseCounts, setPhaseCounts] = useState({});
  const [badges, setBadges] = useState([]);
  const [activity, setActivity] = useState([]);
  const [nextStep, setNextStep] = useState({ key: 'addProject', to: '/' });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) return;
    let cancelled = false;

    async function loadAll() {
      setLoading(true);

      const projectsRes = await supabase
        .from('projects')
        .select('name, progress, phase, created_at')
        .eq('user_id', user.id);

      const termsRes = await supabase
        .from('glossary_terms')
        .select('en, created_at', { count: 'exact' })
        .eq('user_id', user.id)
        .order('created_at', { ascending: false })
        .limit(3);

      const convRes = await supabase
        .from('conversations')
        .select('id', { count: 'exact', head: true })
        .eq('user_id', user.id);

      const reportsRes = await supabase
        .from('error_reports')
        .select('id', { count: 'exact', head: true })
        .eq('user_id', user.id);

      if (cancelled) return;

      const projectRows = projectsRes.data || [];
      const projectCount = projectRows.length;
      const avgProgress =
        projectCount > 0
          ? Math.round(projectRows.reduce((sum, p) => sum + (p.progress || 0), 0) / projectCount)
          : 0;

      const counts = {};
      let hasPublishedProject = false;
      let hasCompletedProject = false;
      projectRows.forEach((p) => {
        const n = extractPhaseNumber(p.phase);
        if (n) counts[n] = (counts[n] || 0) + 1;
        if (n === 7) hasPublishedProject = true;
        if ((p.progress || 0) >= 100) hasCompletedProject = true;
      });

      const termCount = termsRes.count ?? 0;
      const conversationCount = convRes.count ?? 0;
      const reportCount = reportsRes.count ?? 0;

      // بناء سجلّ النشاط: آخر مشاريع + آخر مصطلحات، مرتّبة زمنياً
      const events = [];
      projectRows.forEach((p) => {
        if (p.created_at) events.push({ type: 'project', label: p.name, at: p.created_at });
      });
      (termsRes.data || []).forEach((tm) => {
        if (tm.created_at) events.push({ type: 'term', label: tm.en, at: tm.created_at });
      });
      events.sort((a, b) => new Date(b.at) - new Date(a.at));
      const recentActivity = events.slice(0, 5);

      setStats({ projects: projectCount, terms: termCount, conversations: conversationCount, avgProgress });
      setPhaseCounts(counts);
      setBadges(computeBadges({
        projectCount, termCount, conversationCount, reportCount,
        hasPublishedProject, hasCompletedProject,
      }));
      setActivity(recentActivity);
      setNextStep(computeNextStep({
        projectCount, termCount, conversationCount, hasPublishedProject,
      }));
      setLoading(false);
    }

    loadAll();
    return () => { cancelled = true; };
  }, [user]);

  const initial = (displayName || '?').trim().charAt(0).toUpperCase();
  const memberSince = user?.created_at
    ? new Date(user.created_at).toLocaleDateString(LOCALES[lang] || 'ar', { year: 'numeric', month: 'long' })
    : '';

  const maxPhaseCount = Math.max(1, ...PHASE_NUMBERS.map((n) => phaseCounts[n] || 0));
  const earnedCount = badges.filter((b) => b.earned).length;

  // تنسيق تاريخ الحدث (يوم وشهر) حسب اللغة
  function fmtDate(at) {
    try {
      return new Date(at).toLocaleDateString(LOCALES[lang] || 'ar', { day: 'numeric', month: 'short' });
    } catch (e) {
      return '';
    }
  }

  const activityIcon = {
    project: <IconFolderPlus size={14} />,
    term: <IconVocabulary size={14} />,
    chat: <IconMessage size={14} />,
  };

  async function handleSignOut() {
    await signOut();
  }

  return (
    <div className="profile">
      <div className="profile-hero">
        <div className="big-avatar">{initial}</div>
        <div className="hero-info">
          <div className="hero-name">{displayName}</div>
          {memberSince && (
            <div className="hero-level">{t('profile.memberSince')} {memberSince}</div>
          )}
        </div>
        <button className="signout-btn" onClick={handleSignOut}>
          <IconLogout size={16} /> {t('auth.signOut')}
        </button>
      </div>

      {loading ? (
        <div className="profile-section">
          <div className="profile-loading">
            <IconLoader2 size={18} className="spin" /> {t('profile.loadingStats')}
          </div>
        </div>
      ) : (
        <>
          {/* الإحصاءات الحيّة */}
          <div className="profile-section">
            <h2><IconChartBar size={16} /> {t('profile.statsTitle')}</h2>
            <div className="profile-stats">
              <div className="ps-box">
                <div className="ps-n">{stats.projects}</div>
                <div className="ps-l">{t('profile.statProjects')}</div>
              </div>
              <div className="ps-box">
                <div className="ps-n">{stats.terms}</div>
                <div className="ps-l">{t('profile.statTerms')}</div>
              </div>
              <div className="ps-box">
                <div className="ps-n">{stats.conversations}</div>
                <div className="ps-l">{t('profile.statConversations')}</div>
              </div>
              <div className="ps-box">
                <div className="ps-n">{stats.avgProgress}%</div>
                <div className="ps-l">{t('profile.statAvgProgress')}</div>
              </div>
            </div>
          </div>

          {/* مشاريعك عبر المراحل */}
          <div className="profile-section">
            <h2><IconRoute2 size={16} /> {t('profile.phasesTitle')}</h2>
            {stats.projects === 0 ? (
              <p className="profile-empty">{t('profile.phasesEmpty')}</p>
            ) : (
              <div className="phases-list">
                {PHASE_NUMBERS.map((n) => {
                  const c = phaseCounts[n] || 0;
                  const pct = Math.round((c / maxPhaseCount) * 100);
                  return (
                    <div key={n} className="phase-row">
                      <span className="phase-name">{t('roadmap.phase' + n + 'title')}</span>
                      <div className="phase-track">
                        <div className="phase-fill" style={{ width: (c === 0 ? 0 : Math.max(pct, 8)) + '%' }} />
                      </div>
                      <span className="phase-count">{c}</span>
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          {/* الإنجازات الحقيقية */}
          <div className="profile-section">
            <h2>
              <IconTrophy size={16} /> {t('profile.badgesTitle')}
              <span className="badges-counter">{earnedCount}/{badges.length}</span>
            </h2>
            <div className="badges-grid">
              {badges.map((b) => (
                <div key={b.key} className={'badge-card' + (b.earned ? ' earned' : ' locked')}>
                  <div className="badge-icon">{b.icon}</div>
                  <div className="badge-name">{t('profile.badge_' + b.key + '_name')}</div>
                  <div className="badge-desc">{t('profile.badge_' + b.key + '_desc')}</div>
                </div>
              ))}
            </div>
          </div>

          {/* رحلتك الحقيقية */}
          <div className="profile-section">
            <h2><IconHistory size={16} /> {t('profile.activityTitle')}</h2>
            {activity.length === 0 ? (
              <p className="profile-empty">{t('profile.activityEmpty')}</p>
            ) : (
              <div className="activity-list">
                {activity.map((a, i) => (
                  <div key={i} className="activity-item">
                    <div className="act-icon">{activityIcon[a.type]}</div>
                    <div className="act-content">
                      <div className="act-text">
                        {t('profile.activity_' + a.type)} <span className="act-label">{a.label}</span>
                      </div>
                      <div className="act-time">{fmtDate(a.at)}</div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </>
      )}

      {/* الخطوة القادمة الذكية */}
      <Link to={nextStep.to} className="next-step-card">
        <div className="ns-icon"><IconArrowLeft size={16} /></div>
        <div className="ns-text">
          <div className="ns-title">{t('profile.nextTitle')}</div>
          <div className="ns-sub">{t('profile.next_' + nextStep.key)}</div>
        </div>
      </Link>
    </div>
  );
}