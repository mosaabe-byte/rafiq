import { useState, useEffect } from 'react';
import {
  IconChartBar, IconArrowLeft, IconLogout, IconLoader2, IconTrophy,
  IconRoute2, IconHistory, IconFolderPlus, IconVocabulary, IconMessage,
  IconPencil, IconCheck, IconX, IconShieldLock
} from '@tabler/icons-react';
import { Link } from 'react-router-dom';
import { supabase } from '../lib/supabase';
import { useAuth } from '../auth/AuthContext';
import { useLanguage } from '../i18n/LanguageContext';
import './Profile.css';
import { useNavigate } from 'react-router-dom';
import { sessions } from './LearningPath';

const LOCALES = { ar: 'ar', fr: 'fr-FR', en: 'en-US' };
const PHASE_NUMBERS = [1, 2, 3, 4, 5, 6, 7];


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

function computeNextStep(data) {
  if (data.projectCount === 0) return { key: 'addProject', to: '/' };
  if (data.conversationCount === 0) return { key: 'tryChat', to: '/chat' };
  if (data.termCount === 0) return { key: 'buildGlossary', to: '/glossary' };
  if (!data.hasPublishedProject) return { key: 'reachDeploy', to: '/roadmap' };
  return { key: 'keepGoing', to: '/learn' };
}

