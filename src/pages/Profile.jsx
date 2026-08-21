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
  const [projectList, setProjectList] = useState([]);
  const [badges, setBadges] = useState([]);
  const [activity, setActivity] = useState([]);
  const [nextStep, setNextStep] = useState({ key: 'addProject', to: '/' });
  const [loading, setLoading] = useState(true);
  const [environment, setEnvironment] = useState({});
  const [savingTool, setSavingTool] = useState(null);

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
        .select('name, emoji, progress, phase_number, status, created_at')
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

      const profileRes = await supabase
        .from('profiles')
        .select('environment')
        .eq('id', user.id)
        .maybeSingle();

      if (cancelled) return;

      if (profileRes.data?.environment) {
        setEnvironment(profileRes.data.environment);
      }

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
      console.log('projectRows للمعرض:', projectRows.length, projectRows);
      setProjectList(projectRows);
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

  // ترتيب المنتجات: منشور أولاً، ثم مكتمل، ثم قيد الإنجاز
  function productRank(p) {
    if (p.phase_number === 7) return 0;
    if (p.status === 'done' || (p.progress || 0) >= 100) return 1;
    return 2;
  }

  // معلومات المنتج: الشارة، النصّ التحفيزيّ، الصنف
  function productInfo(p) {
    if (p.phase_number === 7) {
      return { cls: 'published', badge: 'منشور 🚀', text: 'أنجزتَه ونشرتَه للعالم — هذا فخرٌ حقيقيّ!' };
    }
    if (p.status === 'done' || (p.progress || 0) >= 100) {
      return { cls: 'completed', badge: 'مكتمل ✓', text: 'أتممتَه بالكامل — إنجازٌ تستحقّ أن تفخر به!' };
    }
    const pct = p.progress || 0;
    let text;
    if (pct === 0) {
      text = 'رحلةُ الألف ميل تبدأ بخطوة — لنبدأ أولى خطوات هذا المنتج!';
    } else if (pct <= 15) {
      text = `${pct}% — انطلقتَ! البداية أصعب خطوة، وقد تجاوزتَها.`;
    } else if (pct <= 50) {
      text = `${pct}% — تتقدّم بثبات، والطريق يتّضح أمامك. واصِل!`;
    } else {
      text = `${pct}% — أوشكتَ! النهاية قريبة، لا تتوقّف الآن.`;
    }
    return { cls: 'ongoing', badge: 'قيد الإنجاز ⏳', text };
  }

    // تحديث حالة أداة في بيئة المستخدم وحفظها فوراً
  async function updateTool(tool, status) {
    if (!user) return;
    setSavingTool(tool);
    // إن ضغط الحالة نفسها، نزيلها (تبديل)؛ وإلّا نضبطها
    const newEnv = { ...environment };
    if (newEnv[tool] === status) {
      delete newEnv[tool];
    } else {
      newEnv[tool] = status;
    }
    const { error } = await supabase
      .from('profiles')
      .update({ environment: newEnv })
      .eq('id', user.id);
    if (!error) {
      setEnvironment(newEnv);
    }
    setSavingTool(null);
  }

  return (
    <div className="profile">
      <div className="profile-hero">
              {/* ── بيئة العمل: أدوات المستخدم ── */}
      <div className="env-section">
        <h3 className="env-title">{t('profile.envTitle')}</h3>
        <p className="env-hint">{t('profile.envHint')}</p>
        <div className="env-tools">
          {[
            { key: 'node', label: 'Node.js' },
            { key: 'git', label: 'Git' },
            { key: 'vscode', label: 'VS Code' },
            { key: 'postgresql', label: 'PostgreSQL' },
          ].map((tool) => (
            <div className="env-tool" key={tool.key}>
              <span className="env-tool-name">{tool.label}</span>
              <div className="env-tool-actions">
                <button
                  className={'env-tool-btn' + (environment[tool.key] === 'installed' ? ' active-installed' : '')}
                  onClick={() => updateTool(tool.key, 'installed')}
                  disabled={savingTool === tool.key}
                >
                  {t('profile.envInstalled')}
                </button>
                <button
                  className={'env-tool-btn' + (environment[tool.key] === 'deferred' ? ' active-deferred' : '')}
                  onClick={() => updateTool(tool.key, 'deferred')}
                  disabled={savingTool === tool.key}
                >
                  {t('profile.envDeferred')}
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
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

            {/* بطاقة المشاريع الجامعة */}
            <div className="projects-card">
              <div className="pj-head">
                <div className="pj-total">{stats.projects}</div>
                <div className="pj-total-label">{t('profile.statProjects')}</div>
              </div>

              {stats.projects > 0 && (
                <>
                  <div className="pj-statuses">
                    <div className="pj-status">
                      <span className="status-dot active"></span>
                      <span className="pj-status-label">جارٍ</span>
                      <span className="pj-status-num">{statusCounts.active}</span>
                    </div>
                    <div className="pj-status">
                      <span className="status-dot done"></span>
                      <span className="pj-status-label">مكتمل</span>
                      <span className="pj-status-num">{statusCounts.done}</span>
                    </div>
                    <div className="pj-status">
                      <span className="status-dot published"></span>
                      <span className="pj-status-label">منشور</span>
                      <span className="pj-status-num">{statusCounts.published}</span>
                    </div>
                    <div className="pj-status">
                      <span className="status-dot paused"></span>
                      <span className="pj-status-label">متوقّف</span>
                      <span className="pj-status-num">{statusCounts.paused}</span>
                    </div>
                  </div>

                  <div className="pj-progress">
                    <div className="pj-progress-hdr">
                      <span>{t('profile.statAvgProgress')}</span>
                      <span className="pj-progress-pct">{stats.avgProgress}%</span>
                    </div>
                    <div className="pj-progress-track">
                      <div className="pj-progress-fill" style={{ width: stats.avgProgress + '%' }} />
                    </div>
                  </div>
                </>
              )}
            </div>

            {/* بطاقتا التعلّم: المعجم والمحادثات */}
            <div className="learn-stats">
              <div className="ls-box">
                <div className="ls-n">{stats.terms}</div>
                <div className="ls-l">{t('profile.statTerms')}</div>
              </div>
              <div className="ls-box">
                <div className="ls-n">{stats.conversations}</div>
                <div className="ls-l">{t('profile.statConversations')}</div>
              </div>
            </div>
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
            <h2><IconTrophy size={16} /> ما أنجزتَه</h2>
            {projectList.length === 0 ? (
              <p className="profile-empty">لم تُنشئ مشروعاً بعد — ابدأ أوّل منتج لك، وسيظهر هنا فخراً!</p>
            ) : (
              <div className="products-list">
                {[...projectList]
                  .sort((a, b) => productRank(a) - productRank(b))
                  .map((p, i) => {
                    const info = productInfo(p);
                    return (
                      <div key={i} className={'product-card ' + info.cls}>
                        <div className="product-emoji">{p.emoji || '📦'}</div>
                        <div className="product-body">
                          <div className="product-name">
                            {p.name}
                            <span className={'product-badge ' + info.cls}>{info.badge}</span>
                          </div>
                          <div className="product-motiv">{info.text}</div>
                        </div>
                      </div>
                    );
                  })}
              </div>
            )}
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