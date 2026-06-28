import { useState, useEffect } from 'react';
import { IconChartBar, IconArrowLeft, IconLogout, IconLoader2 } from '@tabler/icons-react';
import { Link } from 'react-router-dom';
import { supabase } from '../lib/supabase';
import { useAuth } from '../auth/AuthContext';
import { useLanguage } from '../i18n/LanguageContext';
import './Profile.css';

// خريطة رمز اللغة إلى locale لعرض التاريخ
const LOCALES = { ar: 'ar', fr: 'fr-FR', en: 'en-US' };

export default function Profile() {
  const { user, displayName, signOut } = useAuth();
  const { lang, t } = useLanguage();

  const [stats, setStats] = useState({ projects: 0, terms: 0, conversations: 0, avgProgress: 0 });
  const [loadingStats, setLoadingStats] = useState(true);

  useEffect(() => {
    if (!user) return;
    let cancelled = false;

    async function loadStats() {
      setLoadingStats(true);

      // عدد المشاريع + متوسّط التقدّم (نجلب progress لحسابه)
      const projectsRes = await supabase
        .from('projects')
        .select('progress', { count: 'exact' })
        .eq('user_id', user.id);

      // عدد المصطلحات الشخصية
      const termsRes = await supabase
        .from('glossary_terms')
        .select('id', { count: 'exact', head: true })
        .eq('user_id', user.id);

      // عدد المحادثات
      const convRes = await supabase
        .from('conversations')
        .select('id', { count: 'exact', head: true })
        .eq('user_id', user.id);

      if (cancelled) return;

      const projectRows = projectsRes.data || [];
      const projectCount = projectsRes.count ?? projectRows.length;
      const avgProgress =
        projectRows.length > 0
          ? Math.round(projectRows.reduce((sum, p) => sum + (p.progress || 0), 0) / projectRows.length)
          : 0;

      setStats({
        projects: projectCount,
        terms: termsRes.count ?? 0,
        conversations: convRes.count ?? 0,
        avgProgress,
      });
      setLoadingStats(false);
    }

    loadStats();
    return () => { cancelled = true; };
  }, [user]);

  const initial = (displayName || '?').trim().charAt(0).toUpperCase();

  const memberSince = user?.created_at
    ? new Date(user.created_at).toLocaleDateString(LOCALES[lang] || 'ar', { year: 'numeric', month: 'long' })
    : '';

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

      <div className="profile-section">
        <h2><IconChartBar size={16} /> {t('profile.statsTitle')}</h2>

        {loadingStats ? (
          <div className="profile-loading">
            <IconLoader2 size={18} className="spin" /> {t('profile.loadingStats')}
          </div>
        ) : (
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
        )}
      </div>

      <Link to="/" className="next-step-card">
        <div className="ns-icon"><IconArrowLeft size={16} /></div>
        <div className="ns-text">
          <div className="ns-title">{t('profile.nextTitle')}</div>
          <div className="ns-sub">{t('profile.nextSub')}</div>
        </div>
      </Link>
    </div>
  );
}