export default function Profile() {
  const navigate = useNavigate();
  const { user, displayName, signOut, updateProfile } = useAuth();
  const { lang, t } = useLanguage();
  
  const [stats, setStats] = useState({ projects: 0, terms: 0, conversations: 0, avgProgress: 0 });
  const [phaseCounts, setPhaseCounts] = useState({});
  const [completedStations, setCompletedStations] = useState([]);
  const [statusCounts, setStatusCounts] = useState({ active: 0, done: 0, published: 0, paused: 0 });
  const [badges, setBadges] = useState([]);
  const [activity, setActivity] = useState([]);
  const [nextStep, setNextStep] = useState({ key: 'addProject', to: '/' });
  const [loading, setLoading] = useState(true);

  // حالة تعديل الاسم
  const [editingName, setEditingName] = useState(false);
  const [nameInput, setNameInput] = useState('');
  const [savingName, setSavingName] = useState(false);

  useEffect(() => {
    if (!user) return;
    let cancelled = false;

    async function loadAll() {
      setLoading(true);

      const projectsRes = await supabase
        .from('projects')
        .select('name, progress, phase_number, status, created_at')
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

        const stationsRes = await supabase
        .from('station_completions')
        .select('station_number')
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
        const n = p.phase_number;
        if (n) counts[n] = (counts[n] || 0) + 1;
        if (n === 7) hasPublishedProject = true;
        if ((p.progress || 0) >= 100) hasCompletedProject = true;
      });

      // حالات المشاريع (للإحصاءات الجديدة)
      const sCounts = { active: 0, done: 0, published: 0, paused: 0 };
      projectRows.forEach((p) => {
        if (p.phase_number === 7) sCounts.published += 1;
        if (p.status === 'done') sCounts.done += 1;
        else if (p.status === 'paused') sCounts.paused += 1;
        else if (p.status === 'active') sCounts.active += 1;
      });

      const termCount = termsRes.count ?? 0;
      const conversationCount = convRes.count ?? 0;
      const reportCount = reportsRes.count ?? 0;

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
      setStatusCounts(sCounts);
      setCompletedStations((stationsRes.data || []).map((r) => r.station_number));
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

  // فتح وضع تعديل الاسم بالقيمة الحالية
  function openEditName() {
    setNameInput(displayName === '—' ? '' : displayName);
    setEditingName(true);
  }

  // حفظ الاسم الجديد
  async function saveName() {
    const trimmed = nameInput.trim();
    if (!trimmed) return;
    setSavingName(true);
    await updateProfile({ full_name: trimmed });
    setSavingName(false);
    setEditingName(false);
  }

  // تصدير كل بيانات المستخدم في ملفّ JSON
  const [exporting, setExporting] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [deleteText, setDeleteText] = useState('');

  async function handleExport() {
    if (!user || exporting) return;
    setExporting(true);

    const tables = ['profiles', 'projects', 'conversations', 'messages',
      'glossary_terms', 'quality_results', 'station_completions', 'error_reports'];
    const exportData = { exported_at: new Date().toISOString(), user_id: user.id };

    for (const table of tables) {
      const { data } = await supabase.from(table).select('*').eq('user_id', user.id);
      exportData[table] = data || [];
    }

    const blob = new Blob([JSON.stringify(exportData, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'rafiq-my-data.json';
    a.click();
    URL.revokeObjectURL(url);

    setExporting(false);
  }

  // حذف كل بيانات المستخدم (بالترتيب: الأبناء قبل الآباء)
  async function handleDeleteAccount() {
    if (!user || deleting) return;
    setDeleting(true);

    // messages قبل conversations (علاقة تبعية)
    const order = ['messages', 'error_reports', 'quality_results',
      'station_completions', 'glossary_terms', 'projects', 'conversations', 'profiles'];

    for (const table of order) {
      await supabase.from(table).delete().eq('user_id', user.id);
    }

    // تسجيل الخروج بعد حذف البيانات
    await supabase.auth.signOut();
    navigate('/login');
  }

  return (
    <div className="profile">
      <div className="profile-hero">
        <div className="big-avatar">{initial}</div>
        <div className="hero-info">
          {editingName ? (
            <div className="name-edit">
              <input
                className="name-edit-input"
                value={nameInput}
                onChange={(e) => setNameInput(e.target.value)}
                placeholder={t('profile.namePlaceholder')}
                maxLength={40}
                autoFocus
                onKeyDown={(e) => {
                  if (e.key === 'Enter') saveName();
                  if (e.key === 'Escape') setEditingName(false);
                }}
              />
              <button className="name-edit-btn save" onClick={saveName} disabled={savingName} title={t('profile.save')}>
                {savingName ? <IconLoader2 size={16} className="spin" /> : <IconCheck size={16} />}
              </button>
              <button className="name-edit-btn cancel" onClick={() => setEditingName(false)} title={t('profile.cancel')}>
                <IconX size={16} />
              </button>
            </div>
          ) : (
            <div className="hero-name-row">
              <span className="hero-name">{displayName}</span>
              <button className="edit-name-btn" onClick={openEditName} title={t('profile.editName')}>
                <IconPencil size={14} />
              </button>
            </div>
          )}
          {memberSince && !editingName && (
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

          <div className="profile-section">
            <h2><IconRoute2 size={16} /> رحلتي في التعلّم</h2>
            <div className="journey-summary">
              <div className="journey-count">
                <span className="journey-done">{completedStations.length}</span>
                <span className="journey-total">من {sessions.length} محطة</span>
              </div>
              <div className="journey-bar">
                <div
                  className="journey-fill"
                  style={{ width: Math.round((completedStations.length / sessions.length) * 100) + '%' }}
                />
              </div>
            </div>
            <div className="stations-grid">
              {sessions.map((s) => {
                const done = completedStations.includes(s.n);
                return (
                  <div key={s.n} className={'station-chip' + (done ? ' done' : '')}>
                    <span className="station-chip-num">{done ? '✓' : s.n}</span>
                    <span className="station-chip-name">{s.title[lang] || s.title.ar}</span>
                  </div>
                );
              })}
            </div>
          </div>

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

      <Link to={nextStep.to} className="next-step-card">
        <div className="ns-icon"><IconArrowLeft size={16} /></div>
        <div className="ns-text">
          <div className="ns-title">{t('profile.nextTitle')}</div>
          <div className="ns-sub">{t('profile.next_' + nextStep.key)}</div>
        </div>
      </Link>
      <div className="profile-section data-rights">
        <h2><IconShieldLock size={16} /> {t('profile.dataRightsTitle')}</h2>
        <p className="data-rights-intro">{t('profile.dataRightsIntro')}</p>

        <button className="data-export-btn" onClick={handleExport} disabled={exporting}>
          {exporting ? t('profile.exporting') : t('profile.exportData')}
        </button>

        <button className="data-delete-btn" onClick={() => setShowDeleteConfirm(true)}>
          {t('profile.deleteAccount')}
        </button>
        <Link to="/privacy" className="privacy-link">{t('profile.privacyPolicy')}</Link>
      </div>

      {showDeleteConfirm && (
        <div className="modal-overlay" onClick={() => setShowDeleteConfirm(false)}>
          <div className="delete-modal" onClick={(e) => e.stopPropagation()}>
            <h3>{t('profile.deleteConfirmTitle')}</h3>
            <p>{t('profile.deleteConfirmWarning')}</p>
            <p className="delete-confirm-hint">{t('profile.deleteConfirmHint')}</p>
            <input
              type="text"
              className="delete-confirm-input"
              value={deleteText}
              onChange={(e) => setDeleteText(e.target.value)}
              placeholder={t('profile.deleteConfirmWord')}
            />
            <div className="delete-modal-actions">
              <button
                className="delete-modal-cancel"
                onClick={() => { setShowDeleteConfirm(false); setDeleteText(''); }}
              >
                {t('profile.cancel')}
              </button>
              <button
                className="delete-modal-confirm"
                onClick={handleDeleteAccount}
                disabled={deleting || deleteText !== t('profile.deleteConfirmWord')}
              >
                {deleting ? t('profile.deleting') : t('profile.deleteConfirmBtn')}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
      );
}